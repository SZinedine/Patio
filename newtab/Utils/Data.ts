
export async function fetchData() {
    return new Promise<{ data: any }>((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "data" }, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(response);
        });
    });
}

