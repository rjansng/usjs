const caption = '取得 現有蝦幣 數據';
const version = 'v20240129';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let body = $response.body;
try {
	let obj = JSON.parse(body);
	if ('error' in obj && obj.error == null && 'data' in obj) {
		if ('fe_available_amount' in obj.data && obj.data.fe_available_amount) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'SC';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.s = obj.data.fe_available_amount / 100000;
				s.f = true;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('not success');
			console.log(body);
			console.log(obj);
		}
	}
	else {
		console.log('ERR MSG');
		console.log(body);
		console.log(obj);
		try {
			obj.data.err_msg += ' ' + obj.msg;
			$done({ body: JSON.stringify(obj) });

		} catch (error) {

		}

	}
} catch (error) {
	console.log(`ERR: ${error}`);
}

$done({});
