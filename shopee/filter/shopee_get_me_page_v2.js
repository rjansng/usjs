let title = 'Get Me Page V2';
let caption = '過濾 ' + title;
let version = 'v20250529';

let ShopeeUserID = '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log('ShopeeUserID:' + ShopeeUserID); }

let SimulateShowInfo = ($persistentStore.read('顯示偽裝的資訊') || '');
if (SimulateShowInfo == '是') { SimulateShowInfo = true; } else { SimulateShowInfo = false; }
let walletShow = ($persistentStore.read('顯示我的蝦皮錢包') || '');
if (walletShow == '是') { walletShow = true; } else { walletShow = false; }
let checkListShow = ($persistentStore.read('顯示每日任務') || '');
if (checkListShow == '是') { checkListShow = true; } else { checkListShow = false; }
let myVouchersShow = ($persistentStore.read('顯示我的票匣') || '');
if (myVouchersShow == '是') { myVouchersShow = true; } else { myVouchersShow = false; }
let 顯示偽裝購買清單 = ($persistentStore.read('顯示偽裝購買清單') || '') == '是';
let 顯示購買清單 = ($persistentStore.read('顯示購買清單') || '');
let 顯示購買清單b = 顯示購買清單 != '否';
let 顯示電子票券與繳費 = ($persistentStore.read('顯示電子票券與繳費') || '') != '否';
let 顯示我的優惠券 = ($persistentStore.read('顯示我的優惠券') || '') != '否';
let 顯示更多遊戲 = ($persistentStore.read('顯示更多遊戲') || '') == '是';
let 顯示更多服務 = ($persistentStore.read('顯示更多服務') || '');
let 顯示服務與支援 = ($persistentStore.read('顯示服務與支援') || '') != '否';
let 電子票券 = 0;
if (!顯示我的優惠券) {
	try {
		let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		let tsn = 'shopees';
		let tsid = 'VL1';
		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		let tasks = JSON.parse(rs);
		let ts = {}, s = {};
		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
		if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
		if (s.c > 0) {
			顯示我的優惠券 = true;
			console.log(`發現 我的優惠券 電子票券 ${s.c} 張\n由於設定不顯示，將改成顯示。`);
			電子票券 = s.c;
		}

	} catch (e) { console.log(e); }
}
function getSaveObject(key) {
	const string = $persistentStore.read(key);
	return !string || string.length === 0 ? {} : JSON.parse(string);
}

function isEmptyObject(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
}
Date.prototype.format = function (format = '1') {
	if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.fff'; }
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
		"f+": this.getMilliseconds(),  //millisecond  
		"S": this.getMilliseconds() //millisecond  
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length === 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};
let DTND = new Date(new Date().format('2')).getTime();
let DTN = new Date().getTime();
let DT1 = '';
let DT2 = '';
let TOKEN插件未更新 = false;
let TOKEN是否過期 = false;
try {
	const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
	// console.log(shopeeInfo);
	if (!isEmptyObject(shopeeInfo)) {
		if ('lastDate' in shopeeInfo && 'date' in shopeeInfo) {
			DT1 = (new Date(shopeeInfo.date)).format('MM/dd');
			DT2 = (new Date(shopeeInfo.lastDate)).format('MM/dd HH:mm');
			console.log(DT1);
			console.log(DT2);
			console.log((new Date(shopeeInfo.lastDate + 15 * 60 * 60 * 1000)).format());
			if ((shopeeInfo.lastDate + 15 * 60 * 60 * 1000) < DTN) { TOKEN是否過期 = true; }

		} else { TOKEN插件未更新 = true; TOKEN是否過期 = true; }

		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'shopee' + 's';
			let tsid = 'ERROR';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			if (s.r) { TOKEN是否過期 = true; }
		} catch (e) { console.log(e); }

	}
	if (!TOKEN是否過期) {
		let ShopeeTokenError = JSON.parse($persistentStore.read('ShopeeTokenError' + _ShopeeUserID) || '{"Count":0,"DataDate":0}');
		if (ShopeeTokenError.Count > 0) { TOKEN是否過期 = true; }
	}
} catch (error) {
	console.log('ERROR:' + 'ShopeeInfo' + _ShopeeUserID);
	console.log(error);
}
console.log(`TOKEN插件未更新: ${TOKEN插件未更新}`);
console.log(`TOKEN是否過期: ${TOKEN是否過期}`);
let hasOrder = false;
function parseCookie(cookieString) {
	return cookieString
		.split(';')
		.map(v => v.split('='))
		.filter((v) => v.length > 1)
		.reduce((acc, v) => {
			let value = decodeURIComponent(v[1].trim());
			for (let index = 2; index < v.length; index++) {
				if (v[index] === '') {
					value += '=';
				}
			}
			acc[decodeURIComponent(v[0].trim())] = value;
			return acc;
		}, {});
}
let mkt_tasks_obj = null;
try {
	console.log('shopee_mkt_coins_tasks');
	let mkt_tasks = $persistentStore.read('shopee_mkt_coins_tasks' + _ShopeeUserID);
	if (mkt_tasks) {
		mkt_tasks_obj = JSON.parse(mkt_tasks);
		if (date in mkt_tasks_obj) {
			if (mkt_tasks_obj.date != DTND) { mkt_tasks_obj = null; }
		}
	}
} catch (error) { }

