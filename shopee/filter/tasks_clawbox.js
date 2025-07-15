let title = '取得 手動 夾夾樂 數據';
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
// };
// let $request = {
// 	body: '{"code": 0,"data": {"maxCorrectRate": 70,"costTimeMS": 44770,"correctRate": 90},"timestamp": 1678965259274,"msg": ""}'
// 	, url: 'https://games.shopee.tw/api-gateway/claw/v2/start/grab/activity/'
// };
// let $done = function () { };
// let $notification = { post: function (title, subtitle, message, url) { console.log(`${title}\t${subtitle}\t${message}`); } };
// let $persistentStore = { read: function (n) { if (n === 'ShopeeGamePlayed') return dd2; return null; }, write: function (v, n) { dd2 = v; dd1 = JSON.parse(v); } };

let isReq = false;
let body = null;
try {
	body = $response.body;
} catch (e) {
	isReq = true;
	body = $request.body;
}
if (!body) { body = $request.body; }
let url = $request.url;

let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
let tsn = 'clawbox' + 's';
let showNotification = ($persistentStore.read('UseNotify') || '1') === '1';
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'loon://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
console.log(new Date().format());
let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
let tasks = JSON.parse(rs);
shopee_ids = [
	{ 'id': 'A', 'name': '分享得1次', 't': '', 'h': '給果園任務 玩過1次' },
	{ 'id': 'B', 'name': '玩過1次 ', 't': '', 'h': '果園任務10水滴' },
	{ 'id': 'C', 'name': '玩Start ', 't': 'T', 'h': '2次 可夾到蝦幣，夾愛心多2次' },
	{ 'id': 'CE', 'name': '夾到物品', 't': 'T', 'h': '' },
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
	[1, 'C', 'https://games.shopee.tw/api-gateway/claw/v2/start/grab/activity/'],
	[1, 'CE', 'https://games.shopee.tw/api-gateway/claw/v2/grab/box/activity/'],
];
// try {
let json = JSON.parse(body);
if (!json.hasOwnProperty('code')) { json.code = 0; }
if (!json.hasOwnProperty('data')) { json.data = null; }
if (!json.hasOwnProperty('msg')) { json.msg = ''; }
if (json.data === null && json.hasOwnProperty('result')) { json.data = json.result; }
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
		s.c++;
		let msg = `今天第 ${s.c} 次`;
		let msg2 = '';
		caption = p.name;
		// let sf = s.f;
		let ss = s.s;
		let sl = s.l;
		let cc = 0;
		s.f = true;

		if (p.id === 'C') {
			if (s.s > 0) { s.s--; }

			let tsidF = 'B';
			let sF = {};
			if (ts.hasOwnProperty(tsidF)) { sF = ts[tsidF]; } else { sF = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			sF.c++;
			sF.f = sF.c > 0;
			ts[tsidF] = sF;
		}
		else if (p.id === 'CE') {
			try {
				if (d.chance) {
					msg2 += '\n🔆' + d.chance.title + ' ' + d.chance.desc; s.r += msg2;
				}
				else if (d.luckydraw) {
					msg2 += '\n🔆' + d.luckydraw.name; s.r += msg2;
					console.log('luckydraw');
					console.log(d);
				}
				else if (d.coin) {
					console.log('coin');
					console.log(d);
				}
				else {
					msg2 += '\n🔆沒夾到'; s.r += msg2;
				}
			}
			catch (e) {
				console.log(d);
				console.log(e);
			}
		}

		msg += msg2;
		if (flag) { loonNotify(caption, msg.replace(/\n/g, '')); }

		ts[p.id] = s;
		tasks[tsn] = ts;
		$persistentStore.write(JSON.stringify(tasks), dataName);
		// console.log(tasks);
		// console.log(JSON.stringify(tasks));
		// console.log(dd2);
	}
	else {
		console.log(`未指定 : ${json}`);
	}

}
else {
	console.log(`ERROR`);
	console.log(`CODE : ${json.code}`);
	console.log(`MSG : ${json.msg}`);
	console.log(`DATA : ${json.data}`);
	loonNotify(caption, `ERROR : ${json.msg}`);
	console.log(json);
}

// } catch (e) {
// 	console.log(e);
// }
//console.log(tasks);
$done({});