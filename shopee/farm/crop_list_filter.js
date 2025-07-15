// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '顯示 種子清單';
const title = '蝦蝦果園 ' + caption;
const version = 'v20230918';
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
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}
let pp1 = $persistentStore.read('種子過濾清單') || ''; // ,預設(是),否,是
if (pp1 != '否') { pp1 = true; } else { pp1 = false; } if (pp1) { $persistentStore.write(null, '種子過濾清單'); }
let pp2 = $persistentStore.read('種子清單顯示蝦幣') || ''; // ,預設(是),否,是  // type=3
let pp22 = ''; if (pp2 == '4蝦幣') { pp22 = pp2; }
if (pp2 != '否') { pp2 = true; } else { pp2 = false; } if (pp2 && pp22 == '') { $persistentStore.write(null, '種子清單顯示蝦幣'); }
let pp3 = $persistentStore.read('種子清單顯示優惠券') || ''; // ,預設(是),否,是  // type=6
if (pp3 != '否') { pp3 = true; } else { pp3 = false; } if (pp3) { $persistentStore.write(null, '種子清單顯示優惠券'); }
let pp4 = $persistentStore.read('種子清單顯示點心券') || ''; // ,預設(是),否,是  // type=8
if (pp4 != '否') { pp4 = true; } else { pp4 = false; } if (pp4) { $persistentStore.write(null, '種子清單顯示點心券'); }
let pp5 = $persistentStore.read('種子清單顯示預估水量') || ''; // ,預設(是),否,是
if (pp5 != '否') { pp5 = true; } else { pp5 = false; } if (pp5) { $persistentStore.write(null, '種子清單顯示預估水量'); }
let pp6 = $persistentStore.read('種子清單僅顯示當日') || ''; // ,預設(否),否,是
if (pp6 == '是') { pp6 = true; } else { pp6 = false; } if (!pp6) { $persistentStore.write(null, '種子清單僅顯示當日'); }
let pp9 = $persistentStore.read('種子清單開放種子') || ''; // ,預設(自動),否,是,自動
let pp10 = false;
if (pp9 == '是') { pp9 = true; } else if (pp9 == '否') { pp9 = false; } else { pp9 = false; pp10 = true; }
if (!pp9 && pp10) { $persistentStore.write(null, '種子清單開放種子'); }
let pp8 = $persistentStore.read('種子清單排序') || ''; // ,預設(否),否,是
if (pp8 == '是') { pp8 = true; } else { pp8 = false; } if (!pp8) { $persistentStore.write(null, '種子清單排序'); }

let pp32 = $persistentStore.read('種子清單顯示優惠券其它') || ''; // ,預設(是),否,是
if (pp32 != '否') { pp32 = true; } else { pp32 = false; } if (pp32) { $persistentStore.write(null, '種子清單顯示優惠券其它'); }


console.log('開放種子: ' + (pp10 ? '自動' : (pp9 ? '是' : '否')));

