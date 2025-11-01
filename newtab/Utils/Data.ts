import { CellType, ListType, SettingsType, ThreadType } from "./Types";

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
    return fetchFromStorage("data", "data");
}


export async function fetchSettings(): Promise<SettingsType> {
    return fetchFromStorage("get settings", "settings", {});
}


export async function saveSettings(settings: SettingsType): Promise<{ data: boolean }> {
    return sendRuntimeMessage({ action: "set settings", settings: settings });
}


export async function editThread(thread: ThreadType) {
    return sendRuntimeMessage({ action: "edit thread", thread });
}


export async function insertThread(thread: ThreadType) {
    return sendRuntimeMessage({ action: "insert thread", thread });
}


export async function insertList(threadUuid: string, list: ListType) {
    return sendRuntimeMessage({ action: "insert list", list, thread: threadUuid });
}


export async function editList(list: ListType) {
    return sendRuntimeMessage({ action: "edit list", list });
}


export async function insertCell(listUuid: string, cell: CellType) {
    return sendRuntimeMessage({ action: "insert cell", cell, list: listUuid });
}


export async function editCell(cell: CellType) {
    return sendRuntimeMessage({ action: "edit cell", cell });
}


export async function deleteCell(cell: string) {
    return sendRuntimeMessage({ action: "delete cell", cell: cell });
}


export async function insertSubCell(listUuid: string, cell: CellType, parentCell: string) {
    return sendRuntimeMessage({ action: "insert subcell", cell: cell, list: listUuid, parentCell: parentCell });

}


export async function deleteThread(threadUuid: string) {
    return sendRuntimeMessage({ action: "delete thread", thread: threadUuid });
}


export async function deleteList(listUuid: string) {
    return sendRuntimeMessage({ action: "delete list", list: listUuid });
}
