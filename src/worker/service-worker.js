importScripts('data.js')

chrome.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(request, sender, sendResponse) {
    if (request.action === "data") {
        sendResponse({ data: data });
    } else {
        sendResponse({data: "error"});
    }
}

