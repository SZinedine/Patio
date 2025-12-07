
import { dataUrlToBlob } from "./Data";

const Browser = typeof browser !== "undefined" ? browser : chrome;
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


export async function storeImage(file: File | Blob): Promise<void> {
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
    try {
        let blob = await getStoredBackground();

        if (!blob) {
            blob = await fetchDefaultBackgroundFromWorker();
            await storeImage(blob);
        }

        applyBackground(blob);
    } catch (error) {
        console.error("Failed to load background image:", error);
        applyBackground(null);
    }
}

export async function getBackgroundBlob(): Promise<Blob | null> {
    try {
        const blob = await getStoredBackground();
        if (blob) {
            return blob;
        }

        const defaultBlob = await fetchDefaultBackgroundFromWorker();
        await storeImage(defaultBlob);
        return defaultBlob;
    } catch (error) {
        console.error("Failed to fetch background image:", error);
        return null;
    }
}

export async function applyBackgroundDataUrl(dataUrl: string): Promise<void> {
    const blob = dataUrlToBlob(dataUrl);
    await storeImage(blob);
    await loadAndApplyBackground();
}


async function getStoredBackground(): Promise<Blob | null> {
    const db = await openPatioDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const getReq = store.get("background");

        getReq.onsuccess = () => {
            const blob = getReq.result as Blob | undefined;
            resolve(blob ?? null);
        };

        getReq.onerror = () => {
            reject(getReq.error);
        };

        tx.oncomplete = () => {
            db.close();
        };

        tx.onabort = tx.onerror = () => {
            const error = tx.error;
            db.close();
            reject(error);
        };
    });
}


function applyBackground(blob: Blob | null) {
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
}


async function fetchDefaultBackgroundFromWorker(): Promise<Blob> {
    return new Promise((resolve, reject) => {
        Browser.runtime.sendMessage({ action: "get image" }, (response) => {
            const err = Browser.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }

            if (!response || response.error) {
                reject(new Error(response?.error || "Failed to fetch default background"));
                return;
            }

            const uint8 = new Uint8Array(response.bytes);
            const blob = new Blob([uint8], { type: response.type });

            if (!blob) {
                reject(new Error("Default background blob missing from service worker response"));
                return;
            }
            resolve(blob);
        });
    });
}
