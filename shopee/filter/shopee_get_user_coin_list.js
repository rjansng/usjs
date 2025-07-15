let showProcInfo = false;
let html = '';
// let isGui = true;
// let body = document.querySelector('#jfContent_pre').innerText;
// let obj = JSON.parse(body);
// Date.prototype.format = function (format = '1') {
//     if (format == '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
//     else if (format == '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
//     else if (format == '2') { format = 'yyyy/MM/dd'; }
//     else if (format == '3') { format = 'HH:mm:ss'; }
//     else if (format == '4') { format = 'MM/dd'; }
//     else if (format == '5') { format = 'HH:mm'; }
//     let o = {
//         "M+": this.getMonth() + 1, //month  
//         "d+": this.getDate(),    //day  
//         "h+": this.getHours(),   //hour  
//         "H+": this.getHours(),   //hour  
//         "m+": this.getMinutes(), //minute  
//         "s+": this.getSeconds(), //second  
//         "q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
//         "S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
//     }
//     if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
//         (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (let k in o) if (new RegExp("(" + k + ")").test(format))
//         format = format.replace(RegExp.$1,
//             RegExp.$1.length == 1 ? o[k] :
//                 ("00" + o[k]).substr(("" + o[k]).length));
//     return format;
// };

let isGui = false;
try {
    if ($request && $request.url.match(/^http:\/\/lo.on\/.+/i)) { isGui = true; console.log('GUI手動執行。\n'); }
} catch (error) { }
let UseUserId = '';
let ShopeeUserID = '';
let SimulateUserID = '';
if (isGui) {
    SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
    if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
    if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
} else {
    UseUserId = $persistentStore.read('UseUserId') || '';
    ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
}
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
if (UseUserId != '1' && SimulateUserID == '') { ShopeeUserID = ''; _ShopeeUserID = ''; if (showProcInfo) { console.log('使用本機資料。'); } }

