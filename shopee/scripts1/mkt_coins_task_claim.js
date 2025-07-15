let argd = '';
try {
	if ($argument) { argd = $argument; }
} catch (e) { console.log(e); }

let NotSet = false;
let ShopeeUserID2 = '';
let UserNickname = '';
try {
	if (argd != '') {
		if (argd == '0') {
			NotSet = true;
		}
		else if (argd.includes(';')) {
			let ds = argd.split(';');
			ShopeeUserID2 = ds[0].trim();
			UserNickname = ds[1].trim();
		}
		else {
			ShopeeUserID2 = argd;
		}
	}
} catch (e) { console.log(e); }


// ver 20230702
let UseUserId = $persistentStore.read('UseUserId') || '';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
if (ShopeeUserID2 != '') { ShopeeUserID = ShopeeUserID2; UseUserId = '1'; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

// let NotAutoClaim = $persistentStore.read('手動領蝦幣任務獎勵') || '';
// //$persistentStore.write(null, '手動領蝦幣任務獎勵');
// //let NotAutoClaim = $persistentStore.read('手動簽到') || '';
// if (NotAutoClaim == '是') { NotAutoClaim = true; } else { NotAutoClaim = false; }
// let UseUA = $persistentStore.read('領蝦幣任務獎勵UA') || '';
// if (UseUA == '是') { UseUA = true; } else { UseUA = false; }
let AutoClaim = true;
let UseUA = true;
try {
	let vv = $loon.split(' ');
	if (vv.length >= 3) {
		if (vv[2].match(/^(\d+)\.(\d+)\.(\d+)/)) {
			let vv2 = vv[2].match(/^(\d+)\.(\d+)\.(\d+)/);
			let v1 = parseInt(vv2[1]);
			let v2 = parseInt(vv2[2]);
			let v3 = parseInt(vv2[3]);
			if (!(v1 > 3 || v1 == 3 && (v2 > 1 || v2 == 1 && v3 > 0))) { UseUA = false; }
			//console.log(`${v1} ${v2} ${v3}`);
		}
	}
} catch (error) { console.log('NO $loon'); }

let caption = '每日任務 領任務蝦幣';
let title = '💰我的蝦幣 ' + caption;
const version = 'v20240811';
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
			//'Cookie': `${cookieToString(shopeeInfo.token)};csrftoken=${shopeeInfo.csrfToken}`,
			'Cookie': `${shopeeInfo.cookieAll}SPC_EC=${shopeeInfo.token.SPC_EC}`,  // 
			'Content-Type': 'application/json',
		}
		// UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15.7.2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7.2 Mobile/15E148 Safari/604.1';
		UA = 'iOS app iPhone Shopee appver=33953 language=zh-Hant app_type=1 platform=native_ios os_ver=16.7.2 Cronet/102.0.5005.61';
		shopeeHeaders['User-Agent'] = UA;

		// if (UseUA) {
		// 	let UA = 'iOS app iPhone Shopee appver=31208 language=zh-Hant app_type=1 Cronet/102.0.5005.61';
		// 	try {
		// 		let ua1 = JSON.parse($persistentStore.read('ShopeeUserAgent') || '{"DataDate":"","UA":""}');
		// 		if (ua1.UA != '') { UA = ua1.UA; }
		// 	} catch (error) { }
		// 	shopeeHeaders['User-Agent'] = UA;
		// 	shopeeHeaders['x-csrftoken'] = shopeeInfo.csrfToken;
		// 	shopeeHeaders['referer'] = 'https://games-dailycheckin.shopee.tw/mkt/coins/api/';
		// }

		// console.log(shopeeHeaders);
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
		// console.log(json);
		let mkt_tasks = null;
		if (json.code === 0) {
			found = true;
			let ut = json.data.user_tasks;
			config.ts = [];
			let msg = [];
			if (ut && ut.length > 0) {
				mkt_tasks = data;
				config.mkt_tasks = mkt_tasks;

				let tss = [];
				ut.forEach(t => {
					let tt = {
						'can_reward': t.can_reward,
						'task_status': t.task_status,
						'id': t.task.id,
						'task_name': t.task.task_name,
						'prize_value': t.task.prize_value
					};
					msg.push(`\n${tt.id.toString().padEnd(6)}\t`);
					msg.push(`${tt.prize_value}\t`);
					if (tt.can_reward) { msg.push(`可領`.padEnd(6)); }
					if (tt.task_status === 3) { msg.push(`已完成`); }
					msg.push(`\t${tt.task_name}`);
					tss.push(tt);
					let tsid3 = `ST${t.task.id}`;
					// let tsid3Name = `${t.task.task_name} ${t.task.prize_value}`;
					let tsid2 = '';
					if (tasksData.some(td => {
						if (td.id === tt.id) {
							tsid2 = td.tsid;
							return true;
						}
					})) {
						try {
							let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
							let tsn = 'shopee' + 's';
							let tsid = tsid2;
							let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
							let tasks = JSON.parse(rs);
							let ts = {}, s = {};
							if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
							if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
							s.s = 1
							if (!s.f) {
								if (tt.task_status === 3) {
									s.f = true;
									s.d.push(`🔆${tt.prize_value} 蝦幣`);
								}
								if (s.f) { s.c = 1; } else { s.c = 0; }
							}
							if (s.d.length > 1) {
								let sd = [];
								sd.push(s.d[0]);
								s.d = sd;
							}

							if (s.c > 0) { s.s = 0; }
							ts[tsid] = s;
							tasks[tsn] = ts;
							$persistentStore.write(JSON.stringify(tasks), dataName);
						} catch (e) { console.log(e); }

					}
					else {  // 不存在列表的，直接寫入
						try {
							let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
							let tsn = 'shopee' + 's';
							let tsid = tsid3;
							let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
							let tasks = JSON.parse(rs);
							let ts = {}, s = {};
							if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
							if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
							s.s = 1
							if (!s.f) {
								if (tt.task_status === 3) {
									s.f = true;
									s.d.push(`🔆${tt.prize_value} 蝦幣`);
								}
								if (s.f) { s.c = 1; } else { s.c = 0; }
							}
							if (s.d.length > 1) {
								let sd = [];
								sd.push(s.d[0]);
								s.d = sd;
							}

							if (s.c > 0) { s.s = 0; }
							ts[tsid] = s;
							tasks[tsn] = ts;
							$persistentStore.write(JSON.stringify(tasks), dataName);
						} catch (e) { console.log(e); }


					}

					try {
						let DTND = new Date(new Date().format('2')).getTime();
						if ((t.task.id == 9948 || t.task_id == 15677 || t.task_id == 16300) && t.task_status == 3) {
							let gmp = { 'dataTime': DTND };
							$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
						}
						else if (t.task.id == 15676 && t.task_status == 3) {
							let gmp = { 'dataTime': DTND };
							$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink1' + _ShopeeUserID);
						}
						else if (t.task.id == 16111 && t.task_status == 3) {
							let gmp = { 'dataTime': DTND };
							$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink2' + _ShopeeUserID);
						}
					} catch (error) { }

				});
				console.log(msg.join(''));
				config.ts = tss;
			}
			else {
				console.log('現在沒有任務。');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		$persistentStore.write(mkt_tasks, 'shopee_mkt_coins_tasks' + _ShopeeUserID);
		return resolve(found);
	});
}
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		//console.log(json);
		if (json.code === 0) {
			found = true;
			let msg = '';
			try {
				msg = `獲得 ${json.data.coin_amount} 蝦幣`;

			} catch (error) {
				console.log(json);
			}
			console.log(msg);

			let tsid2 = '';
			if (tasksData.some(td => {
				if (td.id === config.task_id) {
					tsid2 = td.tsid;
					return true;
				}
			})) {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'shopee' + 's';
					let tsid = tsid2;
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c++;
					if (s.s > 0) { s.s--; }
					s.f = true;
					s.d.push(`🔆${json.data.coin_amount} 蝦幣`);
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

			}
			else {
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'shopee' + 's';
					let tsid = `ST${config.task_id}`;
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.c++;
					if (s.s > 0) { s.s--; }
					s.f = true;
					s.d.push(`🔆${json.data.coin_amount} 蝦幣`);
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

			}

			let mkt_tasks = config.mkt_tasks;
			let obj_mkt = JSON.parse(mkt_tasks);
			obj_mkt.data.user_tasks.some(t => {
				if (t.task.id == config.task_id) { t.task_status = 3; return true; }
			});
			config.mkt_tasks = JSON.stringify(obj_mkt);
			$persistentStore.write(config.mkt_tasks, 'shopee_mkt_coins_tasks' + _ShopeeUserID);

			//$persistentStore.write(null, 'ShopeeFeedsTaskToken');
		}
		else {
			//			return reject([`執行失敗 ‼️`, json.msg, data]);
			console.log(data);
			console.log('❌ 失敗！\n' + json.msg);
		}
		return resolve(found);
	});
}

