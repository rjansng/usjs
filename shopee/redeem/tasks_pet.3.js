let title = '取得 手動 寵物村 數據';
let version = 'v20230927';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

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

// let dd1 = { 'gameTime': 0 };
// dd1 = { "gameTime": 1678896000000, "pet": [{ "1": { "s": 10, "isOk": true } }, { "2": { "s": 0, "isOk": false } }, { "3": { "s": 0, "isOk": false } }] };
// let dd2 = JSON.stringify(dd1);
// let $response = {
// 	body: '{"code": 0,"data": {"maxCorrectRate": 70,"costTimeMS": 44770,"correctRate": 90},"timestamp": 1678965259274,"msg": ""}'
// 	, url: 'https://games.shopee.tw/api-gateway/pet/game/finish_culture_quiz_v2?activityCode=b711c6148c210f8f&eventCode=195a56c179f4cc0a'
// };
// let $done = function () { };
// let $notification = { post: function (title, subtitle, message, url) { console.log(`${title}\t${subtitle}\t${message}`); } };
// let $persistentStore = { read: function (n) { if (n === 'ShopeeGamePlayed') return dd2; return null; }, write: function (v, n) { dd2 = v; dd1 = JSON.parse(v); } };

let body = $response.body;
let url = $request.url;

let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
let showNotification = ($persistentStore.read('UseNotify') || '1') == '1';
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'loon://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
console.log(new Date().format());
let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
let tasks = JSON.parse(rs);
shopee_ids = [
    { 'id': 'E', 'name': '金頭腦  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 6, 'l3': 10 }, // 20 40 60
    { 'id': 'F', 'name': '賽跑    ', 't': 'B', 'h': '210 💎', 'l1': 4, 'l2': 2, 'l3': 1 },  // 30 60 120
    { 'id': 'G', 'name': '找碴    ', 't': 'E', 'h': '100 💎', 'l1': 3, 'l2': 6, 'l3': 9 },  // 20 20 60
    { 'id': 'C', 'name': '踢足球  ', 't': 'D', 'h': '120 💎', 'l1': 3, 'l2': 5, 'l3': 7 },  // 20 40 60
    { 'id': 'H', 'name': '團體賽  ', 't': 'C', 'h': '80 💎', 'l1': 30, 'l2': 60, 'l3': 90 }, // 20 60 裝
    { 'id': 'GT', 'name': '跳床    ', 't': 'P', 'h': '' },
    { 'id': 'GM', 'name': '音樂    ', 't': 'P', 'h': '' }, // t:P  7/1 音樂
    { 'id': 'GG3', 'name': '彈珠台💎', 't': 'T', 'h': ' 50 💎' },
    { 'id': 'GG3C', 'name': '彈珠台蝦幣', 't': 'T', 'h': '' },
];
let reset = false;
if (tasks.gameTime != dtD) { tasks.gameTime = dtD; reset = true; }
if (reset || !tasks.hasOwnProperty('pets')) { tasks.pets = {}; }
shopee_ids.forEach((p, i) => {
    let p2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' };
    if (!tasks.pets.hasOwnProperty(p.id)) { tasks.pets[p.id] = p2; }
});
let pets = tasks.pets;

let caption = '';
let url_list = [
    [1, 'C', 'https://games.shopee.tw/api-gateway/pet/game/finish_football', 'finish_football'],
    [1, 'E', 'https://games.shopee.tw/api-gateway/pet/game/finish_culture_quiz_v2', 'finish_culture_quiz_v2'],
    [1, 'F', 'https://games.shopee.tw/api-gateway/pet/game/finish_race_v2', 'finish_race_v2'],
    [1, 'G', 'https://games.shopee.tw/api-gateway/pet/game/finish_art_v2', 'finish_art_v2'],
    [1, 'GT', 'https://games.shopee.tw/api-gateway/pet/competition/finish_trampoline', 'finish_trampoline'],
    [1, 'GM', 'https://games.shopee.tw/api-gateway/pet/competition/finish_music', 'finish_music'],
    [1, 'GG3', 'https://games.shopee.tw/api-gateway/pet/game/finish_pinball', 'finish_pinball'],
];
let msg = '';
let isGG3 = false;
//console.log(body);
// try {
let json = JSON.parse(body);
//console.log(json);
if (json.code == 0) {
    let flag = true;
    let d = json.data;
    let uu = null;
    let p = {};
    if (url_list.some(u => {
        if (u[0] === 1 && url.indexOf(u[2]) === 0) { uu = u; return true; }
    })) {
        let REQ_Name = uu[3] + _ShopeeUserID;
        let REQ_Data = $persistentStore.read(REQ_Name);
        if (REQ_Data) {
            console.log(REQ_Data);
            console.log('清除 REQ 記錄');
            $persistentStore.write(null, REQ_Name); // 清除 REQ
        }
        else {
            console.log('無 REQ 記錄');
        }

        shopee_ids.some(x => { if (x.id === uu[1]) { p = x; return true; } });
        if (p.id == 'GG3') {
            isGG3 = true;
            let ppi = JSON.parse($persistentStore.read('pet_pinball_info') || '{"costCoins":0,"entranceID":0}');
            if (ppi.entranceID > 1) { p.id = 'GG3C'; p.name = '彈珠台💰蝦幣'; }
            console.log('pet_pinball_info');
            console.log(ppi);
            $persistentStore.write(null, 'pet_pinball_info');
            // $persistentStore.write('1', 'pinball_finish');
        }

        let s = pets[p.id];
        s.c++;
        msg = `今天第 ${s.c} 次`;
        caption = p.name;
        // let sf = s.f;
        let ss = s.s;
        let sl = s.l;
        let cc = 0;
        //console.log(p);
        if (p.t === 'D') {
            let s2 = Math.floor(d.score / (100 / p.l3));
            if (s2 > s.s) {
                if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
                if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
                if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
                s.s = s2;
                s.f = s.l === 3;
                msg += `，成績 ${ss} -> ${s.s}`;
            }
        }
        else if (p.t === 'A') {
            let s2 = Math.floor(d.correctRate / 100 * p.l3);
            if (s2 > s.s) {
                if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
                if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
                if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
                s.s = s2;
                s.f = s.l === 3;
                msg += `，成績 ${ss} -> ${s.s}`;
            }
        }
        else if (p.t === 'B') {
            if (d.rank < s.s || s.s === 0) {
                if (d.rank <= p.l1) { s.l = 1; if (s.l > sl) { cc += 30; } }
                if (d.rank <= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
                if (d.rank <= p.l3) { s.l = 3; if (s.l > sl) { cc += 120; } }
                s.s = d.rank;
                s.f = s.l === 3;
                msg += `，成績 ${ss} -> ${s.s}`;
            }
        }
        //  else if (p.t === 'C') {
        // 	let s2 = d.maxCorrectRate;
        // 	if (s2 > s.s) {
        // 		if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
        // 		if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
        // 		if (s2 >= p.l3) { s.l = 3; }
        // 		s.s = s2;
        // 		s.f = s.l >= 2;
        // 		msg += `，成績 ${ss} -> ${s.s}`;
        // 	}
        // }
        else if (p.t === 'E') {
            let s2 = Math.floor(d.correctRate / 100 * p.l3);
            if (s2 > s.s) {
                if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
                if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
                if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
                s.s = s2;
                s.f = s.l === 3;
                msg += `，成績 ${ss} -> ${s.s}`;
            }
        }
        else if (p.id === 'GG3') {
            console.log(json.data);
            if (json.data.obtainDiamond > 0) {
                cc += json.data.obtainDiamond;
                if (!s.f) {
                    s.f = true;
                    s.r = cc;
                    let sn = showNotification;
                    showNotification = true;
                    loonNotify(caption, `獲得獎勵 💎 ${cc}`);
                    showNotification = sn;
                }
            }
        }
        else if (p.id === 'GG3C') {
            console.log(json.data);
            if (json.data.obtainCoin > 0) {
                cc = `💰${json.data.obtainCoin}`;
                if (!s.f || json.data.obtainCoin > 0) {
                    s.f = true;
                    if (s.s > 0) s.s--;
                    s.d.push(cc);
                    //s.r = cc;
                    let sn = showNotification;
                    showNotification = true;
                    loonNotify(caption, `獲得獎勵 💰蝦幣 ${json.data.obtainCoin}`);
                    showNotification = sn;
                }
            }
        }
        else if (['GT', 'GM'].some(x => { if (x == p.id) { return true; } })) {
            if (s.c > 0) { s.f = true; }
        }
        if (p.t != 'P') {
            //s.d.push(JSON.stringify(d));
            if (cc > 0) { msg += `，獲得獎勵 💎${cc}`; }
            if (s.f) { msg += `，已`; }
            else { msg += `，未`; }
            msg += '完成每日💎任務';
        }
        if (p.id === '') {
            s.s = curTrophyNum;
            s.f = true;
        }

        if (flag) { loonNotify(caption, msg); }

        pets[p.id] = s;
        tasks.pets = pets;
        $persistentStore.write(JSON.stringify(tasks), dataName);

        // console.log(tasks);
        // console.log(JSON.stringify(tasks));
        // console.log(dd2);
    }
    else {
        console.log(`未指定 : ${json.data}`);
    }

}
else {
    console.log(`ERROR`);
    console.log(`CODE : ${json.code}`);
    console.log(`MSG : ${json.msg}`);
    console.log(`DATA : `);
    console.log(json.data);
    loonNotify(caption, `ERROR : ${json.msg}`);
}

// } catch (e) {
// 	console.log(e);
// }
//console.log(tasks);
if (isGG3) {
    let UseCoins = $persistentStore.read('彈珠台用蝦幣玩') || '';
    if (UseCoins == '是') { UseCoins = true; }
    else { UseCoins = false; }
    let fPBC = $persistentStore.read('彈珠台過濾機台') || '';
    if (!UseCoins && fPBC == '是') {
        console.log('彈珠台過濾機台 (模擬「意外結束彈珠台，獎勵已派發」)，畫面才不會異常卡住。');
        // 模擬 pinball already finished
        json.code = 625007;
        json.msg = 'pinball already finished (fake)';
        body = JSON.stringify(json);
        $done({ body });
    } else {
        $done({});
    }
}
else {
    let DataTest = $persistentStore.read('DataTest') || '';
    if (DataTest == '是') { DataTest = true; } else { DataTest = false; }
    if (DataTest) {
        let sn = showNotification;
        showNotification = true;
        loonNotify(caption, `獲得獎勵 💰蝦幣 ${cc}`);
        showNotification = sn;

        json.code = 500;
        body = JSON.stringify(json);
        // $done({ body });
        $done({ response: { status: 404, headers: {}, body: "" } });

    }
    else { $done({}); }
}

