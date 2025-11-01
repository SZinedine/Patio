import { MouseEvent, RefObject, useEffect, useRef } from "react";
import { createList, ListType } from "../Utils/Types";
import { useEntityContext } from "../Context/EntityContext";
import { insertList, editList as editListData } from "../Utils/Data";
import { storeExpandedListState } from "../Utils/SettingsUtils";

type ListAddingDialogProps = {
    threadUuid: string | null;
    onClose: () => void;
    list: ListType | undefined;     // defined if we are in editing mode
    dialogRef: RefObject<HTMLDialogElement | null>;
};

export default function ListAddingDialog({ threadUuid, onClose, list, dialogRef }: ListAddingDialogProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const { dispatch } = useEntityContext();

    useEffect(() => {
        if (!titleRef.current)
            return;

        if (list) {
            titleRef.current.value = list.title;
        } else {
            titleRef.current.value = "";
        }
    }, [list]);

    const confirm = async (event: MouseEvent<HTMLButtonElement>) => {
        const title = titleRef.current!.value.trim();

        if (title === "") {
            event.preventDefault();     // prevent DaisyUI from closing the dialog
            return;
        }

        try {
            if (list) {
                const updatedList = { ...list, title };
                dispatch({
                    type: 'EDIT_LIST',
                    payload: updatedList
                });
                await editListData(updatedList);
            } else if (threadUuid) {
                const newList = createList(title);
                dispatch({
                    type: 'ADD_LIST',
                    payload: {
                        threadUuid,
                        list: newList
                    }
                });
                storeExpandedListState(true, newList.uuid);
                await insertList(threadUuid, newList);
            } else {
                alert("Error. Cannot add a new List. Undefined thread UUID and list");
                return;
            }
        } catch (err) {
            console.error("Failed to insert/edit list", err);
        }
    };

    return <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
        <div className="modal-box">
            <h2 className="font-bold text-lg">Add New List</h2>
            <fieldset className="fieldset flex flex-row justify-center">
                <input ref={titleRef} type="text" placeholder="Title" className="input" />
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
