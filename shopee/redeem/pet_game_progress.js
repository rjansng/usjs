let ShopeeUserID = '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log('ShopeeUserID: ' + ShopeeUserID); }

let caption = '過濾校園遊戲 點數 完成度';
const version = 'v20230914';

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

let body = $response.body;
try {
	let json = JSON.parse(body);

	try {
		let dtD = new Date(new Date().format('2')).getTime();
		let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		let tasks = JSON.parse(rs);

		shopee_ids = [
			{ 'id': 'E', 'name': '金頭腦  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 6, 'l3': 10 }, // 20 40 60
			{ 'id': 'F', 'name': '賽跑    ', 't': 'B', 'h': '210 💎', 'l1': 4, 'l2': 2, 'l3': 1 },  // 30 60 120
			{ 'id': 'G', 'name': '找碴    ', 't': 'E', 'h': '100 💎', 'l1': 3, 'l2': 6, 'l3': 9 },  // 20 20 60
			{ 'id': 'C', 'name': '踢足球  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 5, 'l3': 7 },  // 20 40 60
			{ 'id': 'H', 'name': '團體賽  ', 't': 'C', 'h': ' 80 💎', 'l1': 30, 'l2': 60, 'l3': 90 }, // 20 60 裝
		];

		let reset = false;
		if (tasks.gameTime != dtD) { tasks.gameTime = dtD; reset = true; }
		if (reset) { tasks.pets = {}; }

		let tsn2 = 'pet' + 's';

		shopee_ids.forEach((p, i) => {
			let p2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' };
			if (!tasks[tsn2].hasOwnProperty(p.id)) { tasks[tsn2][p.id] = p2; }
		});

		let pets = tasks[tsn2];

		let gns = ['', '金頭腦', '賽跑  ', '找碴  ', '足球  ', '團體賽'];
		let gnids = ['XX', 'E', 'F', 'G', 'C', 'H'];

		let gp = json.data.gameProgresses;
		if (gp && gp.length > 0) {
			gp.forEach(g => {
				console.log(`\n${g.gameID} : ${gns[g.gameID]}\t${g.completed ? '💯' : (g.gameData != '' ? '⭕️' : '❌')}`); // \t${g.gameData}
				if (g.gameData != '') {
					let d = JSON.parse(g.gameData);

					let uu = gnids[g.gameID];
					let p = {};
					let sI = pets['I'];

					shopee_ids.some(x => { if (x.id === uu) { p = x; return true; } });
					let s = pets[p.id];
					//s.c++;
					let msg = `今天第 ${s.c} 次`;
					caption = p.name;
					// let sf = s.f;
					let ss = s.s;
					let sl = s.l;
					let cc = 0;
					s.l = 0;

					if (p.t === 'A') {
						let s2 = Math.floor(d.maxCorrectRate / 100 * p.l3);
						//if (s2 > s.s) {
						if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
						if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
						if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
						s.s = s2;
						s.f = s.l === 3;
						msg += `，成績 ${ss} -> ${s.s}`;
						//}
					} else if (p.t === 'B') {
						//if (d.maxRank < s.s || s.s === 0) {
						if (d.maxRank <= p.l1) { s.l = 1; if (s.l > sl) { cc += 30; } }
						if (d.maxRank <= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
						if (d.maxRank <= p.l3) { s.l = 3; if (s.l > sl) { cc += 120; } }
						s.s = d.maxRank;
						s.f = s.l === 3;
						msg += `，成績 ${ss} -> ${s.s}`;
						//}
					} else if (p.t === 'C') {
						let s2 = d.maxCorrectRate;
						//if (s2 > s.s) {
						if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
						if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 60; } }
						if (s2 >= p.l3) { s.l = 3; }
						s.s = s2;
						s.f = s.l >= 2;
						// s.c++;  // 成績提高才計次數
						msg = msg.replace(/第 \d+ 次/, `第 ${s.c} 次`);
						msg += `，成績 ${ss} -> ${s.s}`;
						//}
					} else if (p.t === 'E') {
						let s2 = Math.floor(d.maxCorrectRate / 100 * p.l3);
						//if (s2 > s.s) {
						if (s2 >= p.l1) { s.l = 1; if (s.l > sl) { cc += 20; } }
						if (s2 >= p.l2) { s.l = 2; if (s.l > sl) { cc += 40; } }
						if (s2 >= p.l3) { s.l = 3; if (s.l > sl) { cc += 60; } }
						s.s = s2;
						s.f = s.l === 3;
						msg += `，成績 ${ss} -> ${s.s}`;
						//}
					}
					if (p.t === 'A' || p.t === 'B' || p.t === 'C' || p.t === 'E') {
						s.d = [];
						// s.d.push(d);
						if (cc > 0) { msg += `，獲得獎勵 💎${cc}`; }
						if (s.f) { msg += `，已`; }
						else { msg += `，未`; }
						msg += '完成每日💎任務';
					}
					console.log('\t\t\t\t' + msg);
					pets[p.id] = s;
					pets['I'] = sI;
					tasks.pets = pets;
					$persistentStore.write(JSON.stringify(tasks), dataName);

				}
			});
		}

	} catch (error) {
		console.log(error);
		console.log(json);

	}

	let flag = false;
	json.data.gameProgresses.forEach((g, i) => {
		console.log('\n');
		// console.log(`GameID: ${g.gameID}`);
		//console.log(g);

		if (!g.completed) {
			if (g.gameData == "") { console.log(`${g.gameID}: 未完成`); }
			else {
				let d = JSON.parse(g.gameData);
				if (g.gameID == 1) {
					let gt = $persistentStore.read('金頭腦完成標示') || '預設';
					if (gt == '預設') { gt = 0; } else { gt = parseInt(gt); }
					console.log('金頭腦完成標示: ' + gt);
					let s2 = Math.floor(d.maxCorrectRate / 100 * 10);
					console.log('s2: ' + s2);
					if (gt > 0) {
						if (gt == 1 && s2 >= 3) { g.completed = true; flag = true; }
						else if (gt == 2 && s2 >= 6) { g.completed = true; flag = true; }
						// else if (gt == 3 && s2 >= 10) { g.completed = true; flag = true; }
					}
				}
				else if (g.gameID == 2) {
					let gt = $persistentStore.read('賽跑完成標示') || '預設';
					if (gt == '預設') { gt = 0; } else { gt = parseInt(gt); }
					console.log('賽跑完成標示: ' + gt);
					console.log('賽跑完成標示 Rank: ' + d.maxRank);
					if (gt > 0) {
						if (gt == 1 && d.maxRank <= 4) { g.completed = true; flag = true; }
						else if (gt == 2 && d.maxRank <= 2) { g.completed = true; flag = true; }
						// else if (gt == 3 && d.maxRank <= 1) { g.completed = true; flag = true; }
					}
				}
				else if (g.gameID == 3) {
					let gt = $persistentStore.read('找碴完成標示') || '預設';
					if (gt == '預設') { gt = 0; } else { gt = parseInt(gt); }
					console.log('找碴完成標示: ' + gt);
					let s2 = Math.floor(d.maxCorrectRate / 100 * 9);
					console.log('找碴完成標示 s2: ' + s2);
					if (gt > 0) {
						if (gt == 1 && s2 >= 3) { g.completed = true; flag = true; }
						else if (gt == 2 && s2 >= 6) { g.completed = true; flag = true; }
						// else if (gt == 3 && s2 >= 10) { g.completed = true; flag = true; }
					}
				}
				else if (g.gameID == 4) {
					let gt = $persistentStore.read('足球完成標示') || '預設';
					if (gt == '預設') { gt = 0; } else { gt = parseInt(gt); }
					console.log('足球完成標示: ' + gt);
					let s2 = Math.floor(d.maxCorrectRate / 100 * 7);
					console.log('足球完成標示 s2: ' + s2);
					if (gt > 0) {
						if (gt == 1 && s2 >= 3) { g.completed = true; flag = true; }
						else if (gt == 2 && s2 >= 5) { g.completed = true; flag = true; }
						// else if (gt == 3 && s2 >= 7) { g.completed = true; flag = true; }
					}
				}
				else if (g.gameID == 5) {
					if (d.maxCorrectRate >= 60) { g.completed = true; flag = true; }
				}
			}
		}
	});
	if (flag) {
		body = JSON.stringify(json);
		$done({ body });
	}
}
catch (e) {
	console.log(e);
}

$done({});
