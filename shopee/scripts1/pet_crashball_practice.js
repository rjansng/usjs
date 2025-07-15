let title = '桌上曲棍球';
let caption = '過濾 ' + title;
let version = 'v20240121';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let CarshballRank = $persistentStore.read('桌上曲棍球限名次') || '';
if (CarshballRank == '第1名') { CarshballRank = 1; }
else if (CarshballRank == '第2名') { CarshballRank = 2; }
else if (CarshballRank == '第3名') { CarshballRank = 3; }
else { CarshballRank = 0; }

let CarshballRankPoints = $persistentStore.read('桌上曲棍球點數不足限名次') || '';
if (CarshballRankPoints == '第1名') { CarshballRankPoints = 1; }
else if (CarshballRankPoints == '第2名') { CarshballRankPoints = 2; }
else if (CarshballRankPoints == '第3名') { CarshballRankPoints = 3; }
else { CarshballRankPoints = 0; }

let CarshballMode = $persistentStore.read('桌上曲棍球報錯模式') || '';
CarshballMode = CarshballMode != '否'

let PetPoints = $persistentStore.read('寵物村目前點數' + _ShopeeUserID) || '0';
try { PetPoints = parseInt(PetPoints); } catch (error) { PetPoints = 0 }

if (PetPoints < 3200 && CarshballRankPoints > 0) { CarshballRank = CarshballRankPoints; }