if ($request.method === 'GET') {

	let headers = $request.headers;
	//	console.log(headers);
	let hc = headers['Cookie'] || headers['cookie'];
	let hcc = parseCookie(hc);
	console.log(`userid : ${hcc.userid}`);
	console.log(`SPC_U : ${hcc.SPC_U}`);
	let s_fake_srcid = headers['s-fake-srcid'] || '';
	console.log(`s-fake-srcid : ${s_fake_srcid}\n`);

	let body = $response.body;
	let json = JSON.parse(body);
	// console.log(json);

	try {
		if (json.error == 0) {
			if (json.hasOwnProperty('data') && json.data.hasOwnProperty('page_info')) {

				// 偽裝時 token 過期
				if (json.data.verification_info.is_shopee_verified == null) {
					json.data.verification_info = {
						"email_verified": true,
						"is_shopee_verified": false,
						"is_official_shop": false,
						"is_preferred_plus_seller": false
					};
					json.data.account_info = {
						"birth_timestamp": null,
						"is_seller": false,
						"is_kyc_verified": null,
						"access": {
							"wallet_setting": 0,
							"wallet_provider": 0
						},
						"shopid": 0,
						"has_full_name": false,
						"has_cpf_number": null,
						"portrait": "",
						"has_login_password": true,
						"cover": "",
						"has_ic_number": false,
						"username": "偽裝 TOKEN 過期",
						"nickname": null,
						"email": "",
						"gender": null
					};
					TOKEN是否過期 = true;
				}
				// 調整顯示不必要的訊息
				if (json.data.account_info.gender == null) { json.data.account_info.gender = 3; }
				if (json.data.account_info.nickname == null) { json.data.account_info.nickname = "No Nick Name"; }
				if (json.data.account_info.birth_timestamp == null) { json.data.account_info.birth_timestamp = 0; }
				if (json.data.account_info.email == '') { json.data.account_info.email = "No email"; }

				json.data.verification_info.email_verified = true;
				json.data.account_info.has_login_password = true;

				let gs = []; // new groups

				let e_ticket = null;
				let my_vouchers = null;
				console.log(`顯示購買清單: ${顯示購買清單}`);
				console.log(`顯示偽裝購買清單: ${顯示偽裝購買清單}`);
				json.data.page_info.groups.forEach(g => {
					// 不顯示的項目
					// campaign_nuz 攻略搶先看 , my_wallet 我的錢包
					let fss1 = ['campaign_nuz'];
					let gs_e = [];
					if (g.name == 'my_purchase') {
						g.sections.forEach(s => {
							if (s.name == 'buyer_order_section') {
								// 判斷是否有購買項目
								if (!hasOrder && s.features.some(f => {
									if (f.name.match(/(order_buyer_unpaid|order_buyer_toship|order_buyer_shipping)/i)
										&& f.icon_text != null) {
										hasOrder = true; return true;
									}
								})) { }
							}
							if (s.features.some(f => {
								if (f.name == 'digital_purchase_TW') {
									e_ticket = JSON.parse(JSON.stringify(s));
									return true;
								}
							}) && !顯示電子票券與繳費) { }
							else { gs_e.push(s); }
						});
						g.sections = gs_e;
					}
					if (hasOrder && (顯示偽裝購買清單 && 顯示購買清單b && ShopeeUserID != '' || ShopeeUserID == '')) { 顯示購買清單 = '是'; 顯示購買清單b = true; }
					if (g.name == 'my_purchase' && 顯示購買清單 == '必要') { g.sections = []; }
					else if (!顯示購買清單b) { fss1.push('my_purchase'); }


					let fss2 = ['more_service', 'support'];
					if (!顯示偽裝購買清單) { fss2.push('my_purchase'); }
					if (fss1.some(n => { if (g.name.match(new RegExp(`^${n}$`, "i"))) { return true; } })) {
						console.log(`❌ G:${g.name}\t${g.display_name}`);
					}
					// 偽裝時，不顯示的項目, 'my_wallet'
					else if (ShopeeUserID != '' && fss2.some(n => { if (g.name.match(new RegExp(`^${n}$`, "i"))) { return true; } })) {
						if (g.name == 'my_purchase') {
							g.sections.some(s => {
								return s.features.some(f => {
									if (f.name == 'digital_purchase_TW') { e_ticket = s; }
								});
							});
						}
						console.log(`🚫 G:${g.name}\t${g.display_name}`);
					}
					else {
						if (g.name == 'my_wallet') {
							console.log(`顯示電子票券與繳費: ${顯示電子票券與繳費}`);

							let ss = []; // new sections

							console.log('新增 custom_other 1');
							if (ShopeeUserID != '') {
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"tail_text": null,
									"page_id": 4,
									"sections": [
										{ "style": 4, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"redirect_url": null,
									"non_login_access": 0,
									"tracking_name": null,
									"display_name": "",
									"name": "custom_other1"
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								let iis = 5;
								let iis2 = 0;
								if (顯示購買清單b) { iis -= 2; iis2 = -2; }
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gurl = null;
									let gdnt = '';
									let gttc = null;
									let gicon = null;
									// if (ii == 1) { gdn = ' ⚛️  蝦皮App 偽裝 Headers'; gdnt = '插件' + (s_fake_srcid == '' ? '關閉 ⛔️ ' : '開啟 🟢 ') + '    '; }
									// else if (ii == 2) {
									// 	gdn = ' 👉  偽裝的UserID 必需為 NULL';
									// 	gdnt = ' ♻️ 清除偽裝 👉';
									// 	gurl = 'http://lo.on/simulate?suid=null';
									// }
									// else if (ii == 3) {
									// 	gdn = ' 👉  從 Cloud 取得 TOKEN';
									// 	gdnt = '🔄 👉';
									// 	gurl = 'http://lo.on/simulate/get_cloud_token';
									// }
									if (ii == 3 + iis2) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
										// gttc = '#0000FF';
										gicon = 'https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc';
									}
									else if (TOKEN是否過期 && ii == 4 + iis2) {
										gdn = '需要重新取得⛔️實名認證資訊👉';
										gdnt = 'TOKEN 已過期';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
									}
									else if (ii == 4 + iis2) {
										gdn = '⚛️ 偽裝 使用 "HTTP Proxy & TUN" 模式較佳';
										gdnt = '';
									}
									else if (ii == 5 + iis2) {
										gdn = ' 👉  每日任務 總覽  👈';
										gdnt = 'Get Cloud ✡️ 👉';
										gurl = 'http://lo.on/simulate/tasks_check_list_cloud';
										gttc = '#0000FF';
									}

									gfs.push(
										{
											"name": `Spaces${ii}`,
											"display_name": gdn,
											"tail_text": gdnt,
											"icon": gicon,
											"redirect_url": gurl,
											"tail_text_color": gttc,
											"tracking_info_v2": null,
											"space_key": "",
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": 0,
											"experiment_infos": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": 0,
											"non_login_access": 0,
											"reddot": null
										}

									);
									console.log(`\t✅ F:Spaces${ii}\t${gdn}`);

								}
								g2.features = gfs;
								ss.push(g2);
								//g.sections.push(g2);
								// g2m.sections[0] = g2;
								// gs.push(g2m);
							}
							else if (!顯示購買清單b || 顯示購買清單 == '必要') {
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"tail_text": null,
									"page_id": 4,
									"sections": [
										{ "style": 4, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"redirect_url": null,
									"non_login_access": 0,
									"tracking_name": null,
									"display_name": "",
									"name": "custom_other1"
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								let iis = 5;
								let iis2 = 1;
								if (顯示購買清單 == '必要') { iis--; iis2--; }
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gicon = null;
									let gurl = null;
									let gdnt = '';
									let gttc = null;
									if (ii == 3 + iis2) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
										gicon = 'https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc';
									}
									else if (TOKEN是否過期 && ii == 4 + iis2) {
										gdn = '蝦皮實名認證';
										gdnt = '⛔️ TOKEN 已過期 需要重新取得 👉';
										gurl = 'rn/@shopee-rn/shopeepay/TW_KYC_SELECTION';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
									}
									// else if (ii == 1 + iis2) {
									// 	gdn = ' 👉    目前使用本機帳號';
									// 	gdnt = '✅';
									// 	gurl = '';
									// }
									gfs.push(
										{
											"name": `Spaces${ii}`,
											"display_name": gdn,
											"tail_text": gdnt,
											"icon": gicon,
											"redirect_url": gurl,
											"tail_text_color": gttc,
											"tracking_info_v2": null,
											"space_key": "",
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": 0,
											"experiment_infos": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": 0,
											"non_login_access": 0,
											"reddot": null
										}

									);
									console.log(`\t✅ F:Spaces${ii}\t${gdn}`);

								}
								g2.features = gfs;
								ss.push(g2);
								//g.sections.push(g2);
								// g2m.sections[0] = g2;
								// gs.push(g2m);
							}
							else {
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"tail_text": null,
									"page_id": 4,
									"sections": [
										{ "style": 4, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"redirect_url": null,
									"non_login_access": 0,
									"tracking_name": null,
									"display_name": "",
									"name": "custom_other1"
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								let iis = 5;
								let iis2 = 1;
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gicon = null;
									let gurl = null;
									let gdnt = '';
									let gttc = null;
									if (ii == 3 + iis2) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
									}
									else if (TOKEN是否過期 && ii == 4 + iis2) {
										gdn = '蝦皮實名認證';
										gdnt = '⛔️ TOKEN 已過期 需要重新取得 👉';
										gurl = 'rn/@shopee-rn/shopeepay/TW_KYC_SELECTION';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
									}
									gfs.push(
										{
											"name": `Spaces${ii}`,
											"display_name": gdn,
											"tail_text": gdnt,
											"icon": gicon,
											"redirect_url": gurl,
											"tail_text_color": gttc,
											"tracking_info_v2": null,
											"space_key": "",
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": 0,
											"experiment_infos": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": 0,
											"non_login_access": 0,
											"reddot": null
										}

									);
									console.log(`\t✅ F:Spaces${ii}\t${gdn}`);

								}
								g2.features = gfs;
								ss.push(g2);
							}


							console.log('我的錢包 修改 Style = 3');
							g.sections[0].style = 3;
							g.display_name = null;
							let fs = [];
							//顯示我的蝦皮錢包 子項目
							g.sections[0].features.forEach(f => {
								if (f.name == "shopee_wallet_wallet" && (!walletShow || ShopeeUserID != '')) { }
								else if (f.name.match(/^my_vouchers/i)) { my_vouchers = JSON.parse(JSON.stringify(f)); }
								else if (f.name.match(/^shopee_paylater/i)) { }
								else { fs.push(f); }
							});
							if (fs.length == 1) { g.sections[0].style = 4; }
							g.sections[0].features = fs;
							ss.push(g.sections[0]);

							console.log('新增 custom_other2');
							{
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"tail_text": null,
									"page_id": 4,
									"sections": [
										{ "style": 1, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"redirect_url": null,
									"non_login_access": 0,
									"tracking_name": null,
									"display_name": "",
									"name": "custom_other2"
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								try {

									// 我的蝦幣 增加 快捷徑

									let dn = '', tt = '';

									// // 蝦幣
									// let sd0 = false;
									// dn = '30秒領蝦幣';
									// let rurl = 'rn/@shopee-rn/coins/COINS_HOME';
									// try {
									// 	let sftt = JSON.parse($persistentStore.read('ShopeeFeedsTaskToken' + _ShopeeUserID) || '{}');
									// 	console.log(sftt);
									// 	if ('task_token' in sftt) {
									// 		let timeOver = false;
									// 		let jsonBT = JSON.parse($persistentStore.read('ShopeeFeedsTaskBrowseTime' + _ShopeeUserID) || '{"dataTime":0}');
									// 		console.log(jsonBT);
									// 		if (jsonBT.dataTime + 1800000 < Date.now()) { timeOver = true; }
									// 		if (!timeOver) {
									// 			dn = '可領蝦幣⭕️';
									// 			rurl = 'http://lo.on/coins';
									// 			sd0 = true;
									// 		}
									// 	}
									// } catch (error) { console.log('ERROR coins'); console.log(error); }
									// if (sd0) {

									// 	gfs.push({
									// 		"name": `coins30`,
									// 		"display_name": dn,
									// 		"tail_text": null,
									// 		"icon": "https://cf.shopee.tw/file/b2338deb5f25f5fae3fccbfaaeec35e4",
									// 		"redirect_url": rurl,
									// 		"tracking_info_v2": null,
									// 		"space_key": null,
									// 		"banner_ruleset": null,
									// 		"rule_set_id": null,
									// 		"new_badge": null,
									// 		"experiment_infos": null,
									// 		"tail_text_color": null,
									// 		"icon_text": null,
									// 		"reddot_timestamp": null,
									// 		"tracking_info": null,
									// 		"new_badge_end_time": null,
									// 		"non_login_access": 0,
									// 		"reddot": null
									// 	});

									// }

									// 顯示IFRAME內容
									$persistentStore.write(null, '顯示IFRAME果園');
									let sd2 = $persistentStore.read('顯示IFRAME內容') || '';
									sd2 = sd2 == '是';
									if (sd2) {

										// 果園
										dn = 'iframe';
										tt = 'Source';

										gfs.push({
											"name": `iframeSource`,
											"display_name": dn,
											"tail_text": tt,
											"icon": "b2338deb5f25f5fae3fccbfaaeec35e4",
											"redirect_url": "https://games.shopee.tw/game/iframe/api/h5/get?iframeSource=2",
											// "redirect_url": "https://mall.shopee.tw/api/v4/market_coin/get_iframe_list?region=TW&offset=0&limit=10",
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});

									}

									// 果園
									dn = '果園';
									tt = '';
									try {
										let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
										let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
										let tasks = JSON.parse(rs);
										let tsn = 'farm' + 's';
										let tsidB = 'B', tsidE = 'E', tsidF = 'F', tsidFW = 'FW';
										let ts = {}, sE = {}, sF = {}, sB = {}, sFW = {};
										if (tsn in tasks) { ts = tasks[tsn]; }
										if (tsidB in ts) { sB = ts[tsidB]; } else { sB = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (tsidE in ts) { sE = ts[tsidE]; } else { sE = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (tsidF in ts) { sF = ts[tsidF]; } else { sF = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (tsidFW in ts) { sFW = ts[tsidFW]; } else { sFW = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (sB.s > 0) { tt += `${sB.s}`; }
										if (sB.s == 0 && sE.f && sF.f) { dn += '✅'; } else { dn += `${sE.c}/${sF.c}`; }
										if (!dn.includes('✅') && sFW.r.includes('已收成')) { dn += '果園✅'; }
									} catch (e) { console.log(e); }
									//if (dn.includes('✅') && tt.includes('✅')) { tt = ''; }

									gfs.push({
										"name": `fruitgame`,
										"display_name": dn,
										"tail_text": tt,
										"icon": "sg-11134004-23020-botrkaa8jvnvf7",
										"redirect_url": "https://games.shopee.tw/farm/",
										// "redirect_url": "https://games.shopee.tw/farm/?Entrypoint=Gamepage",
										// "redirect_url": "https://shopee.tw/m/fruitgame",
										"tracking_info_v2": null,
										"space_key": null,
										"banner_ruleset": null,
										"rule_set_id": null,
										"new_badge": null,
										"experiment_infos": null,
										"tail_text_color": null,
										"icon_text": null,
										"reddot_timestamp": null,
										"tracking_info": null,
										"new_badge_end_time": null,
										"non_login_access": 0,
										"reddot": null
									});


									// 寵物村
									dn = '寵物村';
									//dn = '抽寵物✅';
									tt = '';
									try {
										let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
										let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
										let tasks = JSON.parse(rs);
										let tsn = 'pet' + 's';
										let tsid = 'FF';
										let ts = {}, s = {};
										if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
										if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (s.f && s.c > 0 && s.s == 0 || s.c == 0 && s.s == 0) { dn += '✅'; } else { dn += `${s.c}/${s.s}`; }
									} catch (e) { console.log(e); }
									let dn_next = true;
									try {
										let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
										let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
										let tasks = JSON.parse(rs);
										let tsn = 'pet' + 's';
										let tsid = 'PTIB';
										let ts = {}, s = {};
										if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
										if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
										if (s.f && s.c > 0 && s.s == 0) { tt = '抽寵物✅'; dn_next = false; }
									} catch (e) { console.log(e); }
									if (dn_next) {
										try {
											let ZZ = $persistentStore.read('pet_need_twist' + _ShopeeUserID) || '{"dataTime":0}';
											let gmp = JSON.parse(ZZ);
											if (gmp.dataTime == DTND) { tt = '抽寵物⭕️'; dn_next = false; }
										} catch (error) { console.log('ERROR'); console.log(error); }
									}
									if (dn.includes('✅') && tt.includes('✅')) { tt = ''; }
									gfs.push({
										"name": `petgame2`,
										"display_name": dn,
										"tail_text": tt,
										"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
										"redirect_url": "https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
										// "redirect_url": "https://shopee.tw/m/petgame",
										"tracking_info_v2": null,
										"space_key": null,
										"banner_ruleset": null,
										"rule_set_id": null,
										"new_badge": null,
										"experiment_infos": null,
										"tail_text_color": null,
										"icon_text": null,
										"reddot_timestamp": null,
										"tracking_info": null,
										"new_badge_end_time": null,
										"non_login_access": 0,
										"reddot": null
									});

									// 貪食蛇
									dn = '貪食蛇';
									try {
										let ZZ = $persistentStore.read('get_me_page_showquicklinkGG1' + _ShopeeUserID) || '{"dataTime":0}';
										let gmp = JSON.parse(ZZ);
										if (gmp.dataTime == DTND) { dn = '貪食蛇✅'; }
									} catch (error) { console.log('ERROR'); console.log(error); }
									gfs.push({
										"name": `petgame2`,
										"display_name": dn,
										"tail_text": null,
										"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
										"redirect_url": "https://games.shopee.tw/pet-worms-game/?activity=480d67df44babcaf",
										"tracking_info_v2": null,
										"space_key": null,
										"banner_ruleset": null,
										"rule_set_id": null,
										"new_badge": null,
										"experiment_infos": null,
										"tail_text_color": null,
										"icon_text": null,
										"reddot_timestamp": null,
										"tracking_info": null,
										"new_badge_end_time": null,
										"non_login_access": 0,
										"reddot": null
									});

									// // 桌上曲棍球
									// dn = '桌上曲棍球';
									// try {
									// 	let ZZ = null;
									// 	// if (DTN < DT8) {
									// 	// 	ZZ = $persistentStore.read('get_me_page_showquicklinkGG2P' + _ShopeeUserID) || '{"dataTime":0}';
									// 	// }
									// 	// else {
									// 	ZZ = $persistentStore.read('get_me_page_showquicklinkGG2' + _ShopeeUserID) || '{"dataTime":0}';
									// 	// }
									// 	let gmp = JSON.parse(ZZ);
									// 	if (gmp.dataTime == DTND) { dn = '曲棍球✅'; }
									// } catch (error) { console.log('ERROR'); console.log(error); }
									// gfs.push({
									// 	"name": `petgame3`,
									// 	"display_name": dn,
									// 	"tail_text": null,
									// 	"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
									// 	"redirect_url": "https://games.shopee.tw/pet-crashball/?activity=ab894e82f6d97121",
									// 	"tracking_info_v2": null,
									// 	"space_key": null,
									// 	"banner_ruleset": null,
									// 	"rule_set_id": null,
									// 	"new_badge": null,
									// 	"experiment_infos": null,
									// 	"tail_text_color": null,
									// 	"icon_text": null,
									// 	"reddot_timestamp": null,
									// 	"tracking_info": null,
									// 	"new_badge_end_time": null,
									// 	"non_login_access": 0,
									// 	"reddot": null
									// });



								} catch (e) {
									console.log('ERROR 2');
									console.log(e);
								}
								g2.features = gfs;
								ss.push(g2);
								//g.sections.push(g2);
								// g2m.sections[0] = g2;
								// gs.push(g2m);

							}

							// mkt_tasks_obj
							console.log('新增 custom_other 蝦幣任務清單未完成項目');
							if (mkt_tasks_obj) {
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"name": "custom_other_coins",
									"display_name": "蝦幣任務未領清單",
									"tail_text": "AAA",
									"redirect_url": 'rn/@shopee-rn/coins/COINS_HOME',
									"page_id": 4,
									"sections": [
										{ "style": 4, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"non_login_access": 0,
									"tracking_name": null,
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								try {
									let timeOver = false;
									let c30 = false;
									try {
										let sftt = JSON.parse($persistentStore.read('ShopeeFeedsTaskToken' + _ShopeeUserID) || '{}');

										if ('task_token' in sftt) {
											c30 = true;
											let jsonBT = JSON.parse($persistentStore.read('ShopeeFeedsTaskBrowseTime' + _ShopeeUserID) || '{"dataTime":0}');
											if (jsonBT.dataTime + 1800000 < Date.now()) { timeOver = true; }
										}
									} catch (error) { console.log('ERROR coins'); console.log(error); }
									mkt_tasks_obj.data.user_tasks.forEach(t => {
										if (t.task_status != 3) {
											//console.log(t.task);
											let gn = `custom_${t.task.id}`;
											let gdn = `${t.task.task_name}`;
											if (c30 && !timeOver && gdn.match(/推薦商品/)) { timeOver = true; c30 = true; }
											let gtt = `${t.task_status == 2 ? ' 可領' : ''}${t.task.prize_value}蝦幣${t.task_status == 2 ? '' : (c30 ? ' 可領' : ' 未完成')}`;
											let oo = JSON.parse(t.task.assets_config);
											let gi = oo.image_task_icon
											// console.log(oo);
											let gru = 'rn/@shopee-rn/coins/COINS_HOME';
											if (c30) { gru = 'http://lo.on/coins'; c30 = false; }
											gfs.push({
												"name": gn,
												"display_name": gdn,
												"tail_text": gtt,
												"icon": gi,
												"redirect_url": gru,
												"tracking_info_v2": null,
												"space_key": null,
												"banner_ruleset": null,
												"rule_set_id": null,
												"new_badge": null,
												"experiment_infos": null,
												"tail_text_color": null,
												"icon_text": null,
												"reddot_timestamp": null,
												"tracking_info": null,
												"new_badge_end_time": null,
												"non_login_access": 0,
												"reddot": null
											});
										}
									});
								} catch (e) {
									console.log('ERROR T');
									console.log(e);
								}
								if (gfs.length > 0) {
									g2.features = gfs;
									ss.push(g2);
								}

							}
							console.log('新增 custom_other3');
							{
								// style 1 上圖示 下說明 2 GridLineList 3 Grid 左圖示 右說明 4 LineList
								let g2m = {
									"tail_text": null,
									"page_id": 4,
									"sections": [
										{ "style": 4, "features": [], "name": null, "display_name": null }
									],
									"id": 0,
									"redirect_url": null,
									"non_login_access": 0,
									"tracking_name": null,
									"display_name": "",
									"name": "custom_other3"
								};
								let g2 = g2m.sections[0];

								let gfs = [];
								try {

									// 我的蝦幣 增加 快捷徑

									let dn = '', tt = '';
									dn = '';
									try {
										let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
										//											console.log(dataName);
										let rs = $persistentStore.read(dataName) || '{"gameTime":0,"pets":{}}';
										// console.log(rs);
										let tasks = JSON.parse(rs);
										// console.log(tasks);
										let tsn = 'pet' + 's';
										let idn = ['通識', '賽跑', '找碴', '足球', '彈珠台'];
										['E', 'F', 'G', 'C', 'GG3'].forEach((id, idi) => {
											let dn2 = `${idn[idi]}`;
											// dn += `${idn[idi]}`;
											let tsid = id;
											let ts = {}, s = {};
											if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
											if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
											if (id != 'GG3') {
												if (s.l == 0) { dn2 += '❌'; }
												else if (s.l == 3) { dn2 += '✅'; }
												else { dn2 += `[${s.l}]`; }
											}
											else {
												if (s.s > 0 || s.c > 0) {
													if (s.f) { dn2 += '✅'; } else { dn2 += '❌'; }
												}
												else {
													dn2 = '';
												}
											}
											if (dn2 != '') {
												dn2 += ' ';
												dn += dn2;
											}
										});
									} catch (e) { console.log(e); }

									// "足球⭕️ 找碴⭕️ 賽跑⭕️ 金頭腦⭕️ 彈珠台⭕️"

									// 寵物村狀態
									gfs.push({
										"name": `petgames`,
										"display_name": dn,
										"tail_text": "🔄 👉 ",
										"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
										"redirect_url": 'http://lo.on/pet_game_progress',
										"tracking_info_v2": null,
										"space_key": null,
										"banner_ruleset": null,
										"rule_set_id": null,
										"new_badge": null,
										"experiment_infos": null,
										"tail_text_color": null,
										"icon_text": null,
										"reddot_timestamp": null,
										"tracking_info": null,
										"new_badge_end_time": null,
										"non_login_access": 0,
										"reddot": null
									});

									// 每日任務 總覽
									gfs.push({
										"name": `SpaceTCL`,
										"display_name": ' 👉  每日任務 總覽  👈',
										"tail_text": '✡️ 👉',
										"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
										"redirect_url": 'http://lo.on/tasks_check_list',
										"tracking_info_v2": null,
										"space_key": null,
										"banner_ruleset": null,
										"rule_set_id": null,
										"new_badge": null,
										"experiment_infos": null,
										"tail_text_color": null,
										"icon_text": null,
										"reddot_timestamp": null,
										"tracking_info": null,
										"new_badge_end_time": null,
										"non_login_access": 0,
										"reddot": null
									});


									// 偽裝的UserID
									if (SimulateShowInfo) {

										let _suid = $persistentStore.read('偽裝的UserID') || '';
										if (_suid == '') { _suid = '🔴未指定'; } else { _suid = '🤩' + _suid; }
										gfs.push({
											"name": `Spaces1`,
											"display_name": ' 👉  偽裝ID: ' + _suid,
											"tail_text": '插件 ' + (s_fake_srcid == '' ? '⛔️' : '🟢') + ' 👉',
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": 'http://lo.on/simulate?page=main&uid=' + (s_fake_srcid == '' ? hcc.userid : s_fake_srcid),
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									// 顯示每日任務
									if (checkListShow) {
										gfs.push({
											"name": `Spaces2`,
											"display_name": ' 👉  顯示每日任務  👈',
											"tail_text": 'ALL ID ✡️ 👉',
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": 'http://lo.on/simulate?page=list',
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									// if (ShopeeUserID != ''){ //} && e_ticket != null) {
									// 	//e_ticket.name = ' 👉  ' + e_ticket.name;
									// 	//gfs.push(e_ticket);
									// 	gfs.push({
									// 		"name": "digital_purchase_TW2",
									// 		"display_name": "電子票券與繳費",
									// 		"tail_text": "",
									// 		"icon": "",
									// 		"redirect_url": "https://shopee.tw/m/DP?dp_from_source=6",
									// 		"tracking_info_v2": null,
									// 		"space_key": "",
									// 		"banner_ruleset": null,
									// 		"rule_set_id": null,
									// 		"new_badge": null,
									// 		"experiment_infos": null,
									// 		"tail_text_color": null,
									// 		"icon_text": null,
									// 		"reddot_timestamp": null,
									// 		"tracking_info": null,
									// 		"new_badge_end_time": null,
									// 		"non_login_access": 0,
									// 		"reddot": null
									// 	});
									// }



									// 我的票匣
									if (myVouchersShow) {
										gfs.push({
											"name": `my_vouchers`,
											"display_name": ' 👉  我的票匣  👈',
											"tail_text": '✡️ 👉',
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": 'https://shopee.tw/universal-link/digital-product/m/rn/evoucher?tabName=my_vouchers',
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									// 蝦皮遊戲
									if (顯示更多遊戲) {
										gfs.push({
											"name": `shopeedailygames`,
											"display_name": ' 👉  更多遊戲  👈',
											"tail_text": 'more ✡️ 👉',
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": 'https://shopee.tw/m/shopeedailygames',
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									// 偽裝的UserID token 更新
									if (SimulateShowInfo && ShopeeUserID != '') {
										gfs.push({
											"name": `SpaceUT`,
											"display_name": ' 👉 偽裝的UserID 更新 TOKEN  👈',
											"tail_text": '♻️ 👉',
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": 'http://lo.on/simulate/shopee_update_token',
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});

										gfs.push({
											"name": `SpaceS10`,
											"display_name": "",
											"tail_text": null,
											"icon": null,
											"redirect_url": null,
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});

									}
									if (($persistentStore.read('顯示Google') || '') == '是') {
										gfs.push({
											"name": `SpaceS22`,
											"display_name": "Google Page 👈",
											"tail_text": null,
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": "https://www.google.com/",
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									if (($persistentStore.read('顯示SdanyPage') || '') == '是') {
										gfs.push({
											"name": `SpaceS21`,
											"display_name": "Sdany Page 👈",
											"tail_text": null,
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": "https://sdany.org/url/urljs.html",
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}
									let ShowPageUrl = $persistentStore.read('ShowPageUrl');
									if (ShowPageUrl != null) {
										gfs.push({
											"name": `SpaceS23`,
											"display_name": "Custom Page Url 👈",
											"tail_text": null,
											"icon": "https://cf.shopee.tw/file/ad2983c92a2e67f96b6326aca26056cc",
											"redirect_url": ShowPageUrl,
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										});
									}

									if (顯示我的優惠券 && my_vouchers != null) {
										if (電子票券 > 0) { my_vouchers.tail_text = `電子票券 ${電子票券} 張，記得兌換`; }
										gfs.push(my_vouchers);
									}
								} catch (e) {
									console.log('ERROR 3');
									console.log(e);
								}
								g2.features = gfs;
								ss.push(g2);
								// g.sections.push(g2);
								// gs.push(g2m);
								//
								if (顯示電子票券與繳費 && e_ticket != null) {
									ss.push(e_ticket);
								}
							}

							g.sections = ss;
							gs.push(g);

						}
						else {
							bFlag = true;
							try {
								if (g.name == 'support' && !顯示服務與支援) {
									let gsf = [];
									console.log(`顯示服務與支援: ${顯示服務與支援}`);
									g.sections[0].features.forEach(f => { // 僅移除已知的，有新的再加入
										if (['New_RR', 'help_center', 'chatbot_tw', 'cs_phone'].some(n => {
											if (f.name.match(new RegExp(`^${n}$`, "i"))) { return true; }
										})) { }
										else { gsf.push(f); }
									});
									if (gsf.length == 0) { bFlag = false; }
									g.sections[0].features = gsf;

								}
								else if (g.name == 'more_service' && ['必要', '簡略', '否'].some(n => { if (n == 顯示更多服務) return true; })) {
									let gsf = [];
									console.log(`顯示更多服務: ${顯示更多服務}`);
									// console.log(`g.sections: ${g.sections.length}`);
									let b_shopee_kyc = false;
									if (顯示更多服務 == '必要') {
										let BreakException = {};
										try {
											g.sections[0].features.forEach(f => {
												if (f.name == 'shopee_kyc') {
													gsf.push(f);
													b_shopee_kyc = true;
													throw BreakException;
												}
											});
										} catch (error) { }
									}
									else if (顯示更多服務 == '簡略') {
										// console.log(`features: ${g.sections[0].features.length}`);
										g.sections[0].features.forEach(f => {
											// console.log(f);
											if (f.name == 'shopee_kyc') { b_shopee_kyc = true; }
											['shopee_loyalty', 'my_likes_new', 'shopee_kyc']
												.some(fn => { if (f.name == fn) { gsf.push(f); return true; } });
										});
									}
									else {
										bFlag = false;
									}
									if (bFlag && !b_shopee_kyc) {
										// gsf.push({
										// 	"tracking_info_v2": null,
										// 	"redirect_url": "rn/@shopee-rn/shopeepay/TW_KYC_SELECTION",
										// 	"tail_text": "",
										// 	"space_key": "",
										// 	"banner_ruleset": null,
										// 	"rule_set_id": null,
										// 	"new_badge": 0,
										// 	"experiment_infos": null,
										// 	"tail_text_color": null,
										// 	"icon_text": null,
										// 	"reddot_timestamp": null,
										// 	"tracking_info": null,
										// 	"display_name": "蝦皮實名認證",
										// 	"icon": "https://cf.shopee.tw/file/2d3ba906f922d53e10b5e5959d652a26",
										// 	"new_badge_end_time": 0,
										// 	"non_login_access": 0,
										// 	"name": "shopee_kyc",
										// 	"reddot": null
										// });
									}
									//if (bFlag && gsf.length == 0) { bFlag = false; } // 加了 完全不顯示
									g.sections[0].style = 4;
									// console.log(gsf.length);
									if (bFlag) {
										g.sections[0].features = gsf;
										//g.display_name = null; g.tail_text = null; g.redirect_url = null;
									}
									else {
										g.sections[0].features = [{
											"name": `SpaceS12`,
											"display_name": "",
											"tail_text": null,
											"icon": null,
											"redirect_url": null,
											"tracking_info_v2": null,
											"space_key": null,
											"banner_ruleset": null,
											"rule_set_id": null,
											"new_badge": null,
											"experiment_infos": null,
											"tail_text_color": null,
											"icon_text": null,
											"reddot_timestamp": null,
											"tracking_info": null,
											"new_badge_end_time": null,
											"non_login_access": 0,
											"reddot": null
										}];
									}

								}
							} catch (error) {
								console.log('ERROR X');
								console.log(error);
							}
							if (bFlag) {
								console.log(`✅ G:${g.name}\t${g.display_name}`);
								gs.push(g);
							}
							else {
								console.log(`🚫 G:${g.name}\t${g.display_name}`);
							}
						}
					}
				});
				json.data.page_info.groups = gs;

				// console.log('');
				// console.log(json.data.verification_info);
				// console.log('');
				// console.log(json.data.account_info);
				// console.log('');
				// console.log(json.data.entrance_info);
				// console.log('');
				// console.log(json.data.pending_refund_banner_info);


				body = JSON.stringify(json);
				$done({ body });
			}
		}
	} catch (error) {
		console.log('ERROR');
		console.log(error);
		$done({});
	}
}
else {
	console.log('NOT GET');
	$done({});
}