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


const caption = '遊戲清單';
const title = '顯示 蝦皮 ' + caption;
const version = 'v20231223';
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
        let UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=zh-Hant version=31208 appver=31208 rnver=1698306827 shopee_rn_bundle_version=5096001 Shopee language=zh-Hant app_type=1';
        // let UA = 'iOS app iPhone Shopee appver=31208 language=zh-Hant app_type=1 Cronet/102.0.5005.61';
        // try {
        //   let ua1 = JSON.parse($persistentStore.read('ShopeeUserAgent') || '{"DataDate":"","UA":""}');
        //   if (ua1.UA != '') { UA = ua1.UA; }
        // } catch (error) { }
        shopeeHeaders['User-Agent'] = UA;

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

		function htmlDecode(str) {
			var _str = '';
			if (str.length == 0) return '';
			_str = str.replace(/&amp;/g, '&');
			_str = _str.replace(/&lt;/g, '<');
			_str = _str.replace(/&gt;/g, '>');
			_str = _str.replace(/&quot;/g, '"');
			return _str;
		}
		//let data = document.querySelector('#jfContent_pre').innerHTML;
		let json = JSON.parse(data);
		let found2 = false;
		let show_d = false;
		let gns = [
			{ id: 'pet', n: '寵物村' },
			{ id: 'farm', n: '果園  ' },
			{ id: 'claw', n: '夾夾樂' },
			{ id: 'candy', n: '消消樂' },
			{ id: 'puzzle', n: '泡泡王' },
			{ id: 'knife', n: '飛刀  ' },
			{ id: 'collectible', n: '特蒐任務' },
			{ id: 'luckydraw', n: '抽抽樂' },
		];
		config.games = [];
		config.luckydraws = [];
		json.data.content.forEach((c, ci) => {
			ci++;
			let urls = [];
			if (c.type === 3) {
				if (show_d) console.log(`\n${ci}\t${c.type}\t${c.general.name}`);
				c.data.hotspots.forEach(h => {
					let url = htmlDecode(h.link);
					if (show_d) console.log(`\t\t${url}`);
					urls.push(url);
					if (found2) {
						config.games.push(url);
					}
					if (url.match(/luckydraw\-v2/i)) {
						if (!config.luckydraws.some(u => {
							if (u.includes(url) || url.includes(u)) {
								return true;
							}
						})) {
							config.luckydraws.push(url);
						};
					}
				});
			}
			else if (c.type === 5) {
				if (show_d) console.log(`\n${ci}\t${c.type}\t${c.general.name}`);
				let url = htmlDecode(c.data.dangerously_set_inner_html).replace(/.+\"([^\"]+)\".+/, '$1');
				if (show_d) console.log(`\t\t${url}`);
				urls.push(url);
				if (url.match(/luckydraw\-v2/i)) {
					if (!config.luckydraws.some(u => {
						if (u.includes(url) || url.includes(u)) {
							return true;
						}
					})) {
						config.luckydraws.push(url);
					};
					// let us = url.split(' ');
					// us.some(u => {
					// 	if (u.match(/luckydraw\-v2/i)) {
					// config.luckydraws.push(u.replace(/.+\"([^\"]+)\\\".+/, '$1'));
					// 		return true;
					// 	}
					// });
				}

			}
			else if (c.type === 26) {
				found2 = false;
				if (show_d) console.log(`\n${ci}\t${c.type}\t${c.general.name}\t${c.data.header_text}`);
				if (c.general.name.includes('經典遊戲')) { found2 = true; }
			}
			else if (c.type === 21) {
				if (show_d) console.log(`\n${ci}\t${c.type}\t${c.general.name}`);
				// console.log(c.data.vouchers)
				// if (c.data.vouchers && c.data.vouchers.manual_vouchers) {
				// 	c.data.vouchers.manual_vouchers.forEach((v, vi) => {
				// 		if (show_d) console.log(`\t\t${vi + 1}\t${v.ribbon_text} (${v.promotion_id})\n\t\t${v.display_shop_name}\t${v.redirect_url}\n\t\t${v.promotion_signature}`);
				// 		urls.push(v.redirect_url);
				// 	});
				// }
			}
			else if (c.type === 32) {
				if (show_d) console.log(`\n${ci}\t${c.type}\t${c.general.name}`);
				// c.data.vouchers.forEach((v, vi) => {
				// 	if (show_d) console.log(`\t\t${vi + 1}\t${v.redirect_url}`);
				// 	urls.push(v.redirect_url);
				// });
			}
			else if (c.type === 23) { // 說明
				// console.log(`${ci}\t${c.type}\t${c.general.name}`);
			}
			else if (c.type === 11) { // back to top
				// console.log(`${ci}\t${c.type}\t${c.general.name}`);
			}
			else {
				console.log(`\n${ci}\t${c.type}\t${c.general.name}`);
				console.log(c);
				// console.log(`${h.type}\t${h.link}`);
			}
			if (found2 && c.type != 3 && c.type != 26) { found2 = false; }
			if (show_d && urls.length > 0) {
				console.log('');
				urls.forEach((u, ui) => {
					let mm = '❌';
					let gn = '';
					gns.some(g => { if (u.includes(g.id)) { gn = g.n; return true; } });
					if (u.match(/(game|free|universal)/i) || c.general.name.includes('運')) { mm = '⭕️'; }
					console.log(`${mm}\t${gn}\t${u}`);
				});
			}
		});

		// console.log(config.games);
		// console.log(config.luckydraws);

		if (config.games.length > 0) {
			console.log('');
			config.games.forEach((u, ui) => {
				let mm = '❌';
				let gn = '';
				gns.some(g => { if (u.includes(g.id)) { gn = g.n; return true; } });
				if (u.match(/(game|free|universal)/i)) { mm = '⭕️'; }
				console.log(`${mm}\t${gn}\t${u}`);
			});
		}
		if (config.luckydraws.length > 0) {
			console.log('\n\n');
			config.luckydraws.forEach((u, ui) => {
				let mm = '❌';
				let gn = '';
				gns.some(g => { if (u.includes(g.id)) { gn = g.n; return true; } });
				if (u.match(/(game|free|universal)/i)) { mm = '⭕️'; }
				console.log(`${mm}\t${gn}\t${u}`);
			});
		}

		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得遊戲清單', '取得', 'https://shopee.tw/api/v4/microsite/get_page_configuration?url=shopeedailygames&platform=mobile&version=2023.12.v2', '', , ProcData1],
];
let DataPostBodyList = [,];
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

