importScripts('data.js')

const defaultSettings = {
    locked: false,
}

chrome.runtime.onInstalled.addListener(async () => {
    // storeData(testingData);      // for testing

    const data = await hasData();
    const settings = await hasSettings();

    if (!data) {
        await storeData(DEFAULT_DATA);
    }

    if (!settings) {
        await storeSettings({ settings: defaultSettings });
    }
});


chrome.runtime.onMessage.addListener(receiveMessage);

/**
 * @param {any} request
 * @param {(response?: any) => void} sendResponse 
 */
function receiveMessage(request, _, sendResponse) {
    /**
     * convenience function for similar requests/responses
     * @param {Promise<any>} promise
     */
    const processSet = (promise) => {
        promise.then(() => {
            sendResponse({ data: true });
        }).catch(err => {
            sendResponse({ data: false, error: err });
            console.error(err);
        });
    };

    switch (request.action) {
        case "get data":
            getData().then((data) => {
                sendResponse({ data: data, response: true });
            }).catch(err => {
                sendResponse({ data: false, error: err });
                console.error(`Error while fetching data: ${err}`);
            });
            return true;

        case "set data":
            const data = request.data;
            if (!data) {
                throw Error("set data: invalid")
            }

            storeData(data)
                .then(() => sendResponse({ data: true }))
                .catch(err => sendResponse({ data: false, error: err }));

            return true;
        case "get settings":
            getSettings().then(settings => {
                sendResponse({ settings: settings });
            }).catch(err => {
                sendResponse({ data: false, error: err });
                console.error(err);
            });
            return true;

        case "set settings":
            processSet(storeSettings(request));
            return true;

        case "edit thread":
            processSet(editThread(request));
            return true;

        case "insert thread":
            processSet(insertThread(request));
            return true;

        case "insert cell":
            processSet(insertCell(request));
            return true;

        case "edit cell":
            processSet(editCell(request));
            return true;

        case "insert subcell":
            processSet(insertSubCell(request));
            return true;

        case "delete cell":
            processSet(deleteCell(request));
            return true;

        case "delete thread":
            processSet(deleteThread(request));
            return true;

        case "fetch favicon":
            fetchFavicon(request.url)
                .then((dataUrl) => sendResponse({ dataUrl }))
                .catch(err => {
                    console.error('Favicon fetch failed', err);
                    sendResponse({ error: err?.message || 'Unknown error' });
                });
            return true;

        default:
            sendResponse({
                data: false,
                message: `Error: Unrecognized request "${request.action}"`
            });
            return true;
    }
}

/**
 * insert a thread
 * @param {Object} request 
 */
async function insertThread(request) {
    let data = await getData();
    data.push(request.thread);
    await storeData(data);
}


/**
 * edit a thread
 * @param {Object} request 
 */
async function editThread(request) {
    const editedThread = request.thread;
    let data = await getData();

    for (let thread of data) {
        if (thread.uuid === editedThread.uuid) {
            thread.title = editedThread.title;
            await storeData(data);
            return;
        }
    }

    throw new Error("Error while trying to edit a Thread");
}


/**
 * delete a thread
 * @param {Object} request 
 */
async function deleteThread(request) {
    const threadUuid = request.thread;
    if (!threadUuid) {
        throw new Error("the provided Thread UUID is invalid")
    }

    let data = await getData();
    data = data.filter((th) => th.uuid !== threadUuid)
    await storeData(data);
}


/**
 * insert a cell into a list
 * @param {Object} request 
 */
async function insertCell(request) {
    const uuid = request.list;
    let data = await getData();
    for (let thread of data) {
        for (let list of thread.children) {
            if (list.uuid === uuid) {
                list.children.push(request.cell);
                await storeData(data);
                return;
            }
        }
    }

    throw new Error("Error while trying to insert a Cell");
}


/**
 * edit a cell
 * @param {Object} request 
 */
