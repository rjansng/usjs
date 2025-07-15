// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '🎮遊戲玩過';
const title = '蝦皮拼拼樂 自動' + caption;
const version = 'v20241021'; // 20241001 start
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
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
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
			dc.url = dc.url.replace(`\{${p}\}`, config[p]);
		}
	}
	dc.dataRequest.url = dc.url;
	if (func != null && typeof (func) === 'function') { dc = func(dc); }
	return dc;
}
Date.prototype.format = function (format) {
	if (!(format)) format = 'yyyy/MM/dd';
	var o = {
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
	for (var k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length === 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
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
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
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
let task = {
	'taskFinishNum': 2,
	'isNewUserTask': false,
	'taskId': 0,
	'forceClaim': false,
};
let taskStatus = {};
async function ProcData1X1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			// console.log(obj.data);

			if (!found && obj.data.games) {
				for (let i = 0; i < obj.data.games.length; i++) {
					const g = obj.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/tilematch\/\?activity=([0-9a-f]{14,16})(&.+)?/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found && obj.data.no_chance_games) {
				for (let i = 0; i < obj.data.no_chance_games.length; i++) {
					const g = obj.data.no_chance_games[i];
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/tilematch\/\?activity=([0-9a-f]{14,16})(&.+)?$/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('目前沒有拼拼樂遊戲');
				console.log(obj.data);
			}
			else {
				taskStatus.item = 3;
				taskStatus.canReward = false;
			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {

		let found = false;
		let obj = JSON.parse(data);

		let tasks = obj.data.userTasks;
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i].length == 1) {
				//console.log(tasks[i])
				let ti = tasks[i][0].taskInfo;
				if (tasks[i][0].taskFinishStatus != 3) {
					//console.log(ti.Id + '\t' + ti.taskName);
					if (ti.taskName.includes('拼拼樂') && !ti.taskName.includes('蝦幣')) {
						console.log(`找到任務 ${ti.taskName} (${ti.Id})`);
						found = true;
						if (ti.taskName.includes('拼拼樂')) { taskStatus.item = 3; }
						taskStatus.name = ti.taskName;
						taskStatus.canReward = tasks[i][0].canReward;
						task.isNewUserTask = ti.isNewUserTask;
						task.taskId = ti.Id;
						task.taskFinishNum = tasks[i][0].taskFinishNum;
						let activityId = ti.ctaUrl.replace(/^.+\/tilematch\/\?activity=([0-9a-f]{16})(&.+)?/i, '$1');
						console.log('AID : ' + activityId);
						if (!activityId.match(/\/\//)) { config.activityId = activityId; }
						config.canReward = taskStatus.canReward;
						config.hasTileMatch = true;
						config.canTask = !taskStatus.canReward;
						break;
					}
				}
			}
		}
		if (found) {
			if (taskStatus.item === 2 && !taskStatus.canReward) {
				found = false;
				console.log(`請手動玩過 ${taskStatus.name}`);
			}
			else if (taskStatus.item === 3 && !taskStatus.canReward) {
			}
			if (found) {
				console.log(`${taskStatus.name} ${(taskStatus.canReward ? '領取水滴💧' : '執行玩過')}`);
			}
		}
		else {
			console.log(`已完成所有 ${caption} 任務`);
		}
		return resolve(found);
	});
}
async function ProcData1X2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		// console.log(obj);
		if (obj.code === 0) {
			let ut = obj.data.user_tasks;
			if (ut && ut.length > 0) {
				ut.forEach(t => {
					if (t.task.task_name.includes('拼拼樂')) { // 拼拼樂 未完成
						if (t.task_status != 3 && !t.can_reward) {
							console.log(t.task.task_name);
							config.hasTask = true;
							// config.canTask = true;
							found = true;
						}
						return true;
					}
				});
			}
			else {
				console.log('現在沒有任務。');
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

			if (obj.data.claimValue > 0) {
				found = true;
				console.log(`成功領取 ${obj.data.claimValue} 水滴💧`);

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'farm' + 's';
					let tsid = 'TG6';
					let tsidT = 'TS';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {}, sT = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					if (ts.hasOwnProperty(tsidT)) { sT = ts[tsidT]; } else { sT = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c++;
					s.f = s.c > 0;//&& s.s === 0;
					sT.c++;
					sT.r += `\n🔆${taskStatus.name}`;
					ts[tsid] = s;
					ts[tsidT] = sT;
					if (found) {
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					}
				} catch (e) { console.log(e); }

			}
			else {
				console.log(`領取 ${obj.data.claimValue} 水滴💧`);
				console.log(data);
				console.log(obj);
			}
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

			let found1 = false;
			let found2 = false;
			let basic = obj.data.curr_basic;
			let modules = obj.data.modules;
			let ndt = new Date().getTime();
			console.log(obj.data.activity.activity_name);
			// console.log(new Date(ndt).format('yyyy/MM/dd HH:mm:ss'));
			// console.log('');
			// console.log(new Date(basic.start_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
			// console.log(new Date(basic.end_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
			// console.log(basic);
			if (ndt < (basic.end_time * 1000)) {
				// console.log(obj.data.activity.activity_name);
				//config.event_code = basic.event_code;
				for (let i = 0; i < basic.slots.length; i++) {
					let slot = basic.slots[i];
					// console.log('');
					// console.log(slot.slot_name);
					// console.log(new Date(slot.start_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
					// console.log(new Date(slot.end_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
					if (slot.page_key === 'page_run_time'
						&& (slot.start_time * 1000) < ndt && (slot.end_time * 1000) > ndt) {
						found1 = true;
						console.log(slot.slot_name);
						config.slot_code = slot.slot_code;
						console.log(`SID : ${config.slot_code}`)
						break;
					}
				}
				for (let i = 0; i < modules.length; i++) {
					let module = modules[i];
					if (module.module_name === 'Service.NEW_RANK' && module.module_key === 'rank_global') {
						found2 = true;
						config.module_id = module.module_id;
						console.log(`MID : ${config.module_id}`)
						break;
					}
				}
				// console.log(`${found1},${found2}`);
				found = found1 && found2;
				if (!found) {
					console.log('找不到 Service.NEW_RANK');
					console.log(basic);
					console.log(modules);
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

async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0) {
			found = true;

			// console.log(obj.data);
			if ('map' in obj.data) {
				console.log(obj.data.map);
				console.log(obj.data.levelMode);
				config.map = obj.data.map;
				config.levelMode = obj.data.levelMode;
				// DataPostBodyList[7].map = obj.data.map;
				// DataPostBodyList[7].requestID = config.shopeeInfo.token.SPC_U + '_' + getToken();
				// DataPostBodyList[7].levelMode = obj.data.levelMode;
			}
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
		// console.log(data);
		let obj = JSON.parse(data);
		if (obj.code === 0) {

			found = true;
			// console.log(obj.data);
			try {
				if ('token' in obj.data) {
					config.token = obj.data.token;
					console.log(obj.data.token);
					// DataPostBodyList[8].token = obj.data.token;
					// DataPostBodyList[8].requestID = config.shopeeInfo.token.SPC_U + '_' + getToken();
				}
			} catch (e) {
				console.log(e);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = true;
		// console.log(data);
		var aaa = new RegExp(/[¤ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŠŸŒº¢]/g);
		var bbb = new RegExp(/{´\d´|¦/g);
		let o = data.split('{´1´|¦');
		if (o.length >= 4) {
			var aa1 = o[1].split('}')[0];
			var aa2 = o[2].split('}')[0];

			console.log(aa1);
			console.log(aa1.match(aaa).length / 2);
			console.log(aa1.match(bbb).length + 2);
			console.log('');
			console.log(aa2);
			console.log(aa2.match(aaa).length / 2);
			console.log(aa2.match(bbb).length + 2);

			config.ga1 = aa1.match(aaa).length / 2;
			config.ga2 = aa1.match(bbb).length + 2;
			config.gb1 = aa2.match(aaa).length / 2;
			config.gb2 = aa2.match(bbb).length + 2;
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
			if(obj.data.reward)
			{
				console.log(obj.data.reward);
			}
			else
			{
				console.log('獎利已領');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, obj.msg, data]);
		}
		return resolve(found);
	});
}
let UrlData = [[],
['GET', '01 取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1X1],
['GET', '01 取得💰我的蝦幣 任務清單', '2', 'https://games-dailycheckin.shopee.tw/mkt/coins/api/v2/tasks', '', , ProcData1X2],
['GET', '01 取得ℹ️任務資訊', '3', 'https://games.shopee.tw/farm/api/task/listV2?groceryEntryOn=true&withMicrosite=1', '', , ProcData1],
['POST', '02 領取水滴💧', '4', 'https://games.shopee.tw/farm/api/task/reward/claim', '', , ProcData2],
['GET', '03 取得拼拼樂資訊', '5', 'https://games.shopee.tw/gameplatform/api/v5/game/activity/{activityId}/settings?appid={appid}', '', ['appid', 'activityId'], ProcData3],
['GET', '04 取得拼拼樂主頁', '6', 'https://games.shopee.tw/api-gateway/tilematch_api/game/home?activityCode={activityId}&slotCode={slot_code}', '', ['activityId', 'slot_code'], ProcData4],
['POST', '05 開始玩拼拼樂', '7', 'https://games.shopee.tw/api-gateway/tilematch_api/game/play?activityCode={activityId}&slotCode={slot_code}', '', ['activityId', 'slot_code'], ProcData5],
// ['GET', '07 取己LEVEL資訊', '8', '{map}', '', ['map'], ProcData6],
// ['POST', '08 玩拼拼樂續關2', '9', 'https://games.shopee.tw/api-gateway/tilematch_api/game/winplay?activityCode={activityId}&slotCode={slot_code}', '', ['activityId', 'slot_code'], ProcData7],
// ['POST', '09 玩拼拼樂續關3', '10', 'https://games.shopee.tw/api-gateway/tilematch_api/game/winplay?activityCode={activityId}&slotCode={slot_code}', '', ['activityId', 'slot_code'], ProcData7],
];

let DataPostBodyList = [, , , , {}, , ,
	{
		"map": "https://games.deo.shopeemobile.com/shopee/mkt/games/file/6aaf242520d397f902c4bf542ed65d84/level21_level.json",
		"requestID": "681985929_1729121816743",
		"levelMode": 0
	}, ,
	{
		"token": "01JABV24KNJS9S9DCTVPJTKRBW",
		"info": {
			"propUse": {
				"undo": 0,
				"shuffle": 0,
				"magnet": 0,
				"revive": 0,
				"extraSlot": 0,
				"remove": 0
			},
			"targetTiles": 18,
			"level": 1,
			"clearTiles": 18,
			"tilesType": 3,
			"moveTiles": 18
		},
		"requestID": "681985929_1729121827228"
	},
	{
		"token": "01JABV24KNJS9S9DCTVPJTKRBW",
		"info": {
			"propUse": {
				"undo": 0,
				"shuffle": 0,
				"magnet": 0,
				"revive": 0,
				"extraSlot": 0,
				"remove": 0
			},
			"targetTiles": 18,
			"level": 2,
			"clearTiles": 18,
			"tilesType": 3,
			"moveTiles": 18
		},
		"requestID": "681985929_1729121827228"
	}

];
// {
// 	"user_avatar": "",
// 	"prop_img": "tw-11134001-22120-vsqgouvsxdlv7f",
// 	"chance_module_id": 42489,
// 	"transaction_id": "16764244768280.5079947208830323",
// 	"box_type": 1,
// 	"next_refresh_time": 1676476800000,
// 	"item_id": "AAAAAAAAAAAAAAAAAAAAAFj3Msggu/WfWTK7NnbYBBfvsaO8oheewHgBQJIWqZZPxoXUaV0dzuupIDE15aYeIw==",
// 	"exp_group_id": 24003
// }

function preInit() {
	config.appid = 'kRFxgyO375Zyt3wjez';
	config.activityId = ''; // f18c7c0e1da7e401
	config.slot_code = '7eab27d10356b0b2';
	config.event_id = '7eab27d10356b0b2';
	config.module_id = 42489;
	config.group_id = 24003;
	config.transaction_id = getToken() + "." + getRnd();
	config.canReward = false;
	config.hasTileMatch = false;
	config.hasTask = false;
	config.token = '';
	// config.ldc_id = 190309;
	// let DTn = new Date();
	// let DTL = new Date(DTn.getFullYear(), DTn.getMonth(), DTn.getDate() + 1).getTime();
	// config.next_refresh_time = 0;
	// config.item_id = "AAAAAAAAAAAAAAAAAAAAAFj3Msggu/WfWTK7NnbYBBfvsaO8oheewHgBQJIWqZZPxoXUaV0dzuupIDE15aYeIw==";
}
// [¤ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŠŸŒº¢]
const forMaxCount = 15;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		needLastNotify = false;
		let flag = true;
		let runCount = 0;
		let item = -1;
		// config.hasTask = true;
		// var ddd = '|{¨width¨Ñ¨height¨Ñ¨levelId¨¤Q¨levelKey¨Ê¨blockTypeData¨{´1´Ë´2´Ë¨15¨Ë}¨levelData¨{´1´|¦¨colNum¨¨rowNum¨‡¤G¤G¤S¤G¤e¤G¤G¤W¤S¤W¤e¤W¤G¤m¤S¤m¤e¤m—÷´2´|¦ß7ß8‡¤G¤K¤S¤K¤e¤K¤G¤a¤S¤a¤e¤a¤G¤q¤S¤q¤e¤q—÷}}{ß0Ñß1Ñß2¤Qß3Ëß4{´0´Ì´1´Ì´2´Ë´3´Ë´4´Ë´5´Ë}ß6{´1´|¦ß7ß8‡ÑÑ¤GÑÑ¤G¤G¤G¤eÑ¤mÑ¤e¤G¤m¤GÑ¤m¤G¤mÑ¤u¤G¤u¤e¤m¤m¤m¤e¤u¤m¤u—÷´2´|¦ß7ß8‡¤C¤K¤K¤C¤K¤K¤a¤C¤a¤K¤i¤K¤K¤i¤C¤i¤K¤q¤a¤i¤i¤i¤a¤q—÷´3´|¦ß7ß8‡¤O¤e¤O¤W¤O¤O¤W¤O¤W¤W¤W¤e—÷´4´|¦ß7ß8‡¤K¤S¤K¤a¤a¤S¤a¤a—÷´5´|¦ß7ß8‡¤G¤W¤O¤W¤W¤W¤e¤W—÷}}{ß0Ñß1¤Aß2¤Qß3Ìß4{´0´Î´1´Î´2´Î´3´Î´4´Î´5´Ï´6´Î´7´Î´8´Î´9´Î¨11¨Î¨12¨Î¨13¨Î¨14¨Îß5Î}ß6{´1´|¦ß7¨DDType¨ß8‡¤OÊ¤G¤WÊ¤G¤SÊ¤O¤SÊ¤W¤CÊ¤WÍÊ¤e¤iÊ¤W¤qÊ¤e—{ß8¤yß7Ñ}{ß8¢16ß7Ñ}{ß8¤yß7¤G}{ß8º0ß7¤G}{ß8¤yß7¤m}{ß8º0ß7¤m}{ß8¤yß7¤e}{ß8º0ß7¤e}÷´2´|¦ß7ßDß8‡¤SÊ¤K¤SÊ¤SÑÊ¤a¤mÊ¤a—{ß8¤yß7Í}{ß8¤yß7¤C}{ß8¢12ß7¤K}{ß8º0ß7Í}{ß8º0ß7¤C}{ß8¤yß7¤q}{ß8¤yß7¤i}{ß8º1ß7¤a}{ß8º0ß7¤q}{ß8º0ß7¤i}{ß8Ñß7Ï¨moldType¨Ë}{ß8Ñß7¤oßEË}÷´3´|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤eÑº1¤Gº0¤G¤y¤mº1¤eº0¤e¤y—{ß8Ñß7ÐßEË}{ß8Ñß7¤nßEË}÷´4´|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—{ß8Ñß7ÑßEË}{ß8Ñß7¤mßEË}÷´5´|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—{ß8Ñß7ÒßEË}{ß8Ñß7¤lßEË}÷´6´|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—{ß8Ñß7¤AßEË}{ß8Ñß7¤kßEË}÷´7´|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—{ß8Ñß7¤BßEË}{ß8Ñß7¤jßEË}÷´8´|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—{ß8Ñß7¤CßEË}{ß8Ñß7¤ißEË}÷´9´|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—{ß8Ñß7¤DßEË}{ß8Ñß7¤hßEË}÷¨10¨|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—{ß8Ñß7¤EßEË}{ß8Ñß7¤gßEË}÷ß9|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—{ß8Ñß7¤FßEË}{ß8Ñß7¤fßEË}÷ßA|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—÷ßB|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—÷ßC|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—÷ß5|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—÷¨16¨|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—÷¨17¨|¦ß7ß8‡¤O¤G¤W¤G¤S¤O¤S¤W¤C¤WÍ¤e¤i¤W¤q¤e—÷¨18¨|¦ß7ß8‡¤S¤K¤S¤SÑ¤a¤m¤a—÷¨19¨|¦ß7ß8‡¤S¤O¤O¤G¤C¤WÍ¤WÍ¤e¤C¤e¤S¤a¤W¤G¤i¤W¤q¤W¤q¤e¤i¤e—÷¨20¨|¦ß7ß8‡¤S¤e¤S¤WÍ¤aÍ¤i¤O¤O¤C¤a¤C¤i¤S¤CÍ¤S¤q¤a¤q¤i¤W¤O¤i¤a¤i¤i¤q¤S—÷¨21¨|¦ß7ß8‡¤K¤S¤S¤K¤O¤a¤S¤iÑ¤WÑ¤O¤G¤mÑ¤eÑ¤m¤O¤C¤S¤S¤a¤S¤W¤a¤m¤W¤m¤O¤e¤m¤m¤e¤m¤m¤W¤C—÷¨22¨|¦ß7ß8‡¤C¤iÍ¤q¤C¤qÍ¤iÍ¤S¤C¤K¤C¤SÍ¤K¤S¤G¤S¤O¤S¤W¤O¤e¤S¤m¤K¤W¤K¤q¤OÑ¤C¤a¤i¤i¤q¤q¤i¤q¤q¤i¤q¤S¤i¤K¤i¤S¤q¤K¤W¤e¤a¤W¤a¤q¤WÑ¤i¤a—÷}¨isGen¨Ê¨levelType¨¨normal¨}÷';
		// await ProcData6(ddd);
		// flag = false;
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			if (i == 3) {
				console.log('');
				// if (runCount > 2) { await delay(3.0); }
			}
			runCount++;
			let func = null;
			item = -1;
			if (i === 2) {
				if (!config.canTask) {

				} else { i++ }
			}
			if (i === 3) {
				taskStatus = { 'item': 0, 'name': '', 'canReward': false };
			}
			if (i === 4) {
				DataPostBodyList[i] = task;
				if (config.hasTileMatch && !taskStatus.canReward || config.hasTask
					|| config.canTask && !config.hasTileMatch
				) { i++; }
				//if (taskStatus.item > 2 && !taskStatus.canReward) { i = taskStatus.item; }
			}
			if (i === 7) {
				DataPostBodyList[i].map = config.map;
				DataPostBodyList[i].requestID = config.shopeeInfo.token.SPC_U + '_' + getToken();
				DataPostBodyList[i].levelMode = config.levelMode;
			}
			if (i === 9) {
				await delay(5.0);
				DataPostBodyList[i].token = config.token;
				DataPostBodyList[i].requestID = config.shopeeInfo.token.SPC_U + '_' + getToken();
				DataPostBodyList[i].info.targetTiles = config.ga1;
				DataPostBodyList[i].info.clearTiles = config.ga1;
				DataPostBodyList[i].info.moveTiles = config.ga1;
				DataPostBodyList[i].info.tilesType = config.ga2;
			}
			if (i === 10) {
				await delay(10.0);
				DataPostBodyList[i].token = config.token;
				DataPostBodyList[i].requestID = config.shopeeInfo.token.SPC_U + '_' + getToken();
				DataPostBodyList[i].info.targetTiles = config.gb1;
				DataPostBodyList[i].info.clearTiles = config.gb1;
				DataPostBodyList[i].info.moveTiles = config.gb1;
				DataPostBodyList[i].info.tilesType = config.gb2;
			}


			let dc = GetDataConfig(i, null, null, null, null, func);
			// console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			//if (i >= 10) break;
			// 2 領完水後 及  i=? 玩過後 需 要重新取任務
			if (!flag && i === 2) { flag = true; }
			if (flag && (i === 4)) { i = 1; config.canTask = false; }
			if (!flag && i == 3 && config.hasTask) { flag = true; }
			if (runCount >= forMaxCount) { break; }
			if (runCount > 15) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
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

