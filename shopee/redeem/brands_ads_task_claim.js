// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '推薦商店水滴';
const title = '🍤 蝦蝦果園' + caption;
const version = 'v20230427';
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
function generateUUID(e = 32) {
	var t = "0123456789ABCDEF",
		a = t.length,
		n = "";
	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n;
}

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
		//console.log(json.data);
		if (json.code === 0) {
			let tasks = [];
			if (json.data.userTasks) {
				json.data.userTasks.forEach((ct, cti) => {
					console.log(`${cti + 1} : ${ct.taskInfo.taskName}\t${ct.taskFinishStatus}\t${ct.canReward}`)
					if (ct.taskFinishStatus != 3) {
						let ctt = ct.taskInfo;
						let j = JSON.parse(ctt.assetsConfig);
						let t = {
							id: ctt.Id,
							name: ctt.taskName,
							module_id: ctt.moduleId,
							task_code: '',
							type: 0,
							prize_url: '',
							isReward: false,
							can_reward: ct.canReward,
							completion_time: 10,
						};
						//console.log(j);
						if (ctt.ctaKey === '-' && j.hasOwnProperty('prize_url')) {
							t.type = 1;
							t.prize_url = j.prize_url;
							t.isReward = true;
							t.task_code = decodeURIComponent(ctt.ctaUrl).replace(/^https:\/\/shopee\..+entryPoint=.+taskId=([^\=\&]+)\&moduleId.+/ig, '$1');
							t.completion_time = j.completion_time;
						}
						else {
							console.log(ct);
						}
						//console.log(t);
						tasks.push(t);
					}
				});
			}
			if (json.data.shopAdsTask) {
				json.data.shopAdsTask.forEach((ct, cti) => {
					console.log(`${cti + 1} : ${ct.taskInfo.taskName}\t${ct.taskFinishStatus}\t${ct.canReward}`)
					if (ct.taskFinishStatus != 3) {
						let ctt = ct.taskInfo;
						let j = JSON.parse(ctt.assetsConfig);
						let t = {
							id: ctt.Id,
							name: ctt.taskName,
							module_id: ctt.moduleId,
							task_code: '',
							type: 0,
							prize_url: '',
							isReward: false,
							can_reward: ct.canReward,
							completion_time: 10,
						};
						//console.log(j);
						if (ctt.ctaKey === '-' && j.hasOwnProperty('prize_url')) {
							t.type = 1;
							t.prize_url = j.prize_url;
							t.isReward = true;
							t.task_code = decodeURIComponent(ctt.ctaUrl).replace(/^https:\/\/shopee\..+entryPoint=.+taskId=([^\=\&]+)\&moduleId.+/ig, '$1');
							t.completion_time = j.completion_time;
						}
						else {
							console.log(ct);
						}
						//console.log(t);
						tasks.push(t);
					}
				});
			}

			// console.log(tasks);
			config.tasks = tasks;
			if (tasks.length > 0) {
				found = true;

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'farm' + 's';
					let tsid = 'B';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks2 = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks2.hasOwnProperty(tsn)) { ts = tasks2[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					if (s.s === 0) { s.s = tasks.length; }
					//if (s.s === 0 && s.c === 0) { s.f = true; }
					ts[tsid] = s;
					tasks2[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks2), dataName);
				} catch (e) { console.log(e); }

			}
			else {

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'farm' + 's';
					let tsid = 'B';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks2 = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks2.hasOwnProperty(tsn)) { ts = tasks2[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.f = true;
					ts[tsid] = s;
					tasks2[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks2), dataName);
				} catch (e) { console.log(e); }

				console.log('今日無水滴可領。');
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
			//console.log('讀取成功。');
			config.report_token = json.data.report_token;
			console.log(`report_token length: ${config.report_token.length}`);
			found = true;
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
			// console.log(json.data);
			if (json.data.user_task.can_reward) {
				//console.log('確認成功。');
				found = true;
			}
			else if (!json.data.user_task.can_reward && json.data.user_task.task_finish_status === 3) {
				console.log('已領過。');
			}
			else {
				console.log('確認失敗。');
			}
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
			//console.log('領取成功。');
			console.log(`成功領取 ${json.data.claimValue} 水滴。`);
			found = true;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'B';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				if (s.s > 0) { s.s--; }
				s.f = s.c > 0 && s.s === 0;
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
// https://games.shopee.tw/gameplatform/api/v3/task/browse/064970e4f2b47acf?module_id=404
// https://games.shopee.tw/gameplatform/api/v3/task/browse/619d702578c5e0ed?module_id=404
let UrlData = [[],
['GET', '01 取得任務資訊', '取得', 'https://games.shopee.tw/farm/api/brands_ads/task/list?platformType=2', '', ['activityId'], ProcData1],
['GET', '02 取得瀏覽任務 Token', '獲得', 'https://games.shopee.tw/gameplatform/api/v3/task/browse/{task_code}?module_id={task_module_id}', '', ['task_code', 'task_module_id'], ProcData2],
['POST', '03 送出瀏覽任務 Token', '獲得', 'https://games.shopee.tw/gameplatform/api/v3/task/component/report', '', , ProcData3],
['POST', '04 取得瀏覽任務水滴', '獲得', 'https://games.shopee.tw/farm/api/brands_ads/task/claim', '', , ProcData4],
];
let DataPostBodyList = [, , ,
	{ 'report_token': '' },
	{
		"module_id": "254",
		"request_id": "",
		"task_id": 4893
	},
];
function preInit() {
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.userName = config.shopeeInfo.userName;
	config.appid = 'kElMuSeTL3DTooG2N3'; // 特蒐任務
	config.activityId = '90fae3ef39f18c47';
	config.event_code = '93303d295f9f1510';
	config.slot_code = '73d2efd5ecd29c1d';
	config.module_id = 42948;
	config.item_id = '';
	config.redeem_token = '';
	config.store_id = 650;
	config.hasChance = false;
	config.report_token = '';
	config.procItem = -1;
}

