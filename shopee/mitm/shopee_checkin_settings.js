const caption = '取得 checkin 數據';
const version = 'v20240130';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
// console.log(`_UID: ${_ShopeeUserID}`);

let body = $response.body;

try {
	let json = JSON.parse(body);
	//console.log(json);
	if (json.code == 0 && 'data' in json) {
		// console.log(json.data);

		let change_data = false;
		let pp = $persistentStore.read('簽到失敗偽裝為成功') || '';
		if (pp != '是') { pp = false; } else { pp = true; }
		if (json.data.fraud_detected) {
			json.data.fraud_detected = false;
			change_data = true;
			console.log('被偵到詐欺行為。');
		}
		if (json.data.checked_in_today) {
			console.log(`已簽到 ${json.data.today_index} 天，今日領取 ${json.data.checked_in_today_amount}`);
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'CI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tsn in tasks) { ts = tasks[tsn]; }
				if (tsid in ts) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (!s.f) {
					s.c = 1;
					s.f = true;
					s.r = `🔆${json.data.checked_in_today_amount} 蝦幣，簽到 ${json.data.today_index} 天。`;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				}
			} catch (e) { console.log(e); }
		}
		else {
			console.log('未簽到。');
			if (pp && !json.data.checked_in_today) {
				json.data.checked_in_today = true;
				change_data = true;
				console.log('簽到失敗偽裝為成功。');
			}
			console.log(body);
		}

		if (change_data) {
			$done({ body: JSON.stringify(json) });
		}
		else { $done({}); }

	}
	else { $done({}); }
} catch (error) {
	console.log(`ERR: ${error}`);
	$done({});
}

