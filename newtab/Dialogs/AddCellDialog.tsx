import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

type AddCellProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (title: string, link: string, description: string) => void;
};

export default function AddCellDialog({ open, onClose, onConfirm }: AddCellProps): ReactNode {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");

    if (!open) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm(title, link, description);
        onClose();
    };

    const resetInputs = () => {
        setTitle("");
        setLink("");
        setDescription("");
    }

    const onClose_ = () => {
        window.removeEventListener("keydown", handleKey)
        resetInputs();
        onClose();
    }


    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose_();
        }
    }

    window.addEventListener("keydown", handleKey);

    return createPortal(
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={onClose_}
        >
            <div
                className="flex w-full max-w-lg flex-col gap-4 rounded-lg border border-base-300 bg-base-200 p-6 text-base-content shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-center text-lg font-semibold">Add a New Cell</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                />
                <input
                    type="text"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="input input-bordered w-full"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input input-bordered w-full"
                />
                <div className="mt-4 flex justify-end gap-3">
                    <button type="button" onClick={handleConfirm} className="btn btn-primary">Ok</button>
                    <button type="button" onClick={onClose_} className="btn btn-ghost">Cancel</button>
                </div>
            </div>
        </div>,
        document.body
    );
};
