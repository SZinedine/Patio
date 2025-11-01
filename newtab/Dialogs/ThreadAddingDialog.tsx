import { MouseEvent, RefObject, useEffect, useRef } from "react"
import { createThread, ThreadType } from "../Utils/Types";
import { useEntityContext } from "../Context/EntityContext";
import { insertThread, editThread as editThreadData } from "../Utils/Data";


type ThreadAddingDialogProps = {
    thread: ThreadType | undefined;     // defined if we are in editing mode
    onClose: () => void;
    dialogRef: RefObject<HTMLDialogElement | null>;
};


export default function ThreadAddingDialog({ thread, onClose, dialogRef }: ThreadAddingDialogProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const { dispatch } = useEntityContext();

    useEffect(() => {
        if (!titleRef.current)
            return;

        if (thread) {
            titleRef.current.value = thread.title;
        } else {
            titleRef.current.value = "";
        }
    }, [thread]);

    const confirm = async (event: MouseEvent<HTMLButtonElement>) => {
        const title = titleRef.current!.value.trim();
        if (title === "") {
            event.preventDefault();     // prevent DaisyUI from closing the dialog
            return;
        }

        try {
            if (thread) {
                const updatedThread = { ...thread, title };
                dispatch({ type: 'EDIT_THREAD', payload: updatedThread });
                await editThreadData(updatedThread);
            } else {
                const th = createThread(title);
                dispatch({ type: 'ADD_THREAD', payload: th });
                await insertThread(th);
            }
        } catch (err) {
            console.error("Failed to insert/edit thread", err);
        }
    }

    return <dialog ref={dialogRef} id="thread-dialog" className="modal modal-bottom sm:modal-middle" onClose={onClose}>
        <div className="modal-box">
            <h2 className="font-bold text-lg">Add New Thread</h2>
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

