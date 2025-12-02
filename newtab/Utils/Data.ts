import { CellType, HistoryType, SettingsType, ThreadType } from "./Types";

type defaultValueType = [] | {};

async function fetchFromStorage(actionValue: string, key: string, defaultValue: defaultValueType = []): Promise<any> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: actionValue }, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }

            if (response && response.error) {
                reject(new Error(response.error));
                return;
            }

            const result = response?.[key] || defaultValue;
            resolve(result);
        });
    });
}


async function sendRuntimeMessage(request: object): Promise<{ data: any }> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(request, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                console.log(err);
                reject(new Error(err.message));
            } else {
                resolve(response);
            }
        });
    });
}


export async function fetchData(): Promise<ThreadType[]> {
    return fetchFromStorage("get data", "data");
}


export async function saveData(data: ThreadType[]) {
    return sendRuntimeMessage({ action: "set data", data: data });
}


export async function fetchSettings(): Promise<SettingsType> {
    return fetchFromStorage("get settings", "settings", {});
}


export async function saveSettings(settings: SettingsType): Promise<{ data: boolean }> {
    return sendRuntimeMessage({ action: "set settings", settings: settings });
}


function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('patio-favicons', 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore('icons');
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};


export async function getCachedIcon(iconCacheKey: string) {
    const db = await openDb();
    return new Promise<string | null>((resolve, reject) => {
        const tx = db.transaction('icons', 'readonly');
        const store = tx.objectStore('icons');
        const req = store.get(iconCacheKey);

        req.onsuccess = () => {
            const blob = req.result as Blob | undefined;
            if (!blob) {
                resolve(null);
                return;
            }
            const objectUrl = URL.createObjectURL(blob);
            resolve(objectUrl);
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
};


export async function storeIcon(iconCacheKey: string, blob: Blob) {
    const db = await openDb();
    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction('icons', 'readwrite');
        const store = tx.objectStore('icons');
        const req = store.put(blob, iconCacheKey);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
};


export async function fetchIconFromBackground(faviconUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetch favicon', url: faviconUrl }, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            if (response?.error || !response?.dataUrl) {
                reject(new Error(response?.error || 'No data returned'));
                return;
            }
            resolve(response.dataUrl as string);
        }
        );
    });
};


export function dataUrlToBlob(dataUrl: string): Blob {
    const [meta, base64] = dataUrl.split(',');
    const mimeMatch = /data:(.*?);base64/.exec(meta);
    const mime = mimeMatch?.[1] || 'image/png';
    const bytes = atob(base64);
    const len = bytes.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = bytes.charCodeAt(i);
    }
    return new Blob([arr], { type: mime });
};

