import { SettingsType } from "./Types";

let currentBackgroundUrl: string | null = null;

function openPatioDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Patio", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images");
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


export async function storeImage(file: File): Promise<void> {
    const db = await openPatioDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readwrite");
        tx.oncomplete = () => {
            db.close();
            resolve();
        };

        tx.onabort = tx.onerror = () => {
            const error = tx.error;
            db.close();
            reject(error);
        };

        tx.objectStore("images").put(file, "background");
    });
}


export async function loadAndApplyBackground(): Promise<void> {
    const db = await openPatioDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const getReq = store.get("background");

        getReq.onsuccess = () => {
            const blob = getReq.result as Blob | undefined;
            if (!blob) {
                if (currentBackgroundUrl) {
                    URL.revokeObjectURL(currentBackgroundUrl);
                    currentBackgroundUrl = null;
                }

                document.documentElement.style.backgroundImage = "";
                return;
            }

            const url = URL.createObjectURL(blob);
            if (currentBackgroundUrl) {
                URL.revokeObjectURL(currentBackgroundUrl);
            }

            currentBackgroundUrl = url;
            document.documentElement.style.backgroundImage = `url(${url})`;
        };

        getReq.onerror = () => {
            reject(getReq.error);
        };

        tx.oncomplete = () => {
            db.close();
            resolve();
        };

        tx.onabort = tx.onerror = () => {
            const error = tx.error;
            db.close();
            reject(error);
        };
    });
}


/**
 * store the state of a list (expanded/collapsed)
 */
export function storeExpandedListState(isOpen: boolean, uuid: string) {
    if (!uuid) {
        return;
    }
    try {
        const raw = localStorage.getItem("expanded_lists");
        const arr: string[] = raw ? JSON.parse(raw) : [];

        if (!Array.isArray(arr))
            return;

        let newArray = arr;
        if (isOpen) {
            if (!arr.includes(uuid)) newArray = [...arr, uuid];
        } else {
            newArray = arr.filter(x => x !== uuid);
        }

        localStorage.setItem("expanded_lists", JSON.stringify(newArray));
    } catch (_) { }
}
