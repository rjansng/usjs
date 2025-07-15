let title = '💰我的蝦幣 瀏覽商店 領任務';
let version = 'v20231123';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

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

// console.log($request.body);

var body = $response.body;
var json = JSON.parse(body);
//console.log(json);

if (json.hasOwnProperty('data') && json.data.hasOwnProperty('claimed_coin_amount')) {

	let task_id = parseInt($persistentStore.read('mkt_coins_task_id' + _ShopeeUserID) || '9948');

	try {
		let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		let tsn = 'shopee' + 's';
		let tsid = 'ST48';
		if (task_id != 9948) { tsid = `ST${task_id}`; }
		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		let tasks = JSON.parse(rs);
		let ts = {}, s = {};
		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
		if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
		s.c++;
		if (s.s > 0) { s.s--; }
		s.f = true;
		s.d.push(`🔆${json.data.claimed_coin_amount} 蝦幣`);
		ts[tsid] = s;
		tasks[tsn] = ts;
		$persistentStore.write(JSON.stringify(tasks), dataName);
	} catch (e) { console.log(e); }

	try {
		let gmp = { 'dataTime': DTND, 'ts': true, 'ts': true, 'id': task_id };
		$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
		// if (task_id == 9948) {
		// 	let gmp = { 'dataTime': DTND, 'ts': true, 'ts': true, 'id': task_id };
		// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
		// }
		// else 
		if (task_id == 15676) {
			let gmp = { 'dataTime': DTND, 'ts': true, 'ts': true, 'id': task_id };
			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink1' + _ShopeeUserID);
		}
		else if (task_id == 16111) {
			let gmp = { 'dataTime': DTND, 'ts': true, 'ts': true, 'id': task_id };
			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink2' + _ShopeeUserID);
		}
	} catch (error) { }

	$persistentStore.write(null, 'ShopeeFeedsTaskToken' + _ShopeeUserID);

}

$done({});
