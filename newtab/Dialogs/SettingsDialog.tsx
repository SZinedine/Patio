import { useEffect, ReactNode, useRef } from "react";

type SettingsDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function SettingsDialog({ open, onClose, onConfirm }: SettingsDialogProps): ReactNode {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAndApplyBackground();
    }, []);

    if (!open) {
        return null;
    }

    const confirm = () => {
        const file = ref.current?.files?.[0];
        if (!file) {
            return;
        }

        storeImage(file).then(_ => {
            loadAndApplyBackground();
            onConfirm();
        });
    }

    return <>
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-lg flex-col gap-4 rounded-lg border border-base-300 bg-base-200 p-6 text-base-content shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-center text-lg font-semibold">Settings</h2>
                <input ref={ref} type="file" accept="image/*" className="file-input file-input-bordered w-full" />
                <div className="mt-4 flex justify-end gap-3">
                    <button type="button" onClick={confirm} className="btn btn-primary">Ok</button>
                    <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                </div>
            </div>
        </div>
    </>
}


async function storeImage(file: File) {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("Patio", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images");
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("images", "readwrite");
            const blob = new Blob([file], { type: file.type });
            tx.objectStore("images").put(blob, "background");
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
    });
}


async function loadAndApplyBackground() {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("Patio", 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("images");
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("images", "readonly");
            const getReq = tx.objectStore("images").get("background");
            getReq.onsuccess = () => {
                const blob = getReq.result as Blob | undefined;
                if (!blob) return resolve();
                const url = URL.createObjectURL(blob);
                document.documentElement.style.backgroundImage = `url(${url})`;
                resolve();
            };
            getReq.onerror = () => reject(getReq.error);
        };
        request.onerror = () => reject(request.error);
    });
}
