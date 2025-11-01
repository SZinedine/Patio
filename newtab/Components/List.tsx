import { ReactElement, useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { CellType, ListType } from "../Utils/Types";
import Cell from "./Cell";
import { GiSettingsKnobs } from "react-icons/gi";
import { useEntityContext } from "../Context/EntityContext";
import { useLock } from "../Context/LockContext";
import { storeExpandedListState } from "../Utils/SettingsUtils";
import { useDialogs } from "../Context/DialogContext";
import { deleteList } from "../Utils/Data";


export default function List({ ...data }: ListType): ReactElement {
    // Controls the settings/menu popover visibility
    const [menuOpen, setMenuOpen] = useState(false);
    // Controls the expanded/collapsed state of the <details> list
    const [expanded, setExpanded] = useState<boolean>(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);
    const { dispatch } = useEntityContext();
    const { showCellDialog, showListDialog } = useDialogs();
    const lock = useLock();

    const onAddCellClicked = () => {
        showCellDialog(data.uuid);
    };

    const onDeleteListClicked = () => {
        const res = confirm("Do you really want to remove the List " +
            `'${data.title}'? It will delete its containing lists.`);

        if (res) {
            dispatch({ type: 'DELETE_LIST', payload: data.uuid });
            deleteList(data.uuid);
        }
    };

    const onEditListClicked = () => {
        showListDialog(data.uuid, data);
    };

    useLayoutEffect(() => {
        if (menuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom, left: rect.left });
        }
    }, [menuOpen]);

    // Initialize expanded state from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem("expanded_lists");
            const arr: string[] = raw ? JSON.parse(raw) : [];
            setExpanded(Array.isArray(arr) && data.uuid ? arr.includes(data.uuid) : false);
        } catch (_) {
            setExpanded(false);
        }
    }, []);

    const onToggleDetails = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        const isOpen = (e.currentTarget as HTMLDetailsElement).open;
        setExpanded(isOpen);
        storeExpandedListState(isOpen, data.uuid);
    };

    const menu = (
        <ul className="menu rounded-box w-52 p-2 m-0 shadow-sm fixed z-[9999]
                       bg-base-200/70 backdrop-blur-lg border border-base-300/80"
            style={{ top: pos.top, left: pos.left }}
            onMouseLeave={() => setMenuOpen(false)}
        >
            <li> <a className="p-3" onClick={onEditListClicked}> Edit </a> </li>
            <li> <a className="p-3" onClick={onAddCellClicked}> Add a New Cell </a> </li>
            <li> <a className="p-3 text-red-400" onClick={onDeleteListClicked}> Delete List </a> </li>
        </ul>
    );


    return (
        <ul className="list menu rounded-box w-full flex flex-col justify-start">
            <li>
                {!lock.locked && <div className="float-right absolute right-9 top-2 p-0">
                    <div
                        ref={buttonRef}
                        role="button"
                        tabIndex={0}
                        className="btn btn-sm btn-square border-none bg-base-200/40 hover:bg-base-300/80 m-0 p-0"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <GiSettingsKnobs size={18} />
                    </div>
                </div>
                }
                {
                    !lock.locked && menuOpen && createPortal(menu, document.body)
                }

                <details open={expanded} onToggle={onToggleDetails}>
                    <summary className="list-title font-bold p-3 text-lg">
                        {data.title}
                    </summary>
                    <ul className="list-content flex flex-col justify-start">
                        {data?.children?.map((child: CellType) => (
                            <Cell
                                key={child.uuid}
                                {...child}
                                parentListUuid={data.uuid}
                            />
                        ))}
                    </ul>
                </details>
            </li>
        </ul>
    );
}