async function editCell(request) {
    const newCell = request.cell;
    const uuid = newCell.uuid;
    let data = await getData();

    const findAndUpdateCell = (cells) => {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.uuid === uuid) {
                cells[i].title = newCell.title;
                cells[i].link = newCell.link;
                cells[i].description = newCell.description;
                return true;
            }

            if (cell.children && cell.children.length > 0) {
                if (findAndUpdateCell(cell.children)) {
                    return true;
                }
            }
        }

        return false;
    };

    for (let thread of data) {
        for (let list of thread.children) {
            if (findAndUpdateCell(list.children)) {
                await storeData(data);
                return;
            }
        }
    }

    throw new Error("Error while trying to edit a Cell: Cell not found.");
}


/**
 * delete a cell
 * @param {Object} request 
 */
async function deleteCell(request) {
    const cellUuid = request.cell;
    let data = await getData();

    if (!cellUuid) {
        throw new Error("Error while deleting a cell. invalid UUID")
    }

    const removeCell = (cells) => {
        return cells
            .filter(cell => cell.uuid !== cellUuid)
            .map(cell => ({
                ...cell,
                children: removeCell(cell.children || [])
            }));
    };

    data = data.map(thread => ({
        ...thread,
        children: thread.children.map(list => ({
            ...list,
            children: removeCell(list.children || [])
        }))
    }));

    await storeData(data);
}


/**
 * insert a subcell into a cell
 * @param {Object} request 
 */
async function insertSubCell(request) {
    const parentList = request.list;
    const parentCell = request.parentCell;
    const newCell = request.cell;

    let data = await getData();
    for (let thread of data) {
        for (let list of thread.children) {
            if (list.uuid === parentList) {
                for (let cell of list.children) {
                    if (cell.uuid === parentCell) {
                        cell.children = cell.children ? cell.children : [];
                        cell.children.push(newCell);
                        await storeData(data);
                        return;
                    }
                }
            }
        }
    }

    throw new Error(`Error while trying to insert subcell: Parent list or cell not found.`);
}


/**
 * Stores data in chrome storage
 * @param {Array<Object>} data - The data to store
 * @returns {Promise<void>}
 */
async function storeData(data) {
    if (!Array.isArray(data)) {
        throw new Error("storeData: data must be an array of objects");
    }

    try {
        await chrome.storage.local.set({ data });
    } catch (error) {
        console.error("Error storing data:", error);
        throw error;
    }
}


/**
 * Retrieves data from local storage
 * @returns {Promise<Array<Object>>} The stored data or an empty array if none exists
 */
async function getData() {
    const result = await chrome.storage.local.get(["data"]);
    return result.data || [];
}


/**
 * Checks if data exists
 * @returns {Promise<boolean>} True if data exists, false otherwise
 */
async function hasData() {
    const result = await chrome.storage.local.get(['data']);
    return result.data !== undefined && result.data !== null;
}


/**
 * @param {Object} req 
 * @returns {Promise<void>}
 */
async function storeSettings(req) {
    const settings = req.settings;
    if (!settings) {
        throw new Error("storeSettings: invalid setting object");
    }

    await chrome.storage.local.set({ settings });
}


/**
 * Retrieves data from local storage
 * @returns {Promise<Array<Object>>} The stored data or an empty array if none exists
 */
async function getSettings() {
    const result = await chrome.storage.local.get(["settings"]);
    return result.settings || defaultSettings;
}


/**
 * Checks if settings object exists in local storage
 * @returns {Promise<boolean>} True if settings exists, false otherwise
 */
async function hasSettings() {
    const result = await chrome.storage.local.get(['settings']);
    return result.settings !== undefined && result.settings !== null;
}

/**
 * Fetch favicon and return as data URL
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchFavicon(url) {
    if (!url) {
        throw new Error('No favicon url provided');
    }

    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    const base64 = arrayBufferToBase64(buffer);
    return `data:${contentType};base64,${base64}`;
}

/**
 * Convert an ArrayBuffer to base64 string
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
