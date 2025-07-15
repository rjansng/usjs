let title = '桌上曲棍球';
let caption = '過濾 ' + title + ' 免誤按及提醒待完成';
let version = 'v20231205';
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

let UseCoins = $persistentStore.read('桌上曲棍球用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
	if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
	if (showNotification) {
		$notification.post(title, subtitle, message, { 'openUrl': url });
	}
};
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
Date.prototype.AddDay = function (intNum) {
	sdate = new Date(this);
	sdate.setDate(sdate.getDate() + intNum);
	return sdate;
};
let DTND = new Date(new Date().format('2')).getTime();

if ($request.method === 'GET') {

	let body = $response.body;
	let ShowBodyLog = ($persistentStore.read('ShowBodyLog') || '');
	if (ShowBodyLog == '是') { ShowBodyLog = true; } else { ShowBodyLog = false; }
	if (ShowBodyLog) { console.log('\n\n'); console.log(body); console.log('\n\n'); }

	$persistentStore.write(body, 'pet_crashball_landing_page' + _ShopeeUserID);

	let json = JSON.parse(body);
	let ShowJsonLog = ($persistentStore.read('ShowJsonLog') || '');
	if (ShowJsonLog == '是') { ShowJsonLog = true; } else { ShowJsonLog = false; }
	if (ShowJsonLog) { console.log('\n\n'); console.log(json); console.log('\n\n'); }
	// console.log(json);

	try {
		// console.log(json.data.user_data);
		if (json.data && json.data.user_data && json.data.user_data.play_limit) {
			let PetPoints = json.data.user_data.diamond_balance
			$persistentStore.write(`${PetPoints}`, '寵物村目前點數' + _ShopeeUserID);


			if (PetPoints < 3200 && CarshballRankPoints > 0) { CarshballRank = CarshballRankPoints; }

			// json.data.user_data.milestone_claimed_levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

			//json.data.user_data.total_play = 1;
			// 不要出現 刷新記錄的畫面
			if (json.data.user_data.milestone_end_timestamp < json.data.server_eod_timestamp) {
				json.data.user_data.milestone_end_timestamp = Date.now() + 604800000;
			}
			// // 測試
			// if (json.data.user_data.milestone_end_timestamp > json.data.server_eod_timestamp) {
			// 	json.data.user_data.milestone_end_timestamp -= 604800000;
			// }
			// 避免按到蝦幣
			if (!UseCoins) {
				json.data.user_data.play_limit.remaining = 0;
				json.data.user_data.play_limit.max = 0;
			}
			//json.data.local_eod_datetime = '2023-11-22T01:01:01+08:00';
			json.data.user_data.first_play = false;
			json.data.user_data.arcade_pass.is_vip = true;
			let eligible_reward = json.data.user_data.multiple_entrance.eligible_reward['1'];

			if (eligible_reward) { // 已完成 不提醒 (true : 未完成)

				json.data.user_data.coin_balance += 880000;
				// json.data.user_data.diamond_balance += 10000000;
				// 由上面的調整蝦幣數量來確認是否已完成

				// 下面跳出通知訊息提示是否未完成
				// let dtn = new Date().getTime();
				// let kk = $persistentStore.read('pet_crashball_practice_marker2') || '{"gameTime":0}';
				// let jkk = JSON.parse(kk);
				// if (new Date(jkk.gameTime + 16000) < dtn) { // 短時間內 不提醒
				// 	$persistentStore.write(JSON.stringify({ 'gameTime': dtn }), 'pet_crashball_practice_marker2');
				// 	// if (new Date().getTime() >= new Date(new Date().format('2') + ' 08:00:00').getTime()) {
				// 	if (CarshballRank == 0) {
				// 		loonNotify(`持續挑戰！🙂未指定名次，有點數就好。`, '第1名500點，可兌換1.5蝦幣。');
				// 	}
				// 	else {
				// 		loonNotify(`持續挑戰！🔝您指定最少需要第${CarshballRank}名。`, '第1名500點，可兌換1.5蝦幣。');
				// 	}
				// 	//loonNotify('AM 8.後 待完成');
				// 	// } else {
				// 	// loonNotify('AM 8.前 (昨日) 待完成');
				// 	// }
				// }
			}


			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'GG2';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.f = !eligible_reward;
				let gmp = { 'dataTime': 0 };
				if (s.f) { gmp = { 'dataTime': DTND }; }
				try {
					$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG2' + _ShopeeUserID);
				} catch (error) { }

				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }


			body = JSON.stringify(json);
			$done({ body });
		}
	} catch (error) {
		$done({});
	}
}
else {
	$done({});
}