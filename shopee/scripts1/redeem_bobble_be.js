// let title = '偽裝 Cookie';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '兌換 蝦幣';
const title = '蝦蝦消消樂 自動' + caption;
const version = 'v20240902';
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
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.get(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`${dc.content}失敗 ‼️`, '連線錯誤']);
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
		const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
		if (isEmptyObject(shopeeInfo)) {
			return reject(['檢查失敗 ‼️', '沒有 蝦皮 Token']);
		}
		const shopeeHeaders = {
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
			'Content-Type': 'application/json',
			'x-user-id': shopeeInfo.userId,
		}
		let UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15.7.2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7.2 Mobile/15E148 Safari/604.1';
		shopeeHeaders['User-Agent'] = UA;
	
		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}
async function ProcData1(data, dc) {
	console.log(data);
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.code === 0 && 'data' in obj && 'store_token' in obj.data) {
			found = true;
			config.store_token = obj.data.store_token;
		}

		return resolve(found);
	});
}

async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		// console.log(`✅ ${dc.content}成功`);
		let found = false;
		let found2 = false;
		let obj = JSON.parse(data);
		// console.log(obj);

		console.log(`現有點數 ${obj.data.current_points}`);
		config.pointsS = obj.data.current_points;
		//current_points = obj.data.current_points;
		let item_list = obj.data.item_list;
		// console.log(data);
		for (let i = item_list.length - 1; i >= 0; i--) {
			if (item_list[i].item_type == 4) // 4  蝦幣
			{
				// console.log(item_list[i]);
				// console.log(`${item_list[i].name} (${item_list[i].id})`);
				// console.log(`數量 : ${item_list[i].left_amount}/${item_list[i].total_amount}`);
				let re = new RegExp(`^${泡泡王點數兌換蝦幣} 蝦幣`, 'i');
				if (item_list[i].name.match(re)) {
					found2 = true;
					//config.event_item = 0;
					//console.log(`現有點數 : ${obj.data.current_points}`);
					//console.log(`需要點數 : ${obj.data.current_points}/${item_list[i].points_to_redeem}`);
					config.points_to_redeem = item_list[i].points_to_redeem;
					let m = 0;
					let msg = `\n🔆兌換 ${泡泡王點數兌換蝦幣} 蝦幣 `;
					if (item_list[i].redeem_limit > item_list[i].redeemed_times) {
						if (item_list[i].left_amount > 0) {
							if (obj.data.current_points > item_list[i].points_to_redeem) {
								config.event_item = item_list[i].id;
								found = true;
								m = 1;
							}
							else {
								msg += `\n點數不足。`;
								m = 2;
							}
						}
						else {
							msg += '\n已被搶換一空。';
							m = 3;
						}
					}
					else {
						msg += `已兌換。${item_list[i].redeemed_times}/${item_list[i].redeem_limit}`;
						m = 4;
					}
					if (m >= 2) { console.log(msg); }
					if (m != 0) {
						config.msg = msg;
						if (!found) {
							try {
								let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
								let tsn = 'puzzle_bobble_bes';
								let tsid = 'Z';
								let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
								let tasks = JSON.parse(rs);
								let ts = {}, s = {};
								if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
								if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
								//s.r += '\n' + msg.replace(/\n/g, '');
								s.s++;
								s.f = s.s > 0;
								s.d.push(msg.replace(/\n/g, ''));
								//config.dataIndex = s.d.length - 1;
								ts[tsid] = s;
								tasks[tsn] = ts;
								$persistentStore.write(JSON.stringify(tasks), dataName);
							} catch (e) { console.log(e); }
						}
					}
					break;
				}
			}
		}
		if (!found2) {
			console.log(`\n找不到 ${泡泡王點數兌換蝦幣} 蝦幣`);
		}
		return resolve(found);
	});
}
async function ProcData3(data, dc) {
	console.log(data);
	return new Promise((resolve, reject) => {
		let obj = JSON.parse(data);
		console.log(`剩於點數 : ${obj.data.current_points}`);
		config.pointsN = obj.data.current_points;
		let found = false;
		let msg = '';
		if (obj.code === 0) {
			found = true;
			msg = `成功`;
			console.log(`✅ 兌換成功 ✅`);
		}
		else { msg = '失敗'; }
		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'puzzle_bobble_bes';
			let tsid = 'Z';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.c++;
			if (s.s > 0) { s.s--; }
			s.f = s.c > 0;
			//s.d[config.dataIndex] += msg.replace(/\n/g, '');
			s.d.push(config.msg.replace(/\n/g, '') + msg.replace(/\n/g, ''));
			//s.r += msg.replace(/\n/g, '');
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }

		return resolve(found);
	});
}

let UrlData = [[],
['!GET', '取得兌換商店token', '取得', 'https://idgame.shopee.tw/api/puzzle-bobble-be/v4/events/282bdb825fa9d0fb/redeem_store/generate_token', '', , ProcData1],
['GET', '取得兌換商店清單', '取得', 'https://games.shopee.tw/gameplatform/api/v2/redeem_store/item_list/store/1419?guest=1&limit=24&offset=24&appid=sXXLMi0v7R4phDVWk5&activity=282bdb825fa9d0fb', '', , ProcData2],
['POST', '兌換 蝦幣', '兌換', 'https://games.shopee.tw/gameplatform/api/v2/redeem_store/redeem_item/store/1419/item/{event_item}?appid=sXXLMi0v7R4phDVWk5&activity=282bdb825fa9d0fb', '', ['event_item'], ProcData3],
];
//                                                        /gameplatform/api/v2/redeem_store/item_list/store/1419?guest=1&limit=12&offset=0&appid=sXXLMi0v7R4phDVWk5&activity=282bdb825fa9d0fb
let DataPostBodyList = [, , ,
	{
		"request_id": ''
	}
];
let 泡泡王點數兌換蝦幣 = 0;
function preInit() {
	config.pointsS = -1;
	config.pointsN = -1;

	泡泡王點數兌換蝦幣 = $persistentStore.read('泡泡王點數兌換蝦幣') || '';
	if (泡泡王點數兌換蝦幣.match(/^[\d\.]+$/)) { 泡泡王點數兌換蝦幣 = parseFloat(泡泡王點數兌換蝦幣); } else { 泡泡王點數兌換蝦幣 = 0; }
}

const forMaxCount = 5;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	try {
		await preCheck();
		preInit();
		let flag = true;
		let runCount = 0;
		let item = -1;
		if (泡泡王點數兌換蝦幣 == 0) { flag = false; console.log('您指定：不兌換。'); }
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			runCount++;
			if (i === 1) { console.log(''); }
			// item = -1;
			if (i === 3) {
				DataPostBodyList[i].request_id = `${config.shopeeInfo.token.SPC_U}_1419_${config.event_item}_${getToken()}_` + getRnd(7)
			}
			let dc = GetDataConfig(i);
			// if (i === 1) { dc.url += '&t=' + getToken(); }
			// console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (runCount >= forMaxCount) { break; }
			if (runCount > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);
		//loonNotify(msg);
	} catch (error) {
		handleError(error);
	}

	$done({});
})();

