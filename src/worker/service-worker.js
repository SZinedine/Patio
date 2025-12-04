importScripts('data.js')

const defaultSettings = {
    locked: false,
}
const DEFAULT_BACKGROUND_PATH = "images/leaves.jpg";

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

        case "fetch favicon":
            fetchFavicon(request.url)
                .then((dataUrl) => sendResponse({ dataUrl }))
                .catch(err => {
                    sendResponse({ error: err?.message || 'Unknown error' });
                });
            return true;

        case "get image":
            getDefaultBackgroundBlob()
                .then((blob) => blob.arrayBuffer())
                .then((buffer) => {
                    const bytes = Array.from(new Uint8Array(buffer));
                    sendResponse({ bytes, type: "image/jpeg" })})
                .catch(err => {
                    console.error('Error while loading default background:', err);
                    sendResponse({ error: err?.message || 'Failed to load default background' });
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

const faviconService1 = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&size=32&url=";
const faviconService2 = "https://www.google.com/s2/favicons?sz=64&domain_url=";

/**
 * Fetch favicon and return as data URL
 * @param {string} url_
 * @returns {Promise<string>}
 */
async function fetchFavicon(url) {
    if (!url) {
        throw new Error('No favicon url provided');
    }

    const url_ = new URL(url).origin;

    let response = await fetch(faviconService1 + url_, { cache: 'force-cache' });
    if (!response.ok) {
        response = await fetch(faviconService2 + url_, { cache: 'force-cache' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    const base64 = arrayBufferToBase64(buffer);
    return `data:${contentType};base64,${base64}`;
}


async function getDefaultBackgroundBlob() {
    const url = chrome.runtime.getURL(DEFAULT_BACKGROUND_PATH);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.blob();
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
