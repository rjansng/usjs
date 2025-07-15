let isGui = false;
try {
	if ($request && $request.url.match(/^http:\/\/lo.on\/.+$/i)) { isGui = true; console.log('GUI手動執行。\n'); }
} catch (error) { }
let html = '';

// ver 20230702
let UseUserId = $persistentStore.read('UseUserId') || '';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = '';
if (UseUserId != '1' || isGui) {
	UseUserId = '';
	SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
	if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
	if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
}
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
if (UseUserId != '1' && SimulateUserID == '') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

if (isGui) html += `\nShopeeUserID:  ${ShopeeUserID}`;



// let UseUserId = '';
// let ShopeeUserID = '';

// ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
// let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
// if (ShopeeUserID != '') { console.log(ShopeeUserID); }
// UseUserId = $persistentStore.read('UseUserId') || '';
// if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '取得學校遊戲狀態';
const title = '寵物村 ' + caption;
const version = 'v20230916';
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
	if (isGui) html += '\n' + msg;
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

async function dataGet(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
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
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
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
		const shopeeHeaders = {
			'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
			'Content-Type': 'application/json',
		}

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
		let json = JSON.parse(data);
		if (json.code === 0) {
			if (!found && json.data.games) {
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						// https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
						config.activityId = g.link_url.replace(/^.+\/\?activity=([0-9a-f]+)(&.+)?/i, '$1');
						config.activityName = g.app_name;
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found && json.data.no_chance_games) {
				for (let i = 0; i < json.data.no_chance_games.length; i++) {
					const g = json.data.no_chance_games[i];
					if (g.app_id === config.appid) {
						found = true;
						// https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
						config.activityId = g.link_url.replace(/^.+\/\?activity=([0-9a-f]+)(&.+)?/i, '$1');
						config.activityName = g.app_name;
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('找不到寵物村遊戲');
				console.log(json.data);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.event_code = json.data.eventCode;
			if (json.data.hasOwnProperty('pets') && json.data.pets && json.data.pets.length > 0) {
				config.petID = json.data.pets[0].petID;
			}
			if (json.data.hasOwnProperty('mainPet') && json.data.mainPet) {
				config.petID = json.data.mainPet.petID;
			}
			else {
				console.log('需設定主要的寵物。');
				//found = false;
			}
			console.log(`EID : ${config.event_code}`);
			console.log(`PID : ${config.petID}`);
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
let dtD = new Date(new Date().format('2')).getTime();
let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
let tasks = JSON.parse(rs);

// console.log(tasks);

shopee_ids = [
	{ 'id': 'E', 'name': '金頭腦  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 6, 'l3': 10 }, // 20 40 60
	{ 'id': 'F', 'name': '賽跑    ', 't': 'B', 'h': '210 💎', 'l1': 4, 'l2': 2, 'l3': 1 },  // 30 60 120
	{ 'id': 'G', 'name': '找碴    ', 't': 'E', 'h': '100 💎', 'l1': 3, 'l2': 6, 'l3': 9 },  // 20 20 60
	{ 'id': 'C', 'name': '踢足球  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 5, 'l3': 7 },  // 20 40 60
	{ 'id': 'H', 'name': '團體賽  ', 't': 'C', 'h': ' 80 💎', 'l1': 30, 'l2': 60, 'l3': 90 }, // 20 60 裝
	// { 'id': 'E', 'name': '金頭腦', 't': 'A', 'h': '💎250', 'l1': 3, 'l2': 6, 'l3': 10 },
	// { 'id': 'F', 'name': '賽跑  ', 't': 'B', 'h': '💎250', 'l1': 4, 'l2': 2, 'l3': 1 },
	// { 'id': 'G', 'name': '找碴  ', 't': 'A', 'h': '💎250', 'l1': 3, 'l2': 6, 'l3': 9 },
	// { 'id': 'H', 'name': '團體賽', 't': 'C', 'h': '💎200', 'l1': 40, 'l2': 60, 'l3': 90 },
];

let reset = false;
if (tasks.gameTime != dtD) { tasks.gameTime = dtD; reset = true; }
if (reset) { tasks.pets = {}; }

let tsn2 = 'pet' + 's';

shopee_ids.forEach((p, i) => {
	let p2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' };
	if (!tasks[tsn2].hasOwnProperty(p.id)) { tasks[tsn2][p.id] = p2; }
});

let pets = tasks[tsn2];
let gns = ['', '金頭腦', '賽跑  ', '找碴  ', '足球  ', '團體賽'];
let gnids = ['XX', 'E', 'F', 'G', 'C', 'H'];

async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			// console.log(json.data);
			let gp = json.data.gameProgresses;
			if (gp && gp.length > 0) {
				gp.forEach(g => {
					let flag = false;
					if (isGui) html += `\n${g.gameID} : ${gns[g.gameID]}\t${g.completed ? '💯' : (g.gameData != '' ? '⭕️' : '❌')}\n`;
					console.log(`\n${g.gameID} : ${gns[g.gameID]}\t${g.completed ? '💯' : (g.gameData != '' ? '⭕️' : '❌')}`); // \t${g.gameData}
					if (g.gameData != '') {
						let d = JSON.parse(g.gameData);

						let uu = gnids[g.gameID];
						let p = {};
						let sI = pets['I'];

						shopee_ids.some(x => { if (x.id === uu) { p = x; return true; } });
						let s = pets[p.id];
						//s.c++;
						let msg = `今天第 ${s.c} 次`;
						caption = p.name;
						// let sf = s.f;
						let ss = s.s;
						let sl = s.l;
						let cc = 0;
						s.l = 0;

						if (p.t === 'A') {
							let s2 = Math.floor(d.maxCorrectRate / 100 * p.l3);
							//if (s2 > s.s) {
							if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
							if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
							if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
							s.s = s2;
							s.f = s.l === 3;
							msg += `，成績 ${ss} -> ${s.s}`;
							//}
						} else if (p.t === 'B') {
							//if (d.maxRank < s.s || s.s === 0) {
							if (d.maxRank <= p.l1) { s.l = 1; if (s.l > sl) { cc += 30; } }
							if (d.maxRank <= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
							if (d.maxRank <= p.l3) { s.l = 3; if (s.l > sl) { cc += 120; } }
							s.s = d.maxRank;
							s.f = s.l === 3;
							msg += `，成績 ${ss} -> ${s.s}`;
							//}
						} else if (p.t === 'C') {
							let s2 = d.maxCorrectRate;
							//if (s2 > s.s) {
							if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
							if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
							if (s2 >= p.l3) { s.l = 3; }
							s.s = s2;
							s.f = s.l >= 2;
							// s.c++;  // 成績提高才計次數
							msg = msg.replace(/第 \d+ 次/, `第 ${s.c} 次`);
							msg += `，成績 ${ss} -> ${s.s}`;
							//}
						} else if (p.t === 'E') {
							let s2 = Math.floor(d.maxCorrectRate / 100 * p.l3);
							//if (s2 > s.s) {
							if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
							if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
							if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
							s.s = s2;
							s.f = s.l === 3;
							msg += `，成績 ${ss} -> ${s.s}`;
							//}
						}
						if (p.t === 'A' || p.t === 'B' || p.t === 'C' || p.t === 'E') {
							s.d = [];
							// s.d.push(d);
							if (cc > 0) { msg += `，獲得獎勵 💎${cc}`; }
							if (s.f) { msg += `，已`; }
							else { msg += `，未`; }
							msg += '完成每日💎任務';
						}
						if (s.s > 0) { if (s.c == 0) { s.c++; } } else { if (s.c > 0) { s.c = 0; } }
						//if (flag) { loonNotify(caption, msg); }
						if (isGui) html += '\t\t\t\t' + msg + '\n';
						console.log('\t\t\t\t' + msg);
						pets[p.id] = s;
						pets['I'] = sI;
						tasks.pets = pets;
						$persistentStore.write(JSON.stringify(tasks), dataName);
						// if (cc > 0) {
						// 	try {
						// 		//let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						// 		let tsn = 'pet' + 's';
						// 		// let tsid = 'ST';
						// 		let tsidD = 'SA';
						// 		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						// 		let tasks = JSON.parse(rs);
						// 		let ts = {}, s = {}, sD = {};
						// 		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						// 		// if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						// 		if (ts.hasOwnProperty(tsidD)) { sD = ts[tsidD]; } else { sD = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						// 		s.s += cc;
						// 		s.f = true;
						// 		sD.s += cc;
						// 		sD.f = true;
						// 		// ts[tsid] = s;
						// 		ts[tsidD] = sD;
						// 		tasks[tsn] = ts;
						// 		$persistentStore.write(JSON.stringify(tasks), dataName);
						// 	} catch (e) { console.log(e); }
						// }

					}
				});
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得遊戲清單C2', '取得', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '取得', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得學校遊戲狀態', '', 'https://games.shopee.tw/api-gateway/pet/game/game_progress?activityCode={activityId}&eventCode={event_code}&petID={petID}', '', ['activityId', 'event_code', 'petID'], ProcData3],
];
let DataPostBodyList = [, , ,];
function preInit() {
	// config.shopeeHeaders['x-user-id'] = config.shopeeInfo.token.SPC_U;
	config.appid = 'LcqcAMvwNcX8MR63xX'; // 寵物村
	config.activityId = '';
	config.activityName = '';
	config.event_code = '';
	config.module_id = 0;
	config.caption = caption;
	config.hasTask = true;
	config.petID = '';
}

const forMaxCount = 20;
const forMaxDebugCount = forMaxCount - 2;

(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	console.log(`${new Date().format('0')}`);
	try {
		await preCheck();
		preInit();
		if (new Date().getTime() > config.end_time) {
			throw ([`執行失敗 ‼️`, '活動已過期 : ' + new Date(config.end_time).format()]);
		}
		let flag = true;
		let runCount = 0;
		let item = -1;
		for (let i = 1; i < UrlData.length; i++) {
			// console.log(`i : ${i}`);
			if (!flag) { break; }
			item = -1;
			runCount++;

			let dc = GetDataConfig(i);
			// console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > forMaxDebugCount) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		caption = config.caption;
		console.log('');
		let msg = '處理已完成 ✅';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		caption = config.caption;
		handleError(error);
	}

	if (isGui) {

		let dt = new Date();
		let rbody = '<html><head><meta charset="utf-8" />'
			+ '<meta name="viewport" content="width=device-width, initial-scale=0.5,minimum-scale:0.1, maximum-scale=5, user-scalable=1">'
			+ '<style>'
			+ 'header,content,footer { display: block; white-space: pre;}'
			+ 'footer{padding-top:5px;text-align:center;}'
			+ '</style>'
			+ '</head><body>'
			+ '<h1>取得 寵物村 學校遊戲 狀態</h1>'
			+ '<content>'
			+ html.replace(/\n/g, '<br>')
			+ '</content>'
			+ '<footer>'
			+ '<br><br>👉 請按左上角「←」反回，並下拉頁面重整。 👈'
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

