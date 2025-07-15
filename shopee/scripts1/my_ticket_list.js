// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let tg = '0';
let dn = '';
let sn = ''; // 超商單位 
try {
	if ($argument) {
		tg = $argument;
		let tgs = tg.split(';');
		if (tgs.length > 1) {
			tg = tgs[0];
			dn = tgs[1];
			if (tgs.length > 2) { sn = tgs[2]; }
		}
	}
} catch (e) { console.log('Not $argument'); }

const caption = '我的票匣清單';
const title = '顯示 蝦皮 ' + caption;
const version = 'v20230822';
let showNotification = true;
let showLog = true;
let showInfo = false;
let config = {};
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
async function delay(seconds, isshow = true) { if (isshow) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); } return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
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
function telegramNotify(title, subtitle = '', message = '') {
	let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
	if (TelegramUrl != '') {
		let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
		$httpClient.get(telegramData, function (error, response, data) { });
	}
}

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
		return resolve();
	});
}
async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let obj = JSON.parse(data);
		if (obj.err_code === 0) {
			found = true;
			obj.data.ticket_info_list.forEach(x => {
				if (config.dateEnd == 0 && config.dateStart > 0 && (x.create_time * 1000) >= config.dateStart
					|| config.dateEnd > 0 && config.dateStart == 0 && (x.create_time * 1000) <= config.dateEnd
					|| config.dateStart == 0 && config.dateEnd == 0
				) {
					if (dn == '' || dn != '' && x.product_name.includes(dn) && (sn == '' || sn != '' && x.product_name.includes(sn))) {
						// console.log(`\n\nticket_id: ${x.ticket_id}`);
						// console.log(`單位: ${x.carrier_name}`);
						// console.log(`名稱: ${x.product_name}`);
						let et = x.expire_time;
						if (et === 32503651199) {
							et = '無期限';
						}
						else {
							et = new Date(et * 1000).format('2');
						}
						// console.log(`期限: ${et}`);
						let ds = {
							'ticket_id': x.ticket_id,
							'carrier_name': x.carrier_name,
							'product_name': x.product_name,
							'expire_time': x.expire_time,
							'et': et,
							'flag': true
						};
						config.dataList.push(ds);
					}
				}
				//console.log(x);
			});
		}
		return resolve(found);
	});
}
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = true;
		let obj = JSON.parse(data);
		if (obj.err_code === 0) {
			// console.log(obj);

			let td = obj.data.ticket_detail;
			let etd = td.evoucher_ticket_detail;
			//console.log(`名稱: ${td.item_name}`);
			// let msg = '';
			// etd.what_you_get.forEach(x => {
			// 	msg += (msg != '' ? '\n' : '') + x;
			// });
			// console.log(etd);
			var etd2 = [];
			etd.what_you_get.forEach(x=>{if(!x.includes('更多票券看')){etd2.push(x);}});

			console.log(`獲得: ${etd2.join('\n')}`);
			// console.log(`序號: ${etd.serial_number}`);
			// console.log(`網址: ${etd.code_url}`);
			console.log(`${etd.code_url}`);
			config.msg.push(`獲得: ${etd2.join('\n')}`);
			config.msg.push(`${etd.code_url}`);

			if (tg === '1') {
				telegramNotify(config.msg.join('\n'));
				config.msg = [];
			}

		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得我的票匣清單', '取得', 'https://shopee.tw/digital-product/api/my-ticket/list?ticket_type_list=&state=1&page_size=30&category_id_list=30102', '', , ProcData1],
['GET', '取得票券明細', '取得', 'https://shopee.tw/digital-product/api/my-ticket/detail?ticket_id={ticket_id}', '', ['ticket_id'], ProcData2],
];
let DataPostBodyList = [, ,];
function preInit() {
	config.dataList = [];
	config.index = -1;
	config.msg = [];
	config.dateStart = 0;
	config.dateEnd = 0;

	let 票券開始日期 = $persistentStore.read('票券開始日期') || '';
	if (票券開始日期 != '') {
		try {
			config.dateStart = new Date(票券開始日期).getTime();
		} catch (error) { }
	}
	let 票券結束日期 = $persistentStore.read('票券結束日期') || '';
	if (票券結束日期 != '') {
		try {
			config.dateEnd = new Date(票券結束日期).getTime();
		} catch (error) { }
	}

}

const forMaxCount = 20;
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
			if (i == 2) {
				runCount++;
				let x = {};
				if (config.dataList.some((ds, dsi) => {
					if (ds.flag) { config.index = dsi; x = ds; ds.flag = false; return true; }
				})) {
					config.ticket_id = x.ticket_id;
					console.log(`\n`);
					//console.log(`\n\nTID: ${x.ticket_id}`);
					console.log(`店名: ${x.carrier_name}`);
					console.log(`名稱: ${x.product_name}`);
					console.log(`期限: ${x.et}`);

					config.msg.push(`店名: ${x.carrier_name}`);
					config.msg.push(`名稱: ${x.product_name}`);
					config.msg.push(`期限: ${x.et}`);

				} else { flag = false; break; }

			}
			let dc = GetDataConfig(i);
			//console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			if (flag && i >= 2) { i = 1; await delay(0.5, 0); }
			if (runCount >= forMaxCount) { break; }
			if (runCount > 10) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}

		console.log('');
		console.log('');
		console.log(config.msg.join('\t').replace(/\s+\t/ig, '\t').replace(/\t店名:/ig, '\n店名:').replace(/\thttp/ig, '\t\t\t\t\t\thttp')
			.replace(/(店名|名稱|期限|獲得): /ig, ''));
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);

		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}

	$done({});
})();

