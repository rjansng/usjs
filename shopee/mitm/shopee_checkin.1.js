const caption = '取得 手動 checkin 數據';
const version = 'v20231214';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
// console.log(caption);
// console.log(version);
// console.log(ShopeeUserID);

let body = $response.body;
// console.log(body);
try {
	let json = JSON.parse(body);
	if (json.code == 0 && 'data' in json) {
		if ('success' in json.data && json.data.success) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'CI';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c++;
				s.f = true;
				// s.r = `\n連續簽到 ${json.data.check_in_day} 天，今日領取 ${json.data.increase_coins} 蝦幣`;
                s.r = `第 ${obj.data.check_in_day} 天。🔆${obj.data.increase_coins} 蝦幣`;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('not success');
			console.log(body);
			console.log(json);
		}
	}
	else {
		console.log('ERR MSG');
		console.log(body);
		console.log(json);
		try {
			json.data.err_msg += ' ' + json.msg;
			$done({ body: JSON.stringify(json) });

		} catch (error) {

		}

	}
} catch (error) {
	console.log(`ERR: ${error}`);
}

$done({});
