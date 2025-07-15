let title = '💰我的蝦幣 瀏覽商店 領任務';
let version = 'v20240226';

let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

function telegramNotify(title, subtitle = '', message = '') {
    let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
    if (TelegramUrl != '') {
        let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
        $httpClient.get(telegramData, function (error, response, data) { });
    }
}
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }

let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
    if (showNotification) {
        $notification.post(title, subtitle, message, { 'openUrl': url });
    }
    if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
};
function parseCookie(cookieString) {
    return cookieString
        .split(';')
        .map(v => v.split('='))
        .filter((v) => v.length > 1)
        .reduce((acc, v) => {
            let value = decodeURIComponent(v[1].trim());
            for (let index = 2; index < v.length; index++) {
                if (v[index] === '') {
                    value += '=';
                }
            }
            acc[decodeURIComponent(v[0].trim())] = value;
            return acc;
        }, {});
}
function cookieToString(cookieObject) {
    let string = ''; for (const [key, value] of Object.entries(cookieObject)) {
        if (string != '') { string += '; '; }
        string += `${key}=${value}`;
    } return string;
}
Date.prototype.format = function (format = '1') {
    if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.fff'; }
    else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
    else if (format === '2') { format = 'yyyy/MM/dd'; }
    else if (format === '3') { format = 'HH:mm:ss'; }
    else if (format === '4') { format = 'MM/dd'; }
    else if (format === '5') { format = 'HH:mm'; }
    let o = {
        "M+": this.getMonth() + 1, //month  
        "d+": this.getDate(),    //day  
        "h+": this.getHours(),   //hour  
        "H+": this.getHours(),   //hour  
        "m+": this.getMinutes(), //minute  
        "s+": this.getSeconds(), //second  
        "q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
        "f+": this.getMilliseconds(),  //millisecond  
        "S": this.getMilliseconds() //millisecond  
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length === 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
let DTND = new Date(new Date().format('2')).getTime();
let DTN = new Date().getTime();


if ($request.method != 'OPTIONS') {
    let flag = true;
    let isChangeHeaders = false;
    let headers = $request.headers;
    let hc = headers['Cookie'] || headers['cookie'];
    let hcc = parseCookie(hc);
    console.log(`userid : ${hcc.userid}`);
    console.log(`SPC_U : ${hcc.SPC_U}`);

    if (hcc.userid != hcc.SPC_U) {
        isChangeHeaders = true;
        let ssc = JSON.parse($persistentStore.read('ShopeeInfo' + _ShopeeUserID) || '{}');
        let sc = '';
        if ('tokenAll' in ssc) {
            ['shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'].forEach(cc => {
                if (cc in hcc && cc in ssc.tokenAll) { ssc.tokenAll[cc] = hcc[cc]; }
            });
            sc = cookieToString(ssc.tokenAll);
        }
        else if ('cookieAll' in ssc) { sc = ssc.cookieAll; }
        else if ('cookieToken' in ssc) { sc = ssc.cookieToken; }
        else { sc = cookieToString(ssc.token); }

        if (!sc.includes('csrftoken')) sc += `; csrftoken=${ssc.csrfToken}`;
        if (!sc.includes('shopee_token')) sc += `; shopee_token=${ssc.shopeeToken}`;
        if (!sc.includes('shopid')) sc += `; shopid=${ssc.shopId}`;
        if (!sc.includes('userid')) sc += `; userid=${ssc.token.SPC_U}`;
        if (!sc.includes('username')) sc += `; username=${ssc.userName}`;

        try {
            for (const [key, value] of Object.entries(headers)) {
                if (!key.match(/(content-.+|accept|accept-.+|host|user-agent)/i)) {
                    if (key.match(/cookie/i)) { headers[key] = sc; }
                    else if (key.match(/x-user-(id|token)/i)) { headers[key] = ssc.token.SPC_U; }
                    else if (key.match(/x-device-(id|fingerprint)/i)) { headers[key] = ssc.token.SPC_F; }
                    else if (key.match(/X-(CSRFToken|sign)/i)) { headers[key] = ssc.csrfToken; }
                }
            }

        } catch (error) {
            flag = false;
            console.log('ERROR');
            console.log(error);
            $done({ response: { status: 404, headers: {}, body: "" } });
        }
    }

    if ($request.method != 'POST') { flag = false; }
    if (flag) {
        var body = $request.body;
        var json = JSON.parse(body);

        json.datetime = new Date().getTime();
        json.headers = headers;
        let timeOver = false;
        let jsonBT = JSON.parse($persistentStore.read('ShopeeFeedsTaskBrowseTime' + _ShopeeUserID) || '{"dataTime":0}');
        let waitTime = Math.floor(((jsonBT.dataTime + 31000) - json.datetime) / 1000);
        if (jsonBT.dataTime + 31000 < json.datetime) { timeOver = true; }
        console.log(`timeOver: ${timeOver}`);
        if (!timeOver && waitTime >= 0 && waitTime < 3) {
            console.log(`Wait Time ${waitTime}`);
            timeOver = true;
            waitTime++;
            (async () => { try { await delay(waitTime); } catch (error) { } })();
        }
        let hasToken = false;
        if (json.hasOwnProperty('task_token')) {
            let jsonr = JSON.parse($persistentStore.read('ShopeeFeedsTaskToken' + _ShopeeUserID) || '{}');
            if (jsonr.hasOwnProperty('task_token') && json.task_token == jsonr.task_token) { hasToken = true; }
        }
        console.log(`hasToken: ${hasToken}`);
        if (!hasToken) {
            $persistentStore.write(JSON.stringify(json), 'ShopeeFeedsTaskToken' + _ShopeeUserID);
            if (!timeOver) {
                loonNotify('30秒領蝦幣', (ShopeeUserID == '' ? '' : ShopeeUserID + ' ') + ` 還需等待 ${waitTime} 秒，再手動按「領取」。`);
                let rfbody = JSON.stringify(
                    {
                        "data": null, "bff_meta": null, "error": 71210052, "error_msg": "failed to finish product feeds task and claim"
                    }
                );

                $done({
                    response: {
                        status: 200,
                        headers: {
                            'server': 'SGW',
                            'date': new Date().toUTCString(),
                            'content-type': 'application/json; charset=UTF-8',
                            'X-FAKE': 'FAKE'
                        },
                        body: rfbody
                    }
                });

            }
        }
        if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
        else { console.log('未修改 Headers'); $done({}); }
    }
    else {
        if (isChangeHeaders) { console.log('修改 Headers !POST'); $done({ headers }); }
        else { console.log('未修改 Headers !POST'); $done({}); }
    }
}
else {
    $done({});
}

