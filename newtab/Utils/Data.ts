import { CellType, ListType, SettingsType, ThreadType } from "./Types";

async function fetchFromStorage(actionValue: string, key: string): Promise<any> {
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

            const result = JSON.parse(response?.[key] || "{}");
            resolve(result);
        });
    });
}


export async function fetchData(): Promise<ThreadType[]> {
    return fetchFromStorage("data", "data");
}


export async function fetchSettings(): Promise<SettingsType> {
    return fetchFromStorage("get settings", "settings");
}


export async function saveSettings(settings: SettingsType): Promise<SettingsType> {
    return new Promise<SettingsType>((resolve, reject) => {
        const request = { action: "set settings", settings: settings };
        chrome.runtime.sendMessage(request, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(response);
        })
    });
}


export async function insertThread(thread: ThreadType) {
    return new Promise<{ data: any }>((resolve, reject) => {
        const request = { action: "insert thread", thread: thread };
        chrome.runtime.sendMessage(request, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(response);
        })
    });
}


export async function insertList(threadUuid: string, list: ListType) {
    return new Promise<{ data: any }>((resolve, reject) => {
        const request = { action: "insert list", list: list, thread: threadUuid };
        chrome.runtime.sendMessage(request, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(response);
        })
    });
}


export async function insertCell(listUuid: string, cell: CellType) {
    return new Promise<{ data: any }>((resolve, reject) => {
        const request = { action: "insert cell", cell: cell, list: listUuid };
        chrome.runtime.sendMessage(request, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(response);
        })
    });
}
