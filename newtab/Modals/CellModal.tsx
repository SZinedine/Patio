import { FormEvent, MouseEvent, useState, useEffect, useRef, RefObject, ReactNode, ReactElement } from 'react';
import { CellType, createCell } from '../Utils/Types';
import { t } from '../Utils/i18n';

export type CellModalModeType = "" | "add-cell" | "add-subcell" | "edit";

interface CellModalProps {
    mode: CellModalModeType;
    onClose: () => void;
    onAdd: (cell: CellType) => void;
    onEdit: (cell: CellType) => void;
    cell: CellType | null;
}

export function CellModal({ mode, onClose, onAdd, onEdit, cell }: CellModalProps): ReactNode {
    const [link, setLink] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const ref = useRef<HTMLDialogElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode === "") {
            close(null);
            return;
        } else if (mode === "add-cell" || mode === "add-subcell") {
            clear();
        } else if (mode === "edit") {
            if (!cell) {
                console.error("CellModal opened in edit mode without a cell");
                alert(t("error_cell_data_required"));
                return;
            }

            setLink(cell.link);
            setTitle(cell.title);
            setDescription(cell.description);

        }

        ref.current?.showModal();
    }, [mode]);

    const handleManualSubmit = (e: FormEvent<HTMLButtonElement> | null) => {
        if (e) {
            e.preventDefault();
        }

        if (!link || !linkRef.current?.checkValidity()) {
            return;
        }

        if (mode === "edit") {
            if (!cell) {
                console.error("CellModal opened in edit mode without a cell");
                alert(t("error_cell_data_required"));
                return;
            }

            cell.link = link;
            cell.title = title.trim() || new URL(link).hostname;
            cell.description = description.trim() || title;

            onEdit(cell);
        } else if (mode === "add-cell" || mode === "add-subcell") {
            const title_ = title.trim() || new URL(link).hostname;
            const newCell = createCell(title_, link, description.trim() || title_);
            onAdd(newCell);
        }

        clear();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e && e.key === "Enter") {
            handleManualSubmit(null);
        }
    }


    const close = (e: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLDialogElement> | null) => {
        if (e) {
            e.preventDefault();
        }

        ref.current?.close();
        clear();
        onClose();
    }

    const clear = () => {
        setLink("");
        setTitle("");
        setDescription("");
    }


    if (mode === "") {
        return null;
    }

    return <dialog ref={ref} className="modal modal-bottom sm:modal-middle animate-in fade-in duration-200" onClose={close}>
        <div className="modal-box border border-base-100/30 bg-base-100/40 backdrop-blur-3xl">
            <h2 className="font-bold text-xl text-center">
                {cell ? t("cellmodal_title_edit") : t("cellmodal_title_new")}
            </h2>
            <fieldset className="fieldset flex flex-col justify-center p-2">

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{t("cellmodal_label_url")}</label>
                <InputLink ref={linkRef} value={link} setValue={setLink} onKeyDown={onKeyDown} />

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{t("cellmodal_label_title")}</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder={t("cellmodal_placeholder_title")} className={inputCls} onKeyDown={onKeyDown} />

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{t("cellmodal_label_description")}</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder={t("cellmodal_placeholder_description")} className={inputCls} onKeyDown={onKeyDown} />

            </fieldset>
            <div className="modal-action">
                <form method="dialog">
                    <button className="btn" onClick={close}>{t("common_cancel")}</button>
                    <button className="btn" onClick={handleManualSubmit}>{t("common_ok")}</button>
                </form>
            </div>
        </div>
    </dialog>
};

const inputCls = "input self-center w-4/5 bg-base-200/50 backdrop-blur-3xl";

type InputLinkProps = {
    ref: RefObject<HTMLInputElement | null>;
    value: string;
    setValue: (value: string) => void;
    onKeyDown: (e: KeyboardEvent) => void;
};

function InputLink({ ref, value, setValue, onKeyDown }: InputLinkProps): ReactElement {
    return (
        <div className="self-center w-4/5">
            <label className="input validator w-full bg-base-200/50 backdrop-blur-3xl flex items-center gap-2">
                <svg
                    className="h-[1.2em] w-[1.2em] opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </g>
                </svg>

                <input
                    ref={ref}
                    type="url"
                    onKeyDown={onKeyDown}
                    required
                    placeholder="https://"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9-].*[a-zA-Z0-9])?.)+[a-zA-Z].*$"
                    title={t("cellmodal_url_invalid")}
                    className="grow"
                />
            </label>

            <p className="validator-hint text-xs mt-1">{t("cellmodal_url_invalid")}</p>
        </div>
    );
}
