const caption = '顯示兌換清單';
const title = '寵物村 ' + caption;
const version = 'v20250502';
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
		"M+": this.getMonth() + 1, //month  
		"d+": this.getDate(),    //day  
		"h+": this.getHours(),   //hour  
		"H+": this.getHours(),   //hour  
		"m+": this.getMinutes(), //minute  
		"s+": this.getSeconds(), //second  
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
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
			let msg = `嘗試 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.get(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`${dc.content}失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						console.log(new Date().format());
						console.log(response.headers['Date'] || response.headers['date']);
						return resolve(data);
					} else {
						return reject([`${dc.content}失敗 ‼️`, response.status, data]);
					}
				}
			});
		} catch (error) {
			return reject([`${dc.content}失敗 ‼️`, error]);
		}
	});
}
async function dataPost(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `嘗試 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.post(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`${content}失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						return resolve(data);
					} else {
						return reject([`${dc.content}失敗 ‼️`, response.status, data]);
					}
				}
			});

		} catch (error) {
			return reject([`${dc.content}失敗 ‼️`, error]);
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
			'HTTP2':'true',
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
			'Content-Type': 'application/json',
		}
		// UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15.7.2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7.2 Mobile/15E148 Safari/604.1';
		UA = 'iOS app iPhone Shopee appver=33953 language=zh-Hant app_type=1 platform=native_ios os_ver=16.7.2 Cronet/102.0.5005.61';
		shopeeHeaders['User-Agent'] = UA;

		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}
//let current_points = 0;
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		//console.log(`✅ ${dc.content}成功`);
		let found = false;
		let found2 = false;
		let json = JSON.parse(data);
		// console.log(json);
		console.log(`現有點數 ${json.data.current_points}`);
		config.pointsS = json.data.current_points;
		//current_points = json.data.current_points;
		var item_list = json.data.item_list;
		for (var i = item_list.length - 1; i >= 0; i--) {
			if (item_list[i].item_type === 6) // 6  寶箱
			{
				console.log(`\n${item_list[i].name} (${item_list[i].id}) (${item_list[i].item_type})`);
				console.log(`兌換: ${item_list[i].redeemed_times}/${item_list[i].redeem_limit}\t數量: ${item_list[i].left_amount}/${item_list[i].total_amount}\t點數: ${item_list[i].cost}`);
			} else if (item_list[i].item_type != 1) // 4  蝦幣
			{
				console.log(`\n${item_list[i].name} (${item_list[i].id}) (${item_list[i].item_type})`);
				console.log(`兌換: ${item_list[i].redeemed_times}/${item_list[i].redeem_limit}\t數量: ${item_list[i].left_amount}/${item_list[i].total_amount}\t點數: ${item_list[i].points_to_redeem}`);
			}

		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得兌換商店清單', '取得', 'https://games.shopee.tw/gameplatform/api/v2/redeem_store/item_list/store/397?guest=1&limit=24&offset=24&appid=LcqcAMvwNcX8MR63xX&activity=b711c6148c210f8f', '', , ProcData1],
];
// ['GET', '取得兌換商店清單', '取得', 'https://games.shopee.tw/gameplatform/api/v2/redeem_store/item_list/store/397/event/37e27a756d6e48f7?appid=LcqcAMvwNcX8MR63xX&guest=1&limit=90&offset=0', '', , ProcData1],
let DataPostBodyList = [, ,];

const forMaxCount = 5;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		let flag = true;
		let runCount = 0;
		let item = -1;
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			runCount++;
			if (i === 1) { console.log(''); }
			item = -1;
			let dc = GetDataConfig(i);
			// console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else {
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
	// if (config.pointsS >= 0) {
	// 	try {
	// 		let dataName = 'ShopeeGamePlayed';
	// 		let tsn = 'pets';
	// 		let tsid = 'SY';
	// 		let tsidD = 'ST';
	// 		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
	// 		let tasks = JSON.parse(rs);
	// 		let ts = {}, s = {}, sD = {};
	// 		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
	// 		if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
	// 		if (ts.hasOwnProperty(tsidD)) { sD = ts[tsidD]; } else { sD = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
	// 		if (s.s === 0) { s.s = config.pointsS; }
	// 		if (sD.s === 0) { sD.s = config.pointsS; }
	// 		s.f = true;
	// 		sD.f = true;
	// 		ts[tsid] = s;
	// 		ts[tsidD] = sD;
	// 		tasks[tsn] = ts;
	// 		$persistentStore.write(JSON.stringify(tasks), dataName);
	// 	} catch (e) { console.log(e); }
	// }
	$done({});
})();