async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code == 0) {

			let ds2 = [];
			let ds = json.data.cropMetas;
			console.log(ds.length);
			let dn = new Date();// '2023/12/18 23:50:00'
			let _dy = dn.getFullYear();
			let _dm = dn.getMonth();
			let _dd = dn.getDate();
			let hw = 50 / 3; // water/hour 50w/3h
			let dnd = new Date(dn.format('2')).getTime();
			let odt = 24 * 60 * 60 * 1000;
			let dnd2 = dnd + odt;
			// console.log(`dn: ${new Date(dn).format()}`);
			// console.log(`dnd: ${new Date(dnd).format()}\tdnd2: ${new Date(dnd2).format()}`);


			ds = ds.filter(d => {
				if (d.price > 0 || d.rewardMetaVo.type == 5
					|| d.name.includes("不含運") || d.name.includes("小時免費充電") || d.name.includes("蝦大")
					|| (d.rewardMetaVo.type == 6
						&& !(d.name.includes('蝦')
							|| d.name.includes('免運')
							|| d.name.includes('限量')
							|| d.name.includes('天天抽')
							|| d.name.includes('免費')
							|| d.name.includes('咖啡')
							|| d.name.includes('CAFE')
							|| d.name.includes('道具')
							|| d.name.includes('&優惠券')
							|| d.name.includes('LiTV')
							|| (pp32 && (d.name.includes('肯德基')
								|| d.name.includes('必勝客')))))
				) { return false; }
				let bF = false;
				if ((pp2 && d.rewardMetaVo.type == 3
					|| pp4 && d.rewardMetaVo.type == 8
					|| pp3 && d.rewardMetaVo.type == 6)) {

					//if(d.rewardMetaVo.type==6 && )

					if (!pp6 || pp6 && dnd2 >= d.config.startTime && dnd <= d.config.endTime) {
						// console.log(`\n\n${d.name}`);
						// console.log(`ST: ${new Date(d.config.startTime).format()}\t${new Date(d.config.endTime).format()}`);
						let nextReleaseTime = 0;
						if (d.nextReleaseTime > 0) { nextReleaseTime = d.nextReleaseTime; }
						if (pp9) {
							d.curNum = 0; d.status = 1;
							// 時間 減 1 天 才能正常取得
							d.config.startTime -= odt;
							if (nextReleaseTime > 0) {
								d.nextReleaseTime -= odt;
							}
						} else if (pp10) { // 自動
							// console.log(new Date(nextReleaseTime).format());
							if (nextReleaseTime == 0 && d.config.startTime > dn) { nextReleaseTime = d.config.startTime; }
							let nextReleaseTimeN = nextReleaseTime + (2 * 60 * 1000);
							let nextReleaseTimeP = nextReleaseTime - (30 * 60 * 1000);
							// console.log(`${new Date(nextReleaseTimeP).format()}\t${new Date(nextReleaseTime).format()}\t${new Date(nextReleaseTimeN).format()}`);
							if (dn >= nextReleaseTimeP && dn <= nextReleaseTimeN) {
								d.curNum = 0; d.status = 1;
								// 時間 減 1 天 才能正常取得
								if (dn >= d.config.startTime) { d.config.startTime -= (30 * 60 * 1000); }
								if (d.nextReleaseTime > 0) { d.nextReleaseTime = nextReleaseTimeP; }
							}
						}

						//if (dnd == d.config.startTime) { d.config.startTime -= odt; }
						bF = true;
						if (pp5) {

							let needDays = parseFloat(d.config.needDays);
							let totalExp = parseInt(d.config.totalExp);
							if (!d.thumbnailText.includes("天) ")) {
								let ii0 = false;
								if (d.thumbnailText.match(/^\d+蝦幣$/i)) { ii0 = true; }
								let cct = 0; let h3 = 0; let h2 = 0; let ii = 0;
								while (cct < totalExp) {
									if (h2 == 12) { if (ii == 0 && ii0 || ii > 0) { cct += 870; } ii++; h2 = 0; }
									else { cct += hw; h3++; h2++; }
								}
								d.thumbnailText = '(' + (Math.ceil((h3 / 24) * 10) / 10).toString() + '天) ' + d.thumbnailText;
							}
						}

					}

				}

				return bF;
			});
			console.log(ds.length);

			console.log('');
			for (let i = 0; i < ds.length; i++) {
				let d = ds[i];
				let nrt = new Date(d.nextReleaseTime);
				let sd = new Date(d.config.startTime);
				let ed = new Date(d.config.endTime);
				// console.log(`${(i + 1).toString().padStart(3, '0')}:${d.rewardMetaVo.type}:${d.status}:${nrt.format('1')}:${sd.format('1')}-${ed.format('1')},${d.config.totalExp.toString().padStart(4, ' ')},${d.curNum.toString().padStart((d.curNum === 0 ? 1 : 5), ' ')}/${d.totalNum.toString().padStart(5, ' ')},${d.name}`);
				console.log(`${(i + 1).toString().padStart(3, '0')}:${d.rewardMetaVo.type}:${nrt.format('4')}:${sd.format('4')}-${ed.format('4')},${d.config.totalExp.toString().padStart(4, ' ')},${d.curNum.toString().padStart((d.curNum === 0 ? 1 : 5), ' ')}/${d.totalNum.toString().padStart(5, ' ')},${d.name}`);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}



let UrlData = [[],
['GET', '顯示種子清單', '取得', 'https://games.shopee.tw/farm/api/orchard/crop/meta/get?t={token}', '', ['token'], ProcData1],
];
let DataPostBodyList = [, ,];
function preInit() {
	console.log('BBB');
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
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			item = -1;
			if (i == 1) {
			}
			let dc = GetDataConfig(i);
			// console.log(`🌐 ${dc.method} URL : ${dc.url}`);
			if (dc.method == 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (dc.method == 'POST') {
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