let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
	if (showNotification) {
		$notification.post(title, subtitle, message, { 'openUrl': url });
	}
	if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
};
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
function cookieToString(cookieObject) {
	let string = ''; for (const [key, value] of Object.entries(cookieObject)) {
		if (string != '') { string += '; '; }
		string += `${key}=${value}`;
	} return string;
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
let DTND = new Date(new Date().format('2')).getTime();
let DT8 = new Date(new Date().format('2') + ' 08:00').getTime();
let DTN = new Date().getTime();


if ($request.method != 'OPTIONS') {
	let flag = true;
	let isChangeHeaders = false;
	let headers = $request.headers;
	let hc = headers['Cookie'] || headers['cookie'];
	let hcc = parseCookie(hc);
	console.log(`userid : ${hcc.userid}`);
	console.log(`SPC_U : ${hcc.SPC_U}`);

	if (hcc.userid != hcc.SPC_U) {
		isChangeHeaders = true;
		let ssc = JSON.parse($persistentStore.read('ShopeeInfo' + _ShopeeUserID) || '{}');
		let sc = '';
		if ('tokenAll' in ssc) {
			['shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'].forEach(cc => {
				if (cc in hcc && cc in ssc.tokenAll) { ssc.tokenAll[cc] = hcc[cc]; }
			});
			sc = cookieToString(ssc.tokenAll);
		}
		else if ('cookieAll' in ssc) { sc = ssc.cookieAll; }
		else if ('cookieToken' in ssc) { sc = ssc.cookieToken; }
		else { sc = cookieToString(ssc.token); }

		if (!sc.includes('csrftoken')) sc += `; csrftoken=${ssc.csrfToken}`;
		if (!sc.includes('shopee_token')) sc += `; shopee_token=${ssc.shopeeToken}`;
		if (!sc.includes('shopid')) sc += `; shopid=${ssc.shopId}`;
		if (!sc.includes('userid')) sc += `; userid=${ssc.token.SPC_U}`;
		if (!sc.includes('username')) sc += `; username=${ssc.userName}`;

		try {
			for (const [key, value] of Object.entries(headers)) {
				if (!key.match(/(content-.+|accept|accept-.+|host|user-agent)/i)) {
					if (key.match(/cookie/i)) { headers[key] = sc; }
					else if (key.match(/x-user-(id|token)/i)) { headers[key] = ssc.token.SPC_U; }
					else if (key.match(/x-device-(id|fingerprint)/i)) { headers[key] = ssc.token.SPC_F; }
					else if (key.match(/X-(CSRFToken|sign)/i)) { headers[key] = ssc.csrfToken; }
				}
			}

		} catch (error) {
			flag = false;
			console.log('ERROR');
			console.log(error);
			$done({ response: { status: 404, headers: {}, body: "" } });
		}
	}

	if ($request.method != 'POST') { flag = false; }
	if (flag) {
		let body = $request.body;
		let ShowBodyLog = ($persistentStore.read('ShowBodyLog') || '');
		if (ShowBodyLog == '是') { ShowBodyLog = true; } else { ShowBodyLog = false; }
		if (ShowBodyLog) { console.log('\n\n'); console.log(body); console.log('\n\n'); }

		let json = JSON.parse(body);
		let ShowJsonLog = ($persistentStore.read('ShowJsonLog') || '');
		if (ShowJsonLog == '是') { ShowJsonLog = true; } else { ShowJsonLog = false; }
		if (ShowJsonLog) { console.log('\n\n'); console.log(json); console.log('\n\n'); }

		let gbody = JSON.parse($persistentStore.read('pet_crashball_landing_page' + _ShopeeUserID) || '{}');
		if (gbody == {}) {
			gbody.data = {};
			gbody.data.user_data = {};
			gbody.data.user_data.milestone_end_timestamp = 0;
			gbody.data.user_data.diamond_balance = 0;
			gbody.data.user_data.coin_balance = 0;
			gbody.data.user_data.multiple_entrance = { eligible_reward: { '1': true } }
		}
		let eligible_reward = true;
		try {
			eligible_reward = gbody.data.user_data.multiple_entrance.eligible_reward['1'];
		} catch (error) { }
		try {
			// entrance_type = 1 免費關卡
			if (json.hasOwnProperty('game') && json.game.entrance_type == 1 && eligible_reward
				&& json.hasOwnProperty('user') && json.user.game_stats) {
				let quitback = false;
				if (json.game.hasOwnProperty('end_reason') && json.game.end_reason == 'quit.back') { quitback = true; }

				let hasP = '';
				// if (DTN < DT8) { hasP = 'P'; }
				let isOK = false;
				let rank = json.user.game_stats.ingame_rank;
				if (CarshballRank > 0 && rank > CarshballRank) { //   && rank < 4
					let dtn = new Date().getTime();
					let kk = $persistentStore.read('pet_crashball_practice_marker') || '{"gameTime":0}';
					let jkk = JSON.parse(kk);
					if (!quitback && new Date(jkk.gameTime + 16000) < dtn) { // 短時間內 異常 會重送 4 次
						$persistentStore.write(JSON.stringify({ 'gameTime': dtn }), 'pet_crashball_practice_marker');
						//if (CarshballMode) { 
						loonNotify(`第${rank}名 不會送出結果 請重新挑戰。`, `🔝您指定最少需要第${CarshballRank}名。`);
						//}
						try {
							let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
							let tsn = 'pet' + 's';
							let tsid = 'GG2' + hasP;
							let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
							let tasks = JSON.parse(rs);
							let ts = {}, s = {};
							if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
							if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
							s.c++;
							// if (s.s > 0) { s.s--; }
							// s.f = true;
							ts[tsid] = s;
							tasks[tsn] = ts;
							$persistentStore.write(JSON.stringify(tasks), dataName);
						} catch (e) { console.log(e); }
					}
					// if (!CarshballMode) { quitback = true; }
					// console.log(CarshballMode);
					// console.log(quitback);

					// $done({
					// 	response: {
					// 		status: 400,
					// 		headers: {
					// 			'server': 'SGW',
					// 			'date': new Date().toUTCString(),
					// 			'content-type': 'application/json; charset=UTF-8',
					// 			// "content-length": `${fbody.length}`,
					// 			'access-control-allow-credentials': 'true',
					// 			'access-control-allow-origin': 'https://games.shopee.tw',
					// 			'vary': 'Origin',
					// 			'X-FAKE': 'FAKE'
					// 		},
					// 		body: JSON.stringify({ "errors": { "message": "missing x-tenant ???", "code": 4002 } })
					// 	}
					// });
					// console.log('400');
					if (!quitback && !CarshballMode) { // 不是結束  ，不傳送異常訊息
						console.log('不回傳數據，也不報錯模式。');
						let rfbody = JSON.stringify({
							"data": {
								"event_is_active": true,
								"reward": {
									"coin": {
										"additional": 0,
										"is_active": false,
										"base": 0,
										"total": 0
									}
								},
								"milestone_end_timestamp": Date.now(),
								"event": {
									"is_active": true
								},
								"user": {
									"multiple_entrance": {
										"last_played_entrance": 1,
										"play_ads": {
											"next_eligible_ticket": 0,
											"has_ticket": false
										},
										"eligible_reward": { "1": true }
									},
									"diamond_balance": 0,
									"play_limit": {
										"max": 0,
										"remaining": 0
									},
									"coin_balance": 880000.00
								}
							}
						});
						$done({
							response: {
								status: 200,
								headers: {
									'server': 'SGW',
									'date': new Date().toUTCString(),
									'content-type': 'application/json; charset=UTF-8',
									'access-control-allow-credentials': 'true',
									'access-control-allow-origin': 'https://games.shopee.tw',
									'vary': 'Origin',
								},
								body: rfbody
							}
						});
					}
					else if (!quitback) { // end_reason = finish
						console.log('不回傳數據，報錯模式。');
						$done({
							response: {
								status: 500,
								headers: {
									'server': 'SGW',
									'date': new Date().toUTCString(),
									'content-type': 'application/json; charset=UTF-8',
									'access-control-allow-credentials': 'true',
									'access-control-allow-origin': 'https://games.shopee.tw',
									'vary': 'Origin',
								},
								body: '{"data":{}}'
							}
						});
					}
					else { // end_reason = quit.back
						console.log('不回傳數據，快速結束。');
						// console.log('404');
						// 模擬回應訊息
						let rfbody = JSON.stringify(
							{
								"data": {
									"event_is_active": true,
									"reward": {
										"coin": {
											"additional": 0,
											"is_active": false,
											"base": 0,
											"total": 0
										}
									},
									"milestone_end_timestamp": Date.now(), // gbody.data.user_data.milestone_end_timestamp,
									"user": {
										"multiple_entrance": {
											"last_played_entrance": 1,
											"play_ads": {
												"next_eligible_ticket": 0,
												"has_ticket": false
											},
											"eligible_reward": {
												"1": eligible_reward
											}
										},
										"diamond_balance": gbody.data.user_data.diamond_balance,
										"play_limit": {
											"max": 0,  // 15
											"remaining": 0  // 15
										},
										"coin_balance": gbody.data.user_data.coin_balance
									}
								}
							}
						);
						// console.log(rfbody);
						$done({
							response: {
								status: 200,
								headers: {
									'server': 'SGW',
									'date': new Date().toUTCString(),
									'content-type': 'application/json; charset=UTF-8',
									'access-control-allow-credentials': 'true',
									'access-control-allow-origin': 'https://games.shopee.tw',
									'vary': 'Origin',
								},
								body: rfbody
							}
						});
					}

				}
				else {
					// loonNotify('桌上曲棍球', '獲得第一名 500P');

					try {
						let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						let tsn = 'pet' + 's';
						let tsid = 'GG2' + hasP;
						let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						let tasks = JSON.parse(rs);
						let ts = {}, s = {};
						if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						s.c++;
						// if (s.s > 0) { s.s--; }
						if (!s.f && CarshballRank > 0 && rank <= CarshballRank) {
							s.f = true; isOK = true;
							s.r = (rank == 1 ? '500' : (rank == 2 ? '200' : (rank == 3 ? '100' : '')));
						}
						if (s.f) {
							try {
								let gmp = { 'dataTime': DTND };
								$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG2' + hasP + _ShopeeUserID);
							} catch (error) { }
						}

						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					} catch (e) { console.log(e); }


					if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
					else { console.log('未修改 Headers'); $done({}); }
				}

			} else {
				if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
				else { console.log('未修改 Headers'); $done({}); }
			}
		} catch (error) {
			console.log('ERROR');
			console.log(error);
			if (isChangeHeaders) { console.log('修改 Headers ERROR'); $done({ headers }); }
			else { console.log('未修改 Headers ERROR'); $done({}); }
		}
	}
	else {
		if (isChangeHeaders) { console.log('修改 Headers !POST'); $done({ headers }); }
		else { console.log('未修改 Headers !POST'); $done({}); }
	}
}
else {
	$done({
		response: {
			status: 204,
			headers: {
				'server': 'SGW',
				'date': new Date().toUTCString(),
				'access-control-allow-credentials': 'true',
				'access-control-allow-headers': 'Game-Session-Id, X-Tenant, X-User-Id',
				'access-control-allow-methods': 'POST',
				'access-control-allow-origin': 'https://games.shopee.tw',
				'vary': 'Origin',
				// 'vary': 'Access-Control-Request-Method',
				// 'vary': 'Access-Control-Request-Headers',
				// 'X-FAKE': 'FAKE'
			}
		}
	});
	$done({});
}