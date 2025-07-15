let caption = '每日任務 領任務蝦幣 Res';
let title = '💰我的蝦幣 ' + caption;
const version = 'v20231123';
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

// console.log($request.body);

var body = $response.body;
var json = JSON.parse(body);
console.log(json);

let tasksData = [
	{ 'tsid': 'ST45', 'id': 9945, 'need': 1, 'name': '今日玩蝦蝦寵物村1次' },
	{ 'tsid': 'ST47', 'id': 9947, 'need': 1, 'name': '今日玩蝦皮夾夾樂1次' },
	{ 'tsid': 'ST48', 'id': 9948, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST15677', 'id': 15677, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST16300', 'id': 16300, 'need': 1, 'name': '瀏覽 推薦商品 30秒' },
	{ 'tsid': 'ST15676', 'id': 15676, 'need': 1, 'name': '瀏覽 推薦商品 30秒 (1/2)' },
	{ 'tsid': 'ST16111', 'id': 16111, 'need': 1, 'name': '瀏覽 推薦商品 30秒 (2/2)' },
	{ 'tsid': 'ST16112', 'id': 16112, 'need': 1, 'name': '今日玩蝦皮消消樂1次' },
	{ 'tsid': 'ST16113', 'id': 16113, 'need': 1, 'name': '今日玩蝦皮夾夾樂1次' },
	{ 'tsid': 'ST16515', 'id': 16515, 'need': 1, 'name': '今日玩蝦皮消消樂1次' },
	{ 'tsid': 'ST17847', 'id': 17847, 'need': 1, 'name': '今日玩蝦皮消消樂1次' },
];

let DTND = new Date(new Date().format('2')).getTime();
let task_id = 0;
let task_json = JSON.parse($persistentStore.read('mkt_coins_task_claim') || '{}');
console.log(task_json);
if (task_json.hasOwnProperty('task_id')) {
	let dtn = new Date();
	let dt1 = new Date(task_json.datetime);
	if (dtn.format("2") === dt1.format("2")) {
		task_id = task_json.task_id;
	}
}


let tsid2 = '';
if (tasksData.some(td => {
	if (td.id === task_id) {
		tsid2 = td.tsid;
		return true;
	}
})) {
	try {
		let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		let tsn = 'shopee' + 's';
		let tsid = tsid2;
		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		let tasks = JSON.parse(rs);
		let ts = {}, s = {};
		if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
		if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
		s.c++;
		if (s.s > 0) { s.s--; }
		s.f = true;
		s.d.push(`🔆${json.data.coin_amount} 蝦幣`);
		ts[tsid] = s;
		tasks[tsn] = ts;
		$persistentStore.write(JSON.stringify(tasks), dataName);
	} catch (e) { console.log(e); }

	try {
		if (task_id == 9948 || task_id == 15677 || task_id == 16300) {
			let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
		}
		// else if (task_id == 15676) {
		// 	let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
		// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
		// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink1' + _ShopeeUserID);
		// }
		// else if (task_id == 16111) {
		// 	let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
		// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
		// 	$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink2' + _ShopeeUserID);
		// }
	} catch (error) { }

}

$persistentStore.write(null, 'mkt_coins_task_claim');

$done({});
