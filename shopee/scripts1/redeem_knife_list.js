const caption = '顯示兌換清單';
const title = '蝦蝦飛刀 ' + caption;
const version = 'v20230325';
let showNotification = true;
let showLog = true;
let showInfo = true;
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
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			if (showInfo) console.log(msg);
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
			if (showInfo) console.log(msg);
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
		const shopeeInfo = getSaveObject('ShopeeInfo');
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
			// console.log(`⭕️ 執行成功 💯`);
			let msg = '';
			if (!found && json.data.games) {
				msg += '\n\n\t--- Game ---';
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					msg += `\n\nAppName: ${g.app_name}`;
					msg += `\nName: ${JSON.parse(g.custom_setting).user_side_name}`;
					msg += `\nAppID: ${g.app_id}\nLinkUrl: ${g.link_url}`;
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/knifethrow\/\?event=([0-9a-f]+)$/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found && json.data.no_chance_games) {
				msg += '\n\n\t--- No Chance Game ---';
				for (let i = 0; i < json.data.no_chance_games.length; i++) {
					const g = json.data.no_chance_games[i];
					msg += `\n\nAppName: ${g.app_name}`;
					msg += `\nName: ${JSON.parse(g.custom_setting).user_side_name}`;
					msg += `\nAppID: ${g.app_id}\nLinkUrl: ${g.link_url}`;
					if (g.app_id === config.appid) {
						found = true;
						config.activityId = g.link_url.replace(/^.+\/knifethrow\/\?event=([0-9a-f]+)$/i, '$1');
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('目前沒有蝦蝦飛刀遊戲');
				console.log(msg);
				//console.log(json.data);
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
			// console.log(`⭕️ 執行成功 💯`);
			// let activity = json.data.activity;
			let basic = json.data.basic;
			let modules = json.data.modules;
			let ndt = new Date().getTime();
			let dbt = new Date(basic.begin_time * 1000);
			let det = new Date(basic.end_time * 1000);
			config.knifethrowInfo.activityId = config.activityId;
			config.knifethrowInfo.begin_time = basic.begin_time * 1000;
			config.knifethrowInfo.end_time = basic.end_time * 1000;
			config.knifethrowInfo.game_name = basic.game_name;
			config.knifethrowInfo.slot_name = basic.slot_name;
			console.log(`名稱G : ${basic.game_name}`);
			console.log(`名稱S : ${basic.slot_name}`);
			// console.log(`DateTime : ${dbt.format('yyyy/MM/dd HH:mm:ss')} - ${det.format('yyyy/MM/dd HH:mm:ss')}`);
			// console.log(basic);
			if (ndt < det.getTime()) {
				config.event_code = basic.event_code;
				config.slot = config.event_code;
				config.knifethrowInfo.event_code = basic.event_code;
				config.knifethrowInfo.slot = basic.event_code;
				console.log(`EID : ${config.event_code}`);
				for (let i = 0; i < modules.length; i++) {
					if (modules[i].owner === "slot" && modules[i].module_name === 'Service.CHANCE') {
						found = true;
						config.module_id = modules[i].module_id;
						console.log(`MID : ${config.module_id}`);
						config.knifethrowInfo.module_id = config.module_id;
					}
					else if (modules[i].owner === "activity" && modules[i].module_name === 'Service.REDEEM_STORE') {
						found = true;
						config.store_id = modules[i].module_id;
						console.log(`SID : ${config.store_id}`);
						config.knifethrowInfo.store_id = config.store_id;
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
		// console.log(`⭕️ 執行成功 💯`);
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.redeem_token = json.data.redeem_token;
			console.log(`現有點數 : ${json.data.remain_score}`);
		}
		else {
			return reject([`執行失敗 ‼️`, json.data, data]);
		}
		return resolve(found);
	});
}
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let found2 = false;
		let json = JSON.parse(data);
		// console.log(`⭕️ 執行成功 💯`);
		let item_list = json.data.item_list;
		for (let i = 0; i < item_list.length; i++) {
			if (item_list[i].item_type != 1) // 3 100%現拆購物金; 6 XX寶箱  4 蝦幣
			{
				console.log(`\n${item_list[i].name} (${item_list[i].id}) (${item_list[i].item_type})`);
				console.log(`${new Date(item_list[i].display_start_time * 1000).format('2')} - ${new Date(item_list[i].display_end_time * 1000).format('2')}`);
				if (item_list[i].item_type === 4) {
					console.log(`數量 : ${item_list[i].left_amount}/${item_list[i].total_amount}\t點數 : ${item_list[i].points_to_redeem}\t可兌 : ${item_list[i].redeemed_times}/${item_list[i].redeem_limit}`);
				}
				else {
					console.log(`數量 : ${item_list[i].left_amount}/${item_list[i].total_amount}\t點數 : ${item_list[i].cost}\t可兌 : ${item_list[i].redeemed_times}/${item_list[i].redeem_limit}`);
				}
				// console.log(`數量 : ${item_list[i].left_amount}/${item_list[i].total_amount}\t點數 :${item_list[i].cost}`);
				//console.log(item_list[i]);
			}
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得遊戲清單C2', '取得', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得蝦蝦飛刀資訊', '取得', 'https://games.shopee.tw/gameplatform/api/v1/game/activity/{activityId}/settings?appid={appid}&basic=false', '', ['appid', 'activityId'], ProcData2],
['POST', '取得 Token', '取得', 'https://games.shopee.tw/knife/api/v1/redeem/remain_score/activity/{activityId}/slot/{slot}?appid={appid}', '', ['appid', 'activityId', 'slot'], ProcData3],
['GET', '取得兌換清單', '取得', 'https://games.shopee.tw/gameplatform/api/v1/redeem_store/item_list/store/{store_id}?redeem_store_token={redeem_token}&guest=1&limit=90&offset=0&appid={appid}', '', ['appid', 'store_id', 'redeem_token'], ProcData4],
];
let DataPostBodyList = [, , , {
	"request_id": ''
},
];
function preInit() {
	//config.shopeeHeaders['x-user-id'] = config.shopeeInfo.token.SPC_U;
	config.appid = 'KKyN58ob6K6Nln3whP'; // 飛刀
	config.activityId = 'b0d6cfce2a5ec790';
	config.event_code = '93303d295f9f1510';
	config.slot = '93303d295f9f1510';
	config.module_id = 42948;
	config.item_id = '';
	config.redeem_token = '';
	config.store_id = 650;
	config.hasChance = false;
	config.knifethrowInfo = { 'appid': config.appid };
}

const forMaxCount = 5;
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
			if (i === 3) {
				DataPostBodyList[i].request_id = `${getToken()}_${getRnd(7)}`;
			}
			let dc = GetDataConfig(i);
			//console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			//if (flag && i >= 4) { i = 2; }
			if (i >= forMaxCount) { break; }
			if (i > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${i}/${forMaxCount} ★★★`) };
		}
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}

	// console.log(config.knifethrowInfo);
	let saveInfo = $persistentStore.write(JSON.stringify(config.knifethrowInfo), 'KnifeThrowInfo');
	if (saveInfo) {
		console.log('✅ 記錄成功 ✅');
	}
	else {
		console.log('❌ 記錄失敗 ❌');
	}

	$done({});
})();

