let caption = '每日任務 取任務ID 瀏覽 推薦商品 30秒';
let title = '💰我的蝦幣 ' + caption;
const version = 'v20240811';
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

let body = $response.body;
let mkt_tasks = null;
try {
	let obj = JSON.parse(body);
	//console.log(obj);
	console.log((new Date()).format());
	if (obj.hasOwnProperty('code') && obj.code == 0) {
		// mkt_tasks = body;
		let DTND = new Date(new Date().format('2')).getTime();
		obj.date = DTND;
		mkt_tasks = JSON.stringify(obj);
		let task_id = 0;
		let uta = {};
		let shopeetasks_ids = [];

		obj.data.user_tasks.forEach(ut => {
			let sut = {
				'id': ut.task.id
				, 'task_name': ut.task.task_name
				, 'task_status': ut.task_status
				, 'prize_value': ut.task.prize_value
			};
			shopeetasks_ids.push(sut);
			console.log(`${ut.task.id}\t${ut.task.task_name}\t${ut.task_status}`)
			let tsid2 = `${ut.task.id}`;
			if (tsid2 == '9945') { tsid2 = '45'; }
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = `ST${tsid2}`;
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (!s.f && ut.task_status == 3) {
					s.c++;
					if (s.s > 0) { s.s--; }
					s.f = true;
					s.d.push(`🔆${ut.task.prize_value} 蝦幣`);
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				}
			} catch (e) { console.log(e); }


			if (ut.task_status != 3 && ut.task.action_key == 'act_browse_product_ads') {
				if (task_id == 0 || task_id > ut.task.id) {
					task_id = ut.task.id;
					uta = ut;
					console.log(`任務：${uta.task.id} ${uta.task.task_name}，可獲得 ${uta.task.prize_value} 蝦幣。`);
				}
			}
			if (ut.task.action_key == 'act_browse_product_ads') {
				try {
					if ([9948, 15677, 16300].some(tid => { if (tid == task_id) { return true; } })) {
						let gmp = { 'dataTime': DTND, 'ts': ut.task_status == 3, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
					}
					else if (task_id == 15676) {
						let gmp = { 'dataTime': DTND, 'ts': ut.task_status == 3, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink1' + _ShopeeUserID);
					}
					else if (task_id == 16111) {
						let gmp = { 'dataTime': DTND, 'ts': ut.task_status == 3, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink2' + _ShopeeUserID);
					}
					else {
						let gmp = { 'dataTime': DTND, 'ts': ut.task_status == 3, 'id': task_id };
						$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink3' + _ShopeeUserID);
					}
				} catch (error) { }
			}

		});
		if (shopeetasks_ids.length > 0) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				tasks.shopeetasks_ids = shopeetasks_ids;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		if (task_id == 0) {
			$persistentStore.write(null, 'mkt_coins_task_id' + _ShopeeUserID);
			let gmp = { 'dataTime': DTND, 'ts': true, 'id': task_id };
			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
			console.log('任務已領。');
		}
		else { // if ([9948, 15677, 16300].some(tid => { if (tid == task_id) { return true; } })) {
			let gmp = { 'dataTime': DTND, 'ts': false, 'id': task_id };
			$persistentStore.write(JSON.stringify(gmp), 'get_me_page_showquicklink' + _ShopeeUserID);
			$persistentStore.write(task_id.toString(), 'mkt_coins_task_id' + _ShopeeUserID);
			console.log(`當前任務：${uta.task.id} ${uta.task.task_name}，可獲得 ${uta.task.prize_value} 蝦幣。`);
		}


	} else { console.log(obj); }
} catch (error) {
	console.log(error);
	console.log(body);
}
$persistentStore.write(mkt_tasks, 'shopee_mkt_coins_tasks' + _ShopeeUserID);
$done({});
