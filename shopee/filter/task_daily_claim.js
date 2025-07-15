let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '簽到、部份任務、領獎勵';
let title = '自動' + caption;
const version = 'v20240201';
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
Date.prototype.format = function (format = '1', mode = 1) {
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
	if (format.match(/\/|\-/g)) {
		if (mode == 0) { return new Date(format); }
		else if (mode == 2) { return new Date(format).getTime(); }
	} else if (format.match(/:/g)) {
		if (mode == 0) { return new Date('0 ' + format); }
		else if (mode == 2) { return new Date('0 ' + format).getTime(); }
	}
	return format;
};
let DTND = new Date(new Date().format('2')).getTime();
function _uuid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
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
			'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
			'Content-Type': 'application/json',
			'x-tenant': 'TW',
			'x-user-id': shopeeInfo.token.SPC_U
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
			if (obj.data.hasOwnProperty('pets') && obj.data.pets && obj.data.pets.length > 0) {
				config.petID = obj.data.pets[0].petID;
			}
			if (obj.data.hasOwnProperty('mainPet') && obj.data.mainPet) {
				config.petID = obj.data.mainPet.petID;
			}
			else {
				console.log('需設定主要的寵物。');
				//found = false;
			}
			console.log(`EID : ${config.event_code}`);
			console.log(`PID : ${config.petID}`);
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
		if (obj.code === 0) {
			found = true;
			let r = obj.data;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'CT';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentPetCoin;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PT';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentPoints;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);

				$persistentStore.write(`${r.currentPoints}`, '寵物村目前點數');

			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'SC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentCoins;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);

				$persistentStore.write(`${r.currentCoins}`, '目前蝦幣');
			} catch (e) { console.log(e); }


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
		if (obj.code === 0) {
			found = true;

			config.obtainCount = obj.data.obtainCount;
			if (config.obtainCount > 0) { console.log(`可領飼料: ${config.obtainCount}`); }
			// console.log('待確認 Left :');
			// console.log(obj.data.selfInteract);
			// console.log('');

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FO';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = obj.data.selfInteract.obtain;
				s.s = obj.data.selfInteract.leftObtain;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FG';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = obj.data.selfInteract.give;
				s.s = obj.data.selfInteract.leftGive;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
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
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;

			try {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'FC';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c = 1;
					s.s = obj.data.food.ownedCNT;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'L';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c++;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

				console.log(`目前飼料: ${obj.data.food.ownedCNT}`);
				config.ownedCNT = obj.data.food.ownedCNT;

			} catch (error) {
				console.log('資料異常。');
				console.log(error);
				console.log(obj.data);
			}
		}
		else {
			console.log('❌ 失敗！\n' + obj.msg);
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
			config.taskData = obj.data;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }

				config.taskData.dailyTasks.forEach((t, ti) => {
					try {
						let tsid = 'TD' + `${t.taskType}` + (`0${t.taskID}`.match(/\d{2}$/)[0]);

						let s = {};
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						s.c = t.progress;
						s.s = t.isClaimed ? 0 : 1;

						if (tasksList.some(tl => {
							if (tl.id === tsid) {
								s.s = t.progress >= tl.need ? 0 : tl.need - t.progress;
								return true;
							}
						})) { }

						s.f = t.isClaimed;
						//s.r = msg;
						ts[tsid] = s;
					}
					catch (e2) {
						console.log(t);
						console.log(e2);
					}
				});

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
async function ProcData7(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;
			let r = obj.data.reward;
			config.taskData.signedInDays++;
			let msg = `簽到 ${config.taskData.signedInDays} 天，今日領取 `;
			try {
				let f = rewards[config.taskData.signedInDays];
				if (f && f > 1) {
					msg += `${rewards[config.taskData.signedInDays]} `;
				}
			} catch (error) {

			}
			if (r.hasOwnProperty('foodBalance') && r.foodBalance) {
				if (r.foodBalance.hasOwnProperty('foodID')) {
					if (r.foodBalance.foodID === 11001) {
						msg += `飼料`;
					}
					else {
						msg += '待處 3:' + JSON.stringify(r.foodBalance);
					}
				}
				else {
					msg += '待處 2:' + JSON.stringify(r.foodBalance);
				}
			}
			else if (r.hasOwnProperty('clothingID') && r.clothingID) {
				msg += `裝飾 ${r.clothingID}`;
				//{"foodBalance":null,"currentCoins":63.38,"currentPoints":10198,"clothingID":103304,"isRepeat":false}
			}
			else {
				console.log(r);
				msg += '待處 1:' + JSON.stringify(r);
			}
			console.log('✅' + msg);

			/*
			r.foodBalance.ownedCNT
			"r.currentCoins": 119.47, 蝦幣
			"r.currentPoints": 639, 點數
			*/
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'CI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				//s.s = r.foodBalance.ownedCNT;
				s.f = true;
				s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			if (r.foodBalance) {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'FC';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c = 1;
					s.s = r.foodBalance.ownedCNT;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }
			}

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PT';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentPoints;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'SC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentCoins;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData8(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.hasOwnProperty('code') && obj.code === 0 || obj.hasOwnProperty('data') && obj.data) {
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

async function ProcData9(data, dc) {
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


async function ProcData16(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;

			if (obj.data.chances) {

				obj.data.chances.forEach(cc => {
					let tsid2 = ''; // GG3 GG3C

					if (cc.entranceID == 1) {
						tsid2 = 'GG3';
					} else if (cc.entranceID == 2) {
						tsid2 = 'GG3C';
					}

					if (tsid2 != '') {
						try {
							let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
							let tsn = 'pet' + 's';
							let tsid = tsid2;
							let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
							let tasks = JSON.parse(rs);
							let ts = {}, s = {};
							if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
							if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
							// if ('watched' in cc && !cc.watched) {
							// 	s.s = 0;
							// 	s.f = false;
							// } else
							{
								s.c = cc.used;
								if (!s.f) {
									if (tsid == 'GG3') {
										if (s.c > 0) { s.f = true; s.s = 0; }
										else { s.s = 1; }
									}
									else if (tsid == 'GG3C') {
										s.s = cc.left;
										if (s.s == 0 && s.c > 0) { s.f = true; }
									}
								}
								else if (s.s > 0) { s.s = 0; }
							}
							ts[tsid] = s;
							tasks[tsn] = ts;
							$persistentStore.write(JSON.stringify(tasks), dataName);
						} catch (e) { console.log(e); }
					}

				});

			}
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData17(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		found = true;
		let isOK = false;
		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'pet' + 's';
			let tsid = 'GG1';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.f = !obj.data.user_data.lobby.eligible_rewards['1'];
			if (s.f && s.c == 0) s.c++; // s.c = s.f ? 1 : 0;
			s.s = s.f ? 0 : 1;
			isOK = s.f;
			//s.r = msg;
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }

		try {
			if (isOK) {
				let gmp = { 'dataTime': DTND };
				$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG1' + _ShopeeUserID);
			}
		} catch (error) { }

		return resolve(found);
	});
}
async function ProcData18(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);

		found = true;
		let isOK = false;
		// if (new Date().getTime() >= new Date(new Date().format('2') + ' 08:00:00').getTime()) {

		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'pet' + 's';
			let tsid = 'GG2';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.f = !obj.data.user_data.multiple_entrance.eligible_reward['1'];
			// s.c = s.f ? 1 : 0;
			if (s.f && s.c == 0) s.c++; // s.c = s.f ? 1 : 0;
			s.s = s.f ? 0 : 1;
			isOK = s.f;
			//s.r = msg;
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }

		try {
			if (isOK) {
				let gmp = { 'dataTime': DTND };
				$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG2' + _ShopeeUserID);
			}
		} catch (error) { }

		// }
		// else {
		// 	try {
		// 		let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		// 		let tsn = 'pet' + 's';
		// 		let tsid = 'GG2P';
		// 		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		// 		let tasks = JSON.parse(rs);
		// 		let ts = {}, s = {};
		// 		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
		// 		if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
		// 		s.f = !obj.data.user_data.multiple_entrance.eligible_reward['1'];
		// 		// s.c = s.f ? 1 : 0;
		// 		s.s = s.f ? 0 : 1;
		// 		isOK = s.f;
		// 		//s.r = msg;
		// 		ts[tsid] = s;
		// 		tasks[tsn] = ts;
		// 		$persistentStore.write(JSON.stringify(tasks), dataName);
		// 	} catch (e) { console.log(e); }

		// 	try {
		// 		if (isOK) {
		// 			let gmp = { 'dataTime': DTND };
		// 			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG2P' + _ShopeeUserID);
		// 		}
		// 	} catch (error) { }


		// }
		return resolve(found);
	});
}


