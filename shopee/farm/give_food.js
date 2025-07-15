let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '拜訪、請求、贈送飼料';
let title = '自動' + caption;
const version = 'v20240815';
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
// some true ,  every false

async function ProcData0(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
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
			let activity = json.data.activity;
			//let basic = json.data.basic;
			let modules = json.data.modules;
			let ndt = new Date().getTime();
			let dbt = new Date(activity.begin_time * 1000);
			let det = new Date(activity.end_time * 1000);
			console.log(`Act Name : ${activity.activity_name}`);
			// console.log(`DateTime : ${dbt.format('yyyy/MM/dd HH:mm:ss')} - ${det.format('yyyy/MM/dd HH:mm:ss')}`);
			// console.log(basic);
			if (ndt < det.getTime()) {
				// config.event_code = basic.event_code;
				for (let i = 0; i < modules.length; i++) {
					if (modules[i].hasOwnProperty('owner')
						&& modules[i].owner === "slot"
						&& modules[i].module_name === 'Service.CHANCE') {
						found = true;
						config.module_id = modules[i].module_id;
						config.event_code = modules[i].slot_code;
						console.log(`EID : ${config.event_code}`);
						console.log(`MID : ${config.module_id}`);

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
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			let sI = json.data.selfInteract;

			let fs = [];
			json.data.friends.forEach((fd, fi) => {
				if (fd.gameUser) {
					let f = {
						userID: fd.userID,
						userName: fd.userName,
						contactName: fd.contactName,
						giveMe: fd.foodInteract.giveMe,
						leftAskHe: fd.foodInteract.leftAskHe,
						leftGiveHe: fd.foodInteract.leftGiveHe,
						flag: true,
						flagAsk: true,
						flagGive: true,
						modifyTime: new Date().getTime(),
					};
					fs.push(f);
				}
			});

			config.friends = fs;

			console.log(`好友數 ${fs.length}/${json.data.totalFriends}`);
			console.log(`今日\t已贈送飼料 ${sI.give}/${sI.give + sI.leftGive} 次\t已收到飼料 ${sI.obtain}/${sI.obtain + sI.leftObtain} 次`);

			config.give = sI.give;
			config.leftGive = sI.leftGive;
			config.obtain = sI.obtain;
			config.leftObtain = sI.leftObtain;
			if (config.give === config.give + config.leftGive) {
				//found = false;
				console.log('今日贈送飼料已達上限。');
			}

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FO';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = sI.obtain;
				s.s = sI.leftObtain;
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
				s.c = sI.give;
				s.s = sI.leftGive;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.taskData = json.data;

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
								s.s = t.progress > tl.need ? 0 : tl.need - t.progress;
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
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData7(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			let r = json.data.reward;
			config.taskData.signedInDays++;
			let msg = `簽到 ${config.taskData.signedInDays} 天，今日領取 `;
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
					s.c = 0;
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
				s.c = 0;
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
				s.c = 0;
				s.s = r.currentCoins;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData8(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData9(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData20(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			let r = json.data.reward;
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
			else {
				console.log(r);
				msg += '待處 1:' + JSON.stringify(r);
			}
			console.log('✅' + msg);
			if (json.data.hasOwnProperty('lifeTask') && json.data.lifeTask) {
				console.log('待確認 lifeTask');
				console.log(json.data.lifeTask);

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
					s.c = 0;
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
				s.c = 0;
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
				s.c = 0;
				s.s = r.currentCoins;
				s.f = true;
				// s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌ 失敗！\n' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}

		return resolve(found);
	});
}
async function ProcData21(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;

			let fl = json.data.foodList;
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
					s.c = 0;
					s.s = ownedCNT;
					s.f = true;
					//s.r = msg;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }
			}
			else {
				console.log(json.data);
			}
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['!GET', '取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['!GET', '取得寵物村資訊', '2', 'https://games.shopee.tw/gameplatform/api/v5/game/activity/{activityId}/settings?appid={appid}', '', ['activityId', 'appid'], ProcData2],
['GET', '取得寵物資訊', '3', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData3],
['GET', '取得好友清單', '4', 'https://games.shopee.tw/api-gateway/pet/friend/list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData4],
['GET', '取得每日任務資訊', '5', 'https://games.shopee.tw/api-gateway/pet/task/daily_list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
['POST', '執行請求飼料', '6', 'https://games.shopee.tw/api-gateway/pet/interact/ask_food?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData0],
['!GET', '取得非好友清單', '7', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData0],
['!GET', '取得非好友資訊', '8', 'https://games.shopee.tw/api-gateway/pet/friend/home?activityCode={activityId}&eventCode={event_code}&skey=&friendID={friendID}', '', ['activityId', 'event_code', 'friendID'], ProcData0],
['!POST', '執行贈送飼料非好友', '9', 'https://games.shopee.tw/api-gateway/pet/interact/give_food?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData0],
['GET', '取得好友資訊', '10', 'https://games.shopee.tw/api-gateway/pet/friend/home?activityCode={activityId}&eventCode={event_code}&skey=&friendID={friendID}', '', ['activityId', 'event_code', 'friendID'], ProcData0],
['POST', '執行贈送飼料好友', '11', 'https://games.shopee.tw/api-gateway/pet/interact/give_food?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData0],
];
let DataPostBodyList = [, , , , , ,
	{ // 6
		"friendID": 0,
		"source": 1
	}, , , , ,
	{ // 11
		"friendID": 0,
		"source": 1
	}, , ,
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
	config.askGiveCount = 0;
	config.giveCount = 0;
	config.friendHome = 0;
}

let tasksList = [
	{ 'id': 'TD101', 'need': 2, 'name': '餵食寵物2次 75' },
	{ 'id': 'TD102', 'need': 99, 'name': '' },
	{ 'id': 'TD103', 'need': 1, 'name': '在學校聊天室發言1次 75' },
	{ 'id': 'TD104', 'need': 2, 'name': '在學校請求飼料2次 75' },
	{ 'id': 'TD105', 'need': 2, 'name': '在學校贈送他人飼料2次 75' },
	{ 'id': 'TD106', 'need': 99, 'name': '' },
	{ 'id': 'TD107', 'need': 99, 'name': '' },
	{ 'id': 'TD108', 'need': 1, 'name': '去學校上團體課 150' },
	{ 'id': 'TD109', 'need': 1, 'name': '瀏覽衣櫥頁面1次 75' },
	{ 'id': 'TD110', 'need': 2, 'name': '前往學校拜訪不同人家2次 75' },
	{ 'id': 'TD111', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 150' },
	{ 'id': 'TD112', 'need': 1, 'name': '在服裝抽抽樂抽1次 150' },
	{ 'id': 'TD113', 'need': 1, 'name': '在衣櫥直購任一造型1次 150' },
	{ 'id': 'TD114', 'need': 99, 'name': '' },
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
	{ 'id': 'TD128', 'need': 99, 'name': '' },
	{ 'id': 'TD129', 'need': 1, 'name': '蝦幣抽寵物1次 500' },
	{ 'id': 'TD130', 'need': 99, 'name': '' },
	{ 'id': 'TD131', 'need': 9, 'name': '' },
	{ 'id': 'TD132', 'need': 1, 'name': '蝦幣玩彈珠台1次 150' },
	{ 'id': 'TD201', 'need': 1, 'name': '完成新手導覽 100P' }, // No.1
	{ 'id': 'TD202', 'need': 1, 'name': '在學校請求飼料1次 100P' }, // No.3 // 104
	{ 'id': 'TD203', 'need': 99, 'name': '' },
	{ 'id': 'TD204', 'need': 1, 'name': '去學校玩課程遊戲1次 100P' }, // No. 4 // 120
	{ 'id': 'TD205', 'need': 1, 'name': '在學校聊天室發言1次 100P' }, // No. 5 // 103
	{ 'id': 'TD206', 'need': 1, 'name': '前往學校拜訪不同人家1次 100P' }, // No. 6 // 110
	{ 'id': 'TD207', 'need': 1, 'name': '升級家園主題 200P' }, // No. 7
	{ 'id': 'TD208', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 200P' }, // No. 8 // 111
	{ 'id': 'TD209', 'need': 1, 'name': '蝦幣玩猜拳1次 400P' }, // No. 9
	{ 'id': 'TD210', 'need': 1, 'name': '蝦幣抽寵物1次 500P' }, // No. 10
	{ 'id': 'TD211', 'need': 1, 'name': '提領蝦幣1次 300P' }, // No. 11
	{ 'id': 'TD212', 'need': 1, 'name': '在免費寵物扭蛋瀏覽推薦商品 30 秒 100P' }, // No.2
];
function checkTask(tID, tT = 1, ok = 0) {
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
const forMaxCount = 100;
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

			if (i === 6) {
				let found = false;
				if (checkTask(4, 1) || checkTask(2, 2)) {
					let f = {};
					if (config.friends.some((fd, fi) => {
						if (fd.flagAsk && fd.leftAskHe > 0) {
							config.friendID = fd.userID;
							config.taskType = fd.taskType;
							f = fd;
							fd.flagAsk = false;
							return true;
						}
					})) {
						item = config.askGiveCount + 1;
						found = true;
						console.log(`求飼料 : ${f.userID} (${f.userName}) (${f.contactName})`);
						DataPostBodyList[i].friendID = config.friendID;
						DataPostBodyList[i].taskType = config.taskType;
					}
				}
				if (!found) { i++; }
			}
			if (i === 7) {

			}
			if (i === 10) {
				let found = false;
				let found2 = false;
				if (checkTask(10, 1) || checkTask(6, 2)) { if (config.friendHome < 2) { found2 = true; } }

				if (!found2 && config.give === config.give + config.leftGive) {

				} else {
					let f = {};
					if (config.friends.some((fd, fi) => {
						if (fd.flagGive && fd.leftGiveHe > 0) {
							config.friendID = fd.userID;
							config.taskType = fd.taskType;
							config.f = fd;
							f = fd;
							fd.flagGive = false;
							return true;
						}
					})) {
						item = config.giveCount + 1;
						found = true;
						console.log(`拜訪 : ${config.f.userID} (${config.f.userName}) (${config.f.contactName})`);
						DataPostBodyList[i + 1].friendID = config.friendID;
						DataPostBodyList[i + 1].taskType = config.taskType;
					}
				}
				if (!found) { i++; }
			}
			if (i === 11) {
				if (config.give === config.give + config.leftGive) {
					flag = false; break;
				} else {
					runCount++;
					console.log(`贈送飼料 : ${config.f.userID} (${config.f.userName}) (${config.f.contactName})`);
				}
			}

			let dc = GetDataConfig(i);
			//console.log(`\n🌐 ${ dc.method } URL: ${ dc.url } \n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i === 6) {
				if (flag) { config.askGiveCount++; } else { flag = true; }
				if (config.askGiveCount >= 2) { }
				else { i--; }
			}
			if (i === 10) {
				if (flag) { config.friendHome++; } else { flag = true; i--; }
			}
			if (i === 11) {
				if (flag) { config.giveCount++; config.give++; } else { flag = true; }
				i = 9;
			}

			//if (i >= 6) { break; }

			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 30) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

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