const forMaxCount = 30;
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
			if (i === 2) {
				runCount++;
				config.can_reward = false;
				if (config.tasks.some(t => {
					if (t.type === 1 && t.isReward) {
						config.task_code = t.task_code;
						config.can_reward = t.can_reward;
						config.task_module_id = t.module_id;
						config.completion_time = t.completion_time;
						console.log(`\n\n任務 : ${t.name}`);
						console.log(`TID : ${config.task_code}`);
						//DataPostBodyList[i + 2].task_id = t.id;
						DataPostBodyList[i + 2].task_id = t.id;
						DataPostBodyList[i + 2].module_id = `${t.module_id}`;
						DataPostBodyList[i + 2].request_id = `__game_platform_task__${getRnd(13)}_${config.SPC_U}_${getRnd(13)}`;
						t.isReward = false;
						//console.log(DataPostBodyList[i + 2]);
						return true;
					}
				})) {
					if (config.procItem != -1) { item = config.procItem == -1 ? 1 : config.procItem + 1; }
					if (config.can_reward) { i = 4; }
				}
				else {
					i = 4;
					flag = false;
				}
			}
			else if (i === 3) {
				item = config.procItem;
				DataPostBodyList[i].report_token = config.report_token;
				//console.log(config.completion_time);
				//await delay(3.0);
				await delay(1.0 * config.completion_time);
			}
			else if (i === 4) {
				item = config.procItem;
			}
			let dc = !flag ? null : GetDataConfig(i);
			//console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			//if (i === 5) { console.log(dc.dataRequest); }
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			config.procItem = item;
			//console.log(`${i} : ${flag}`);
			if (flag && i === 4) { i = 1; }
			if (!flag && i === 4) { i = 0; flag = true; }
			if (runCount >= forMaxCount) { break; }
			if (runCount > 20) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
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

