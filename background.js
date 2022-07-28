chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'menu',
        title: "扫一扫",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: 'scan',
        parentId: 'menu',
        title: "扫描图片",
        contexts: ["image"]
    });
    chrome.contextMenus.create({
        id: 'tabCapture',
        parentId: 'menu',
        title: "截图",
        contexts: ["all"]
    });

});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "scan") {
        console.log(info);
        chrome.storage.local.get({ "urlList": [] }, function (object) {
            let dataList = object["urlList"];
            dataList.push(info.srcUrl);
            chrome.storage.local.set({ "urlList": dataList });
        })
    }
    if (info.menuItemId === "tabCapture") {
        chrome.tabs.captureVisibleTab();
    }
});