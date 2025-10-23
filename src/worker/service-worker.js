importScripts('data.js')

const defaultSettings = {
    backgroundImage: "",
}

chrome.runtime.onMessage.addListener(receiveMessage);

chrome.runtime.onInstalled.addListener(async () => {
    // storeData(testingData);      // for testing

    const data = await hasData();
    const settings = await hasSettings();

    if (!data) {
        await storeData(defaultData);
    }

    if (!settings) {
        storeSettings(defaultSettings);
    }
});


function receiveMessage(request, sender, sendResponse) {
    if (request.action === "data") {
        getData().then((data) => {
            sendResponse({ data: JSON.stringify(data), response: true });
        }).catch(e => {
            sendResponse({ response: false });
            console.error(`Error while fetching data: ${e}`)
        });

        return true;

    } else if (request.action === "get settings") {
        getSettings().then(settings => {
            sendResponse({ settings: JSON.stringify(settings) });
        }).catch((err) => {
            sendResponse({ response: false });
            console.error(err)
        });

        return true;

    } else if (request.action === "set settings") {
        storeSettings(request.settings).then(_ => {
            sendResponse({ response: true });
        }).catch((err) => {
            sendResponse({ response: false });
            console.error(err)
        });

        return true;

    } else if (request.action === "insert thread") {
        insertThread(request).then(() => {
            sendResponse({ data: true });
        });

        return true;

    } else if (request.action === "insert list") {
        insertList(request).then(() => {
            sendResponse({ data: true });
        });

        return true;

    } else if (request.action === "insert cell") {
        insertCell(request).then(() => {
            sendResponse({ data: true });
        });

        return true;

    } else {
        sendResponse({ data: "error" });

        return true;
    }
}


/**
 * insert a thread
 * @param {Object} req 
 */
async function insertThread(req) {
    let data = await getData();
    data.push(req.thread);
    await storeData(data);
}


/**
 * insert a list into a thread
 * @param {Object} req 
 */
async function insertList(req) {
    const uuid = req.thread;
    let data = await getData();

    for (let thread of data) {
        if (thread.uuid === uuid) {
            thread.children.push(req.list);
            break;
        }
    }

    await storeData(data);
}


/**
 * insert a cell into a list
 * @param {Object} req 
 */
async function insertCell(req) {
    const uuid = req.list;
    let data = await getData();
    for (let thread of data) {
        for (let list of thread.children) {
            if (list.uuid === uuid) {
                list.children.push(req.cell);
                break;
            }
        }
    }

    await storeData(data);
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
 * @param {Object} settings 
 * @returns {Promise<void>}
 */
async function storeSettings(settings) {
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
