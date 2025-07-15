let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '每日任務狀態';
const title = '寵物村 ' + caption;
const version = 'v20231206';
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
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
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
			'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
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
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			if (!found && json.data.games) {
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						// https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
						config.activityId = g.link_url.replace(/^.+\/\?activity=([0-9a-f]+)(&.+)?/i, '$1');
						config.activityName = g.app_name;
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('找不到寵物村遊戲');
				console.log(json.data);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData22(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			let basic = json.data.basic;
			let modules = json.data.modules;
			let ndt = new Date().getTime();
			let dbt = new Date(basic.begin_time * 1000);
			let det = new Date(basic.end_time * 1000);
			console.log(`名稱 : ${basic.game_name}`);
			if (ndt < det.getTime()) {
				config.event_code = basic.event_code;
				console.log(`EID : ${config.event_code}`);
				found = true;
			}
			else {
				console.log('\n活動已結束。');
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
let tasksList = [
	{ 'id': 'TD101', 'need': 2, 'name': '餵食寵物2次 75' },
	{ 'id': 'TD102', 'need': 99, 'name': '' },
	{ 'id': 'TD103', 'need': 1, 'name': '在學校聊天室發言1次 75' },
	{ 'id': 'TD104', 'need': 2, 'name': '在學校請求飼料2次 75' },
	{ 'id': 'TD105', 'need': 2, 'name': '在學校贈送他人飼料2次 75' },
	{ 'id': 'TD106', 'need': 3, 'name': '按讚他人3次 75' },
	{ 'id': 'TD107', 'need': 1, 'name': '在遊樂場玩遊戲 1 次 150' },
	{ 'id': 'TD108', 'need': 1, 'name': '去學校上團體課 150' },
	{ 'id': 'TD109', 'need': 1, 'name': '瀏覽衣櫥頁面1次 75' },
	{ 'id': 'TD110', 'need': 2, 'name': '前往學校拜訪不同人家2次 75' },
	{ 'id': 'TD111', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 150' },
	{ 'id': 'TD112', 'need': 1, 'name': '在服裝抽抽樂抽1次 150' },
	{ 'id': 'TD113', 'need': 1, 'name': '在衣櫥直購任一造型1次 150' },
	{ 'id': 'TD114', 'need': 1, 'name': '前往家園主題頁 75' },
	{ 'id': 'TD115', 'need': 99, 'name': '' },
	{ 'id': 'TD116', 'need': 99, 'name': '' },
	{ 'id': 'TD117', 'need': 99, 'name': '' },
	{ 'id': 'TD118', 'need': 99, 'name': '' },
	{ 'id': 'TD119', 'need': 1, 'name': '蝦幣玩猜拳1次 150' },
	{ 'id': 'TD120', 'need': 1, 'name': '去學校踢足球一次 150' },
	{ 'id': 'TD121', 'need': 1, 'name': '去學校上美術課(找碴) 150' },
	{ 'id': 'TD122', 'need': 1, 'name': '去學校上通職課(金頭腦) 150' },
	{ 'id': 'TD123', 'need': 1, 'name': '去學校上體育課(賽跑) 150' },
	{ 'id': 'TD124', 'need': 99, 'name': '' },
	{ 'id': 'TD125', 'need': 99, 'name': '' },
	{ 'id': 'TD126', 'need': 1, 'name': '蝦幣玩貪食蛇1次 150' },
	{ 'id': 'TD127', 'need': 1, 'name': '蝦幣玩桌上曲棍球1次 150' },
	{ 'id': 'TD128', 'need': 1, 'name': '抽寵物扭蛋1次 500' },
	{ 'id': 'TD129', 'need': 1, 'name': '蝦幣抽寵物1次 500' },
	{ 'id': 'TD130', 'need': 1, 'name': '在免費寵物扭蛋瀏覽推薦商品 60 秒 75' },
	{ 'id': 'TD131', 'need': 99, 'name': '' },
	{ 'id': 'TD132', 'need': 1, 'name': '蝦幣玩彈珠台1次 150' },
	{ 'id': 'TD133', 'need': 99, 'name': '' },
	{ 'id': 'TD134', 'need': 1, 'name': '免費玩猜拳1次 75' },
	{ 'id': 'TD135', 'need': 1, 'name': '免費玩貪食蛇1次 75' },
	{ 'id': 'TD136', 'need': 1, 'name': '免費玩桌上曲棍球1次 75' },
	{ 'id': 'TD137', 'need': 1, 'name': '免費玩彈珠台1次 75' },
	{ 'id': 'TD138', 'need': 1, 'name': '蝦幣玩小廚神1次 150' },
	{ 'id': 'TD139', 'need': 99, 'name': '' },
	{ 'id': 'TD140', 'need': 99, 'name': '' },
	{ 'id': 'TD141', 'need': 99, 'name': '' },
	{ 'id': 'TD142', 'need': 99, 'name': '' },
	{ 'id': 'TD143', 'need': 99, 'name': '' },
	{ 'id': 'TD144', 'need': 99, 'name': '' },
	{ 'id': 'TD145', 'need': 99, 'name': '' },
	{ 'id': 'TD201', 'need': 1, 'name': '完成新手導覽 100P' }, // No.1
	{ 'id': 'TD202', 'need': 1, 'name': '在學校請求飼料1次 100P' }, // No.3
	{ 'id': 'TD203', 'need': 99, 'name': '' },
	{ 'id': 'TD204', 'need': 1, 'name': '去學校玩課程遊戲1次 100P' }, // No. 4
	{ 'id': 'TD205', 'need': 1, 'name': '在學校聊天室發言1次 100P' }, // No. 5
	{ 'id': 'TD206', 'need': 1, 'name': '前往學校拜訪不同人家1次 100P' }, // No. 6
	{ 'id': 'TD207', 'need': 1, 'name': '升級家園主題 200P' }, // No. 7
	{ 'id': 'TD208', 'need': 1, 'name': '幫寵物換裝(需儲存)1次 200P' }, // No. 8
	{ 'id': 'TD209', 'need': 1, 'name': '蝦幣玩猜拳1次 400P' }, // No. 9
	{ 'id': 'TD210', 'need': 1, 'name': '蝦幣抽寵物1次 500P' }, // No. 12
	{ 'id': 'TD211', 'need': 1, 'name': '提領蝦幣1次 300P' }, // No. 13
	{ 'id': 'TD212', 'need': 1, 'name': '在免費寵物扭蛋瀏覽推薦商品 30 秒 100P' }, // No.2
	{ 'id': 'TD213', 'need': 1, 'name': '抽寵物扭蛋1次 200P' }, // No.10
	{ 'id': 'TD214', 'need': 1, 'name': '查看宿舍1次 100P' }, // No.11
	{ 'id': 'TD215', 'need': 99, 'name': '' },
	{ 'id': 'TD216', 'need': 99, 'name': '' },
	{ 'id': 'TD217', 'need': 99, 'name': '' },
	{ 'id': 'TD218', 'need': 99, 'name': '' },
	{ 'id': 'TD219', 'need': 99, 'name': '' },
	{ 'id': 'TD220', 'need': 99, 'name': '' },
];
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.event_code = json.data.eventCode;
			if (json.data.hasOwnProperty('pets') && json.data.pets && json.data.pets.length > 0) {
				config.petID = json.data.pets[0].petID;
			}
			if (json.data.hasOwnProperty('mainPet') && json.data.mainPet) {
				config.petID = json.data.mainPet.petID;
			}
			else {
				console.log('需設定主要的寵物。');
				//found = false;
			}
			console.log(`EID : ${config.event_code}`);
			console.log(`PID : ${config.petID}`);
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
		// console.log(data);
		// console.log(json.code);
		//console.log(JSON.stringify( obj));
		if (json.code === 0) {
			config.taskData = json.data;

			// console.log(json.data);
			// console.log('\n');

			config.taskData.dailyTasks.forEach((td, ti) => {
				try {
					let tsid = 'TD' + `${td.taskType}` + (`0${td.taskID}`.match(/\d{2}$/)[0]);
					let msg = '\n';
					msg += tsid + '\t';
					//console.log(tsid);
					if (tasksList.some(tl => {
						if (tl.id === tsid) {
							if (tl.need === 99) {
								msg += `${td.progress}\t未登入的任務`;
							}
							else {
								msg += `${td.progress}/${tl.need}\t${tl.name}`;
								msg += `\n\t\t${td.progress >= tl.need ? '已' : '未'}完成`;
							}
							if (td.isClaimed) { msg += '\t已兌換'; }

							return true;
						}
					})) {
						console.log(msg);
					}
					else {
						msg += `未知的任務`;
						console.log(msg);
						console.log(td);
					}

				}
				catch (e2) {
					console.log(td);
					console.log(e2);
				}
			});

		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

// ['!GET', '取得活動資訊', '取得', 'https://games.shopee.tw/gameplatform/api/v1/game/activity/{activityId}/settings?appid={appid}&basic=false', '', ['appid', 'activityId'], ProcData2],
let UrlData = [[],
['!GET', '取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '2', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得每日任務資訊', '3', 'https://games.shopee.tw/api-gateway/pet/task/daily_list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData3],
];
let DataPostBodyList = [, , , ,];
function preInit() {
	// config.shopeeHeaders['x-user-id'] = config.shopeeInfo.token.SPC_U;
	config.appid = 'LcqcAMvwNcX8MR63xX'; // 寵物村
	config.activityId = 'b711c6148c210f8f';
	config.activityName = '';
	config.event_code = '1dc0c8914b227e83';
	config.module_id = 0;
	config.caption = caption;
	config.hasTask = true;
}

const forMaxCount = 20;
const forMaxDebugCount = forMaxCount - 2;

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
			// console.log(`i : ${i}`);
			if (!flag) { break; }
			item = -1;
			runCount++;
			let dc = GetDataConfig(i);
			//console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > forMaxDebugCount) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };
		}
		caption = config.caption;
		console.log('');
		let msg = '處理已完成 ✅';
		console.log(msg);
		// loonNotify(msg);
	} catch (error) {
		caption = config.caption;
		handleError(error);
	}
	$done({});
})();

