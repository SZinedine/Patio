import { ReactNode, useState } from "react";

type AddListProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (title: string) => void;
};

export default function AddListDialog({ open, onClose, onConfirm }: AddListProps): ReactNode {
    const [title, setTitle] = useState("");

    if (!open) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm(title);
        onClose();
    };

    const resetInputs = () => {
        setTitle("");
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

    return (
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={onClose_}
        >
            <div
                className="flex w-full max-w-lg flex-col gap-4 rounded-lg border border-base-300 bg-base-200 p-6 text-base-content shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-center text-lg font-semibold">Add a new List</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                />
                <div className="mt-4 flex justify-end gap-3">
                    <button type="button" onClick={handleConfirm} className="btn btn-primary">Ok</button>
                    <button type="button" onClick={onClose_} className="btn btn-ghost">Cancel</button>
                </div>
            </div>
        </div>
    );
};