let UrlData = [[],
['GET', '取得任務清單', '1', 'https://games-dailycheckin.shopee.tw/mkt/coins/api/v2/tasks', '', , ProcData1],
['POST', '領取任務蝦幣', '2', 'https://games-dailycheckin.shopee.tw/mkt/coins/api/v2/task/claim', '', , ProcData2],
];
let DataPostBodyList = [, , {
	'task_id': 0
}, , , ,
];

function preInit() {
	config.shopeeHeaders['x-csrftoken'] = config.shopeeInfo.csrfToken;
	//config.shopeeHeaders['shopee_token'] = config.shopeeInfo.token.shopee_token;
	//config.shopeeHeaders['x-device-id'] = config.deviceId;
	config.mkt_tasks = null;
}
let tasksData = [
	{ 'tsid': 'ST45', 'id': 9945, 'need': 1, 'name': '今日玩蝦蝦寵物村1次' },
	{ 'tsid': 'ST47', 'id': 9947, 'need': 1, 'name': '今日玩蝦皮夾夾樂1次' },
	{ 'tsid': 'ST48', 'id': 9948, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST15677', 'id': 15677, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST16300', 'id': 16300, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST15676', 'id': 15676, 'need': 1, 'name': '瀏覽 推薦商品 30秒 (1/2)' },
	{ 'tsid': 'ST16111', 'id': 16111, 'need': 1, 'name': '瀏覽 推薦商品 30秒 (2/2)' },
	{ 'tsid': 'ST16112', 'id': 16112, 'need': 1, 'name': '今日玩蝦皮消消樂1次' },
	{ 'tsid': 'ST16113', 'id': 16113, 'need': 1, 'name': '今日玩蝦皮夾夾樂1次' },
];
const forMaxCount = 10;
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
				if (config.ts && config.ts.length > 0) {
					if (config.ts.some(t => {
						if (t.can_reward) {
							t.can_reward = false;
							console.log(`領任務獎勵 : ${t.task_name} ${t.prize_value}`);
							config.task_id = t.id;
							config.task_name = t.task_name;
							DataPostBodyList[i].task_id = t.id;
							return true;
						}
					})) {
						runCount++;
						item = runCount;
					}
					else {
						flag = false; break;
					}
				}
				else {
					flag = false; break;
				}
			}
			// if (i == 2 && NotAutoClaim) { console.log('\n您指定了「手動領蝦幣任務獎勵」，請在蝦皮App中，領取獎勵。'); break; }

			let dc = GetDataConfig(i);
			// console.log(`\n🌐 ${dc.method} URL: ${dc.url} \n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i === 2) {
				if (flag) {

				} else {
					flag = true;
				}
				i--;
			}
			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 50) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

		}

		if (config.ts.length > 0) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				if (!tasks.hasOwnProperty('shopeetasks_ids')) {
					tasks.shopeetasks_ids = config.ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				}
			} catch (e) { console.log(e); }
		}

		console.log('');
		// console.log(JSON.stringify(config.fss).replace(/,"last/ig, ',\n"last').replace(/},/ig, '},\n'));
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();


