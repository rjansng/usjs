let title = '餵食 RES';
let caption = '取得 ' + title;
let version = 'v20240815';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;


let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
    if (showNotification) {
        $notification.post('寵物村餵食', subtitle, message, { 'openUrl': url });
    }
    if (showLog) { console.log(`寵物村餵食\t${subtitle}\t${message}`); }
};


let body = $response.body;
console.log(body);
if ($response.status == 400) { body = JSON.stringify({ code: $response.status }); }
try {
    let obj = JSON.parse(body);
    if (obj.code == 0) {
        try {
            let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
            let tsn = 'pet' + 's';
            let tsid = 'FF';
            let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
            let tasks = JSON.parse(rs);
            let ts = {}, s = {};
            if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
            if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
            s.c++;
            s.f = true;
            ts[tsid] = s;

            let tsid2 = 'CTF';
            let s2 = {};
            if (ts.hasOwnProperty(tsid2)) { s2 = ts[tsid2]; } else { s2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
            s2.c++
            if (s2.s == null || s2.s == '') { s2.s = 0; }
            s2.s = Math.round(parseInt((s2.s + parseFloat(obj.data.outputPetCoinNum)) * 10000) / 10000, 4);
            s2.f = true;
            ts[tsid2] = s2;

            let tsid3 = 'CT';
            let s3 = {};
            if (ts.hasOwnProperty(tsid3)) { s3 = ts[tsid3]; } else { s3 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
            s3.c = 1;
            s3.s = obj.data.petCoinBalance;
            s3.f = true;
            ts[tsid3] = s3;

            tasks[tsn] = ts;

            $persistentStore.write(JSON.stringify(tasks), dataName);


        } catch (e) { console.log(e); }
        loonNotify(`獲得撲幣 ${obj.data.outputPetCoinNum} ${obj.data.petCoinBalance}`);
    }
    else {
        console.log(obj);
    }
} catch (error) {
    console.log(error);
    console.log(data);
}
$done({});