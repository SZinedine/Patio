import { MouseEvent, RefObject, useEffect, useRef } from "react";
import { CellType, createCell } from "../Utils/Types";
import { useEntityContext } from "../Context/EntityContext";
import { insertCell, insertSubCell, editCell as editCellData } from "../Utils/Data";

type CellAddingDialogProps = {
    cellDialogData?: { parentListUuid: string, parentCellUuid?: string };
    cell?: CellType;
    onClose: () => void;
    dialogRef: RefObject<HTMLDialogElement | null>;
};

export default function CellAddingDialog({ cellDialogData, cell, onClose, dialogRef }: CellAddingDialogProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const { dispatch } = useEntityContext();

    useEffect(() => {
        if (cell) { // Edit mode
            titleRef.current!.value = cell.title;
            linkRef.current!.value = cell.link;
            descRef.current!.value = cell.description;
        } else { // Adding mode
            titleRef.current!.value = "";
            linkRef.current!.value = "";
            descRef.current!.value = "";
        }
    }, [cell]);

    const confirm = async (event: MouseEvent<HTMLButtonElement>) => {
        const title = titleRef.current!.value.trim();
        const link = linkRef.current!.value.trim();
        const description = descRef.current!.value.trim();

        if (title === "") {
            event.preventDefault();
            return;
        }

        if (cell) { // Editing existing cell
            const updatedCell = { ...cell, title, link, description };
            dispatch({ type: 'EDIT_CELL', payload: updatedCell });
            await editCellData(updatedCell);

        } else if (cellDialogData) { // Adding new cell
            const newCell = createCell(title, link, description);
            if (cellDialogData.parentCellUuid) { // as sub-cell
                dispatch({
                    type: 'ADD_SUB_CELL',
                    payload: {
                        parentCellUuid: cellDialogData.parentCellUuid,
                        cell: newCell
                    }
                });
                await insertSubCell(cellDialogData.parentListUuid, newCell, cellDialogData.parentCellUuid);
            } else { // as regular cell
                dispatch({
                    type: 'ADD_CELL',
                    payload: {
                        listUuid: cellDialogData.parentListUuid,
                        cell: newCell
                    }
                });
                await insertCell(cellDialogData.parentListUuid, newCell);
            }
        }
    };


    return <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
        <div className="modal-box">
            <h2 className="font-bold text-lg">{cell ? 'Edit Cell' : 'Add New Cell'}</h2>
            <fieldset className="fieldset flex flex-col justify-center p-2">
                <input ref={titleRef} type="text" placeholder="Title" className="input self-center w-4/5" />
                <input ref={linkRef} type="text" placeholder="Link" className="input self-center w-4/5" />
                <input ref={descRef} type="text" placeholder="Description" className="input self-center w-4/5" />
            </fieldset>
            <div className="modal-action">
                <form method="dialog">
                    <button className="btn" onClick={() => onClose()}>Cancel</button>
                    <button className="btn" onClick={confirm}>ok</button>
                </form>
            </div>
        </div>
    </dialog>
}

