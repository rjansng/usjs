// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '推薦商店水滴';
const title = '🍤 蝦蝦果園' + caption;
const version = 'v20240201';
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
async function delay(seconds) { console.log(`⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
function GetDataConfig(item = -1, method = 'POST', url = '', title = '', content = '', func = null) {
	if (item === -1) {
		return {
			'item': item, 'method': method, 'url': url, 'title': title, 'content': content, 'memo': ''
			, 'dataRequest': { url: '', headers: config.shopeeHeaders, body: null }, 'func': ud[6],
		};
	}
	let ud = UrlData[item];
	if (ud[0] != 'GET' && ud[0] != 'POST') { return null; }
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
Date.prototype.format = function (format = '1') {
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

async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		// console.log(`⭕️ 執行成功 💯`);
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			let crop = json.data.crops[0];
			console.log(`目前作物 : ${crop.meta.name}`);
			if (crop.lifeStatus === 1) {
				console.log('作物已死亡');
			}
			else if (crop.state < 100) {
				found = true;
				let waterNumInGrocery = json.data.waterNumInGrocery;
				config.waterNumInGrocery = waterNumInGrocery;
				if (crop.state === 3) {
					let mc = crop.meta.config;
					let mclc = mc.levelConfig[crop.state];
					let needexp = mclc.exp - crop.exp;
					config.needexp = needexp;
					if (needexp < (waterNumInGrocery - 10)) {
						found = false;
						loonNotify(`作物再 ${needexp} 水滴就可以收成了，不自動領取。`);
					}
				}
			}
			else if (crop.state === 100) {
				console.log('作物可以收成了');
			}
			else if (crop.state >= 101) {
				console.log('作物已收成');
			}
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
		if (json.code === 0) {
			// console.log(`⭕️ 執行成功 💯`);
			if (!json.data.claimedInGroceryToday) { found = true; }
			else if (json.data.hasNextClaim && json.data.nextClaimTimestamp > 0) {
				let dtn = new Date().getTime();
				if (json.data.nextClaimTimestamp <= dtn) {
					found = true;
					console.log(`已經可以領 ${config.waterNumInGrocery} 水滴`);
				}
				else {
					console.log(`現在還不能領水滴`);
					console.log(`下次領水滴時間 : ${new Date(json.data.nextClaimTimestamp).format('MM/dd HH:mm:ss')}`);
				}
			}
			else if (!json.data.hasNextClaim) {
				console.log(`今天${dc.content}領取完畢`);
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
			// console.log(`⭕️ 執行成功 💯`);
			let msg = '';
			loonNotify('領取成功 ‼️', `${config.waterNumInGrocery} 水滴💧`);
			if (json.data.hasNextClaim && json.data.nextClaimTimestamp > 0) {
				console.log('下次領水滴時間 : ' + new Date(json.data.nextClaimTimestamp).format('MM/dd HH:mm:ss'));
				msg = 'NEXT: ' + (new Date(json.data.nextClaimTimestamp)).format('3');
			}
			else {
				console.log(`今天${dc.content}領取完畢`);
			}
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'farm' + 's';
				let tsid = 'C';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (s.s === 0 && s.c === 0 && !s.f) { s.s = 3; }
				s.c++;
				if (s.s > 0) { s.s--; }
				s.f = s.c > 0 && s.s === 0;
				s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else if (json.msg === 'has claimed') {
			return reject([`執行失敗 ‼️`, '今日已領取']);
		}
		else if (json.code === 409004) {
			return reject([`執行失敗 ‼️`, '請檢查作物是否已經收成']);
		}
		else if (json.code === 430007) {
			return reject([`執行失敗 ‼️`, '今日已領取完畢']);
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得ℹ️作物資訊', '取得', 'https://games.shopee.tw/farm/api/orchard/context/get?skipGuidance=0', '', , ProcData1],
['GET', '取得商店水滴資訊', '取得', 'https://games.shopee.tw/farm/api/orchard/context/get_bubble_info?', '', , ProcData2],
['POST', '領取商店水滴💧', '領取', 'https://games.shopee.tw/farm/api/grocery_store/rn_claim', '', , ProcData3],
];

let DataPostBodyList = [, , ,
	{
		'S': ''
	}
];
function preInit() {
	let shopeeGroceryStoreToken = null;
	let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo' + _ShopeeUserID);
	if (isEmptyObject(shopeeFarmInfo)) {
		console.log('⚠️ 沒有新版蝦蝦果園資訊，使用舊版');
		shopeeGroceryStoreToken = $persistentStore.read('ShopeeGroceryStoreToken' + _ShopeeUserID) || '';
	} else {
		shopeeGroceryStoreToken = shopeeFarmInfo.groceryStoreToken;
		console.log('ℹ️ 找到新版蝦蝦果園資訊');
	}
	DataPostBodyList[3].S = shopeeGroceryStoreToken;
}

const forMaxCount = 5;
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
			runCount++;
			if (i === 1) { console.log(''); }
			let func = null;
			item = -1;
			let dc = GetDataConfig(i, null, null, null, null, func);
			if (dc === null) { continue; }
			if (dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			//if (i === 2) break;
			if (runCount >= forMaxCount) { break; }
			if (runCount > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
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

