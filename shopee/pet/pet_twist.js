let title = '扭蛋';
let caption = '取得 ' + title;
let version = 'v20231108';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };

if ($request.method === 'POST') {
	//console.log($request.body);

	var body = $response.body;
	var json = JSON.parse(body);
	if (json.code === 0) {

		let js = JSON.parse($persistentStore.read('ShopeePetTwist' + _ShopeeUserID) || "{datetime:0,channel:'normal'}");
		$persistentStore.write(null, 'ShopeePetTwist' + _ShopeeUserID);
		$persistentStore.write(null, 'finish_twist' + _ShopeeUserID);

		let tsid2 = '';
		if (js.channel === 'ads') { tsid2 += 'B'; }

		let msg = `${json.data.pet.petID} ${json.data.pet.attr.coinEfficiencyMin}`;
		console.log(`獲得年輕寵物 : ${msg}`);

		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'pet' + 's';
			let tsid = 'PTI' + tsid2;
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.c++;
			if (s.s > 0) { s.s--; }
			s.d.push(msg);
			s.f = s.c > 0;
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }


		let sn = showNotification;
		showNotification = true;
		loonNotify(caption, `獲得年輕寵物 : ${msg} (略過動畫)`);
		showNotification = sn;

		json.code = 600002; // 點數不足 lack chance
		$persistentStore.write(null, '扭蛋機CODE');
		$done({ body: JSON.stringify(json) });
		//$done({ response: { status: 404, headers: {}, body: "" } });

		// $done({});
	}
	else {
		console.log(json);
		$done({});
	}
}
else {
	$done({});
}