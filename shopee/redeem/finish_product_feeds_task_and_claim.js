let isGui = false;
if ($request && $request.url.match(/http:\/\/lo.on\/coins$/)) { isGui = true; console.log('GUI手動執行。\n'); }
let UseUserId = '';
let ShopeeUserID = '';
let SimulateUserID = '';
if (isGui) {
	SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
	if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
	if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
} else {
	UseUserId = $persistentStore.read('UseUserId') || '';
	ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
}
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
if (UseUserId != '1' && SimulateUserID == '') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '瀏覽商店 領任務';
let title = '💰我的蝦幣 ' + caption;
const version = 'v20231123';
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
	config.msg = msg;
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
let DTND = new Date(new Date().format('2')).getTime();

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
		let shopeeHeaders = {
			// 'Cookie': `${cookieToString(shopeeInfo.token)}`,
			'Content-Type': 'application/json',
			// 'x-csrftoken': shopeeInfo.csrfToken,
		}

		// if (shopeeInfo.hasOwnProperty('shopId')) { shopeeHeaders['Cookie'] += `; shopid=${shopeeInfo.shopId}`; }
		// shopeeHeaders['Cookie'] += `; userid=${shopeeInfo.token.SPC_U}`;
		// shopeeHeaders['Cookie'] += `; username=${shopeeInfo.userName}`;

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
		let json = JSON.parse(data);
		try {
			if (json.hasOwnProperty('data') && json.data && json.data.hasOwnProperty('claimed_coin_amount')) {
				$persistentStore.write(null, 'ShopeeFeedsTaskToken' + _ShopeeUserID);
				config.msg = `🔆獲得 ${json.data.claimed_coin_amount} 蝦幣`;
				console.log(config.msg);

				let task_id = parseInt($persistentStore.read('mkt_coins_task_id' + _ShopeeUserID) || '9948');

				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'shopee' + 's';
					let tsid = 'ST48';
					if (task_id != 9948) { tsid = `ST${task_id}`; }
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c++;
					if (s.s > 0) { s.s--; }
					s.f = true;
					s.d.push(`🔆${json.data.claimed_coin_amount} 蝦幣`);
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

				try {
					let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
					$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
					// if (task_id == 9948) {
					// 	let gmp = { 'dataTime': DTND, 'ts': true };
					// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
					// }
					// else 
					if (task_id == 15676) {
						let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink1' + _ShopeeUserID);
					}
					else if (task_id == 16111) {
						let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink2' + _ShopeeUserID);
					}
				} catch (error) { console.log(error); }
			}
			else {
				if (json.hasOwnProperty('error_msg')) {
					return reject([`執行失敗 ‼️`, json.error_msg, data]);
				}
				else if (json.hasOwnProperty('msg')) {
					return reject([`執行失敗 ‼️`, json.msg, data]);
				}
				else {
					return reject([`執行失敗 ‼️`, data]);
				}
			}
		} catch (error) {
			console.log('');
			console.log(json);
		}
		return resolve(found);
	});
}
let UrlData = [[],
['POST', '領任務', '1', 'https://shopee.tw/api/v4/market_coin/finish_product_feeds_task_and_claim', '', , ProcData1],
];
let DataPostBodyList = [, {
	'task_token': ''
}, , , ,
];

function preInit() {
	config.msg = '';
	// config.shopeeHeaders['x-csrftoken'] = config.shopeeInfo.csrfToken;
	//config.shopeeHeaders['shopee_token'] = config.shopeeInfo.token.shopee_token;
	//config.shopeeHeaders['x-device-id'] = config.deviceId;
	config.doRun = false;
	config.json = JSON.parse($persistentStore.read('ShopeeFeedsTaskToken' + _ShopeeUserID) || '{}');
	//console.log(config.json);

	if (config.json.hasOwnProperty('task_token')) {
		let dtn = new Date();
		let dt1 = new Date(config.json.datetime);
		//if (dtn.format("2") === dt1.format("2")) {
		config.doRun = true;
		//}
		DataPostBodyList[1].task_token = config.json.task_token;
		//console.log(config.json.headers);
		config.shopeeHeaders['referer'] = 'https://shopee.tw/api/v4/market_coin/';
		config.shopeeHeaders['host'] = 'shopee.tw';
		config.shopeeHeaders['cookie'] = config.json.headers['cookie'];
		config.shopeeHeaders['user-agent'] = config.json.headers['user-agent'];
		config.shopeeHeaders['x-csrftoken'] = config.json.headers['x-csrftoken'];
		//console.log(config.shopeeHeaders);
	}
}
//$persistentStore.write(JSON.stringify(json), 'ShopeeFeedsTaskToken');

const forMaxCount = 20;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	console.log(`${new Date().format('0')}`);
	let msg = '';
	try {
		await preCheck();
		preInit();
		let flag = true;
		let runCount = 0;
		let item = -1;
		if (config.doRun) {
			for (let i = 1; i < UrlData.length; i++) {
				if (!flag) { break; }
				item = -1;

				let dc = GetDataConfig(i);
				// console.log(dc);
				// console.log(`\n🌐 ${dc.method} URL: ${dc.url} \n`);
				// break;
				if (flag && dc.method === 'GET') {
					await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
				} else if (flag && dc.method === 'POST') {
					await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
				}


				if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
				if (runCount > 50) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

			}
			console.log('');
			// console.log(JSON.stringify(config.fss).replace(/,"last/ig, ',\n"last').replace(/},/ig, '},\n'));
			console.log('');
			msg = '✅ 處理已完成';
			console.log(msg);
		}
		else {
			msg = '無 Token 資料處理。';
			console.log(msg);
		}
		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}

	if (isGui) {
		let dt = new Date();
		let rbody = '<html><head><meta charset="utf-8" />'
			+ '<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale:1, maximum-scale=1, user-scalable=1">'
			+ '<style>'
			+ 'header,content,footer { display: block; white-space: pre;}'
			+ 'footer{padding-top:5px;text-align:center;}'
			+ '</style>'
			+ '</head><body>'
			+ '<h1>超過30秒領蝦幣</h1>'
			+ '<content>'
			+ '' + config.msg + '<br>' + msg + ''
			+ '</content>'
			+ '<footer>'
			+ '👉 請按左上角「←」反回，並下拉頁面重整。 👈'
			+ '</footer>'
			+ '</body></html>';

		$done({
			response: {
				status: 200,
				headers: {
					'server': 'SGW',
					'date': dt.toUTCString(),
					'content-type': 'text/html',
					'X-FAKE': 'FAKE'
				},
				body: rbody
			}
		});

	}
	else { $done({}); }
})();

