// 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。 https://console.cloud.tencent.com/cos5/bucket
var Bucket = '***';  /* 存储桶，必须字段 */

// 存储桶region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/ 
// 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
var Region = 'ap-beijing';     /* 存储桶所在地域，必须字段 */

// 初始化实例
var cos = new COS({
    SecretId: '***',
    SecretKey: '***',
});


const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))


async function handleFileInUploading(file) {
    let ok = false;
    let res;
    cos.putObject(
        {
            Bucket: Bucket,
            Region: Region,
            Key: file.name,
            Body: file,
            // Headers: {
            //     'Pic-Operations':
            //         '{ "is_pic_info": 1, "rules": [{ "fileid": "test.jpg", "rule": "QRcode/cover/1" }] }'
            // },
        },
        function (err, data) {
            console.log(err || data);
            ok = true;
            res = data || err;
        },
    );
    while (ok === false)
        await delay(100);
    return res;
}

async function handleFileInGetQRcode(fileKey) {
    let ok = false;
    let res;
    cos.request(
        {
            Bucket: Bucket,
            Region: Region,
            Key: fileKey,
            Method: 'POST',
            Action: 'image_process',
            Headers: {
                'Pic-Operations':
                    '{ "is_pic_info": 1, "rules": [{"fileid": "desample_photo.jpg","rule": "QRcode/cover/1" }] }'
            },
        },
        function (err, data) {
            ok = true;
            res = data || err;
        },
    );
    while (ok === false)
        await delay(100);
    return res;
}

async function handlePictureInDetectLabel(pictureKey) {
    let ok = false;
    let res;
    cos.getObject(
        {
            Bucket: Bucket,
            Region: Region,
            Key: pictureKey,
            Query: {
                'ci-process': 'detect-label'
            }
        },
        function (err, data) {
            console.log(data || err);
            if (data) {
                console.log(data.Body);
            }
            ok = true;
            res = data || err;
        },
    );
    while (ok === false)
        await delay(100);
    return res;
}