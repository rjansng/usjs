let ShopeeUserID = '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log('ShopeeUserID: ' + ShopeeUserID); }

let title = '貪食蛇 免誤按';
let caption = '過濾 ' + title;
let version = 'v20240121';

let UseCoins = $persistentStore.read('貪食蛇用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

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


if ($request.method === 'GET' && !UseCoins) {
	let body = $response.body;
	let json = JSON.parse(body);
	// console.log(json);

	try {
		if (json.hasOwnProperty('data')
			&& json.data.hasOwnProperty('user_data')
			&& json.data.user_data.hasOwnProperty('play_limit')) {

			json.data.user_data.play_limit.remaining = 0;
			json.data.user_data.play_limit.max = 0;

			// 不能用這個
			// json.data.event_data.special_event_data.free_boosters['1'] = 30;
			// json.data.event_data.special_event_data.free_boosters['2'] = 30;
			// json.data.event_data.special_event_data.free_boosters['3'] = 30;

			let lobby = json.data.event_data.special_event_data.lobby[0];
			json.data.event_data.special_event_data.lobby = [];
			json.data.event_data.special_event_data.lobby.push(lobby);

			let isOK = false;
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'GG1';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.f = !json.data.user_data.lobby.eligible_rewards['1'];
				if (s.f && s.c == 0) s.c++; // s.c = s.f ? 1 : 0;
				s.s = s.f ? 0 : 1;
				isOK = s.f;
				//s.r = msg;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
	
			try {
				if (isOK) {
					let DTND = new Date(new Date().format('2')).getTime();

					let gmp = { 'dataTime': DTND };
					$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklinkGG1' + _ShopeeUserID);
				}
			} catch (error) {
				console.log(error);
			 }
	

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