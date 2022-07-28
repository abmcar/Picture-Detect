function getFileFromUrl(url, fileName) {
    return new Promise((resolve, reject) => {
        let blob = null;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Accept', 'image/png');
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
            // 获取返回结果
            blob = xhr.response;
            let file = new File([blob], fileName, {type: 'image/png'});
            // 返回结果
            resolve(file);
        };
        xhr.onerror = (e) => {
            reject(e)
        };
        // 发送
        xhr.send();
    });
}

// let file = null
// getFileFromUrl(url, name1)
//     .then((response) => {
//         file = response
//     })
//     .catch((e) => {
//         console.error(e)
//     });

async function handleFile(file) {
    console.log("strHandleFile");
    handleFileInUploading(file);
    let QRcodeResult = await handleFileInGetQRcode(file.name);
    let detectLabelResult = await handlePictureInDetectLabel(file.name);
    console.log(QRcodeResult);
    console.log(detectLabelResult);
    let ok = false;
    chrome.storage.local.get({"detectLabelResult": [], "QRcodeResult": 0}, function (object) {
        let detectLabelResultList = object["detectLabelResult"];
        if (QRcodeResult.UploadResult.ProcessResults.Object.CodeStatus === "1")
            QRcodeResult = QRcodeResult.UploadResult.ProcessResults.Object.QRcodeInfo.CodeUrl;
        if (detectLabelResult.Body)
            detectLabelResultList.push(detectLabelResult.Body);
        chrome.storage.local.set({"detectLabelResult": detectLabelResultList});
        chrome.storage.local.set({"QRcodeResult": QRcodeResult});
        ok = true;
    });
    while (!ok)
        await delay(50);
    console.log("endHandleFile");
}