let caption = '💰我的蝦幣 清單';
let title = '取得 ' + caption;
const version = 'v20230926';
let showNotification = true;
let showLog = true;
let config = null;
let dataList = [];
const NotShowNotification = $persistentStore.read('NotShowNotification'); if (NotShowNotification) { showNotification = false; }
const NotShowLog = $persistentStore.read('ShowLog'); if (NotShowLog) { showLog = false; }
function getRnd(len = 16) { return (Math.random() * 10 ** 20).toFixed(0).substring(0, len); }
function getToken() { return (new Date()).getTime().toString(); }
function loonNotifyArray(m) { if (Array.isArray(m)) { loonNotify(m[0], m[1]); } else { loonNotify(m); } };
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
function handleError(error) {
    let sl = showLog; showLog = false; let msg = '❌';
    if (Array.isArray(error)) {
        for (let i = 0; i < error.length; i++) {
            const e = error[i]; msg += (i > 1 ? '\n' : ' ') + `${e}`;
        }
    }
    else { msg += ` ${error}`; }
    config.msg = msg;
    console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
function GetDataConfig(item = -1, method = 'POST', url = '', title = '', content = '') {
    if (item === -1) {
        return {
            'item': item, 'method': method, 'url': url, 'title': title, 'content': content, 'memo': ''
            , 'dataRequest': { url: '', headers: config.shopeeHeaders, body: null }, 'func': ud[6],
        };
    }
    let ud = UrlData[item];
    let dc = {
        'item': item, 'method': ud[0], 'title': ud[1], 'content': ud[2], 'url': ud[3], 'memo': '',
        'dataRequest': { url: '', headers: null, body: null }, 'func': ud[6],
    };
    let params = null;
    params = ud[5];
    if (dc.method === 'POST') { dc.dataRequest.body = DataPostBodyList[dc.item]; }
    dc.dataRequest.headers = config.shopeeHeaders;
    if (params && params.length > 0) {
        for (let i = 0; i < params.length; i++) {
            const p = params[i];
            dc.url = dc.url.replace(`\{${p}\}`, config[p]);
        }
    }
    dc.dataRequest.url = dc.url;
    return dc;
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

async function dataGet(dc, item = -1) {
    return new Promise((resolve, reject) => {
        try {
            let msg = `\t🌐 ${dc.title} ...`;
            if (item >= 0) { msg += ` (${item})`; }
            if (showProcInfo) console.log(msg);
            $httpClient.get(dc.dataRequest, function (error, response, data) {
                if (error) {
                    return reject([`執行失敗 ‼️`, '連線錯誤']);
                } else {
                    if (response.status === 200) {
                        return resolve(data);
                    } else {
                        return reject([`執行失敗 ‼️`, response.status, data]);
                    }
                }
            });
        } catch (error) {
            return reject([`執行失敗 ‼️`, error]);
        }
    });
}
async function dataPost(dc, item = -1) {
    return new Promise((resolve, reject) => {
        try {
            let msg = `\t🌐 ${dc.title} ...`;
            if (item >= 0) { msg += ` (${item})`; }
            if (showProcInfo) console.log(msg);
            $httpClient.post(dc.dataRequest, function (error, response, data) {
                if (error) {
                    return reject([`${content}失敗 ‼️`, '連線錯誤']);
                } else {
                    if (response.status === 200) {
                        return resolve(data);
                    } else {
                        return reject([`執行失敗 ‼️`, response.status, data]);
                    }
                }
            });

        } catch (error) {
            return reject([`執行失敗 ‼️`, error]);
        }
    });
}
async function preCheck() {
    return new Promise((resolve, reject) => {
        const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
        if (isEmptyObject(shopeeInfo)) {
            return reject(['檢查失敗 ‼️', '沒有 蝦皮 Token']);
        }
        let shopeeHeaders = {
            'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
            'Content-Type': 'application/json',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=zh-Hant version=31818 appver=31818 rnver=1706695795 shopee_rn_bundle_version=6005004 Shopee language=zh-Hant app_type=1 ',
            'referer': 'https://shopee.tw/coins/?__mobile__=1',
        }
        config = {
            shopeeInfo: shopeeInfo,
            shopeeHeaders: shopeeHeaders,
        }
        if (showProcInfo) console.log('✅ 檢查成功\n');
        return resolve();
    });
}
// some true ,  every false


async function ProcData1(data, dc) {
    return new Promise((resolve, reject) => {
        let found = false;
        // console.log(data);
        let obj = JSON.parse(data);
        try {
            if ('items' in obj && obj.items) {
                let dataCount = config.dataCount;
                obj.items.forEach((x, i) => {
                    if (x.name.match(/每日任務獎勵|每日登入|蝦皮消消樂|蝦皮泡泡王|蝦幣寶箱|蝦蝦果園|蝦蝦飛刀|蝦蝦寵物村|直播蝦幣|特蒐任務/)
                        && x.fe_coin_amount > 0 && x.ctime >= 1672531200) {
                        let m = parseInt(new Date(x.ctime * 1000).format('MM'));
                        if (config.data_month_s == 0
                            || config.data_month_e == 0 && config.data_month_s > 0 && config.data_month_s == m
                            || config.data_month_e > 0 && config.data_month_s > 0 && config.data_month_s >= m && m <= config.data_month_e
                        ) {
                            config.dataCount = dataCount + i + 1;
                            let msg = '';
                            msg += `${config.dataCount}`;
                            msg += `\t${new Date(x.ctime * 1000).format()}`;
                            msg += `\t${new Date(x.ctime * 1000).format('MM')}`;
                            if (x.name.match(/特蒐任務/)) {
                                msg += `\t特蒐任務`;
                            }
                            else {
                                msg += `\t${x.name}`;
                            }
                            //                            msg += `\t${x.name}`;
                            // msg += `\t${x.name.length > 20 ? x.name.substr(0, 20) : x.name}`;
                            // msg += `\t${new Date(x.ctime * 1000).format('2')}`;
                            msg += `\t${x.fe_coin_amount / 100000}`;
                            // msg += `\t${x.fe_old_amount / 100000}`;
                            // msg += `\t${x.fe_new_amount / 100000}`;
                            msg += `\t${x.info.reason}`;
                            // msg += `\t${x.info.reason == null ? x.name : x.info.reason}`;
                            config.msg += msg + '\n';

                            if (isGui) {
                                html += '<tr>';
                                html += `<td>${config.dataCount}</td>`;
                                html += `<td>${new Date(x.ctime * 1000).format()}</td>`;
                                html += `<td>${new Date(x.ctime * 1000).format('MM')}</td>`;
                                if (x.name.match(/特蒐任務/)) {
                                    html += `<td>特蒐任務</td>`;
                                } else {
                                    html += `<td>${x.name}</td>`;
                                }
                                // html += `<td>${x.name.length > 20 ? x.name.substr(0, 20) : x.name}</td>`;
                                // html += `<td>${new Date(x.ctime * 1000).format('2')}</td>`;
                                html += `<td>${x.fe_coin_amount / 100000}</td>`;
                                // html += `<td>${x.fe_old_amount / 100000}</td>`;
                                // html += `<td>${x.fe_new_amount / 100000}</td>`;
                                html += `<td>${x.info.reason}</td>`;
                                // html += `<td>${x.info.reason == null ? x.name : x.info.reason}</td>`;
                                html += '</tr>\n';
                            }
                        }
                    }
                    else if ((x.fe_coin_amount <= 0 || x.name.match(/的贈送/)
                        && x.fe_coin_amount > 0 && x.ctime >= 1672531200)) {
                    }
                    else if (!x.name.match(/的贈送/)
                        && x.fe_coin_amount > 0 && x.ctime >= 1672531200) {
                        let m = parseInt(new Date(x.ctime * 1000).format('MM'));
                        if (config.data_month_s == 0
                            || config.data_month_e == 0 && config.data_month_s > 0 && config.data_month_s == m
                            || config.data_month_e > 0 && config.data_month_s > 0 && config.data_month_s >= m && m <= config.data_month_e
                        ) {
                            config.dataCount = dataCount + i + 1;
                            let msg = '';
                            msg += `${config.dataCount}`;
                            msg += `\t${new Date(x.ctime * 1000).format()}`;
                            msg += `\t${new Date(x.ctime * 1000).format('MM')}`;
                            msg += `\t回饋蝦幣`;
                            // msg += `\t${x.name}`;
                            // msg += `\t${x.name.length > 20 ? x.name.substr(0, 20) : x.name}`;
                            // msg += `\t${new Date(x.ctime * 1000).format('2')}`;
                            msg += `\t${x.fe_coin_amount / 100000}`;
                            // msg += `\t${x.fe_old_amount / 100000}`;
                            // msg += `\t${x.fe_new_amount / 100000}`;
                            msg += `\t${x.info.reason}`;
                            // msg += `\t${x.info.reason == null ? x.name : x.info.reason}`;
                            config.msg += msg + '\n';

                            if (isGui) {
                                html += '<tr>';
                                html += `<td>${config.dataCount}</td>`;
                                html += `<td>${new Date(x.ctime * 1000).format()}</td>`;
                                html += `<td>${new Date(x.ctime * 1000).format('MM')}</td>`;
                                html += `<td>回饋蝦幣</td>`;
                                // html += `<td>${x.name.length > 20 ? x.name.substr(0, 20) : x.name}</td>`;
                                // html += `<td>${new Date(x.ctime * 1000).format('2')}</td>`;
                                html += `<td>${x.fe_coin_amount / 100000}</td>`;
                                // html += `<td>${x.fe_old_amount / 100000}</td>`;
                                // html += `<td>${x.fe_new_amount / 100000}</td>`;
                                html += `<td>${x.info.reason}</td>`;
                                // html += `<td>${x.info.reason == null ? x.name : x.info.reason}</td>`;
                                html += '</tr>\n';
                            }
                        }
                    }
                    else {
                        console.log(`${x.fe_coin_amount / 100000}\t${x.name}`);
                    }
                });
                found = true;
            }
            else {
                console.log(obj);
            }
        } catch (error) {
            console.log('ERROR');
            console.log(obj);
        }
        return resolve(found);
    });
}
let UrlData = [[],
['GET', '取得 我的蝦幣 清單', '1', 'https://shopee.tw/api/v4/coin/get_user_coin_transaction_list?type=all&offset={data_offset}&limit={data_limit}', '', ['data_offset', 'data_limit'], ProcData1],
];
let DataPostBodyList = [, , ,];

function preInit() {
    config.runCount = 0;
    config.dataCount = 0;
    config.msg = '';
    config.data_offset = 0;
    config.data_limit = 300;
    config.data_month_s = parseInt($persistentStore.read('我的蝦幣清單月份起') || '0');
    config.data_month_e = parseInt($persistentStore.read('我的蝦幣清單月份訖') || '0');

    config.data_limit_c = parseInt($persistentStore.read('我的蝦幣清單筆數') || '300');
    if (config.data_limit_c >= 1000) {
        config.data_limit = 1000;
        config.data_limit_c -= 1000;
    }
    else {
        config.data_limit = config.data_limit_c;
        config.data_limit_c = 0;
    }
    // limit max 1000
}

const forMaxCount = 20;
(async () => {

    if (showProcInfo) console.log(`ℹ️ ${title} ${version}`);
    if (showProcInfo) console.log(`${new Date().format('0')}`);
    let msg = '';
    try {
        await preCheck();
        preInit();
        let flag = true;
        let runCount = 0;
        let item = -1;
        if (isGui) html += '<table><thead><tr><th>NO</th><th>時間</th><th>月份</th><th>名稱</th><th>蝦幣</th><th>說明</th></tr></thead><tbody>\n';
        // if (isGui) html += '<table><thead><tr><th>NO</th><th>名稱</th><th>時間</th><th>日期</th><th>月</th><th>蝦幣</th><th>原蝦幣</th><th>後蝦幣</th><th>說明</th></tr></thead><tbody>';
        config.msg += 'NO\t時間\t月份\t名稱\t蝦幣\t說明\n'; // \t日期\t原蝦幣\t後蝦幣

        for (let i = 1; i < UrlData.length; i++) {
            if (!flag) { break; }
            item = -1;

            //if(data)
            config.runCount++;
            let dc = GetDataConfig(i);
            // console.log(dc);
            // console.log(`\n🌐 ${dc.method} URL: ${dc.url} \n`);
            // break;
            if (flag && dc.method === 'GET') {
                await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
            } else if (flag && dc.method === 'POST') {
                await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
            }

            if (flag && i == 1) {
                if (config.data_limit_c > 0) {
                    config.data_offset = 1000;
                    if (config.data_limit_c >= 1000) {
                        config.data_limit = 1000;
                        config.data_limit_c -= 1000;
                    }
                    else {
                        config.data_limit = config.data_limit_c;
                        config.data_limit_c = 0;
                    }
                    i--;
                }
            }

            if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
            if (runCount > 50) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

        }

        if (isGui) html += '</tbody></table>';
        // console.log('');
        // console.log(JSON.stringify(config.fss).replace(/,"last/ig, ',\n"last').replace(/},/ig, '},\n'));
        console.log('<textarea rows="30" cols="100" onfocus="this.select()">\n' + config.msg + '</textarea>');
        console.log('');
        //console.log('<');

        msg = '✅ 處理已完成';
        if (showProcInfo) console.log(msg);
    } catch (error) {
        handleError(error);
    }

    if (isGui) {
        let dt = new Date();
        let rbody = '<html><head><meta charset="utf-8" />'
            + '<meta name="viewport" content="width=device-width, initial-scale=0.5,minimum-scale:0.01, maximum-scale=5, user-scalable=1">'
            + '<style>'
            + 'header,content,footer { display: block; white-space: pre;}'
            + 'footer{padding-top:5px;text-align:center;}'
            + '</style>'
            + '</head><body>'
            + '<h1>我的蝦幣 清單</h1>'
            + '<content>';
        //+ '' + config.msg + '<br>' + msg + ''
        rbody += html;
        rbody += '</content>'
            + '<footer>'
            + '👉 請按左上角「←」反回。 👈'
            + '</footer>'
            + '</body></html>';

        $done({
            response: {
                status: 200,
                headers: {
                    'server': 'SGW',
                    'date': dt.toUTCString(),
                    'content-type': 'text/html',
                    'X-FAKE': 'FAKE'
                },
                body: rbody
            }
        });

    }
    else { $done({}); }
})();

