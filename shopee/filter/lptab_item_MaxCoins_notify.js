// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '蝦皮直播高額蝦幣通知';
let title = '' + caption;
const version = 'v20240129';
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
function telegramNotify(title, subtitle = '', message = '') {
    let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
    if (TelegramUrl != '') {
        let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
        $httpClient.get(telegramData, function (error, response, data) { });
    }
}
function loonTGNotify(subtitle = '', message = '', url = '') {
    if (($persistentStore.read('TelegramUrl') || '') != '') {
        telegramNotify(title, subtitle, message + (url != '' ? '\n' + url : ''));
    }
    else {
        $notification.post(title, subtitle, message, { 'openUrl': url });
        // console.log(title + '\t' + subtitle + '\t' + message);
    }
};
function handleError(error) {
    let sl = showLog; showLog = false; let msg = '❌';
    if (Array.isArray(error)) {
        for (let i = 0; i < error.length; i++) {
            const e = error[i]; msg += (i > 1 ? '\n' : ' ') + `${e}`;
        }
    }
    else { msg += ` ${error}`; }
    console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
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
            if (p === 'token') {
                dc.url = dc.url.replace(`\{${p}\}`, getToken());
            } else {
                dc.url = dc.url.replace(`\{${p}\}`, config[p]);
            }
        }
    }
    dc.dataRequest.url = dc.url;
    return dc;
}
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

