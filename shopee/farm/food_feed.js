let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

// let caption = '寵物退休休息、年輕工作、餵食、扭蛋、互動';
let caption = '寵物退休休息、互動';
let title = '自動' + caption;
const version = 'v20240129';
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
			// 'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
			'Cookie': `${shopeeInfo.cookieAll}`,  // SPC_EC=${shopeeInfo.token.SPC_EC}
			'Content-Type': 'application/json',
		}

		// let UA = 'iOS app iPhone Shopee appver=31208 language=zh-Hant app_type=1 Cronet/102.0.5005.61';
		// try {
		//   let ua1 = JSON.parse($persistentStore.read('ShopeeUserAgent') || '{"DataDate":"","UA":""}');
		//   if (ua1.UA != '') { UA = ua1.UA; }
		// } catch (error) { }
		// shopeeHeaders['User-Agent'] = UA;

		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}
// some true ,  every false

async function ProcData0(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
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
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.event_code = json.data.eventCode;
			if (json.data.hasOwnProperty('mainPet') && json.data.mainPet) {
				config.petID = json.data.mainPet.petID;
			}
			else {
				console.log('需設定主要的寵物。');
				//found = false;
			}

			if (config.petID === 0 && json.data.hasOwnProperty('pets') && json.data.pets && json.data.pets.length > 0) {
				config.petID = json.data.pets[0].petID;
			}
			if (!config.isReload) {
				console.log(`EID : ${config.event_code}`);
				console.log(`PID : ${config.petID}`);
			}

			config.pets = json.data.pets;
			config.workCount = config.pets.length;

			config.isReload = false;

			if (config.pets) {

			}
			else {
				found = false;
				console.log('目前沒有工作中的寵物，請選擇寵物工作。');
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
		if (json.code == 0 && 'pets' in json.data && json.data.pets.length > 0) {
			found = true;
			config.dormitoryPets = json.data.pets;
			//console.log(json.data.pets);
			json.data.pets.forEach(p => {
				if (p.attr.dayFeedNum > 0) { config.dayFeedNum += p.attr.dayFeedNum; }
			});
			// console.log(json.data.total);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'W1';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.s = json.data.total;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FF';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = config.dayFeedNum;
				s.f = s.c > 0;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData32(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code == 0 && 'pets' in json.data && json.data.pets.length > 0) {
			found = true;
			config.dormitoryRetirePets = json.data.pets;
			config.HangOutPetID = json.data.pets[0].petID;
			console.log(config.HangOutPetID);
			json.data.pets.forEach(p => {
				if (p.attr.dayFeedNum > 0) { config.dayFeedNum += p.attr.dayFeedNum; }
			});
			// console.log(json.data.total);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'W2';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.s = json.data.total;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FF';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = config.dayFeedNum;
				s.f = s.c > 0;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else if (json.code == 0 && 'pets' in json.data && json.data.pets.length == 0) {
			found = true;
			console.log('沒有退休寵物。');
		}
		else {
			found = true;
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;

			let fl = json.data.foodList;
			let ownedCNT = 0;
			fl.some(f => { if (f.foodID === 11001) { ownedCNT = f.ownedCNT; return true; } });
			config.ownedCNT = ownedCNT;
			console.log(`目前飼料 : ${ownedCNT}`);
			//if (ownedCNT === 0) { found = false; }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = ownedCNT;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.isReload = true;
			//console.log(json);
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

async function ProcData9(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.isReload = true;
			config.ownedCNT -= 100;
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'FF';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData10(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			// console.log('暫時顯示');
			// console.log(json);
			let msg = '';

			let chance = 0;
			let adsChance = 0;

			if (json.data.lastFreeTwist === 0) {
				chance++;
				console.log('有免費扭蛋可領');
			}
			else {
				msg = new Date(json.data.lastFreeTwist + 1209600000).format('MM/dd HH:mm:ss'); // 14Day
				console.log(`下次免費扭蛋: ${msg}`);
			}
			// 需要 30 秒
			// json.data.gachaAds.cdTime === 0 && json.data.gachaAds.leftFreeTwist === 0
			// 可領
			// json.data.gachaAds.cdTime > 0 && json.data.gachaAds.leftFreeTwist = 1
			if (json.data.gachaAds.enable) {
				if (json.data.gachaAds.cdTime === 0 && json.data.gachaAds.leftFreeTwist === 0) {
					adsChance++;
					console.log('有Ads免費扭蛋可領，需要瀏覽商品廣告⚠️');
				}
				else if (json.data.gachaAds.cdTime > 0 && json.data.gachaAds.leftFreeTwist > 0) {
					adsChance++;
					config.canAdsChance = true;
					console.log('有Ads免費扭蛋可領⭕️');
				}
				else {
					console.log('Ads免費扭蛋已領✅');
				}
			}
			config.chance = chance;
			config.adsChance = adsChance;

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PTI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.s = chance;
				//s.f = s.c == 0;
				s.r = msg;
				if (s.r != '' && s.d.length === 0) { s.f = true; }
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PTIB';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.s = adsChance;
				s.f = json.data.gachaAds.enable && s.s == 0;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData11(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		config.chance--;
		if (json.code === 0) {
			found = true;

			let msg = `${json.data.pet.attr.coinEfficiencyMin}`; // ${json.data.pet.petID} 
			console.log(`獲得年輕寵物: ${msg}`);

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PTI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				if (s.s > 0) { s.s--; }
				s.d.push(' ' + msg);
				s.f = s.c > 0;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData12(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		config.adsChance--;
		if (json.code === 0) {
			found = true;

			let msg = `${json.data.pet.attr.coinEfficiencyMin}`;// ${json.data.pet.petID} 
			console.log(`獲得年輕寵物: ${msg}`);

			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PTIB';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				if (s.s > 0) { s.s--; }
				s.d.push(' ' + msg);
				s.f = s.c > 0;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData13(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;

			console.log(`寵物第 ${json.data.cnt} 次互動，獲得 ${json.data.points} 點數。目前點數：${json.data.currentTotal}`);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PIA';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (s.c == 0) { s.s = 10; }
				s.c = json.data.cnt;
				s.r = ' ';
				if (s.s > 0) { s.s--; }
				s.f = s.c > 0;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
			// "data":{"currentTotal":11298,"points":10,"cnt":5}

		}
		else if (json.code == 611000) {
			console.log('已完成今天所有互動。');
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'PIA';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (s.c == 0) { s.c = 1; }
				s.r = ' ';
				if (s.s > 0) { s.s = 0; }
				s.f = true;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
			// return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}

// 點寵物賺100點
// https://games.shopee.tw/api-gateway/pet/pet/interactive?activityCode=b711c6148c210f8f&eventCode=7bb0feb4c00db6dc
// {"petID":157817861,"token":"1694162664217"}
// {"code":0,"msg":""                            ,"timestamp":1694162664716,"traceID":"9531632d3ddb4171835ba67c42265f82","data":{"currentTotal":11298,"points":10,"cnt":5}}
// {"code":611000,"msg":"interactive reach limit","timestamp":1694163054041,"traceID":"1c93cfd47ca74f97bd7385999b3e6121","data":{"currentTotal":0,"points":0,"cnt":0}}


let UrlData = [[],
['!GET', '取得遊戲清單C2', '1', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '2', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得年輕寵物資訊', '3', 'https://games.shopee.tw/api-gateway/pet/dormitory/list?activityCode={activityId}&eventCode={event_code}&lifeStatus=1&pageNum=1&pageSize=12', '', ['activityId', 'event_code'], ProcData3],
['GET', '取得退休寵物資訊', '4', 'https://games.shopee.tw/api-gateway/pet/dormitory/list?activityCode={activityId}&eventCode={event_code}&lifeStatus=2&pageNum=1&pageSize=12', '', ['activityId', 'event_code'], ProcData32],
['GET', '取得飼料資訊', '5', 'https://games.shopee.tw/api-gateway/pet/food/list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData4],
['POST', '讓退休寵物休息', '6', 'https://games.shopee.tw/api-gateway/pet/dormitory/withdraw?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
//['!POST', '讓年輕寵物出門', '7', 'https://games.shopee.tw/api-gateway/pet/dormitory/hangout?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
['POST', '讓退休寵物出門', '7', 'https://games.shopee.tw/api-gateway/pet/dormitory/hangout?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData5],
['GET', '取得寵物資訊', '8', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData3],
['POST', '執行寵物餵食', '9', 'https://games.shopee.tw/api-gateway/pet/food/feed?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData9],
['GET', '取得扭蛋資訊', '10', 'https://games.shopee.tw/api-gateway/pet/pet/twist_info?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData10],
['!POST', '執行扭蛋取得寵物', '11', 'https://games.shopee.tw/api-gateway/pet/pet/twist?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData11],
['!POST', '執行扭蛋取得寵物Ads', '12', 'https://games.shopee.tw/api-gateway/pet/pet/twist?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData12],
['POST', '執行寵物互動', '13', 'https://games.shopee.tw/api-gateway/pet/pet/interactive?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData13],
['!POST', '執行', '14', 'https://games.shopee.tw/api-gateway/pet/?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData0],
['GET', '取得飼料資訊', '15', 'https://games.shopee.tw/api-gateway/pet/food/list?activityCode={activityId}&eventCode={event_code}&', '', ['activityId', 'event_code'], ProcData4],
];
let DataPostBodyList = [, , , , , ,
	{ "petID": 0 },
	{ "petID": 0 }, ,
	{ "foodID": 11001, "token": '', "petID": 0 }, ,
	{ "costPrice": 0, "token": getToken(), "channel": "normal" },
	{ "costPrice": 0, "token": getToken(), "channel": "ads" },
	{ "petID": 0, "token": getToken() }, , , , , ,
];

function preInit() {
	config.appid = 'LcqcAMvwNcX8MR63xX'; // 寵物村
	config.activityId = 'b711c6148c210f8f';
	config.event_code = '1dc0c8914b227e83';
	config.deviceId = config.shopeeInfo.token.SPC_F;
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.caption = caption;
	config.title = title;
	config.taskData = {};
	config.ownedCNT = 0;
	config.petID = 0;
	config.petIDFood = 0;
	config.petIDInteractive = 0;
	config.isReload = false;
	config.workCount = 0;
	config.canAdsChance = false;
	config.adsChance = 0;
	config.chance = 0;
	config.dayFeedNum = 0; // 餵食次數
	config.HangOutPetID = 0;
}

const forMaxCount = 30;
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
			if (i == 6) {
				let found = false;
				// console.log(`\n ${config.pets.length} 寵物出門`);
				let msg = '';
				if (config.pets.some((pd, pi) => {
					// console.log(pd.attr.dayFeedNum);
					// console.log(pd.attr.dayFeedLimit);
					// console.log(pd.attr.digestTime);
					if (!pd.hasOwnProperty('flag')) { pd.flag = true; }
					if (pd.flag && pd.lifeStatus != 1) {
						msg += `\n${pd.petID} : 退休`;
						config.petIDFood = pd.petID;
						pd.flag = false;
						if (config.workCount > 2) { // 保留兩個寵物
							config.workCount--;
							found = true;
							return true;
						}
						else {
							msg += '\t工作中寵物數不足，不處理。';
						}
					}
				})) {
					if (msg != '') { console.log(msg); }

					runCount++;
					DataPostBodyList[i].petID = config.petIDFood;
					if (config.isReload) { await delay(1.0); }
				}
				else {
					if (msg != '') { console.log(msg); }
					i++;
					//i = 11;
				}

			}
			if (i === 7) {
				if (config.workCount == 0) {
					found = true;
					config.workCount++;
					DataPostBodyList[i].petID = config.HangOutPetID;
					config.petIDInteractive = config.HangOutPetID;
					if (config.isReload) { await delay(1.0); }
				}
				//if (false && config.workCount < 3) { // 年輕寵物 不自動出門
				// else if (false) {
				// 		console.log(`\n ${config.workCount} 寵物出門工作中`);
				// 		// console.log('出門工作中寵物數不足，');
				// 		// console.log('請手動讓寵物出門工作。');

				// 		let found = false;
				// 		if (config.dormitoryPets.some(p => {
				// 			if (!p.hasOwnProperty('flag')) { p.flag = true; }

				// 			// msg.push(p.petID);
				// 			if (p.attr.retiredTime > new Date().getTime() || p.attr.retiredTime === 0) {
				// 				if (!config.pets.some((pd) => {
				// 					if (p.petID === pd.petID) {
				// 						console.log(`${p.petID} 出門工作中`);
				// 						return true;
				// 					}
				// 				})) {
				// 					p.flag = false;

				// 					console.log(`${p.petID}`);
				// 					if (p.attr.retiredTime > new Date().getTime()
				// 						&& p.attr.dayFeedNum < p.attr.dayFeedLimit
				// 						&& (p.attr.lastFeedTime + p.attr.digestTime < new Date().getTime())) {

				// 						console.log(`未退休 未出門`);
				// 					}
				// 					else {

				// 						console.log(`未工作`);
				// 					}
				// 					config.workCount++;

				// 					config.petIDFood = p.petID;

				// 					return true;
				// 				}
				// 			}
				// 		})) {
				// 			found = true;
				// 			DataPostBodyList[i].petID = config.petIDFood;
				// 			if (config.isReload) { await delay(1.0); }
				// 		}
				// 		if (config.workCount === 0 && !found) {
				// 			console.log(`新寵物數不足，由退休寵物出門工作`);
				// 			if (config.dormitoryRetirePets.some(p => {
				// 				if (!p.hasOwnProperty('flag')) { p.flag = true; }

				// 				if (!config.pets.some((pd) => {
				// 					if (p.petID === pd.petID) {
				// 						console.log(`${p.petID} 出門工作中`);
				// 						return true;
				// 					}
				// 				})) {
				// 					p.flag = false;

				// 					console.log(`${p.petID}`);
				// 					if (p.attr.dayFeedNum < p.attr.dayFeedLimit
				// 						&& (p.attr.lastFeedTime + p.attr.digestTime < new Date().getTime())) {

				// 						console.log(`退休 未出門`);
				// 					}
				// 					else {

				// 						console.log(`未工作`);
				// 					}
				// 					config.workCount++;

				// 					config.petIDFood = p.petID;

				// 					return true;
				// 				}

				// 			})) {
				// 				found = true;
				// 				DataPostBodyList[i].petID = config.petIDFood;
				// 				if (config.isReload) { await delay(1.0); }
				// 			}
				// 		}
				// 		if (!found) {
				// 			i++;
				// 		}
				// 	}
				else {
					i++;
				}
			}
			if (i === 8) {
				if (config.isReload) { } else { i++; }
			}
			if (i === 9) {
				let found = false;
				console.log(`\n ${config.workCount} 寵物出門工作中`);
				let msg = '';
				// let canRun = false; // 20230919 無法餵食
				if (config.pets.some((pd, pi) => {
					// console.log(pd.attr.dayFeedNum);
					// console.log(pd.attr.dayFeedLimit);
					// console.log(pd.attr.digestTime);
					if (config.petIDInteractive == 0) { config.petIDInteractive = pd.petID; }
					if (!pd.hasOwnProperty('flag')) { pd.flag = true; }
					if (pd.flag && pd.lifeStatus === 1) {
						msg += `\n${pd.petID} : ${pd.attr.dayFeedNum}/${pd.attr.dayFeedLimit}`;
						if (pd.attr.dayFeedNum === pd.attr.dayFeedLimit) { msg += ' 吃飽了。'; }
						else if (pd.attr.lastFeedTime + pd.attr.digestTime > new Date().getTime()) {
							msg += ' 工作中，還不能餵食。';
							msg += '\t' + new Date(pd.attr.lastFeedTime + pd.attr.digestTime).format('MM/dd HH:mm:ss');
						}
					}
					if (pd.lifeStatus === 1 && pd.attr.dayFeedNum < pd.attr.dayFeedLimit
						&& (pd.attr.lastFeedTime + pd.attr.digestTime < new Date().getTime())) {
						config.petIDFood = pd.petID;
						pd.attr.digestTime = 14400000;
						pd.attr.lastFeedTime = new Date().getTime();
						pd.attr.dayFeedNum++;
						pd.flag = false;
						found = true;
						msg += ' 需要餵食。\t現在腳本無法自動餵食，請手動餵食。';
						return false; // 20230919 無法餵食
						// return true;
					}
				})) {
					msg += ' 餵食';
					console.log(msg);

					runCount++;
					DataPostBodyList[i].token = getToken();
					DataPostBodyList[i].petID = config.petIDFood;
					if (config.isReload) { await delay(1.0); }
				}
				else {
					console.log(msg);
					i++;
				}
				if (found && config.ownedCNT < 100) {
					console.log('餇料不足。');
					i++;
				}
			}
			if (i === 11) {
				let canRun = false; // 20230919 無法抽寵物
				if (canRun && config.chance > 0) { } else { i++; }
			}
			if (i === 12) {
				let canRun = false; // 20230919 無法抽寵物
				if (canRun && config.canAdsChance && config.adsChance > 0) { } else { i++; }
			}
			if (i === 13) {
				if (config.workCount > 0) {
					DataPostBodyList[i].token = getToken();
					DataPostBodyList[i].petID = config.petIDInteractive;
				}
				else {
					console.log('沒有寵物工作，無法互動 100P。');
					i++;
				}
			}
			if (i === 15) {
				if (!config.isReload) { flag = false; break; }
			}

			let dc = GetDataConfig(i);
			//console.log(`\n🌐 ${ dc.method } URL: ${ dc.url } \n`);
			// if (i == 9) {
			// 	// let gwsign = $persistentStore.read('ShopeePetGWSign' + _ShopeeUserID) || '';
			// 	// if (gwsign != '') {
			// 	// 	dc.dataRequest.headers['x-gw-sign'] = gwsign;
			// 	// 	console.log('x-gw-sign: ' + gwsign);
			// 	// }
			// 	let token = getToken();
			// 	dc.dataRequest.headers['x-runtime'] = 'app=unknown;biz=3.15.1;gr=H5;os=Other';
			// 	// dc.dataRequest.headers['x-gw-t'] = token;
			// 	// dc.dataRequest.headers['x-user-sid'] = getRnd(16) + ';' + token;
			// 	dc.dataRequest.headers['x-gw-t'] = '1699404110284';
			// 	dc.dataRequest.headers['x-user-sid'] = 'spmfint5CQ4HXh8E;1699404110284';
			// 	dc.dataRequest.headers['user-agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=zh-Hant version=31208 appver=31208 rnver=1698997120 shopee_rn_bundle_version=5096012 Shopee language=zh-Hant app_type=1'
			// 	dc.dataRequest.headers['referer'] = 'https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true';
			// 	dc.dataRequest.headers['x-gw-sign'] = 'AAAAAAAAAAAAAAAAAAAAAGTeH3Tz2rluw/R6bvBMvGSnR+dg1OrtOdDbFnmFVUE8Bq/0XTSx1zEPtZns8s/JCHXghJapOfkAYPNzbWnx2gY3RWtA2MFwUqkEX3sofNkp';
			// 	console.log(dc.dataRequest.headers);
			// }
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}

			if (i === 6) { flag = true; i--; }
			if (i === 7) { flag = true; i--; }
			if (i === 9) { if (flag) { i--; } else { flag = true; } }
			if (i === 11 || i === 12) { if (flag) { i--; } else { flag = true; } }
			if (i === 13) {
				if (flag) { i--; await delay(3.0); } else { flag = true; }
			}
			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 15) { console.log(`!! Need Debug!! ★★★ 迴圈 ${runCount} /${forMaxCount} ★★★`) };

		}

		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'pet' + 's';
			let tsid = 'W1';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.c = config.workCount;
			s.f = s.c > 0;
			//s.r = msg;
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }

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