async function ProcData20(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;
			let r = obj.data.reward;
			let msg = '';
			if (r.hasOwnProperty('foodBalance') && r.foodBalance) {
				if (r.foodBalance.hasOwnProperty('foodID')) {
					if (r.foodBalance.foodID === 11001) {
						msg += `飼料`;
					}
					else {
						msg += '待處 3:' + JSON.stringify(r.foodBalance);
					}
				}
				else {
					msg += '待處 2:' + JSON.stringify(r.foodBalance);
				}
			}
			else if (r.hasOwnProperty('clothingID') && r.clothingID) {
				msg += `裝飾 ${r.clothingID}`;
				//{"foodBalance":null,"currentCoins":63.38,"currentPoints":10198,"clothingID":103304,"isRepeat":false}
			}
			else {
				console.log(r);
				msg += '待處 1:' + JSON.stringify(r);
			}
			console.log('✅' + msg);
			if (obj.data.hasOwnProperty('lifeTask') && obj.data.lifeTask) {
				console.log('待確認 lifeTask');
				console.log(obj.data.lifeTask);

			}
			/*
			r.foodBalance.ownedCNT
			"r.currentCoins": 119.47, 蝦幣
			"r.currentPoints": 639, 點數
			*/
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = config.tasksListID;
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				//s.s = r.currentPoints;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			if (r.foodBalance) {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'FC';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c = 1;
					s.s = r.foodBalance.ownedCNT;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }
			}
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PT';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentPoints;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'SC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = r.currentCoins;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌ 失敗！\n' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}

		return resolve(found);
	});
}
async function ProcData21(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;

			let fl = obj.data.foodList;
			let ownedCNT = -1;
			fl.some(f => { if (f.foodID === 11001) { ownedCNT = f.ownedCNT; return true; } });

			if (ownedCNT >= 0) {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'FC';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c = 1;
					s.s = ownedCNT;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }
			}
			else {
				console.log(obj.data);
			}
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData19(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.hasOwnProperty('code') && obj.code === 0 || obj.hasOwnProperty('data') && obj.data) {
			found = true;
			config.checkedInDays = obj.data.checkedInDays;
			config.isCheckedInToday = obj.data.isCheckedInToday;
			if (config.isCheckedInToday) {

				let msg = `簽到 ${obj.data.checkedInDays} 天，今日領取 `;
				try {
					let f = rewards[obj.data.checkedInDays];
					if (f && f > 1) {
						msg += `${rewards[obj.data.checkedInDays]} `;
					}
				} catch (error) {

				}
				if ('checkInID' in obj.data) {
					if (obj.data.checkInID == 1) {
						msg += `飼料`;
					}
					else {
						msg += '待處:' + obj.data.checkInID;
					}
				}

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'CI';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c = 1;
					if (!s.f) {
						s.f = true;
						s.r = msg;
						console.log('✅' + msg);
					}
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }
			}
		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData192(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		console.log(data);
		// console.log(obj);
		if (obj.hasOwnProperty('code') && obj.code === 0 || obj.hasOwnProperty('data') && obj.data) {
			found = true;
			config.checkedInDays++;
			let msg = `第 ${config.checkedInDays} 天，領取 ${obj.data.rewardType == 'food' ? '飼料' : obj.data.rewardType}: ${obj.data.rewardCount}`;
			// try {
			// 	let f = rewards[config.checkedInDays];
			// 	if (f && f > 1) {
			// 		msg += `${rewards[config.checkedInDays]} `;
			// 	}
			// } catch (error) {

			// }
			if (obj.data.rewardType == 'food') {
				msg += `飼料`;
			}
			else {
				msg += '待處:' + obj.data.rewardType;
			}

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'CI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.f = true;
				s.r = msg;
				console.log('✅' + msg);
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = obj.data.foodBalance;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PT';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = obj.data.diamondBalance;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'SC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = obj.data.coinBalance;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌執行失敗。' + obj.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}

// https://games.shopee.tw/gameplatform/api/v1/game/activity/b711c6148c210f8f/settings?appid=LcqcAMvwNcX8MR63xX&basic=false
// https://games.shopee.tw/gameplatform/api/v1/chance/397/event/e3bde8ea288f7cb7/query?appid=LcqcAMvwNcX8MR63xX&basic=false
let UrlData = [[],
['!GET', '取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '2', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得個人資訊', '3', 'https://games.shopee.tw/api-gateway/pet/user/profile?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData3],
['GET', '取得次數資訊', '4', 'https://games.shopee.tw/api-gateway/pet/interact/summary?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData4],
['POST', '領取飼料', '5', 'https://games.shopee.tw/api-gateway/pet/interact/claim_food?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
['GET', '取得每日任務資訊', '6', 'https://games.shopee.tw/api-gateway/pet/task/daily_list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData6],
['!POST', '執行簽到', '7', 'https://games.shopee.tw/api-gateway/pet/task/daily_sign_in?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData7],
['POST', '執行換裝', '8', 'https://games.shopee.tw/api-gateway/pet/clothing/save_clothes?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData8],
['GET', '玩過踢足球', '9', 'https://games.shopee.tw/api-gateway/pet/game/begin_football?activityCode={activityId}&eventCode={event_code}&petID={petID}', '', ['activityId', 'event_code', 'petID'], ProcData8],
['GET', '玩過找碴', '10', 'https://games.shopee.tw/api-gateway/pet/game/begin_art_v2?activityCode={activityId}&eventCode={event_code}&petID={petID}', '', ['activityId', 'event_code', 'petID'], ProcData8],
['GET', '玩過金頭腦', '11', 'https://games.shopee.tw/api-gateway/pet/game/begin_culture_quiz_v2?activityCode={activityId}&eventCode={event_code}&petID={petID}', '', ['activityId', 'event_code', 'petID'], ProcData8],
['GET', '玩過賽跑', '12', 'https://games.shopee.tw/api-gateway/pet/game/begin_race_v2?activityCode={activityId}&eventCode={event_code}&petID={petID}', '', ['activityId', 'event_code', 'petID'], ProcData8],
['GET', '執行瀏覽衣櫥', '13', 'https://games.shopee.tw/api-gateway/pet/clothing/closet_info?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData8],
['GET', '前往家園主題頁', '14', 'https://games.shopee.tw/api-gateway/pet/garden/info?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData8],
['POST', '玩過貪食蛇', '15', 'https://idgame.shopee.tw/worms/api/v2/game/begin-round', '', , ProcData8],
['!POST', '玩過桌上曲棍球', '16', 'https://idgame.shopee.tw/crash-ball/api/v1/game/begin-round', '', , ProcData8],
['!POST', '執行', '17', 'https://games.shopee.tw/api-gateway/pet/?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData8],
['!POST', '執行', '18', 'https://games.shopee.tw/api-gateway/pet/?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData8],
['GET', '取得簽到資訊', '19', 'https://games.shopee.tw/api-gateway/pet/task/check_in_info?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData19],
['!POST', '執行簽到', '20', 'https://games.shopee.tw/api-gateway/pet/task/check_in?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData192],
['GET', '取得彈珠台資訊', '21', 'https://games.shopee.tw/api-gateway/pet/game/get_pinball_chance?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData16],
['GET', '取得貪食蛇資訊', '22', 'https://idgame.shopee.tw/worms/api/v2/event/480d67df44babcaf', '', , ProcData17],
['!GET', '取得桌上曲棍球資訊', '23', 'https://idgame.shopee.tw/crash-ball/api/v1/landing-page?event_code=ab894e82f6d97121', '', , ProcData18],
['GET', '取得每日任務資訊', '24', 'https://games.shopee.tw/api-gateway/pet/task/daily_list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData6],
['POST', '領取任務獎勵', '25', 'https://games.shopee.tw/api-gateway/pet/task/claim_daily?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData20],
['GET', '取得飼料資訊', '26', 'https://games.shopee.tw/api-gateway/pet/food/list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData21],
];
let DataPostBodyList = [, , , , , {}
	, , {}, { "petID": 0, "clothingIDs": [] }, ,
	, , , , , { "event_code": "480d67df44babcaf", "play_pre_source": "lp_play_button", "lobby": 1 },
	{ "event_code": "ab894e82f6d97121", "game": { "entry_point": "crashball_landing_page", "entrance_type": 1 } }, , , ,
	{}, , , , ,
	{ "taskType": 0, "taskID": 0 }, , ,
];

function preInit() {
	config.appid = 'LcqcAMvwNcX8MR63xX'; // 寵物村
	config.activityId = 'b711c6148c210f8f';
	config.event_code = '1dc0c8914b227e83';
	config.deviceId = config.shopeeInfo.token.SPC_F;
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.caption = caption;
	config.title = title;
	config.taskData = {};
	config.ownedCNT = 0;
	config.petID = 0;
	config.isReload = false;
	config.runRun = false;
	config.checkedInDays = 0;
	config.isCheckedInToday = false;
	// try {
	// 	let DTt6 = '06:00:00'
	// 	let DTt = new Date().format('3');
	// 	// console.log(DTt);
	// 	// console.log(DTt6);
	// 	if (DTt < DTt6) { config.runRun = true; console.log('執行賽跑 (測試)'); }
	// } catch (error) {
	// 	console.log(error);
	// }
}
let rewards = [, 200, 200, 300, 200, 300, 1];
let tasksList = [
	{ 'id': 'TD101', 'need': 2, 'name': '餵食寵物2次 75' },
	{ 'id': 'TD102', 'need': 99, 'name': '' },
	{ 'id': 'TD103', 'need': 1, 'name': '在學校聊天室發言1次 75' },
	{ 'id': 'TD104', 'need': 2, 'name': '在學校請求飼料2次 75' },
	{ 'id': 'TD105', 'need': 2, 'name': '在學校贈送他人飼料2次 75' },
	{ 'id': 'TD106', 'need': 3, 'name': '按讚他人3次 75' },
	{ 'id': 'TD107', 'need': 1, 'name': '在遊樂場玩遊戲 1 次 150' },
	{ 'id': 'TD108', 'need': 1, 'name': '去學校上團體課 150' },
	{ 'id': 'TD109', 'need': 1, 'name': '瀏覽衣櫥頁面1次 75' },
	{ 'id': 'TD110', 'need': 2, 'name': '前往學校拜訪不同人家2次 75' },
	{ 'id': 'TD111', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 150' },
	{ 'id': 'TD112', 'need': 1, 'name': '在服裝抽抽樂抽1次 150' },
	{ 'id': 'TD113', 'need': 1, 'name': '在衣櫥直購任一造型1次 150' },
	{ 'id': 'TD114', 'need': 1, 'name': '前往家園主題頁 75' },
	{ 'id': 'TD115', 'need': 99, 'name': '' },
	{ 'id': 'TD116', 'need': 99, 'name': '' },
	{ 'id': 'TD117', 'need': 99, 'name': '' },
	{ 'id': 'TD118', 'need': 99, 'name': '' },
	{ 'id': 'TD119', 'need': 1, 'name': '蝦幣玩猜拳1次 150' },
	{ 'id': 'TD120', 'need': 1, 'name': '去學校踢足球一次 150' },
	{ 'id': 'TD121', 'need': 1, 'name': '去學校上美術課(找碴) 150' },
	{ 'id': 'TD122', 'need': 1, 'name': '去學校上通職課(金頭腦) 150' },
	{ 'id': 'TD123', 'need': 1, 'name': '去學校上體育課(賽跑) 150' },
	{ 'id': 'TD124', 'need': 99, 'name': '' },
	{ 'id': 'TD125', 'need': 99, 'name': '' },
	{ 'id': 'TD126', 'need': 1, 'name': '蝦幣玩貪食蛇1次 150' },
	{ 'id': 'TD127', 'need': 1, 'name': '蝦幣玩桌上曲棍球1次 150' },
	{ 'id': 'TD128', 'need': 1, 'name': '抽寵物扭蛋1次 500' },
	{ 'id': 'TD129', 'need': 1, 'name': '蝦幣抽寵物1次 500' },
	{ 'id': 'TD130', 'need': 1, 'name': '在免費寵物扭蛋瀏覽推薦商品 60 秒 75' },
	{ 'id': 'TD131', 'need': 99, 'name': '' },
	{ 'id': 'TD132', 'need': 1, 'name': '蝦幣玩彈珠台1次 150' },
	{ 'id': 'TD133', 'need': 99, 'name': '' },
	{ 'id': 'TD134', 'need': 1, 'name': '免費玩猜拳1次 75' },
	{ 'id': 'TD135', 'need': 1, 'name': '免費玩貪食蛇1次 75' },
	{ 'id': 'TD136', 'need': 1, 'name': '免費玩桌上曲棍球1次 75' },
	{ 'id': 'TD137', 'need': 1, 'name': '免費玩彈珠台1次 75' },
	{ 'id': 'TD138', 'need': 1, 'name': '蝦幣玩小廚神1次 150' },
	{ 'id': 'TD139', 'need': 99, 'name': '' },
	{ 'id': 'TD140', 'need': 99, 'name': '' },
	{ 'id': 'TD141', 'need': 99, 'name': '' },
	{ 'id': 'TD142', 'need': 99, 'name': '' },
	{ 'id': 'TD143', 'need': 99, 'name': '' },
	{ 'id': 'TD144', 'need': 99, 'name': '' },
	{ 'id': 'TD145', 'need': 99, 'name': '' },
	{ 'id': 'TD201', 'need': 1, 'name': '完成新手導覽 100P' }, // No.1
	{ 'id': 'TD202', 'need': 1, 'name': '在學校請求飼料1次 100P' }, // No.3 // 104
	{ 'id': 'TD203', 'need': 99, 'name': '' },
	{ 'id': 'TD204', 'need': 1, 'name': '去學校玩課程遊戲1次 100P' }, // No. 4 // 120
	{ 'id': 'TD205', 'need': 1, 'name': '在學校聊天室發言1次 100P' }, // No. 5 // 103
	{ 'id': 'TD206', 'need': 1, 'name': '前往學校拜訪不同人家1次 100P' }, // No. 6 // 110
	{ 'id': 'TD207', 'need': 1, 'name': '升級家園主題 200P' }, // No. 7
	{ 'id': 'TD208', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 200P' }, // No. 8 // 111
	{ 'id': 'TD209', 'need': 1, 'name': '蝦幣玩猜拳1次 400P' }, // No. 9
	{ 'id': 'TD210', 'need': 1, 'name': '蝦幣抽寵物1次 500P' }, // No. 12
	{ 'id': 'TD211', 'need': 1, 'name': '提領蝦幣1次 300P' }, // No. 13
	{ 'id': 'TD212', 'need': 1, 'name': '在免費寵物扭蛋瀏覽推薦商品 30 秒 100P' }, // No.2
	{ 'id': 'TD213', 'need': 1, 'name': '抽寵物扭蛋1次 200P' }, // No.10
	{ 'id': 'TD214', 'need': 1, 'name': '查看宿舍1次 100P' }, // No.11
	{ 'id': 'TD215', 'need': 99, 'name': '' },
	{ 'id': 'TD216', 'need': 99, 'name': '' },
	{ 'id': 'TD217', 'need': 99, 'name': '' },
	{ 'id': 'TD218', 'need': 99, 'name': '' },
	{ 'id': 'TD219', 'need': 99, 'name': '' },
	{ 'id': 'TD220', 'need': 99, 'name': '' },
];
function checkTask(tID, tT, ok = 0) {
	return (config.taskData.dailyTasks.some((t, ti) => {
		if (!t.isClaimed && t.taskID === tID) {
			if (tasksList.some(tl => {
				if (tl.id === `TD${t.taskType}` + (`0${t.taskID}`.match(/\d{2}$/)[0])
					&& t.taskType === tT
					&& (t.progress === 0 && ok === 0 || t.progress >= 0 && ok > 0)) {
					if (ok > 0) {
						t.progress++;
					}
					else {
						config.tasksListID = tl.id;
						config.taskType = t.taskType;
						config.taskID = t.taskID;
					}
					return true;
				}
			})) {
				return true;
			}
		}
	}));
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
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			item = -1;

			if (i === 5) { // 領飼料
				//console.log('領飼料');
				if (config.obtainCount === 0) { i++; }
			}
			if (i === 7) { // 簽到
				//console.log('簽到');
				if (config.taskData.isSignInToday) { i++; }
			}
			if (i === 8) { // 換裝
				//console.log('換裝');
				DataPostBodyList[i].petID = config.petID;
				if (checkTask(11, 1) || checkTask(8, 2)) { config.isReload = true; } else { i++; }
			}
			if (i === 9) { // 踢足球
				//console.log('踢足球');
				if (checkTask(20, 1) || checkTask(4, 2)) { config.isReload = true; } else { i++; }
			}
			if (i === 10) { // 找碴
				//console.log('找碴');
				if (checkTask(21, 1)) { config.isReload = true; } else { i++; }
			}
			if (i === 11) { // 金頭腦
				//console.log('金頭腦');
				if (checkTask(22, 1)) { config.isReload = true; } else { i++; }
			}
			if (i == 12) { // 賽跑   config.runRun 測試 速度
				//console.log('賽跑');
				if (config.runRun || checkTask(23, 1)) { config.isReload = true; } else { i++; }
			}
			if (i === 13) { // 瀏覽衣櫥
				//console.log('瀏覽衣櫥');
				if (checkTask(9, 1)) { config.isReload = true; } else { i++; }
			}
			if (i === 14) { // 前往家園主題頁
				//console.log('前往家園主題頁');
				if (checkTask(14, 1)) { config.isReload = true; } else { i++; }
			}
			if (i === 15) { // 免費玩貪食蛇 // 在遊樂場玩遊戲
				//console.log('免費玩貪食蛇');
				if (checkTask(7, 1) || checkTask(35, 1)) { config.isReload = true; } else { i++; }
				//console.log(DataPostBodyList[i]);
			}
			if (i === 16) { // 免費玩桌上曲棍球
				//console.log('免費玩桌上曲棍球');
				if (checkTask(36, 1)) { config.isReload = true; } else { i++; }
			}
			if (i === 24) { if (config.isReload) { await delay(1.0); } else { i++; } }
			if (i === 25) { // 兌換獎勵
				//console.log('兌換獎勵');
				runCount++;
				let dt = {};
				let dtl = {};
				if (config.taskData.dailyTasks.some((t, ti) => {
					if (!t.isClaimed) {
						if (tasksList.some(tl => {
							//console.log('TD1' + (`0${t.taskID}`.match(/\d{2}$/)[0]));
							if (tl.id === `TD${t.taskType}` + (`0${t.taskID}`.match(/\d{2}$/)[0]) && t.progress >= tl.need) {
								dtl = tl;
								dt = t; t.isClaimed = true;
								return true;
							}
						})) {
							return true;
						}
					}
				})) {
					console.log(`\t\t${dtl.id} : ${dtl.name}`);
					config.tasksListID = dtl.id;
					config.taskID = dt.taskID;
					config.taskType = dt.taskType;

					DataPostBodyList[i].taskID = dt.taskID;
					DataPostBodyList[i].taskType = dt.taskType;
				}
				else {
					i++;
				}
			}
			if (i == 20) { if (config.isCheckedInToday) { i++; } }

			let dc = GetDataConfig(i);
			//console.log(`\n🌐 ${dc.method} URL: ${dc.url} \n`);
			if (i == 15) {
				dc.dataRequest.headers['game-session-id'] = getToken() + config.shopeeInfo.token.SPC_U;
			}
			if (i == 16) {
				dc.dataRequest.headers['game-session-id'] = _uuid().replace(/\-/g, '');
			}
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i >= 6 && i <= 23) {
				//checkTask(config.taskID, flag);
				flag = true;
			}
			if (i == 25) { i--; flag = true; await delay(0.5); }
			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 50) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

		}
		console.log('');
		// console.log(JSON.stringify(config.fss).replace(/,"last/ig, ',\n"last').replace(/},/ig, '},\n'));
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);

		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();

