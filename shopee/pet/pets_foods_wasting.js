let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '寵物工作餵食領撲幣';
let title = '自動' + caption;
const version = 'v20240815';
let showNotification = true;
let showLog = true;
let config = null;
let dataList = [];
const NotShowNotification = $persistentStore.read('NotShowNotification'); if (NotShowNotification) { showNotification = false; }
showNotification = true;
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
			'Cookie': `${shopeeInfo.cookieAll}`,
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
// some true ,  every false

async function ProcData0(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;
			console.log(obj);
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			if (!found && obj.data.games) {
				for (let i = 0; i < obj.data.games.length; i++) {
					const g = obj.data.games[i];
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
				console.log(obj.data);
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
		if (obj.code === 0) {
			found = true;
			config.event_code = obj.data.eventCode;
			console.log(`EID : ${config.event_code}`);
			if (obj.data.pets && obj.data.pets.length > 0) {
				for (let i = 0; i < obj.data.pets.length; i++) {
					const p = obj.data.pets[i];
					// if (pets.pets.length >= 30) { break; }
					// 0.004 0.0026 0.0017
					// if (p.attr.retiredTime != 0) {
					config.pets.push({
						'NO': (i + 1),
						'petID': p.petID,
						'coinEfficiencyMin': p.attr.coinEfficiencyMin,
						'retiredTime': p.attr.retiredTime, // 退休時間
						'lastFeedTime': p.attr.lastFeedTime, // 最後餵食時間
						'digestTime': p.attr.digestTime, // 多久後能餵食   // digestTime = 14400000;
						'dayFeedNum': p.attr.dayFeedNum, // 已餵食次數
						'dayFeedLimit': p.attr.dayFeedLimit, // 可餵食次數
						'flag': true
					});
					// }
				}

				// config.pets = obj.data.pets;
			}
			// console.log(JSON.stringify(config.pets));
			// console.log(JSON.stringify(obj.data.pets));

			// console.log('');
			// if (config.pets && config.pets.length > 0) {
			// }
			// else {
			// 	found = false;
			// 	console.log('目前沒有工作中的寵物，請選擇寵物工作。');
			// }
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
		if (obj.code == 0 && 'pets' in obj.data && obj.data.pets.length > 0) {
			found = true;
			config.petsTotal = obj.data.total; // 寵物總數
			config.pageNum = parseInt(obj.data.total / 50) + ((obj.data.total % 50) > 0 ? 1 : 0);
			console.log(`寵物數量：${config.petsTotal}`);
			console.log(`PageNum：${config.pageNum}`);
			//config.dormitoryPets = obj.data.pets; // 宿舍寵物
			// 正常出門 前3個寵物
			for (let i = 0; i < obj.data.pets.length; i++) {
				const p = obj.data.pets[i];
				// if (pets.pets.length >= 30) { break; }
				// 0.004 0.0026 0.0017
				if (p.attr.retiredTime != 0 && p.attr.coinEfficiencyMin == config.預設寵物金額) {
					config.pets1.push({
						'NO': (config.pets1 + 1),
						'petID': p.petID,
						'coinEfficiencyMin': p.attr.coinEfficiencyMin,
						'retiredTime': p.attr.retiredTime, // 退休時間
						'lastFeedTime': p.attr.lastFeedTime, // 最後餵食時間
						'digestTime': p.attr.digestTime, // 多久後能餵食   // digestTime = 14400000;
						'dayFeedNum': p.attr.dayFeedNum, // 已餵食次數
						'dayFeedLimit': p.attr.dayFeedLimit, // 可餵食次數
						'flag': true
					});
				}
				if (config.派出待餵食寵物 && p.attr.retiredTime != 0) { // && p.attr.coinEfficiencyMin != config.預設寵物金額
					config.pets2.push({
						'NO': (config.pets2 + 1),
						'petID': p.petID,
						'coinEfficiencyMin': p.attr.coinEfficiencyMin,
						'retiredTime': p.attr.retiredTime, // 退休時間
						'lastFeedTime': p.attr.lastFeedTime, // 最後餵食時間
						'digestTime': p.attr.digestTime, // 多久後能餵食   // digestTime = 14400000;
						'dayFeedNum': p.attr.dayFeedNum, // 已餵食次數
						'dayFeedLimit': p.attr.dayFeedLimit, // 可餵食次數
						'flag': true
					});
				}
			}
			// if (config.pageNum == 1) { ProcData4(data, dc); }
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code == 0 && 'pets' in obj.data && obj.data.pets.length > 0) {
			found = true;
			let j = config.pets2.length;
			// 候備出門 限制數量 寵物
			for (let i = obj.data.pets.length - 1; i >= 0; i--) {
				j++;
				const p = obj.data.pets[i];
				// console.log(obj.data.pets.length);
				// console.log(config.pets2.length);
				// console.log(`"${p.attr.coinEfficiencyMin}"`);
				// console.log(`"${config.備援寵物金額}"`);
				if (p.attr.coinEfficiencyMin == config.備援寵物金額) { // p.attr.retiredTime == 0 && 
					config.pets2.push({
						'NO': j,
						'petID': p.petID,
						'coinEfficiencyMin': p.attr.coinEfficiencyMin,
						'retiredTime': p.attr.retiredTime, // 退休時間
						'lastFeedTime': p.attr.lastFeedTime, // 最後餵食時間
						'digestTime': p.attr.digestTime, // 多久後能餵食   // digestTime = 14400000;
						'dayFeedNum': p.attr.dayFeedNum, // 已餵食次數
						'dayFeedLimit': p.attr.dayFeedLimit, // 可餵食次數
						'flag': true
					});
				}
				if (config.pets2.length >= config.待出門寵物數) { break; }
			}
		}
		else {
			// found = true;
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;
			//console.log(obj);
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}


let UrlData = [[],
['!GET', '取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '2', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得年輕寵物資訊1', '3', 'https://games.shopee.tw/api-gateway/pet/dormitory/list?activityCode={activityId}&eventCode={event_code}&lifeStatus=1&pageNum=1&pageSize=12', '', ['activityId', 'event_code'], ProcData3],
['GET', '取得年輕寵物資訊2', '4', 'https://games.shopee.tw/api-gateway/pet/dormitory/list?activityCode={activityId}&eventCode={event_code}&lifeStatus=1&pageNum={pageNum}&pageSize=50', '', ['activityId', 'event_code', 'pageNum'], ProcData4],
['POST', '讓寵物休息', '5', 'https://games.shopee.tw/api-gateway/pet/dormitory/withdraw?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
['POST', '讓寵物出門', '6', 'https://games.shopee.tw/api-gateway/pet/dormitory/hangout?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData6],
];
let DataPostBodyList = [, , , , ,
	{ "petID": 0 }, { "petID": 0 },
];

function preInit() {
	config.appid = 'LcqcAMvwNcX8MR63xX'; // 寵物村
	config.activityId = 'b711c6148c210f8f';
	config.event_code = '1dc0c8914b227e83';
	config.deviceId = config.shopeeInfo.token.SPC_F;
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.caption = caption;
	config.title = title;
	config.petID = 0;
	config.petIDIn = -2;
	config.petIDInCount = 0;
	config.petIDInS = [];
	config.petIDOut = -2;
	config.petIDOutCount = 0;
	config.petIDOutS = [];
	config.pageNum = 1;
	config.petsTotal = 0;
	config.pets = [];
	config.dormitoryPets = [];
	config.pets1 = [];
	config.pets2 = [];
	config.派出寵物 = ($persistentStore.read('派出寵物') || '').replace('預設:', '').replace('不處理', '');
	// config.派出備援寵物 = ($persistentStore.read('派出備援寵物') || '') == '是';
	// config.派出預設寵物 = ($persistentStore.read('派出預設寵物') || '') == '是';
	config.派出備援寵物 = config.派出寵物 == '備援';
	config.派出預設寵物 = config.派出寵物 == '預設';
	config.派出待餵食寵物 = config.派出寵物 == '待餵食';
	// config.備援寵物金額 = '0.004';
	// config.備援寵物金額 = '0.0026';
	config.預設寵物金額 = ($persistentStore.read('預設寵物金額') || '0.004').replace('預設:', '');
	config.備援寵物金額 = ($persistentStore.read('備援寵物金額') || '0.0017').replace('預設:', '');
	// config.待出門寵物陪數 = parseInt(($persistentStore.read('待出門寵物陪數') || '4').replace('預設:', ''));
	// $persistentStore.write(null, '派出備援寵物');
	// $persistentStore.write(null, '派出預設寵物');
	// $persistentStore.write(null, '待出門寵物陪數');
	config.待出門寵物數 = 3 * 3;
	config.hasPageNum = false;
}

const forMaxCount = 30;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	console.log(`${new Date().format('0')}`);
	try {
		await preCheck();
		preInit();
		let flag = true;
		let runCount = 0;
		let item = -1;
		let msg2 = '';
		if (config.派出預設寵物) { msg2 = '派出預設寵物'; }
		if (config.派出備援寵物) { msg2 = '派出備援寵物'; }
		if (config.派出寵物 == "") { flag = false; msg2 = '不處理寵物'; }
		msg2 += `\n預設寵物金額：${config.預設寵物金額}`;
		msg2 += `\n備援寵物金額：${config.備援寵物金額}`;
		if (msg2 != '') { console.log(msg2); }

		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			item = -1;
			// 出門寵物
			/*
			是否有下列寵物，如有，需要已出門寵物先回家
			是否已出過門餵過食
			是否已出過門餵過食，且是否可餵食
			未出門未餵過食

			'retiredTime': p.attr.retiredTime, // 退休時間
			'lastFeedTime': p.attr.lastFeedTime, // 最後餵食時間
			'digestTime': p.attr.digestTime, // 多久後能餵食   // digestTime = 14400000;
			'dayFeedNum': p.attr.dayFeedNum, // 已餵食次數
			'dayFeedLimit': p.attr.dayFeedLimit, // 可餵食次數
			*/
			if (i == 4) {
				console.log(`pets Length: ${config.pets2.length}`);
				if (config.派出待餵食寵物 || config.派出預設寵物
					|| config.pets2.length >= config.待出門寵物數 || config.pageNum == 1) { i++; }
				else if (config.hasPageNum) { config.pageNum--; } else { config.hasPageNum = true; }
				if (i == 4) { console.log(`pageNum: ${config.pageNum}`); }

			}
			if (i == 5) {
				if (config.petIDOut == -2) {
					// 處理要休息或出門的寵物
					if (config.pets.length == 0) { config.petIDOut = -1; }
					else {
						config.pets.forEach(p => {
							config.petIDOutS.push(p.petID);
						});
						config.petIDOut = 0;
					}
					config.petIDIn = -1;
					if (config.派出預設寵物) {
						config.pets1.some(p => {
							config.petIDInS.push(p.petID);
							if (config.petIDInS.length >= 3) { return true; }
						});
						if (config.petIDInS.length == 0) { loonNotify('沒有需要出門寵物，不處理。'); }
						config.petIDIn = 0;
					}
					else {
						config.pets2.some(p => {
							if (p.flag) { // 已餵食滿 或 工作中 不列入
								if (p.dayFeedNum == p.dayFeedLimit
									|| p.lastFeedTime + p.digestTime > new Date().getTime()) { p.flag = false; }
							}
							if (p.flag) {
								config.petIDInS.push(p.petID);
								if (config.petIDInS.length >= 3) { return true; }
							}
						});
						if (config.petIDInS.length == 0) {
							config.pets1.some(p => {
								config.petIDInS.push(p.petID);
								if (config.petIDInS.length >= 3) { return true; }
							});
							if (config.petIDInS.length > 0) { loonNotify('派出預設寵物'); }
							else { loonNotify('沒有需要出門寵物，不處理。'); }
						}
						config.petIDIn = 0;
					}
					// console.log(JSON.stringify(config.pets));
					// console.log();
					console.log(JSON.stringify(config.petIDOutS));
					console.log('');
					console.log(JSON.stringify(config.petIDInS));
					console.log('');
				}
				// break;
				// console.log(JSON.stringify(config.pets));
				// console.log('');
				// console.log(JSON.stringify(config.pets1));
				// console.log('');
				// console.log(JSON.stringify(config.pets2));
				console.log('petIDOutS: ' + config.petIDOut);
				// 如果 需要出門寵物 0 ，則不讓寵物休息
				if (config.petIDOut == -1 || config.petIDOut >= config.petIDOutS.length || config.petIDOutS.length == 0 || config.petIDInS.length == 0) { i++; await delay(0.5); }
				else {
					config.petIDOutCount++;
					DataPostBodyList[i].petID = config.petIDOutS[config.petIDOut];
					console.log(`休息寵物：${DataPostBodyList[i].petID}`);
					config.petIDOut++;
					await delay(0.3);
				}
				// break;
			}
			if (i == 6) {
				console.log('petIDInS: ' + config.petIDIn);
				if (config.petIDIn == -1 || config.petIDIn >= config.petIDInS.length || config.petIDInS.length == 0) { flag = false; break; }
				else {
					config.petIDInCount++;
					DataPostBodyList[i].petID = config.petIDInS[config.petIDIn];
					console.log(`出門寵物：${DataPostBodyList[i].petID}`);
					config.petIDIn++;
					await delay(0.3);
				}
				// break;
			}

			let dc = GetDataConfig(i);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i >= 4 && i <= 6) { flag = true; i--; }
			// if (i === 7) { flag = true; i--; }
			// if (i === 9) { if (flag) { i--; } else { flag = true; } }
			// if (i === 11 || i === 12) { if (flag) { i--; } else { flag = true; } }
			// if (i === 13) {
			// 	if (flag) { i--; await delay(3.0); } else { flag = true; }
			// }
			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 15) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

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

