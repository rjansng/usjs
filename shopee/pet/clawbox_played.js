// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '🎮遊戲玩過';
const title = '蝦皮夾夾樂 自動' + caption;
const version = 'v20240220';
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
		let json = JSON.parse(data);
		if (json.code === 0) {
			if (!found && json.data.games) {
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/claw\/\?activity=([0-9a-f]{16})(&.+)?/i, '$1');
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
						config.activityId = g.link_url.replace(/^.+\/claw\/\?activity=([0-9a-f]{16})(&.+)?$/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('目前沒有夾夾樂遊戲');
				console.log(json.data);
			}
			else {
				taskStatus.item = 3;
				taskStatus.canReward = false;
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {

		let found = false;
		let json = JSON.parse(data);

		let tasks = json.data.userTasks;
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i].length == 1) {
				//console.log(tasks[i])
				let ti = tasks[i][0].taskInfo;
				if (tasks[i][0].taskFinishStatus != 3) {
					//console.log(ti.Id + '\t' + ti.taskName);
					if (ti.taskName.includes('夾夾樂') && !ti.taskName.includes('蝦幣')) {
						console.log(`找到任務 ${ti.taskName} (${ti.Id})`);
						found = true;
						if (ti.taskName.includes('夾夾樂')) { taskStatus.item = 3; }
						taskStatus.name = ti.taskName;
						taskStatus.canReward = tasks[i][0].canReward;
						task.isNewUserTask = ti.isNewUserTask;
						task.taskId = ti.Id;
						task.taskFinishNum = tasks[i][0].taskFinishNum;
						let activityId = ti.ctaUrl.replace(/^.+\/claw\/\?activity=([0-9a-f]{16})(&.+)?/i, '$1');
						console.log('AID : ' + activityId);
						if (!activityId.match(/\/\//)) { config.activityId = activityId; }
						config.canReward = taskStatus.canReward;
						config.hasClawBox = true;
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
		let json = JSON.parse(data);
		// console.log(json);
		if (json.code === 0) {
			let ut = json.data.user_tasks;
			if (ut && ut.length > 0) {
				ut.forEach(t => {
					if (t.task.task_name.includes('夾夾樂')) { // 夾夾樂 未完成
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

			if (json.data.claimValue > 0) {
				found = true;
				console.log(`成功領取 ${json.data.claimValue} 水滴💧`);

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'farm' + 's';
					let tsid = 'TG2';
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
				console.log(`領取 ${json.data.claimValue} 水滴💧`);
				console.log(data);
				console.log(json);
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

			let found1 = false;
			let found2 = false;
			let basic = json.data.curr_basic;
			let modules = json.data.modules;
			let ndt = new Date().getTime();
			console.log(json.data.activity.activity_name);
			// console.log(new Date(ndt).format('yyyy/MM/dd HH:mm:ss'));
			// console.log('');
			// console.log(new Date(basic.start_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
			// console.log(new Date(basic.end_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
			// console.log(basic);
			if (ndt < (basic.end_time * 1000)) {
				// console.log(json.data.activity.activity_name);
				//config.event_code = basic.event_code;
				for (let i = 0; i < basic.slots.length; i++) {
					let slot = basic.slots[i];
					// console.log('');
					// console.log(slot.slot_name);
					// console.log(new Date(slot.start_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
					// console.log(new Date(slot.end_time * 1000).format('yyyy/MM/dd HH:mm:ss'));
					if (slot.page_key === 'page_slot'
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
					if (module.module_name === 'Service.CHANCE' && module.module_key === 'chance_free') {
						found2 = true;
						config.module_id = module.module_id;
						console.log(`MID : ${config.module_id}`)
						break;
					}
				}
				// console.log(`${found1},${found2}`);
				found = found1 && found2;
				if (!found) {
					console.log('找不到 Service.CHANCE');
					console.log(basic);
					console.log(modules);
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
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;

			try {
				let free = json.data.game_detail.free;
				for (let i = 0; i < free.new_luckydraw_prop.length; i++) {
					const prop = free.new_luckydraw_prop[i];
					config.ldc_id = prop.ldc_id;
					console.log(`ldc_id : ${config.ldc_id}`)
					config.image = free.extra_chance_prop.image[0].image;
					console.log(`image : ${config.image}`)
					// console.log(free.extra_chance_prop.max_prop);
					// console.log(free.extra_chance_prop.prize_prop_name);
					//console.log(free.extra_chance_prop.image[0].image);
					//console.log(free.extra_chance_prop);
					console.log('這裡還要再觀查 POST Start request.body');
					break;
				}
			} catch (e) {
				console.log(e);
			}
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
			try {
				config.group_id = json.data.experiment_configs[0].group_id;
				console.log(`group_id : ${config.group_id}`)
			} catch (e) {
				console.log(e);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {

			found = true;
			//console.log(json.data.instance_id);
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

			let cc = json.data.total_balance;
			if (cc > 0) {
				found = true;
				console.log(`還可執行 ${cc} 次`);
			}
			else {
				console.log('今天已玩過。');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
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
			config.next_refresh_time = json.data.next_refresh_time;
			console.log(`next_refresh_time : ${config.next_refresh_time}`)
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData9(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {


			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'clawbox' + 's';
				let tsid = 'B';
				let tsidC = 'C';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, sC = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (ts.hasOwnProperty(tsidC)) { sC = ts[tsidC]; } else { sC = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				sC.c++;
				if (sC.s > 0) { sC.s--; }
				s.f = s.c > 0;
				sC.f = sC.c > 0 && sC.s === 0;
				ts[tsid] = s;
				ts[tsidC] = sC;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			found = true;
			console.log(json.data);
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData10(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		found = true;
		// console.log(json.data);
		if (json.code === 0) {

			// found = true;
			// console.log(json.data);
		}
		else {
			console.log(`!! ${dc.content}失敗`);
			console.log(`失敗也算玩過，會扣次數。`);
			// return reject([`執行失敗 ‼️`, json, data]);
		}
		return resolve(found);
	});
}
async function ProcData11(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		found = true;
		try {
			if (json.code === 0) {

				if (json.data.incr_share > 0) {
					console.log(`獲得 ${json.data.incr_share} 次`);

					try {
						let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						let tsn = 'clawbox' + 's';
						let tsid = 'A';
						let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						let tasks = JSON.parse(rs);
						let ts = {}, s = {};
						if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						s.c++;
						s.f = s.c > 0;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					} catch (e) { console.log(e); }

				}
				else {
					console.log(`今天已分享過`);
				}
			}
			else {
				console.log(`執行失敗 ‼️` + json.msg + '\n' + data);
				// return reject([`執行失敗 ‼️`, json.msg, data]);
			}
		} catch (e) { console.log(e); }
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '01 取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1X1],
['GET', '01 取得💰我的蝦幣 任務清單', '2', 'https://games-dailycheckin.shopee.tw/mkt/coins/api/v2/tasks', '', , ProcData1X2],
['GET', '01 取得ℹ️任務資訊', '3', 'https://games.shopee.tw/farm/api/task/listV2?groceryEntryOn=true&withMicrosite=1', '', , ProcData1],
// 取得 taskInfo.ctaUrl activity
['POST', '02 領取水滴💧', '4', 'https://games.shopee.tw/farm/api/task/reward/claim', '', , ProcData2],
['GET', '03 取得夾夾樂資訊', '5', 'https://games.shopee.tw/gameplatform/api/v5/game/activity/{activityId}/settings?appid={appid}', '', ['appid', 'activityId'], ProcData3],
// get modules.module_id 42489    curr_basic.page_key=page_slot , slot_code   start_time  end_time *1000  7eab27d10356b0b2 > slot_code event_id
// ['GET', '登入狀態', '登入', 'https://shopee.tw/api/v2/user/login_status', '', , ProcData3],
['GET', '04 取得夾夾樂明細', '6', 'https://games.shopee.tw/gameplatform/api/v1/game/detailinfo/event/{event_id}?appid={appid}', '', ['appid', 'event_id'], ProcData4],
//get data.game_detail.free.new_luckydraw_prop[0].ldc_id  190309
['GET', '05 取得物品清單', '取得', 'https://games.shopee.tw/api-gateway/claw/get/config/dynamic?keys=claw.min.compat.bundle.version&scene_keys=claw_machine_redirect_test', '', , ProcData5],
// get group_id 24003
['GET', '06 取得獎勵資訊', '取得', 'https://games.shopee.tw/gameplatform/api/v2/goluckydraw/prize/config/module/{ldc_id}?appid={appid}', '', ['appid', 'ldc_id'], ProcData6],
// 190309 get ?
['POST', '07 分享夾夾樂取得 1 次', '執行', 'https://games.shopee.tw/gameplatform/api/v2/chance/share/{module_id}?appid={appid}', '', ['appid', 'module_id'], ProcData11],
['GET', '08 取得可執行的次數', '取得', 'https://games.shopee.tw/gameplatform/api/v2/chance/query/{module_id}?appid={appid}', '', ['appid', 'module_id'], ProcData7],
['GET', '09 取得機台物品', '取得', 'https://games.shopee.tw/api-gateway/claw/get/mybox/activity/{activityId}/slot/{slot_code}?box_type=1', '', ['activityId', 'slot_code'], ProcData8],
['POST', '10 準備夾物品', '執行', 'https://games.shopee.tw/api-gateway/claw/v2/start/grab/activity/{activityId}/slot/{slot_code}', '', ['activityId', 'slot_code'], ProcData9],
['POST', '11 夾到的物品 (送出沒有夾到物品)', '執行', 'https://games.shopee.tw/api-gateway/claw/v2/grab/box/activity/{activityId}/slot/{slot_code}', '', ['activityId', 'slot_code'], ProcData10],
];

let DataPostBodyList = [, , , , {}, , , , , {}, , ,
	{
		"next_refresh_time": 0,
		"box_type": 1,
		"transaction_id": "",
		"chance_module_id": 0
	},
	{
		"user_avatar": "",
		"chance_module_id": 42173,
		"transaction_id": "",
		"box_type": 1,
		"next_refresh_time": 0,
		"item_id": "",
		"exp_group_id": 24003,
	},
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
	config.appid = '72tphGRI5Gy8qLGJqW';
	config.activityId = ''; // 0819b314f5ce9ef7
	config.slot_code = '7eab27d10356b0b2';
	config.event_id = '7eab27d10356b0b2';
	config.module_id = 42489;
	config.group_id = 24003;
	config.transaction_id = getToken() + "." + getRnd();
	config.canReward = false;
	config.hasClawBox = false;
	config.hasTask = false;
	// config.ldc_id = 190309;
	// let DTn = new Date();
	// let DTL = new Date(DTn.getFullYear(), DTn.getMonth(), DTn.getDate() + 1).getTime();
	// config.next_refresh_time = 0;
	// config.item_id = "AAAAAAAAAAAAAAAAAAAAAFj3Msggu/WfWTK7NnbYBBfvsaO8oheewHgBQJIWqZZPxoXUaV0dzuupIDE15aYeIw==";
}

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
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			if (i == 3) {
				console.log('');
				if (runCount > 2) { await delay(3.0); }
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
				if (config.hasClawBox && !taskStatus.canReward || config.hasTask
					|| config.canTask && !config.hasClawBox
				) { i++; }
				//if (taskStatus.item > 2 && !taskStatus.canReward) { i = taskStatus.item; }
			}
			if (i === 12) {
				DataPostBodyList[i].next_refresh_time = config.next_refresh_time;
				DataPostBodyList[i].transaction_id = config.transaction_id;
				DataPostBodyList[i].chance_module_id = config.module_id;
				DataPostBodyList[i + 1].next_refresh_time = config.next_refresh_time;
				DataPostBodyList[i + 1].transaction_id = config.transaction_id;
				DataPostBodyList[i + 1].chance_module_id = config.module_id;
				DataPostBodyList[i + 1].exp_group_id = config.group_id;
				//DataPostBodyList[10].prop_img = config.image;
				//DataPostBodyList[10].item_id = config.item_id;

			}
			//if (i === 6) { DataPostBodyList[i].request_id = getRnd(); }
			//if (i >= 3) { item = runCount; }
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
			if (flag && (i === 4 || i === 13)) { i = 1; config.canTask = false; }
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