async function dataGet(dc, item = -1) {
    return new Promise((resolve, reject) => {
        try {
            let msg = `\t🌐 ${dc.title} ...`;
            if (item >= 0) { msg += ` (${item})`; }
            console.log(msg);
            //console.log(dc.dataRequest);
            $httpClient.get(dc.dataRequest, function (error, response, data) {
                if (error) {
                    return reject([`執行失敗 ‼️`, '連線錯誤']);
                } else {
                    //console.log(data);
                    if (response.status === 200) {
                        return resolve(data);
                    } else {
                        if (config.t_id == 'B') {
                            return resolve(JSON.stringify({ msg: data, code: response.status }));
                        } else { return reject([`執行失敗 ‼️`, response.status, data]); }
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
            console.log(msg);
            $httpClient.post(dc.dataRequest, function (error, response, data) {
                if (error) {
                    return reject([`${content}失敗 ‼️`, '連線錯誤']);
                } else {
                    if (response.status === 200) {
                        return resolve(data);
                    } else {
                        if (config.t_id == 'B') {
                            return resolve(JSON.stringify({ msg: data, code: response.status }));
                        } else { return reject([`執行失敗 ‼️`, response.status, data]); }
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
            'Cookie': `${shopeeInfo.cookieAll}`,
            'Content-Type': 'application/json',
        }
        //console.log(shopeeInfo.cookieAll);
        let UA = 'iOS app iPhone Shopee appver=31208 language=zh-Hant app_type=1 Cronet/102.0.5005.61';
        try {
            let ua1 = JSON.parse($persistentStore.read('ShopeeUserAgent') || '{"DataDate":"","UA":""}');
            if (ua1.UA != '') { UA = ua1.UA; }
        } catch (error) { }
        shopeeHeaders['User-Agent'] = UA;
        // shopeeHeaders['x-csrftoken'] = shopeeInfo.csrfToken;
        // shopeeHeaders.Cookie += `; csrftoken=${shopeeInfo.csrfToken}`;
        // shopeeHeaders.Cookie += `; shopee_token=${shopeeInfo.shopeeToken}`;
        // if (shopeeInfo.hasOwnProperty('shopId')) { shopeeHeaders.Cookie += `; shopid=${shopeeInfo.shopId}`; }
        // shopeeHeaders.Cookie += `; userid=${shopeeInfo.token.SPC_U}`;
        // shopeeHeaders.Cookie += `; username=${shopeeInfo.userName}`;

        config = {
            shopeeInfo: shopeeInfo,
            shopeeHeaders: shopeeHeaders,
        }
        console.log('✅ 檢查成功\n');
        return resolve();
    });
}


async function ProcData1(data, dc) {
    return new Promise((resolve, reject) => {
        let found = false;
        let obj = JSON.parse(data);
        if ('err_code' in obj && 'data' in obj && obj.err_code == 0 && 'list' in obj.data) {
            //console.log(obj.data.list);
            if (obj.data.list.length > 0) {
                found = true;
                let 蝦皮直播高額蝦幣取TABs = parseInt($persistentStore.read('蝦皮直播高額蝦幣取TABs') || '1');
                if ((蝦皮直播高額蝦幣取TABs + 1) > obj.data.list.length) { 蝦皮直播高額蝦幣取TABs = obj.data.list.length - 1; }

                console.log(`取TABs: ${蝦皮直播高額蝦幣取TABs}`);
                config.tab_id = obj.data.list[蝦皮直播高額蝦幣取TABs].id;
                config.tab_type = obj.data.list[蝦皮直播高額蝦幣取TABs].type;

                obj.data.list.forEach((x, xi) => {
                    console.log(`${xi} T:${x.type}\t${x.title} (${x.id})\t${蝦皮直播高額蝦幣取TABs == xi ? 'V' : ''}`);
                    if (x.title == '聯合推薦' && xi != 蝦皮直播高額蝦幣取TABs) {
                        config.tab_id3 = x.id;
                        config.tab_type3 = x.type;
                    }
                });
            }
        }
        return resolve(found);
    });
}
async function ProcData2(data, dc) {
    return new Promise((resolve, reject) => {
        let found = false;
        let obj = JSON.parse(data);
        if ('err_code' in obj && 'data' in obj && obj.err_code == 0 && 'list' in obj.data) {
            found = true;
            if (obj.data.list.length > 0) {
                // let fc1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣1') || '0');
                // let fcp1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.1') || '0');
                // let fcp2 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.2') || '0');
                // let fc = fc1 + fcp1 / 10 + fcp2 / 100;
                // console.log(`fc0: ${fc0}`);
                //let fc = parseFloat($persistentStore.read('蝦皮直播過濾蝦幣') || '0');
                // $persistentStore.write(null, '蝦皮直播過濾蝦幣');
                console.log(`fc: ${config.fc}`);

                // let ct = $persistentStore.read('蝦皮直播蝦幣標示') || '';
                // if (ct == '否') { ct = false; } else { ct = true; }
                // if (ct) {
                //     hasChange = true;
                //     console.log('蝦皮直播蝦幣標示');
                obj.data.list.forEach(x => {
                    x.item.play_url = '';
                    let isRemove = false;
                    let item_title = '';
                    if ('coins_per_claim' in x.item) {
                        // if (x.item.claims_per_session_per_viewer == 0) { item_title += `已領完 `; }
                        item_title += `${x.item.coins_per_claim}/${x.item.claims_per_session_per_viewer}`;
                        if (x.item.coins_per_claim < config.fc) { isRemove = true; }
                        if (x.item.coins_per_claim > config.MaxCoins) {
                            config.MaxCoins = x.item.coins_per_claim; config.LiveId = x.item_id;
                            config.LiveItem = x;
                        }
                    }
                    // else if (fc > 0) { isRemove = true; }
                    // // if (x.item.has_draw) { item_title += `${item_title != '' ? ' ' : ''}抽獎(${x.item.draw_type})`; }
                    // // if (x.item.has_voucher) { item_title += `${item_title != '' ? ' ' : ''}優惠券`; }
                    // if (isRemove) {
                    //     x.item.shop_id = 0;
                    //     x.item.cover_pic = '';
                    //     x.item.avatar = '';
                    //     x.item.status = 0;
                    //     x.item.title = '';
                    //     x.item.username = '';
                    //     x.item.subtitle = '';
                    //     x.item.nick_name = '';
                    //     x.item.real_username = '';
                    //     x.item.share_url = '';
                    //     //x.item.endpage_url = '';
                    //     x.item.origin_title = '';
                    //     x.item.is_seller = false;

                    //     x.item.has_voucher = false;
                    //     x.item.has_streaming_price = false;
                    //     x.item.has_draw = false;
                    //     // x.item.ccu = 0;

                    //     // if (x.streaming_price_timer != null) { x.streaming_price_timer.sp_end_time = x.item.start_time + 1; }
                    //     if (x.cover_info != null) { x.cover_info.replace_cover = ''; }
                    //     // if (x.session_promotion != null) {
                    //     //     x.session_promotion = {
                    //     //         "free_shipping": false,
                    //     //         "free_shipping_special": false,
                    //     //         "flash_sale": false,
                    //     //         "cod": false,
                    //     //         "streaming_price": false,
                    //     //         "ongoing_platform_streaming_price": false
                    //     //     }
                    //     // }

                    // }
                    // x.item.username = item_title;

                });

                //     console.log('Sort');
                //     obj.data.list.sort(function (a, b) {
                //         // boolean false == 0; true == 1
                //         // console.log(a.item.coins_per_claim);
                //         // console.log(b.item.coins_per_claim);
                //         // console.log('');
                //         if (!('coins_per_claim' in a.item)) { a.item.coins_per_claim = -1; }
                //         if (!('coins_per_claim' in b.item)) { b.item.coins_per_claim = -1; }
                //         if ('coins_per_claim' in a.item && 'coins_per_claim' in b.item) {
                //             return a.item.coins_per_claim - b.item.coins_per_claim;
                //         }
                //         //else if ('coins_per_claim' in a.item && !('coins_per_claim' in b.item)) { return true; }
                //         return false;
                //     })
                //     console.log('Reverse');
                //     obj.data.list.reverse();
                // }

                // obj.data.list.forEach(x => {
                //     let msg = `\n${x.item_id}`;
                //     if ('coins_per_claim' in x.item && x.item.coins_per_claim != -1) {
                //         msg += ` ${x.item.coins_per_claim}/${x.item.claims_per_session_per_viewer}`;
                //     }
                //     // if (x.item.has_draw) { msg += `${msg != '' ? ' ' : ''}🎁抽獎(${x.item.draw_type})`; }
                //     // if (x.item.has_voucher) { msg += `${msg != '' ? ' ' : ''}🎁優惠券`; }
                //     // msg += ` ${x.item.title}`;
                //     console.log(msg);
                //     // if ('coins_per_claim' in x.item && x.item.coins_per_claim > 0 && x.item.coins_per_claim >= fc) {
                //     //     console.log(msg);
                //     //     if (config.item == null) {
                //     //         config.item = x;
                //     //     } else if (x.item.coins_per_claim > config.item.item.coins_per_claim) { config.item = x; }
                //     //     // console.log(x);
                //     //     return true;
                //     // }
                //     // console.log(x);
                // });


                // let fc = parseFloat($persistentStore.read('蝦皮直播過濾蝦幣') || '0');

                // found = true;
                // config.offset += obj.data.list.length;
                // config.page_no++;
                // console.log(obj.data.list.length);
                // obj.data.list = obj.data.list.filter(x => {

                //     let msg = `\n${x.item_id}`;
                //     if ('coins_per_claim' in x.item) {
                //         msg += ` ${x.item.coins_per_claim}/${(x.item.coins_per_claim * x.item.claims_per_session_per_viewer).toFixed(2)}`;
                //     }
                //     if (x.item.has_draw) { msg += `${msg != '' ? ' ' : ''}🎁抽獎(${x.item.draw_type})`; }
                //     if (x.item.has_voucher) { msg += `${msg != '' ? ' ' : ''}🎁優惠券`; }
                //     msg += ` ${x.item.title}`;
                //     // console.log(msg);
                //     if ('coins_per_claim' in x.item && x.item.coins_per_claim > 0 && x.item.coins_per_claim >= fc) {
                //         console.log(msg);
                //         if (config.item == null) {
                //             config.item = x;
                //         } else if (x.item.coins_per_claim > config.item.item.coins_per_claim) { config.item = x; }
                //         // console.log(x);
                //         return true;
                //     }
                // });

                // let 蝦皮直播最高蝦幣 = JSON.parse($persistentStore.read('蝦皮直播最高蝦幣') || '{"MaxCoins":0,"date":0,"isNotify":false}');
                // let 蝦皮直播高額蝦幣依設定通知 = $persistentStore.read('蝦皮直播高額蝦幣依設定通知') || '';
                // if (!('isNotify' in 蝦皮直播最高蝦幣)) { 蝦皮直播最高蝦幣.isNotify = false; }
                // console.log(`蝦皮直播高額蝦幣依設定通知: ${蝦皮直播高額蝦幣依設定通知 == '是'}`);
                // console.log(`是否已通知: ${蝦皮直播最高蝦幣.isNotify}`);
                // console.log(`前次記錄，最大蝦幣: ${蝦皮直播最高蝦幣.MaxCoins}`);
                // console.log(`目前直播，最大蝦幣: ${MaxCoins}`);
                // if ((!蝦皮直播最高蝦幣.isNotify || MaxCoins > 蝦皮直播最高蝦幣.MaxCoins) && (
                //     蝦皮直播高額蝦幣依設定通知 == '是' && MaxCoins >= fc
                //     || MaxCoins >= 0.5)) {
                //     loonTGNotify(`目前直播，最大蝦幣: ${MaxCoins}${蝦皮直播高額蝦幣依設定通知 == '是' ? ' (依設定)' : ''}`, '', `https://shopee.tw/universal-link?redir=https%3A%2F%2Flive.shopee.tw%2Fmiddle-page%3Ftype%3Dlive%26id%3D${LiveId}%23share&deep_and_deferred=1&__dsrn__=1`);
                //     蝦皮直播最高蝦幣.isNotify = true;
                // }
                // if (蝦皮直播最高蝦幣.MaxCoins < MaxCoins) { 蝦皮直播最高蝦幣.isNotify = false; }
                // 蝦皮直播最高蝦幣.MaxCoins = MaxCoins;
                // 蝦皮直播最高蝦幣.date = Date.now();
                // $persistentStore.write(JSON.stringify(蝦皮直播最高蝦幣), '蝦皮直播最高蝦幣');
            }
            console.log(`筆數: ${obj.data.list.length}`);
            //console.log(obj.data.list);
        }
        //console.log(config.item.item.coins_per_claim);
        //console.log(obj);
        return resolve(found);
    });
}

// async function ProcData3(data, dc) {
//     return new Promise((resolve, reject) => {
//         let found = false;
//         let obj = JSON.parse(data);
//         if ('err_code' in obj && 'data' in obj && obj.err_code == 0 && 'list' in obj.data) {
//             if (obj.data.list.length > 0) {
//                 let fc = parseFloat($persistentStore.read('蝦皮直播過濾蝦幣') || '0');

//                 found = true;
//                 config.offset += obj.data.list.length;
//                 config.page_no++;
//                 console.log(obj.data.list.length);
//                 obj.data.list = obj.data.list.filter(x => {

//                 });
//             }
//             console.log(obj.data.list.length);
//             //console.log(obj.data.list);
//         }
//         //console.log(config.item.item.coins_per_claim);
//         //console.log(obj);
//         return resolve(found);
//     });
// }

let UrlData = [[],
// ['GET', '取得直播 TAB', '取得', 'https://live.shopee.tw/api/v1/lptab/item?offset={offset}&limit={limit}&tab_type={tab_type}&device_id={device_id}&ctx_id={ctx_id}&page_no={page_no}', '', ['device_id', 'ctx_id', 'offset', 'page_no', 'tab_type', 'tab_id', 'limit'], ProcData1],
['GET', '取得直播 TAB', '1', 'https://live.shopee.tw/api/v1/lptab/tab', '', , ProcData1],
['POST', '取得直播清單2', '2', 'https://live.shopee.tw/api/v1/lptab/item', '', , ProcData2],
['POST', '取得直播清單 聯合推薦', '3', 'https://live.shopee.tw/api/v1/lptab/item', '', , ProcData2],
['POST', '取得直播清單 蝦幣專區', '4', 'https://live.shopee.tw/api/v1/lptab/item', '', , ProcData2],
    // ['!POST', '取得直播清單3', '取得', 'https://live.shopee.tw/api/v1/full_screen/session', '', , ProcData2],
];
/*
https://live.shopee.tw/api/v1/lptab/item?offset=0&limit=50&tab_type=1&device_id=9C6CA54BECDF480FADD6B9FB5A2DEFBD&ctx_id=9C6CA54BECDF480FADD6B9FB5A2DEFBD-1703150923886-721753&page_no=1
https://live.shopee.tw/api/v1/lptab/item?offset=0&limit=50&tab_type=0&device_id=9C6CA54BECDF480FADD6B9FB5A2DEFBD&ctx_id=9C6CA54BECDF480FADD6B9FB5A2DEFBD-1703150938373-002731&page_no=1&tab_id=1274505779877376
*/
let DataPostBodyList = [,
    , {
        "tab_id": 1,
        "offset": 6,
        "ctx_id": "AED0533684FB4667B018F11170035942-1706438051965-670013",
        "device_id": "AED0533684FB4667B018F11170035942",
        "source": "",
        "tab_type": 1,
        "page_no": 2,
        "limit": 50,
        "user_ctx": "{\"scene\":1,\"previous_impr_list\":[]}",
        "viewed_session_ids": []
    }
    , {
        "tab_id": 1274505779877376,
        "offset": 0,
        "ctx_id": "AED0533684FB4667B018F11170035942-1706438051965-670013",
        "device_id": "AED0533684FB4667B018F11170035942",
        "source": "",
        "tab_type": 0,
        "page_no": 1,
        "limit": 50,
        "user_ctx": "{\"scene\":1,\"previous_impr_list\":[]}",
        "viewed_session_ids": []
    }
    , {
        "tab_id": 1274505779877376,
        "offset": 0,
        "ctx_id": "AED0533684FB4667B018F11170035942-1706438051965-670013",
        "device_id": "AED0533684FB4667B018F11170035942",
        "source": "",
        "tab_type": 0,
        "page_no": 1,
        "limit": 50,
        "user_ctx": "{\"scene\":1,\"previous_impr_list\":[]}",
        "viewed_session_ids": []
    }
    , {
        "ctx_id": "AED0533684FB4667B018F11170035942-1703212732442-1297063066",
        "offset": 0,
        "need_play_param": true,
        "device_id": "AED0533684FB4667B018F11170035942",
        "extra": "{\"client_speed_result\":{\"bitrates\":[],\"status_times\":[]},\"client_speed_version\":\"1.0\"}",
        "page_no": 1,
        "is_preload": true
    },
    // { // source
    //     "tab_id": 1,
    //     "offset": 0,
    //     "ctx_id": "9C6CA54BECDF480FADD6B9FB5A2DEFBD-1703118902421-663763",
    //     "device_id": "9C6CA54BECDF480FADD6B9FB5A2DEFBD",
    //     "tab_type": 2,
    //     "page_no": 1,
    //     "limit": 50,
    //     "user_ctx": "{\"scene\":1,\"previous_impr_list\":[]}",
    //     "viewed_session_ids": []
    // }
];
function preInit() {

    config.canRun = false;
    let 蝦皮直播高額蝦幣通知 = $persistentStore.read('蝦皮直播高額蝦幣通知') || '';
    config.canRun = 蝦皮直播高額蝦幣通知 == '是';
    config.device_id = config.shopeeInfo.token.SPC_F;
    config.limit = 50;
    config.offset = 0;
    config.page_no = 1;
    config.tab_type = 2;
    config.tab_id = 2;
    config.item = null;
    config.LiveItem = null;

    //config.tab_id = 1274505779877376;
    config.LiveId = 0;
    config.MaxCoins = 0;

    let fc1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣1') || '0');
    let fcp1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.1') || '0');
    let fcp2 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.2') || '0');
    let fc = fc1 + fcp1 / 10 + fcp2 / 100;
    config.fc = fc;

    config.tab_id3 = 0;
    config.tab_type3 = 0;

}

const forMaxCount = 10;
(async () => {
    console.log(`ℹ️ ${title} ${version}`);
    try {
        await preCheck();
        preInit();
        let flag = true;
        let runCount = 0;
        let item = -1;
        flag = config.canRun;
        if (config.canRun) { console.log('蝦皮直播高額蝦幣通知 開啟'); } else { console.log('蝦皮直播高額蝦幣通知 關閉'); }
        for (let i = 1; i < UrlData.length; i++) {
            if (!flag) { break; }
            item = -1;
            runCount++;
            // if (i == 1) {
            //     config.ctx_id = `${config.shopeeInfo.token.SPC_F}-${getToken()}-${getRnd(6)}`;
            // }
            if (i == 2) {
                DataPostBodyList[i].device_id = config.device_id;
                // DataPostBodyList[i].tab_id = 1274505779877376;  // 蝦幣
                DataPostBodyList[i].tab_id = config.tab_id;
                DataPostBodyList[i].tab_type = config.tab_type;

                DataPostBodyList[i].ctx_id = `${config.shopeeInfo.token.SPC_F}-${getToken()}-${getRnd(6)}`;
                DataPostBodyList[i].offset = config.offset;
                DataPostBodyList[i].page_no = config.page_no;
            }
            if (i == 3) {
                if (config.tab_id3 == 0) {
                    i++;
                }
                else {
                    DataPostBodyList[i].tab_id = config.tab_id3;
                    DataPostBodyList[i].tab_type = config.tab_type3;
                    DataPostBodyList[i].device_id = config.device_id;
                    DataPostBodyList[i].ctx_id = `${config.shopeeInfo.token.SPC_F}-${getToken()}-${getRnd(6)}`;
                }
            }
            if (i == 4) {
                DataPostBodyList[i].device_id = config.device_id;
                DataPostBodyList[i].ctx_id = `${config.shopeeInfo.token.SPC_F}-${getToken()}-${getRnd(6)}`;
            }
            // if (i == 3) {
            //     DataPostBodyList[i].device_id = config.shopeeInfo.token.SPC_F;
            //     DataPostBodyList[i].ctx_id = `${config.shopeeInfo.token.SPC_F}-${getToken()}-${getRnd(10)}`;
            //     DataPostBodyList[i].offset = config.offset;
            //     DataPostBodyList[i].page_no = config.page_no;
            //     // console.log(DataPostBodyList[i]);

            // }

            let dc = GetDataConfig(i);
            // console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
            // if (i == 1) { console.log(dc); }
            if (flag && dc.method === 'GET') {
                await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
            } else if (flag && dc.method === 'POST') {
                await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
            }

            if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
            if (runCount > 30) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };

            // if (flag && i == 1) { i--; await delay(0.5); }
            // if (!flag && i == 1) { flag = true; }
            // if (flag && i === 7) { i = 3; }
            // else if (!flag && i === 4) { i = 7; flag = true; }

            // //if (flag && i >= 7) { await delay(3.0); i = 5; } 
            // if (flag && i >= 11) { if (config.chance > 0) { await delay(3.0); i = 10; } }
            // //if (!flag && (i === 4)) { flag = true; }
            // if (!flag && (i === 3 || i === 8 || i === 10) || flag && i === 11) {
            //     // console.log(`DATA : ${config.luckydraw.length}\t${config.luckydraw_index}`)
            //     if (config.luckydraw.length > config.luckydraw_index) {
            //         i = 2; flag = true;
            //     }
            // }
            // if (flag && i >= 8) await delay(0.5);
        }
        // caption = config.caption;
        // title = config.title;
        if (config.item != null) {
            // $persistentStore.write(config.item.item_id.toString(), '蝦皮直播ID');
            // $persistentStore.write(config.item.item.shop_id.toString(), '蝦皮直播SHOPID');
            // $persistentStore.write(config.item.item.uid.toString(), '蝦皮直播UID');
            // $persistentStore.write(config.item.item.coins_per_claim.toString(), '蝦皮直播蝦幣');
            console.log(`\n\n\n${config.item.item_id} ${config.item.item.title} ${config.item.item.coins_per_claim}`);
            // console.log(config.item);
        }




        let 蝦皮直播最高蝦幣 = JSON.parse($persistentStore.read('蝦皮直播最高蝦幣') || '{"MaxCoins":0,"date":0,"isNotify":false}');
        let 蝦皮直播高額蝦幣依設定通知 = $persistentStore.read('蝦皮直播高額蝦幣依設定通知') || '';
        if (!('isNotify' in 蝦皮直播最高蝦幣)) { 蝦皮直播最高蝦幣.isNotify = false; }
        console.log(`蝦皮直播高額蝦幣依設定通知: ${蝦皮直播高額蝦幣依設定通知 == '是'}`);
        console.log(`是否已通知: ${蝦皮直播最高蝦幣.isNotify}`);
        console.log(`前次記錄，最大蝦幣: ${蝦皮直播最高蝦幣.MaxCoins}`);
        console.log(`目前直播，最大蝦幣: ${config.MaxCoins}`);
        if ((!蝦皮直播最高蝦幣.isNotify || config.MaxCoins > 蝦皮直播最高蝦幣.MaxCoins) && (
            蝦皮直播高額蝦幣依設定通知 == '是' && config.MaxCoins >= config.fc
            || config.MaxCoins >= 0.5)) {
            loonTGNotify(`目前直播，最大蝦幣: ${config.MaxCoins}${蝦皮直播高額蝦幣依設定通知 == '是' ? ' (依設定)' : ''}`, ''
                , `https://shopee.tw/universal-link?redir=https%3A%2F%2Flive.shopee.tw%2Fmiddle-page%3Ftype%3Dlive%26id%3D${config.LiveId}%23share&deep_and_deferred=1&__dsrn__=1`);
            蝦皮直播最高蝦幣.isNotify = true;
        }
        if (蝦皮直播最高蝦幣.MaxCoins < config.MaxCoins) { 蝦皮直播最高蝦幣.isNotify = false; }
        蝦皮直播最高蝦幣.MaxCoins = config.MaxCoins;
        蝦皮直播最高蝦幣.date = Date.now();
        $persistentStore.write(JSON.stringify(蝦皮直播最高蝦幣), '蝦皮直播最高蝦幣');
        console.log(config.LiveItem);

        console.log('');
        let msg = '✅ 處理已完成';
        console.log(msg);
        // loonNotify(msg);
    } catch (error) {
        caption = config.caption;
        title = config.title;
        handleError(error);
    }
    $done({});
})();

