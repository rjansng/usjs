// let dd1 = { 'gameTime': 0 };
// // dd1 = { "gameTime": 1678896000000, "pet": [{ "1": { "s": 10, "isOk": true } }, { "2": { "s": 0, "isOk": false } }, { "3": { "s": 0, "isOk": false } }] };
// let dd2 = JSON.stringify(dd1);
// let $response = {
// 	body: '{"code": 0,"data": {"maxCorrectRate": 70,"costTimeMS": 44770,"correctRate": 90},"timestamp": 1678965259274,"msg": ""}'
// };
// let $request = {
// 	url: 'https://games.shopee.tw/api-gateway/pet/game/finish_culture_quiz_v2?activityCode=b711c6148c210f8f&eventCode=195a56c179f4cc0a'
// };

// let $done = function () { };
// let $notification = { post: function (title, subtitle, message, url) { console.log(`${title}\t${subtitle}\t${message}`); } };
// let $persistentStore = { read: function (n) { if (n === 'ShopeeGamePlayed') return dd2; return null; }, write: function (v, n) { dd2 = v; dd1 = JSON.parse(v); } };

// let body = $response.body;
// let url = $request.url;


const caption = '遊戲清單 Banner';
const title = '顯示 蝦皮 ' + caption;
const version = 'v20230608';
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
		return resolve();
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let json = JSON.parse(data);
		//console.log(json);
		let b1 = json.data.banners;
		let found = true;
		for (let i = 0; i < b1.length; i++) {
			if (!b1[i].hasOwnProperty('banners')) {
				//loonNotify('發現有異。');
				console.log(json.data);
				break;
			}
			console.log(`\nBANNER ${i + 1}`);
			let b2 = b1[i].banners;
			for (let j = 0; j < b2.length; j++) {
				let b = b2[j];
				let url = b.navigate_params.url;
				let name_title = b.navigate_params.navbar.title;
				if (url && (url.match(/^https:\/\/shopee\.tw\/m\//i)
					&& url.match(/.+\.tw\/m\/(knifethrow|collectibles|candyrush|puzzlebubble|[^\/]+game)/i)
					|| url.match(/^https:\/\/games\.shopee\.tw\//i))
					&& !(url.match(/^.+\.tw\/m\/\d+\.\d+\.\d+-USER$/i)
						// || url.match(/^.+\.tw\/m\/kyc$/i)
						// || url.match(/^.+\.tw\/m\/mid-month-sale$/i)
						// || url.match(/^.+\.tw\/m\/NIKEBOD.+$/i)
						|| url.match(/^.+\.tw\/m\/future\.lab\.Wl14BMedWU\.sbd$/i)
						// || url.match(/^.+\.tw\/m\/burgerking$/i)
						// || url.match(/^.+\.tw\/m\/HLkitwat$/i)
						// || url.match(/^.+\.tw\/m\/electronicthree$/i)
						// || url.match(/^.+\.tw\/m\/literature-fiction$/i)
						// || url.match(/^.+\.tw\/m\/coolpcsbd.+$/i)
						// || url.match(/^.+\.tw\/m\/\d{4}[^\/]+$/i)
						// || url.match(/^.+\.tw\/m\/[^\/]+\d{4}$/i)
						// || url.match(/^.+\.tw\/m\/DP-[^\/]+$/i)
					)
				) {
					console.log(`⭕️ ${url}`);
					console.log(`\t${name_title}`);
				}
				else {
					console.log(`❌ ${url}`);
					console.log(`\t${name_title}`);
				}
			}
		}

		return resolve(found);
	});
}

let UrlData = [[],
['POST', '取得遊戲清單', '取得', 'https://mall.shopee.tw/api/v4/banner/batch_list', '', , ProcData1],
];
let DataPostBodyList = [, { "types": [{ "type": "coin_carousel" }, { "type": "coin_square" }] }];
function preInit() {
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
			let dc = GetDataConfig(i);
			//console.log(`🌐 ${dc.method} URL : ${dc.url}`);
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

