let title = '取得 手動 果園 數據';
let version = 'v20230702';
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
		"M+": this.getMonth() + 1, //month 月
		"d+": this.getDate(),    //day 日
		"h+": this.getHours(),   //hour 時
		"H+": this.getHours(),   //hour 時
		"m+": this.getMinutes(), //minute 分 
		"s+": this.getSeconds(), //second 秒
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
	}
	let re = new RegExp(/(y+)/);
	if (re.test(format)) { format = format.replace(re, (this.getFullYear() + "").substr(4 - format.match(re)[1].length)); }
	for (let k in o) {
		let r = RegExp("(" + k + ")");
		if (r.test(format)) {
			let fr = format.match(r)[1];
			format = format.replace(fr, fr.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
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
let tsn = 'farm' + 's';
let showNotification = ($persistentStore.read('UseNotify') || '1') === '1';
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'loon://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
console.log(new Date().format());
let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
let tasks = JSON.parse(rs);
shopee_ids = [
	{ 'id': 'A1', 'name': '今日種植   ', 't': 'H', 'h': '🌱' },
	{ 'id': 'A2', 'name': '今日收成   ', 't': 'H', 'h': '🌱' },
	{ 'id': 'B', 'name': '品牌商店水滴', 't': 'H', 'h': '💧50' },
	{ 'id': 'C', 'name': '瀏覽商店水滴', 't': 'T', 'h': '💧30x3 3h/次' },
	{ 'id': 'D', 'name': '站外澆水   ', 't': 'T', 'h': '💧10x5' },
	{ 'id': 'E', 'name': '幫朋友澆水 ', 't': 'T', 'h': '20 次' },
	{ 'id': 'F', 'name': '收到朋友助水', 't': 'T', 'h': '💧35x20' },
	{ 'id': 'G', 'name': '搖樹       ', 't': 'T', 'h': '💧5x10' },
	{ 'id': 'K', 'name': '買免費道具 ', 't': 'X', 'h': '(週六) 1-2次' },
	{ 'id': 'SB', 'name': '今日簽到獎勵', 't': 'X', 'h': '任務欄' },
	{ 'id': 'CI', 'name': '今日打卡 3次', 't': 'T', 'h': '任務欄' },
	{ 'id': 'TS', 'name': '領取水滴獎勵', 't': 'X', 'h': '💧💦任務欄' },
	{ 'id': 'TCI', 'name': '今日打卡 3次', 't': 'X', 'h': '💧50' },
	{ 'id': 'TF1', 'name': '收到澆水 1 ', 't': 'X', 'h': '💧30' },
	{ 'id': 'TF2', 'name': '收到澆水 3 ', 't': 'X', 'h': '💧50' },
	{ 'id': 'TF3', 'name': '收到澆水 10', 't': 'X', 'h': '💧100' },
	{ 'id': 'TE1', 'name': '幫澆水 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TE2', 'name': '幫澆水 3   ', 't': 'X', 'h': '💧20' },
	{ 'id': 'TE3', 'name': '幫澆水 10  ', 't': 'X', 'h': '💧30' },
	{ 'id': 'TG1', 'name': '消消樂 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG2', 'name': '夾夾樂 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG3', 'name': '寵物村 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG4', 'name': '泡泡王 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG5', 'name': '  飛刀 1   ', 't': 'H', 'h': '💧10' },
	{ 'id': 'TGB1', 'name': '消消樂 1蝦幣', 't': 'H', 'h': '💧100' },
	{ 'id': 'TGB2', 'name': '夾夾樂 1蝦幣', 't': 'H', 'h': '💧100' },
];
let reset = false;
if (tasks.gameTime != dtD) { tasks.gameTime = dtD; reset = true; }
if (reset || !tasks.hasOwnProperty(tsn)) { tasks[tsn] = {}; }
shopee_ids.forEach((p, i) => {
	let p2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' };
	if (!tasks[tsn].hasOwnProperty(p.id)) { tasks[tsn][p.id] = p2; }
});
let ts = tasks[tsn];

let caption = '';
let url_list = [
	[1, 'C', 'https://games.shopee.tw/farm/api/grocery_store/rn_claim'],
	[1, 'G', 'https://games.shopee.tw/farm/api/friend/shake_tree/submit2'],
];
// try {
let json = JSON.parse(body);
//console.log(json);
if (json.code === 0) {
	let flag = true;
	let d = json.data;
	let uu = null;
	let p = {};
	if (url_list.some(u => {
		if (u[0] === 1) {
			let found = false;
			if (url.indexOf(u[2]) === 0) { found = true; }
			if (u.length >= 4 && u[3] === 1) { let re = new RegExp(u[2], 'i'); if (url.match(re)) { found = true; } }
			if (found) { uu = u; return true; }
		}
	})) {
		shopee_ids.some(x => { if (x.id === uu[1]) { p = x; return true; } });
		let s = ts[p.id];
		if (s.c === 0 && s.s === 0 && !s.f) { s.s = 3; }
		s.c++;
		let msg = `今天第 ${s.c} 次`;
		caption = p.name;
		if (s.s > 0) { s.s--; }
		if (p.id === 'G') { s.s = d.remainingChance; } // 剩餘次數
		s.f = s.c > 0 && s.s === 0;

		if (flag) { loonNotify(caption, msg); }

		ts[p.id] = s;
		tasks[tsn] = ts;
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
	console.log(`DATA : ${json.data}`);
	loonNotify(caption, `ERROR : ${json.msg}`);
}

// } catch (e) {
// 	console.log(e);
// }
//console.log(tasks);
$done({});