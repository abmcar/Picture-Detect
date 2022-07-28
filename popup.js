// const detectResult = document.getElementById("content");
const detectResult = document.getElementById("detectResult");

async function handleUrl() {
    let handleAlready = false;
    await chrome.storage.local.get({"urlList": []}, async function (object) {
        let urlList = object["urlList"];
        if (urlList.length === 0) {
            handleAlready = true;
            return;
        }

        console.log(urlList);
        let cnt = 0;
        let url = urlList[0];
        // for (const url of urlList) {
        await getFileFromUrl(url, cnt)
            .then(async function (response) {
                console.log(response);
                await handleFile(response);
                cnt++;
                console.log(cnt);
            })
            .catch((e) => {
                console.error(e);
            });
        // }
        while (cnt === 0) {
            console.log(cnt);
            await delay(50);
        }
        console.log("end");
        await chrome.storage.local.set({"urlList": []});
        handleAlready = true;
    });

    while (!handleAlready)
        await delay(50);

    chrome.storage.local.get({"detectLabelResult": []}, async function (object) {
        let dataList = object["detectLabelResult"];
        console.log('begin');
        console.log(dataList);
        if (dataList.length === 0) {
            let p = document.createElement("p");
            p.innerText = "暂无数据";
            detectResult.appendChild(p);
            return;
        }
        data = dataList[0];
        // dataList.forEach(function (data) {
        // xml解析
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let Labels = xmlDoc.getElementsByTagName('Labels');
        for (let i = 0; i < Labels.length; i++) {
            let Confidence = Labels[i].getElementsByTagName('Confidence')[0].innerHTML;
            let Name = Labels[i].getElementsByTagName('Name')[0].innerHTML;
            let tr = document.createElement('tr');
            const td_1 = document.createElement('td');
            const td_2 = document.createElement('td');
            td_1.innerHTML = Name;
            tr.appendChild(td_1);
            td_2.innerHTML = Confidence;
            tr.appendChild(td_2);
            detectResult.appendChild(tr);
        }
        console.log(data);
        // });
    });
}

handleUrl();

// async function fun() {
//     let p = document.createElement("p");
//     let tmp = await detectLabel("defaultPT.png");
//     console.log(typeof (tmp));
//     console.log(tmp);
//     p.innerText = tmp;
//     detectResult.appendChild(p);
// }

// fun();

const button = document.getElementById("clear");
button.addEventListener("click", function () {
    chrome.storage.local.set({"detectLabelResult": []});
    chrome.storage.local.set({"QRcodeResultList": []});
    chrome.storage.local.set({"urlList": []});
    while (detectResult.childNodes.length)
        detectResult.removeChild(detectResult.firstChild);
    let p = document.createElement("p");
    p.innerText = "暂无数据";
    detectResult.appendChild(p);

    chrome.storage.local.get({"urlList": []}, function (object) {
        console.log(object["urlList"]);
    });

    // const content = document.getElementById('content').value;
    // const time = document.getElementById('time').value;
    // setTimeout(function () {
    //     chrome.notifications.create(
    //         '',
    //         {
    //             type: 'basic',
    //             title: '到时间啦!',
    //             message: content,
    //             iconUrl: 'timer.png',
    //         }
    //     );
    // }, Number(time) * 1000);
});