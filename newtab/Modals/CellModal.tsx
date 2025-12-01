import React, { FormEvent, MouseEvent, useState, useEffect } from 'react';
import { CellType, createCell } from '../Utils/Types';

interface CellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (cell: CellType) => void;
    onEdit: (cell: CellType) => void;
    cell: CellType | null;
}

export const CellModal: React.FC<CellModalProps> = ({ isOpen, onClose, onAdd, onEdit, cell }) => {
    const [link, setLink] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const ref = React.useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (cell) {
                setLink(cell.link);
                setTitle(cell.title);
                setDescription(cell.description);
            } else {
                clear();
            }

            ref.current?.showModal();
        }
    }, [isOpen]);

    const handleManualSubmit = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!link)
            return;

        let formattedUrl = link.trim();
        if (!/^https?:\/\//i.test(link)) {
            formattedUrl = 'https://' + link;
        }

        if (cell) {
            cell.link = formattedUrl;
            cell.title = title.trim() || new URL(formattedUrl).hostname;
            cell.description = description.trim() || title;
            onEdit(cell);
        } else {
            console.log("creating new one")
            const title_ = title.trim() || new URL(formattedUrl).hostname;
            const newCell = createCell(title_, formattedUrl, description.trim() || title_);
            console.log(newCell);
            onAdd(newCell);
        }

        clear();
    };


    const close = (e: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLDialogElement>) => {
        e.preventDefault();
        clear();
        onClose();
    }

    const clear = () => {
        setLink("");
        setTitle("");
        setDescription("");
    }


    if (!isOpen) {
        return null;
    }

    return <dialog ref={ref} className="modal modal-bottom sm:modal-middle backdrop-blur-xs animate-in fade-in duration-200" onClose={close}>
        <div className="modal-box border border-gray-700">
            <h2 className="font-bold text-lg">{cell ? 'Edit Cell' : 'Add New Cell'}</h2>
            <fieldset className="fieldset flex flex-col justify-center p-2">

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">URL</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} type="text" placeholder="Link" className="input self-center w-4/5" />

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">TITLE</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="input self-center w-4/5" />

                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">DESCRIPTION</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Description" className="input self-center w-4/5" />

            </fieldset>
            <div className="modal-action">
                <form method="dialog">
                    <button className="btn" onClick={close}>Cancel</button>
                    <button className="btn" onClick={handleManualSubmit}>ok</button>
                </form>
            </div>
        </div>
    </dialog>
};

