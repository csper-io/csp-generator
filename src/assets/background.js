'use strict';
var cache = {};
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log("chrome.storage.onChanged.addListener", changes, namespace);
    for (let key of Object.keys(changes)) {
        cache[key] = JSON.parse(changes[key].newValue);
    }
});
chrome.storage.sync.get((items) => {
    console.log("chrome.storage.sync.get", items);
    cache = items;
});
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (details.type !== 'main_frame') {
        return;
    }
    let domain = new URL(details.url).hostname;
    if (domain === null) {
        return;
    }
    let apitoken = cache[domain];
    if (!apitoken || !apitoken.isEnabled) {
        return { responseHeaders: details.responseHeaders };
    }
    let out = [];
    out.push({ name: "Content-Security-Policy-Report-Only", value: apitoken.policy });
    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy' || details.responseHeaders[i].name.toLowerCase() === 'content-security-policy-report-only') {
            continue;
        }
        out.push(details.responseHeaders[i]);
    }
    return { responseHeaders: out };
}, { urls: ['<all_urls>'] }, ['blocking', 'responseHeaders']);
