// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '兌換夾機';
const title = '夾夾樂 ' + caption;
const version = 'v20230522';
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
	console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
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
Date.prototype.format = function (format) {
	if (!(format)) format = 'yyyy/MM/dd';
	let o = {
		"M+": this.getMonth() + 1, //month  
		"d+": this.getDate(),    //day  
		"h+": this.getHours(),   //hour  
		"H+": this.getHours(),   //hour  
		"m+": this.getMinutes(), //minute  
		"s+": this.getSeconds(), //second  
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter  
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

async function dataGet(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `嘗試 ${dc.title} ...`;
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
			let msg = `嘗試 ${dc.title} ...`;
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
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
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
			// 
			if (!found && json.data.games) {
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/claw\/\?activity=([0-9a-f]+)$/i, '$1');
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
						config.activityId = g.link_url.replace(/^.+\/claw\/\?activity=([0-9a-f]+)$/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('目前沒有夾夾樂遊戲');
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
			// 
			// let activity = json.data.activity;
			let basic = json.data.basic;
			let modules = json.data.modules;
			let ndt = new Date().getTime();
			let dbt = new Date(basic.begin_time * 1000);
			let det = new Date(basic.end_time * 1000);
			console.log(`Game Name : ${basic.game_name}`);
			// console.log(`DateTime : ${dbt.format('yyyy/MM/dd HH:mm:ss')} - ${det.format('yyyy/MM/dd HH:mm:ss')}`);
			// console.log(basic);
			if (ndt < det.getTime()) {
				config.event_code = basic.event_code;
				for (let i = 0; i < modules.length; i++) {
					if (modules[i].owner === "activity" && modules[i].module_name === 'Service.CHANCE') {
						found = true;
						config.module_id = modules[i].module_id;
						break;
					}
				}
				if (!found) {
					console.log(`找不到 ${title} Service`);
					console.log(json.data);
				}
			}
			else {
				console.log('\n活動已結束。');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		try {
			if (json.code === 0 && json.msg === 'success') {
				console.log(json.data);
				found = true;
			}
			else {
				//console.log(`執行失敗 ‼️` + json.msg + '\n' + data);
				return reject([`執行失敗 ‼️`, json.msg, data]);
			}
		} catch (e) { console.log(e); }
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '01 取得遊戲清單C2', '取得', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['!GET', '02 取得夾夾樂資訊', '取得', 'https://games.shopee.tw/gameplatform/api/v1/game/activity/{activityId}/settings?appid={appid}&basic=false', '', ['appid', 'activityId'], ProcData2],
['POST', '03 兌換夾機', '獲得', 'https://games.shopee.tw/api-gateway/claw/draw/hat', '', , ProcData3],
];
let DataPostBodyList = [, , , {
	'request_id': '',
	'activity_code': ''
},];
function preInit() {
	config.shopeeHeaders['x-user-id'] = config.shopeeInfo.token.SPC_U;
	config.appid = '72tphGRI5Gy8qLGJqW'; // 夾夾樂
	config.activityId = 'b0d6cfce2a5ec790';
}

const forMaxCount = 20;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		let flag = true;
		let runCount = 0;
		let item = -1;
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			item = -1;
			if (i === 3) {
				runCount++;
				item = runCount;
				DataPostBodyList[i].request_id = getRnd();
				DataPostBodyList[i].activity_code = config.activityId;
			}
			let dc = GetDataConfig(i);
			// console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			if (flag && i === 3) { i = 2; await delay(0.5); }
			if (runCount >= forMaxCount) { break; }
			if (runCount > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();

