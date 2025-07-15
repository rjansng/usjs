let title = 'Get Me Page';
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
let 顯示購買清單 = ($persistentStore.read('顯示購買清單') || '');
let 顯示購買清單b = 顯示購買清單 != '否';
let 顯示電子票券與繳費 = ($persistentStore.read('顯示電子票券與繳費') || '') != '否';
let 顯示我的優惠券 = ($persistentStore.read('顯示我的優惠券') || '') != '否';
let 顯示更多遊戲 = ($persistentStore.read('顯示更多遊戲') || '') == '是';
let 顯示更多服務 = ($persistentStore.read('顯示更多服務') || '');
let 顯示服務與支援 = ($persistentStore.read('顯示服務與支援') || '');
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
// let DT8 = new Date(new Date().format('2') + ' 08:00').getTime();
let DTN = new Date().getTime();
let DT1 = '';
let DT2 = '';
let TOKEN插件未更新 = false;
let TOKEN是否過期 = false;
try {
	const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
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
try {
	let shopee_order_info = $persistentStore.read('ShopeeOrderInfo' + ShopeeUserID);
	if (shopee_order_info) {
		if (shopee_order_info.data.buyer_unpaid > 0) { hasOrder = true; } // 待付款
		else if (shopee_order_info.data.buyer_toship > 0) { hasOrder = true; } // 待出貨
		else if (shopee_order_info.data.buyer_shipping > 0) { hasOrder = true; } // 待收貨
		//else if (shopee_order_info.data.buyer_to_rate_count > 0) { hasOrder = true; } // 評價
		//else if (shopee_order_info.data.buyer_return > 0) { hasOrder = true; }
		//else if (shopee_order_info.data.buyer_group_buy_unpaid > 0) { hasOrder = true; }
	}
} catch (error) { }

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

				if (json.data.account_info.gender == null) { json.data.account_info.gender = 3; }
				if (json.data.account_info.nickname == null) { json.data.account_info.nickname = "No Nick Name"; }
				if (json.data.account_info.birth_timestamp == null) { json.data.account_info.birth_timestamp = 0; }
				if (json.data.account_info.email == '') { json.data.account_info.email = "No email"; }

				json.data.verification_info.email_verified = true;
				json.data.account_info.has_login_password = true;

				let gs = [];
				let e_ticket = null;
				let my_vouchers = null;
				let shopee_loyalty = null;
				let pre_live_kyc = null;
				let hasShopeeGames = false;
				console.log(`hasOrder: ${hasOrder}`);
				if (hasOrder) { 顯示購買清單 = '是'; 顯示購買清單b = true; }
				console.log(`顯示購買清單: ${顯示購買清單}`);
				json.data.page_info.groups.forEach(g => {
					// Wallet 錢包 , Buy Again 再買一次 , Miscellaneous 雜項 , Start Selling 賣家資訊 
					if (['Wallet', 'Buy Again', 'Start Selling'].some(n => { if (n == g.name) { return true; } })) {
						console.log('❌ G:' + g.name);
					}
					else if (ShopeeUserID != '' && ['Order', 'Miscellaneous'].some(n => { if (n == g.name) { return true; } })) {
						console.log('❌2 G:' + g.name);
					}
					else {
						let bFlag = true;
						console.log(`✅ G:${g.name}`);
						if (g.name == 'Miscellaneous' && (顯示服務與支援 == '否' || 顯示服務與支援 == '必要')) {
							console.log(`顯示服務與支援: ${顯示服務與支援}`);
							let fs = [];
							let fss = ['New_RR', 'help_center', 'cs_chatbot', 'cs_phone'];
							if (顯示服務與支援 == '否') { fss.push('account_setting'); }
							g.features.forEach(f => {
								if (fss.some(n => { if (f.name == n) { return true; } })) { }
								else { fs.push(f); }
							});
							// if (bFlag && fs.length == 0) { bFlag = false; }
							g.features = fs;
						}
						if (g.name == 'Order') {
							let fs = [];
							g.features.some(f => {
								if (f.name == 'my_purchase') {
									if (顯示購買清單 == '必要') { f.name = 'my_purchase2'; }
									fs.push(f); return true;
								}
							});
							g.features = fs;
							// g.features = [g.features[0]];
							if (!顯示購買清單b) { bFlag = false; }
						}
						else if (g.name == 'Activity') {
							let gfs = [];
							let iis = 0;
							if (ShopeeUserID != '') {
								if (ShopeeUserID != '') { iis = 5; }
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gurl = null;
									let gdnt = '';
									let gicon = null;
									let gttc = null;
									// if (ii == 1) { gdn = ' ⚛️  蝦皮App 偽裝 Headers'; gdnt = '插件' + (s_fake_srcid == '' ? '關閉 ⛔️ ' : '開啟 🟢 ') + '    '; }
									// else if (ii == 2) {
									// 	gdn = ' 👉  偽裝的UserID 必需為 NULL';
									// 	gdnt = ' ♻️ 清除偽裝 👉';
									// 	grurl = 'http://lo.on/simulate?suid=null';
									// }
									// else if (ii == 3) {
									// 	gdn = ' 👉  從 Cloud 取得 TOKEN';
									// 	gdnt = '🔄 👉';
									// 	grurl = 'http://lo.on/simulate/get_cloud_token';
									// }
									// else if (ii == 4) {
									// 	gdn = ' 👉  每日任務 總覽';
									// 	gdnt = 'Cloud ✡️ 👉';
									// 	grurl = 'http://lo.on/simulate/tasks_check_list_cloud';
									// }

									if (ii == 3) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
										// gttc = '#0000FF';
									}
									else if (TOKEN是否過期 && ii == 4) {
										gdn = '需要重新取得⛔️實名認證資訊👉';
										gdnt = 'TOKEN 已過期';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
										gttc = '#FF0000';

									}
									else if (ii == 4) {
										gdn = '⚛️ 偽裝 使用 "HTTP Proxy & TUN" 模式較佳';
										gdnt = '';
									}
									else if (ii == 5) {
										gdn = ' 👉  每日任務 總覽';
										gdnt = 'Get Cloud ✡️ 👉';
										gurl = 'http://lo.on/simulate/tasks_check_list_cloud';
										gttc = '#0000FF';
									}

									gfs.push({
										"name": `Spaces${ii}`,
										"display_name": gdn,
										"tail_text": gdnt, // ${ii}
										"tail_text_color": gttc,
										"icon": gicon,
										"redirect_url": gurl,
										"new_badge": 0,
										"new_badge_end_time": 0,
										"non_login_access": 0,
										"sub_features": {
											"main_feature_subtext": "",
											"feature_circles": []
										},
										"reddot": null,
										"tracking_info": null,
										"tracking_info_v2": null,
										"reddot_timestamp": null,
										"space_key": "",
										"rule_set_id": null,
										"experiment_infos": null,
										"banner_ruleset": null
									});
								}
							}
							else if (!顯示購買清單b || 顯示購買清單 == '必要') {
								iis = 5;
								let iis2 = 1;
								if (顯示購買清單 == '必要') { iis--; iis2--; }
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gurl = null;
									let gdnt = '';
									let gicon = null;
									let gttc = null;
									if (ii == 3 + iis2) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
										// gttc = '#0000FF';
									}
									else if (TOKEN是否過期 && ii == 4 + iis2) {
										gdn = '蝦皮實名認證';
										gdnt = '⛔️ TOKEN 已過期 需要重新取得 👉';
										gurl = 'rn/@shopee-rn/shopeepay/TW_KYC_SELECTION';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
										gttc = '#FF0000';
									}
									// else if (ii == 1 + iis2) {
									// 	gdn = ' 👉    目前使用本機帳號';
									// 	gdnt = '✅';
									// 	grurl = '';
									// }
									gfs.push({
										"name": `Spaces${ii}`,
										"display_name": gdn,
										"tail_text": gdnt, // ${ii}
										"tail_text_color": gttc,
										"icon": gicon,
										"redirect_url": gurl,
										"new_badge": 0,
										"new_badge_end_time": 0,
										"non_login_access": 0,
										"sub_features": {
											"main_feature_subtext": "",
											"feature_circles": []
										},
										"reddot": null,
										"tracking_info": null,
										"tracking_info_v2": null,
										"reddot_timestamp": null,
										"space_key": "",
										"rule_set_id": null,
										"experiment_infos": null,
										"banner_ruleset": null
									});
								}
							}
							else //if (!顯示購買清單b || 顯示購買清單 == '必要') 
							{
								iis = 2;
								for (let ii = 1; ii <= iis; ii++) {
									let gdn = '';
									let gurl = null;
									let gdnt = '';
									let gicon = null;
									let gttc = null;
									if (ii == 1) {
										gdn = ` 🔄   ${DT1} - ${DT2}`;
										gdnt = 'TOKEN';
										// gttc = '#0000FF';
									}
									else if (TOKEN是否過期 && ii == 2) {
										gdn = '蝦皮實名認證';
										gdnt = '⛔️ TOKEN 已過期 需要重新取得 👉';
										gurl = 'rn/@shopee-rn/shopeepay/TW_KYC_SELECTION';
										gicon = 'https://cf.shopee.tw/file/c92ee2ae01aa9ac7b8797dc375e59fef';
										gttc = '#FF0000';
									}
									// else if (ii == 2) {
									// 	gdn = ' 👉   目前使用本機帳號';
									// 	gdnt = '✅';
									// 	grurl = '';
									// }
									gfs.push({
										"name": `Spaces${ii}`,
										"display_name": gdn,
										"tail_text": gdnt, // ${ii}
										"tail_text_color": gttc,
										"icon": gicon,
										"redirect_url": gurl,
										"new_badge": 0,
										"new_badge_end_time": 0,
										"non_login_access": 0,
										"sub_features": {
											"main_feature_subtext": "",
											"feature_circles": []
										},
										"reddot": null,
										"tracking_info": null,
										"tracking_info_v2": null,
										"reddot_timestamp": null,
										"space_key": "",
										"rule_set_id": null,
										"experiment_infos": null,
										"banner_ruleset": null
									});
								}
							}

							// pre_live_kyc 蝦皮實名認證
							if (ShopeeUserID != '' && TOKEN是否過期) {
								g.features.some(f => {
									if (f.name.match(/^pre_live_kyc/i)) {
										f.tail_text = '⛔️ TOKEN 已過期 需要重新取得 👉';
										f.tail_text_color = '#FF0000';
										return true;
									}
								});
							}

							// , shopping_plus_0305 蝦拼Plus
							let span_menu = ['shopping_plus', 'my_rating', 'recently_viewed_new'
								, 'shopee_affiliate', 'tw_custom_kyc', 'buy_again', 'shopee_paylater'];
							// , 'wallet'   'Shopping_Plus',
							// 顯示我的蝦皮錢包
							if (!walletShow || ShopeeUserID != '') { span_menu.push('wallet'); }

							if (!顯示電子票券與繳費) { span_menu.push('digital_purchase_TW'); }
							if (!顯示更多遊戲) { span_menu.push('shopee_games'); }

							g.features.forEach(f => {
								if (f.name.match(/^my_vouchers_/i)) {
									if (電子票券 > 0) { f.tail_text = `電子票券 ${電子票券} 張，記得兌換`; }
									if (!顯示我的優惠券) { span_menu.push(f.name); }
									//return true;
								}
								// 轉移 蝦皮會員
								else if (f.name == 'shopee_loyalty') {
									span_menu.push(f.name); shopee_loyalty = f;
									console.log('轉移 蝦皮會員');
								}
								// 轉移 蝦皮實名認證
								else if (f.name == 'pre_live_kyc') {
									span_menu.push(f.name); pre_live_kyc = f;
									console.log('轉移 蝦皮實名認證');
								}

							});
							// span_menu.push('my_vouchers');


							g.features.forEach(f => {
								if (f.name == 'shopee_games') { hasShopeeGames = true; }
								if (span_menu
									.some(n => { if (f.name.includes(n) || f.name.match(new RegExp(n, 'i'))) { return true; } })) {
									console.log(`\t❌ F:${f.name}: ${f.display_name}\t`);
									if (f.tail_text != '') {
										console.log(`\t\t\t${f.tail_text}`);
									}
								}
								else if (ShopeeUserID != '' && ['pre_live_kyc', 'shopee_loyalty']
									.some(n => { if (f.name.includes(n)) { return true; } })) {
									console.log(`\t❌2 F:${f.name}: ${f.display_name}\t`);
									if (f.tail_text != '') {
										console.log(`\t\t\t${f.tail_text}`);
									}
								}
								else {

									gfs.push(f);
									console.log(`\t✅ F:${f.name}: ${f.display_name}`);
									if (f.tail_text != '') {
										console.log(`\t\t\t${f.tail_text}`);
									}

									// 我的蝦幣 增加 快捷徑
									if (f.name == 'shopee_coins_tw') {
										let dn = '', tt = '';
										console.log('\n增加快捷徑');
										f.sub_features = {
											"main_feature_subtext": "",
											"feature_circles": []
										};
										// 蝦幣
										let sd0 = false;
										dn = '30秒領蝦幣';
										let rurl = 'rn/@shopee-rn/coins/COINS_HOME';
										try {
											let sftt = JSON.parse($persistentStore.read('ShopeeFeedsTaskToken' + _ShopeeUserID) || '{}');
											if (sftt.hasOwnProperty('task_token')) {
												let timeOver = false;
												let jsonBT = JSON.parse($persistentStore.read('ShopeeFeedsTaskBrowseTime' + _ShopeeUserID) || '{"dataTime":0}');
												if (jsonBT.dataTime + 1800000 < Date.now()) { timeOver = true; }
												if (!timeOver) {
													dn = '可領蝦幣⭕️';
													rurl = 'http://lo.on/coins';
													sd0 = true;
												}
											}
										} catch (error) { console.log('ERROR'); console.log(error); }
										// try {
										// 	let ZZ = $persistentStore.read('get_me_page_showquicklink' + _ShopeeUserID) || '{"dataTime":0}';
										// 	let gmp = JSON.parse(ZZ);
										// 	if (gmp.dataTime == DTND) { dn = '領蝦幣✅'; sd0 = false; }
										// } catch (error) { console.log('ERROR'); console.log(error); }
										if (sd0) {
											f.sub_features.feature_circles.push({
												"name": "coins30",
												"display_name": dn,
												"tail_text": "",
												"icon": "https://cf.shopee.tw/file/b2338deb5f25f5fae3fccbfaaeec35e4",
												"redirect_url": rurl,
												"dynamic_tail_text": null,
												"non_login_access": 1,
												"reddot": null,
												"tracking_info": null,
												"reddot_timestamp": null
											});
										}

										// 顯示IFRAME內容
										$persistentStore.write(null, '顯示IFRAME果園');
										let sd2 = $persistentStore.read('顯示IFRAME內容') || '';
										sd2 = sd2 == '是';
										if (sd2) {

											// 果園
											dn = 'iframe';
											tt = 'Source';
											f.sub_features.feature_circles.push({
												"name": "iframeSource",
												"display_name": dn,
												"tail_text": tt,
												"icon": "b2338deb5f25f5fae3fccbfaaeec35e4",
												//"redirect_url": "https://mall.shopee.tw/api/v4/market_coin/get_iframe_list?region=TW&offset=0&limit=10",
												"redirect_url": "https://games.shopee.tw/game/iframe/api/h5/get?iframeSource=2",
												"dynamic_tail_text": null,
												"non_login_access": 0,
												"reddot": null,
												"tracking_info": null,
												"reddot_timestamp": null
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

										f.sub_features.feature_circles.push({
											"name": "fruitgame",
											"display_name": dn,
											"tail_text": tt,
											"icon": "sg-11134004-23020-botrkaa8jvnvf7",
											"redirect_url": "https://games.shopee.tw/farm/?Entrypoint=Gamepage",
											// "redirect_url": "https://shopee.tw/m/fruitgame",
											"dynamic_tail_text": null,
											"non_login_access": 0,
											"reddot": null,
											"tracking_info": null,
											"reddot_timestamp": null
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
										f.sub_features.feature_circles.push({
											"name": "petgame",
											"display_name": dn,
											"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
											"redirect_url": "https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
											// "redirect_url": "https://shopee.tw/m/petgame",
											"tail_text": tt,
											"dynamic_tail_text": null,
											"non_login_access": 0,
											"reddot": null,
											"tracking_info": null,
											"reddot_timestamp": null
										});

										// 貪食蛇
										dn = '貪食蛇';
										try {
											let ZZ = $persistentStore.read('get_me_page_showquicklinkGG1' + _ShopeeUserID) || '{"dataTime":0}';
											let gmp = JSON.parse(ZZ);
											if (gmp.dataTime == DTND) { dn = '貪食蛇✅'; }
										} catch (error) { console.log('ERROR'); console.log(error); }
										f.sub_features.feature_circles.push({
											"name": "petgame2",
											"display_name": dn,
											"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
											"redirect_url": "https://games.shopee.tw/pet-worms-game/?activity=480d67df44babcaf",
											"tail_text": "",
											"dynamic_tail_text": null,
											"non_login_access": 0,
											"reddot": null,
											"tracking_info": null,
											"reddot_timestamp": null
										});
										// 桌上曲棍球
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
										// f.sub_features.feature_circles.push({
										// 	"name": "petgame3",
										// 	"display_name": dn,
										// 	"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
										// 	"redirect_url": "https://games.shopee.tw/pet-crashball/?activity=ab894e82f6d97121",
										// 	"tail_text": "",
										// 	"dynamic_tail_text": null,
										// 	"non_login_access": 0,
										// 	"reddot": null,
										// 	"tracking_info": null,
										// 	"reddot_timestamp": null
										// });

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
											"name": "petgames",
											"display_name": dn,
											"icon": "sg-11134004-23020-2j4c51q5jvnv3f",
											"new_badge": 0,
											"new_badge_end_time": 0,
											"redirect_url": 'http://lo.on/pet_game_progress',
											"non_login_access": 0,
											"sub_features": {
												"main_feature_subtext": "",
												"feature_circles": []
											},
											"tail_text": "🔄 👉 ",
											"tail_text_color": null,
											"reddot": null,
											"tracking_info": null,
											"tracking_info_v2": null,
											"reddot_timestamp": null,
											"space_key": "",
											"rule_set_id": null,
											"experiment_infos": null,
											"banner_ruleset": null
										});


										if (f.name == 'shopee_coins_tw') {
											gfs.push({
												"name": `SpaceTCL`,
												"display_name": ' 👉  每日任務 總覽',
												"icon": null,
												"new_badge": 0,
												"new_badge_end_time": 0,
												"redirect_url": 'http://lo.on/tasks_check_list',
												"non_login_access": 0,
												"sub_features": {
													"main_feature_subtext": "",
													"feature_circles": []
												},
												"tail_text": '✡️ 👉',
												"tail_text_color": null,
												"reddot": null,
												"tracking_info": null,
												"tracking_info_v2": null,
												"reddot_timestamp": null,
												"space_key": "",
												"rule_set_id": null,
												"experiment_infos": null,
												"banner_ruleset": null
											});

										}


										// 偽裝的UserID
										if (SimulateShowInfo) {

											let _suid = $persistentStore.read('偽裝的UserID') || '';
											if (_suid == '') { _suid = '🔴未指定'; } else { _suid = '🤩' + _suid; }

											gfs.push({
												"name": `Spaces1`,
												"display_name": ' 👉  偽裝ID: ' + _suid,
												"icon": null,
												"new_badge": 0,
												"new_badge_end_time": 0,
												"redirect_url": 'http://lo.on/simulate?page=main&uid=' + (s_fake_srcid == '' ? hcc.userid : s_fake_srcid),
												"non_login_access": 0,
												"sub_features": {
													"main_feature_subtext": "",
													"feature_circles": []
												},
												"tail_text": '插件 ' + (s_fake_srcid == '' ? '⛔️' : '🟢') + ' 👉',
												"tail_text_color": null,
												"reddot": null,
												"tracking_info": null,
												"tracking_info_v2": null,
												"reddot_timestamp": null,
												"space_key": "",
												"rule_set_id": null,
												"experiment_infos": null,
												"banner_ruleset": null
											});

										}

										// 顯示每日任務
										if (checkListShow) {
											gfs.push({
												"name": `Spaces2`,
												"display_name": ' 👉  顯示每日任務',
												"icon": null,
												"new_badge": 0,
												"new_badge_end_time": 0,
												"redirect_url": 'http://lo.on/simulate?page=list',
												"non_login_access": 0,
												"sub_features": {
													"main_feature_subtext": "",
													"feature_circles": []
												},
												"tail_text": 'ALL ID ✡️ 👉',
												"tail_text_color": null,
												"reddot": null,
												"tracking_info": null,
												"tracking_info_v2": null,
												"reddot_timestamp": null,
												"space_key": "",
												"rule_set_id": null,
												"experiment_infos": null,
												"banner_ruleset": null
											});


										}



										// 我的票匣
										if (myVouchersShow) {
											gfs.push({
												"name": `my_vouchers`,
												"display_name": ' 👉  我的票匣',
												"tail_text": '✡️ 👉',
												"icon": null,
												"redirect_url": 'https://shopee.tw/universal-link/digital-product/m/rn/evoucher?tabName=my_vouchers',
												"new_badge": 0,
												"new_badge_end_time": 0,
												"non_login_access": 0,
												"sub_features": {
													"main_feature_subtext": "",
													"feature_circles": []
												},
												"tail_text_color": null,
												"reddot": null,
												"tracking_info": null,
												"tracking_info_v2": null,
												"reddot_timestamp": null,
												"space_key": "",
												"rule_set_id": null,
												"experiment_infos": null,
												"banner_ruleset": null
											});
										}
										if (!hasShopeeGames && 顯示更多遊戲) {
											// 蝦皮更多遊戲
											gfs.push({
												"name": `shopeedailygames`,
												"display_name": ' 👉  蝦皮更多遊戲',
												"tail_text": '✡️ 👉',
												"icon": null,
												"redirect_url": 'https://shopee.tw/m/shopeedailygames',
												"new_badge": 0,
												"new_badge_end_time": 0,
												"non_login_access": 0,
												"sub_features": {
													"main_feature_subtext": "",
													"feature_circles": []
												},
												"tail_text_color": null,
												"reddot": null,
												"tracking_info": null,
												"tracking_info_v2": null,
												"reddot_timestamp": null,
												"space_key": "",
												"rule_set_id": null,
												"experiment_infos": null,
												"banner_ruleset": null
											});
										}
									}
								}
							});
							//console.log(gfs.length);


							// 偽裝的UserID token 更新
							if (SimulateShowInfo && ShopeeUserID != '') {
								gfs.push({
									"name": `SpaceUT`,
									"display_name": ' 👉 偽裝的UserID 更新 TOKEN',
									"tail_text": '♻️ 👉',
									"icon": null,
									"redirect_url": 'http://lo.on/simulate/shopee_update_token',
									"new_badge": 0,
									"new_badge_end_time": 0,
									"non_login_access": 0,
									"sub_features": {
										"main_feature_subtext": "",
										"feature_circles": []
									},
									"tail_text_color": null,
									"reddot": null,
									"tracking_info": null,
									"tracking_info_v2": null,
									"reddot_timestamp": null,
									"space_key": "",
									"rule_set_id": null,
									"experiment_infos": null,
									"banner_ruleset": null
								});

								gfs.push({
									"name": `SpaceS10`,
									"display_name": '',
									"tail_text": '',
									"icon": null,
									"redirect_url": null,
									"new_badge": 0,
									"new_badge_end_time": 0,
									"non_login_access": 0,
									"sub_features": {
										"main_feature_subtext": "",
										"feature_circles": []
									},
									"tail_text_color": null,
									"reddot": null,
									"tracking_info": null,
									"tracking_info_v2": null,
									"reddot_timestamp": null,
									"space_key": "",
									"rule_set_id": null,
									"experiment_infos": null,
									"banner_ruleset": null
								});
							}
							if (ShopeeUserID == '' && pre_live_kyc) { gfs.push(pre_live_kyc); }
							if (ShopeeUserID == '' && shopee_loyalty) { gfs.push(shopee_loyalty); }
							if (($persistentStore.read('顯示Google') || '') == '是') {
								gfs.push({
									"name": `SpaceS22`,
									"display_name": "Google Page",
									"tail_text": '',
									"icon": null,
									"redirect_url": "https://www.google.com/",
									"new_badge": 0,
									"new_badge_end_time": 0,
									"non_login_access": 0,
									"sub_features": {
										"main_feature_subtext": "",
										"feature_circles": []
									},
									"tail_text_color": null,
									"reddot": null,
									"tracking_info": null,
									"tracking_info_v2": null,
									"reddot_timestamp": null,
									"space_key": "",
									"rule_set_id": null,
									"experiment_infos": null,
									"banner_ruleset": null

								});
							}
							if (($persistentStore.read('顯示SdanyPage') || '') == '是') {
								gfs.push({
									"name": `SpaceS21`,
									"display_name": "Sdany Page",
									"tail_text": '',
									"icon": null,
									"redirect_url": "https://sdany.org/url/urljs.html",
									"new_badge": 0,
									"new_badge_end_time": 0,
									"non_login_access": 0,
									"sub_features": {
										"main_feature_subtext": "",
										"feature_circles": []
									},
									"tail_text_color": null,
									"reddot": null,
									"tracking_info": null,
									"tracking_info_v2": null,
									"reddot_timestamp": null,
									"space_key": "",
									"rule_set_id": null,
									"experiment_infos": null,
									"banner_ruleset": null
								});
							}

							let ShowPageUrl = $persistentStore.read('ShowPageUrl');
							if (ShowPageUrl != null) {
								gfs.push({
									"name": `SpaceS23`,
									"display_name": "Custom Page Url",
									"tail_text": null,
									"icon": null,
									"redirect_url": ShowPageUrl,
									"new_badge": 0,
									"new_badge_end_time": 0,
									"non_login_access": 0,
									"sub_features": {
										"main_feature_subtext": "",
										"feature_circles": []
									},
									"tail_text_color": null,
									"reddot": null,
									"tracking_info": null,
									"tracking_info_v2": null,
									"reddot_timestamp": null,
									"space_key": "",
									"rule_set_id": null,
									"experiment_infos": null,
									"banner_ruleset": null
								});
							}
							g.features = gfs;
						}
						if (bFlag) { gs.push(g); }
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