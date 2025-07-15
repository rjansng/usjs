// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '領登入獎勵、分享獲得1💎任務';
const title = '消消樂 ' + caption;
const version = 'v20240422';
let showNotification = true;
let needLastNotify = true;
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
	console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒 💤`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
function GetDataConfig(item = -1, method = 'POST', url = '', title = '', content = '', func = null) {
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
	if (func != null && typeof (func) === 'function') { dc = func(dc); }
	return dc;
}
Date.prototype.format = function (format = '1') {
	if (format == '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
	else if (format == '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format == '2') { format = 'yyyy/MM/dd'; }
	else if (format == '3') { format = 'HH:mm:ss'; }
	else if (format == '4') { format = 'MM/dd'; }
	else if (format == '5') { format = 'HH:mm'; }
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
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

async function dataGet(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `\t🌐 ${dc.title} ...`;
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
			'Cookie': `${cookieToString(shopeeInfo.token)}shopee_token=${shopeeInfo.shopeeToken};csrftoken=${shopeeInfo.csrfToken}`,
			'Content-Type': 'application/json',
		}
		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功');
		return resolve();
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			// console.log(obj);
			let basic = obj.data.curr_basic;
			let ndt = new Date().getTime();
			if (ndt < (basic.end_time * 1000)) {
				for (let i = 0; i < basic.slots.length; i++) {
					let slot = basic.slots[i];
					if (slot.page_key === 'page_slot'
						&& (slot.start_time * 1000) < ndt && (slot.end_time * 1000) > ndt) {
						found = true;
						//console.log(slot.slot_name);
						config.slot_code = slot.slot_code;
						console.log(`slot_code : ${config.slot_code}`)
						break;
					}
				}
				if (!found) {
					console.log('找不到 page_slot');
					console.log(basic);
				}

			}
			else {
				console.log('\n活動已結束。');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		if (obj.code == 0 && 'data' in obj) {
			// console.log(obj.data);
			found = true;
			let msg = '';
			let msg2 = '';
			config.isReceivedToday = obj.data.isReceivedToday;
			if (obj.data.isReceivedToday) {
				msg += '登入獎勵已領取。';
			}
			else {
				msg += '登入獎勵未領取。';
			}
			msg2 += `第 ${obj.data.realRewardDays} 天，還有 ${obj.data.leftRewardDays} 天 👀`;
			msg += '\n' + msg2 + `\nisActivityOpen: ${obj.data.isActivityOpen}`;
			console.log(msg);

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'candycrush' + 's';
				let tsid = 'B';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (obj.data.isReceivedToday) {
					if (!s.f) {
						s.c = 1;
						s.f = s.c > 0;
						s.r = msg2;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					}
				}
				else {
					if (s.f) {
						s.c = 0;
						s.f = false;
						s.r = '';
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					}
				}
			} catch (e) { console.log(e); }
			// "leftRewardDays": 5,
			// "realRewardDays": 2,
			// "isReceivedToday": true,
			// "isActivityOpen": true,
			// "isNewPlayer": false
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		if (obj.code == 0 && 'data' in obj) {
			// console.log(obj.data);
			found = true;
			let msg2 = '';
			let msg = '';
			msg += '登入獎勵領取成功。';
			if ('rewardList' in obj.data && obj.data.rewardList) {
				msg2 += `第 ${obj.data.rewardList.length} 天，`;
			}
			msg2 += `還有 ${obj.data.leftRewardDays} 天 👀`;
			console.log(msg + '\n' + msg2);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'candycrush' + 's';
				let tsid = 'B';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.f = true
				s.r = msg2;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {

			return resolve(found);
			//return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}


async function ProcData42(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			// console.log(obj);
			console.log(`目前點數：${obj.data.totalDiamond}`);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'candycrush' + 's';
				let tsid = 'P';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tsn in tasks) { ts = tasks[tsn]; }
				if (tsid in ts) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.f = true;
				s.c = 1;
				s.s = obj.data.totalDiamond;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);

			} catch (e) { console.log(e); }


			found = true;
		}
		// else {
		// 	return reject([`執行失敗 ‼️`, obj.msg, data]);
		// }
		return resolve(found);
	});
}
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			//  console.log(obj);

			let ts = obj.data.fixedTaskList;
			for (let i = 0; i < ts.length; i++) {
				let t = ts[i];
				if (t.taskName.includes('分享蝦皮消消樂')) {
					found = true;
					config.hasTask = true;
					console.log(`找到 ${t.taskName}`);
					break;
				}
			}
			if (!found) {
				console.log(`今已領過 💎`);

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'candycrush' + 's';
					let tsid = 'A';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tsn in tasks) { ts = tasks[tsn]; }
					if (tsid in ts) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					if (!s.f) {
						s.f = true;
						s.c = 1;
						s.s = 0;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					}
				} catch (e) { console.log(e); }

			}
			// found = true;
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		if (obj.code == 0 && 'data' in obj) {
			found = true;
			skey = obj.data.shareKey;
			console.log(`shareKey: ${obj.data.shareKey}`);
		}
		else {
			console.log(obj);
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		if (obj.code == 0 && 'data' in obj) {
			console.log(`short_url: ${obj.data.short_url}`);
			console.log(`original_url: ${obj.data.original_url}`);
			found = true;
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData7(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			if (obj.data.chance > 0) { console.log(`❤️ : ${obj.data.chance}`); }
			if (obj.data.diamond > 0) { console.log(`💎 : ${obj.data.diamond}`); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'candycrush' + 's';
				let tsid = 'A';
				let tsidF = 'D';
				let tsidP = 'P';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, sF = {}, sP = {};
				if (tsn in tasks) { ts = tasks[tsn]; }
				if (tsid in ts) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (tsidF in ts) { sF = ts[tsidF]; } else { sF = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (tsidP in ts) { sP = ts[tsidP]; } else { sP = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = s.c > 0;
				// s.s = obj.data.diamond;
				s.r = `💎` + new Date().format('5');
				sF.s = obj.data.chance;
				sP.s = obj.data.diamond;

				ts[tsid] = s;
				ts[tsidF] = sF;
				ts[tsidP] = sP;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得消消樂資訊', '1', 'https://games.shopee.tw/gameplatform/api/v5/game/activity/{activityCode}/settings?appid=AxJMo8pm7cs5ca7OM8&_t={token}', '', ['activityCode', 'token'], ProcData1],
['GET', '取得登入獎勵資訊', '2', 'https://games.shopee.tw/api-gateway/candycrush_api/con_login_reward/list?activityCode={activityCode}&slotCode={slot_code}&_t={token}', '', ['activityCode', 'slot_code', 'token'], ProcData2],
['POST', '領取登入獎勵', '3', 'https://games.shopee.tw/api-gateway/candycrush_api/con_login_reward/recv_reward?activityCode={activityCode}&slotCode={slot_code}&_t={token}', '', ['activityCode', 'slot_code', 'token'], ProcData3],
['GET', '取得點數資訊', '4', 'https://games.shopee.tw/api-gateway/candycrush_api/round/mainland?page=-1&activityCode={activityCode}&slotCode={slot_code}&_t={token}', '', ['activityCode', 'slot_code', 'token'], ProcData42],
['GET', '取得任務資訊', '24', 'https://games.shopee.tw/api-gateway/candycrush_api/task/fixedTask/list?activityCode={activityCode}&slotCode={slot_code}&_t={token}', '', ['activityCode', 'slot_code', 'token'], ProcData4],
['GET', '取得分享Key', '35', 'https://games.shopee.tw/api-gateway/candycrush_api/share/share_link?activityCode={activityCode}&slotCode={slot_code}&shareType=0&chanceID=43145&channel=line&shareLinkID=4&_t={token}', '', ['activityCode', 'slot_code', 'token'], ProcData5],
['POST', '取得分享Link', '46', 'https://games.shopee.tw/gameplatform/api/v1/share/genShortUrl?appid=AxJMo8pm7cs5ca7OM8', '', , ProcData6],
['POST', '取得一鑽石任務', '57', 'https://games.shopee.tw/api-gateway/candycrush_api/fixedTask/updateShareTask?activityCode={activityCode}&slotCode={slot_code}', '', ['activityCode', 'slot_code'], ProcData7],
];
// https://games.shopee.tw/api-gateway/candycrush_api/share/share_link?activityCode={activityCode}&slotCode={slot_code}&shareType=0&chanceID=43145&channel=line&shareLinkID=5&_t={token}
// https://games.shopee.tw/api-gateway/candycrush_api/user/chance_countdown?activityCode=1731357eb13431cb&slotCode=cf5a35e6d08de17e&_t=1689642372632
let DataPostBodyList = [, , ,
	{
		"requestId": ""
	}, , , ,
	""
	,
	{
		"requestId": ""
	}
];

function preInit() {
	config.transaction_id = `AxJMo8pm7cs5ca7OM8_${config.shopeeInfo.token.SPC_U}_${getToken()}`;
	config.activityCode = '1731357eb13431cb';
	config.hasTask = false;
	//	config.slot_code = 'b1e4c01f8113ab86';
}

var skey = '';
var urlShare = 'https://games.shopee.tw/shopeecandy/?skey={skey}';

const forMaxCount = 10;
const showNeedDebug = 10;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		needLastNotify = false;
		let flag = true;
		let runCount = 0;
		let item = -1;
		let payload = '';
		let boundary = '';

		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			runCount++;
			if (i == 1) { console.log(''); }
			let func = null;
			item = -1;

			if (i == 3) {
				if (config.isReceivedToday) {
					i++;
				}
				else {
					DataPostBodyList[i].requestId = config.transaction_id;
				}
			}
			if (i == 7) {

				let formData = 'https://games.shopee.tw/shareplatform?title=%E8%9D%A6%E7%9A%AE%E6%B6%88%E6%B6%88%E6%A8%82&desc=&universal=0&img=&link=';
				let slink = urlShare.replace('{skey}', skey);
				formData += encodeURIComponent(slink);
				boundary = '------GamesRuntimeFormDataBoundary';
				let content = '';
				content = [
					`\r\n--${boundary}`,
					`\r\nContent-Disposition: form-data; name="real_url";`,
					`\r\n`,
					`\r\n${formData}`,
				].join('');
				payload += content;
				payload += `\r\n--${boundary}--`;

			}
			if (i == 8) {
				DataPostBodyList[i].transaction_id = config.transaction_id;
				if (!config.hasTask) { flag = false; break; }
			}
			if (i > 7) { await delay(5.0); }
			let dc = GetDataConfig(i, null, null, null, null, func);
			if (i == 7) {
				dc.dataRequest.body = payload;
				dc.dataRequest.headers['Content-Length'] = payload.length;
				dc.dataRequest.headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary;
			}
			if (i == 8) {
				delete dc.dataRequest.headers['Content-Length'];
				delete dc.dataRequest.headers['Content-Type'];

			}
			//console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (dc === null) { continue; }
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i == 3 && !flag) { flag = true; }

			if (runCount >= forMaxCount) { break; }
			if (runCount > showNeedDebug) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		console.log('');
		let msg = '✅ 處理已完成';
		// console.log(msg);
		if (!needLastNotify) { showNotification = needLastNotify; }
		loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();

