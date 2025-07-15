let title = '扭蛋 REQ';
let caption = '取得 ' + title;
let version = 'v20231112';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };

Date.prototype.format = function (format = '1') {
    if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
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
        "S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length === 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
let dtD = new Date(new Date().format('2')).getTime();

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

console.log(new Date().format());

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

        let isCoinsTwist = $persistentStore.read('用蝦幣抽寵物') || '';
        if (isCoinsTwist == '是') { isCoinsTwist = true; } else { isCoinsTwist = false; }

        let canTwist = false;
        if (json.hasOwnProperty('channel')) {
            console.log(json);
            if (json.costPrice == 0 || json.channel == 'ads') {
                canTwist = true;
            }
            else if (isCoinsTwist) {
                canTwist = true;
            }
            else {
                loonNotify(`唉呀！您按到 ${json.costPrice} 蝦幣抽寵物了。`, `您指定不能用蝦幣抽寵物。`);
            }
        }

        if (canTwist) {
            try {
                let js = {
                    datetime: new Date().getTime(),
                    channel: json.channel
                };
                $persistentStore.write(JSON.stringify(js), 'ShopeePetTwist' + _ShopeeUserID);
                let js2 = { data: body, datetime: dtD };
                $persistentStore.write(JSON.stringify(js2), 'finish_twist' + _ShopeeUserID);
            } catch (error) {
                console.log(error);
                console.log(json);
            }
        }
        else {
            // 回傳 蝦幣不足
            json = {
                "code": 600001,
                "data": {
                    "premiumTicketNum": 0,
                    "paidCostPrice": 0,
                    "currentCoins": 0,
                    "pet": null,
                    "freeTicketNum": 0,
                    "petList": []
                },
                "timestamp": new Date().getTime(),
                "msg": "",
                "traceID": ""
            }
            $done({ response: { status: 200, body: JSON.stringify(json) } });
        }
    }
    if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
    else { console.log('未修改 Headers'); $done({}); }
}
else {
    $done({});
}
