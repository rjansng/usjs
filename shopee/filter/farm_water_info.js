// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '狀態 澆水通知 更新作物 自動收成 站外澆水';
const title = '蝦蝦果園 ' + caption;
const version = 'v20240108';
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

function shopeeNotify(subtitle = '', message = '', url = '') {
	let title = '🍤 蝦蝦果園 澆水通知';
	if (($persistentStore.read('TelegramUrl') || '') != '') {
		telegramNotify(title, subtitle, message);
	}
	else {
		$notification.post(title, subtitle, message, { 'openUrl': url });
		// console.log(title + '\t' + subtitle + '\t' + message);
	}
};

function telegramNotify(title, subtitle = '', message = '') {
	let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
	if (TelegramUrl != '') {
		let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
		$httpClient.get(telegramData, function (error, response, data) { });
	}
}

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
		// console.log(`⭕️ 執行成功 💯`);
		let found = false;
		let json = JSON.parse(data);
		if (json.code == 0) {

			let crop = json.data.crops[0];
			let cropName = crop.meta.name;
			config.cropName = cropName;
			let rewards = null;
			if ('rewards' in json.data) { rewards = json.data.rewards; }
			let msg = '';
			config.cropId = crop.id;
			console.log(`目前作物: ${crop.meta.name}`); // (${config.cropId})
			if (crop.lifeStatus == 1) {
				// console.log('作物已死亡');
				msg = '作物已死亡。';
			}
			else if (crop.state < 100) {
				if (rewards && rewards.length > 0) {
					console.log('作物更新狀態');
					rewards.forEach(x => {
						config.rewards.push({ ids: x.id, flag: true });
					});
					msg += ' 作物種植中';
				}
				config.canWater = true;
				config.resourceId = json.data.resources[0].id;
				DataPostBodyList[4].cropId = config.cropId;
				DataPostBodyList[4].resourceId = config.resourceId;
				// console.log(DataPostBodyList[4]);

				let NeedWater = '種植中';
				found = true;
				let mc = crop.meta.config;
				let totalExp = mc.totalExp;
				let needExp = totalExp;
				for (let i = 1; i <= 3; i++) {
					let mclc = mc.levelConfig[i];
					if (crop.state > i) { needExp -= mclc.exp; }
					else if (crop.state == i) {
						needExp -= crop.exp;
					}
				}
				config.needExp = needExp;
				// console.log(`還需要水量: ${needExp}`);
				NeedWater += `，需要水量 ${needExp}`;
				msg = NeedWater;
				// console.log(json.data.prop);
				if (json.data.resources && json.data.resources.length > 0) {
					json.data.resources.forEach(r => {
						if (r.hasOwnProperty('meta') && r.meta.hasOwnProperty('name') && r.meta.name == 'water') {
							//console.log(r);

							let nf_water = JSON.parse($persistentStore.read('ShopeeWaterNotify') || '{"datatime":0,"count":0}');
							try {
								NeedWater += `，可澆水量 ${r.number}/${r.meta.config.maxNumber}`;
								NeedWater += `，滿水時間 ${new Date(new Date().getTime() + (r.resumeLeftSeconds * 1000)).format('3')}`;
							} catch (error) {

							}
							// console.log(`可澆水量: ${r.number}`);
							let prop = null;
							let propItemId = 0;
							if ('prop' in json.data) {
								prop = json.data.prop;
								propItemId = prop.itemId;
								console.log(`${prop.itemId}\t${prop.itemName} ${prop.parameter}`);

								NeedWater += `\t${prop.itemId}\t${prop.itemName} ${prop.parameter}`;
								//console.log(prop);
							}
							if (propItemId == 3 || propItemId == 4 || propItemId == 5) {  // 5 澆水好朋友 24
								NeedWater += `，自動澆水 (${new Date(prop.beginUseTime + (prop.parameter * 60 * 60 * 1000)).format('3')})`;
								$persistentStore.write(null, 'ShopeeWaterNotify');
							}
							else {
								if (r.meta.config.maxNumber - 10 <= r.number || r.resumeLeftSeconds <= 900) {
									nf_water.count++;
									nf_water.datatime = Date.now();
									$persistentStore.write(JSON.stringify(nf_water), 'ShopeeWaterNotify');
									let ntc = 1;
									let nt = $persistentStore.read('澆水通知') || '';
									if (nt == '是') { nt = true; }
									else if (nt == '0' || nt == '1' || nt == '2' || nt == '3') { nt = true; ntc = parseInt(nt); }
									else { nt = false; ntc = 0; }
									if (nt && nf_water.count <= ntc) {
										let mmm = '';
										if (nf_water.count > 1) { mmm = `第${nf_water.count}次通知。`; }
										shopeeNotify(`${json.data.user.name} ${cropName}`, `${NeedWater}。${mmm}`);
									}
									// console.log('準備澆水了。');
								}
								else {
									$persistentStore.write(null, 'ShopeeWaterNotify');
								}
							}
							//console.log(r);
						}
						else {
							console.log('Not Meta Name');
							console.log(r);
						}

					});
					msg = NeedWater;

				}


			}
			else if (crop.state == 100) {
				// console.log('作物可以收成了');
				msg = '作物可以收成了。';
				DataPostBodyList[5].cropId = config.cropId;
				found = true;
				config.canHarvest = true;
			}
			else if (crop.state >= 101) {
				// console.log('作物已收成');
				msg = '作物已收成。';
			}
			console.log(`\n${msg}`);

			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'FW';
				let tsid2 = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, s2 = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (ts.hasOwnProperty(tsid2)) { s2 = ts[tsid2]; } else { s2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }

				if (crop.state < 100 || crop.state >= 100 && s.r.includes('種植中')) {
					s2.r = cropName;
					s2.f = true;
					s2.c = 1;
					s.r = `${msg} (${new Date().format('5')})`;
					s.f = true;
					s.c = 1;
				}
				ts[tsid2] = s2;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


		} else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code == 0) {
			found = true;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'E';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = json.data.userWater.totalHelpFriendCount - json.data.userWater.remainingHelpFriendCount;
				s.s = json.data.userWater.remainingHelpFriendCount;
				if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'F';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = json.data.userWater.totalHelpedCount - json.data.userWater.remainingHelpedCount;
				s.s = json.data.userWater.remainingHelpedCount;
				if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
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

async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let GetC = 0;
		let json = JSON.parse(data);
		if (json.code == 0) {
			let ms = json.data.messages;
			for (let i = 0; i < ms.length; i++) {
				let m = ms[i];
				let dtn = new Date(new Date().format("2")).getTime();

				if (m.type === 2 && m.CreateTime >= dtn) {
					found = true;
					try {
						let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						let tsn = 'farms';
						let tsid = 'D';
						let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						let tasks = JSON.parse(rs);
						let ts = {}, s = {};
						if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						if (!s.f && s.s === 0 && s.c === 0) { s.s = 5; }
						if (m.data.Count > 0 && m.data.Exp === 10) {
							if (m.data.Count > s.c) { s.c = m.data.Count; s.s = 5 - s.c; }
						}
						GetC = s.c;
						s.f = s.c >= 5;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					} catch (e) { console.log(e); }
					//}
				}
			}
			if (!found) {
				console.log(`今日未收到站外澆水`)
			}
			else {
				console.log(`收到站外澆水 ${GetC} 次`)

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
		if (json.code == 0) {
			found = true;
			let cropName = config.cropName;
			let luckyDrawAwardName = cropName;
			if ('reward' in json.data && 'rewardItems' in json.data.reward
				&& json.data.reward.rewardItems.length > 0
				&& 'itemExtraData' in json.data.reward.rewardItems[0]
				&& 'luckyDrawAwardName' in json.data.reward.rewardItems[0].itemExtraData) {
				luckyDrawAwardName = json.data.reward.rewardItems[0].itemExtraData.luckyDrawAwardName;
			}

			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'A2';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
				s.r += `\n🌱${config.cropName}\t🌳${luckyDrawAwardName} : ${(new Date()).format('5')}`;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			try {
				let dataName = 'ShopeeGamePlayed';
				let tsn = 'farm' + 's';
				let tsid = 'FW';
				let tsid2 = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}, s2 = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (ts.hasOwnProperty(tsid2)) { s2 = ts[tsid2]; } else { s2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }

				s2.r = cropName;
				s2.f = true;
				s2.c = 1;
				s.r = `作物已收成。 (${new Date().format('5')})`;
				s.f = true;
				s.c = 1;

				ts[tsid2] = s2;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			shopeeNotify('收成成功 ✅', `獲得 ${cropName} 🌳\n${luckyDrawAwardName}`);
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
		if (json.code == 0) {
			found = true;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'FU';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
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
async function ProcData6(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code == 0) {
			found = true;

			// try {
			// 	let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			// 	let tsn = 'farm' + 's';
			// 	let tsid = 'FU';
			// 	let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			// 	let tasks = JSON.parse(rs);
			// 	let ts = {}, s = {};
			// 	if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			// 	if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			// 	s.c++;
			// 	s.f = true;
			// 	ts[tsid] = s;
			// 	tasks[tsn] = ts;
			// 	$persistentStore.write(JSON.stringify(tasks), dataName);
			// } catch (e) { console.log(e); }
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得作物資訊', '', 'https://games.shopee.tw/farm/api/orchard/context/get?skipGuidance=0', '', , ProcData1],
['GET', '取得澆水資訊', '', 'https://games.shopee.tw/farm/api/friend/v2/list?source=&offset=&need_recommend=true&device_id={device_id}&is_ban_contact=false', '', ['device_id'], ProcData2],
['GET', '取得果園訊息', '', 'https://games.shopee.tw/farm/api/message/get?page=1&pageSize=50', '', , ProcData3],
['!POST', '作物澆水', '', 'https://games.shopee.tw/farm/api/orchard/crop/water', '', , ProcData6],
['POST', '作物收成', '', 'https://games.shopee.tw/farm/api/orchard/crop/harvest', '', , ProcData4],
['POST', '更新作物狀態', '', 'https://games.shopee.tw/farm/api/reward/claim', '', , ProcData5],
];
// https://games.shopee.tw/farm/api/orchard/resource/get
let DataPostBodyList = [, , , ,
	{
		"iframe_s": "",
		"resourceId": 0,
		"cropId": 0
	},
	{ "deviceId": '', "cropId": 0 },
	{ "ids": [], "rewardType": 1 }, ,];
function preInit() {
	//config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.device_id = config.shopeeInfo.token.SPC_F;
	config.rewards = [];
	config.canHarvest = false;
	DataPostBodyList[5].deviceId = config.device_id;
	config.canWater = false;
	let autoWater = $persistentStore.read('蝦蝦果園通知澆水') || '';
	$persistentStore.write(null, '蝦皮果園自動澆水');
	$persistentStore.write(null, '自動澆水');
	config.autoWater = autoWater == '自動';

}

const forMaxCount = 10;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		let flag = config.autoWater;
		let runCount = 0;
		let item = -1;

		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			runCount++;
			item = -1;
			if (i == 4) {
				i++;
				// let autoWater = $persistentStore.read('自動澆水') || '';
				// autoWater = autoWater == '是';
				// if (config.canWater && autoWater) {
				// 	let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo' + _ShopeeUserID);
				// 	if ('currentCrop_iframe_s' in shopeeFarmInfo && 'iframe_s' in shopeeFarmInfo.currentCrop_iframe_s) {
				// 		DataPostBodyList[i].iframe_s = shopeeFarmInfo.currentCrop_iframe_s.iframe_s;
				// 		console.log(DataPostBodyList[i]);
				// 	}
				// 	else {
				// 		console.log('沒有新的 iframe_s TOKEN');
				// 		i++;
				// 	}

				// } else { i++; }
			}
			if (i == 5) {
				if (config.canHarvest) {

				} else { i++; }
			}
			if (i == 6) {
				if (config.rewards.some(r => {
					if (r.flag) {
						DataPostBodyList[i].ids = [];
						DataPostBodyList[i].ids.push(r.ids);
						r.flag = false;
						return true;
					}
				})) {
				}
				else { flag = false; }
			}
			let dc = !flag ? null : GetDataConfig(i);
			// console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			//if (flag && i >= 4) { i = 2; }
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

