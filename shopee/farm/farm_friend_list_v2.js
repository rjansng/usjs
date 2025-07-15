let version = 'v20240502';
let title = '果園 好友清單 調整';

let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

function parseCookie(cookieString) {
	return cookieString
		.split(';')
		.map(v => v.split('='))
		.filter((v) => v.length > 1)
		.reduce((acc, v) => {
			let value = decodeURIComponent(v[1].trim());
			for (let index = 2; index < v.length; index++) {
				if (v[index] === '') {
					value += '=';
				}
			}
			acc[decodeURIComponent(v[0].trim())] = value;
			return acc;
		}, {});
}
let headers = $request.headers;
let hc = headers['Cookie'] || headers['cookie'];
let hcc = parseCookie(hc);


let body = $response.body;
if (body) {
	// let friendsList = [681985929, 732423754, 918908158, 981988128, 578729974, 964204346, 664774607, 1116124017, 43980511, 140595219, 16079058, 313955569];
	// let friendsListN = ['s___7 V', 's___1 V', 'j___5 V', 'e___0 V', 's___6 V', 'x___4 V', 'u___w V', 'w___t V', 'z___i V', 's___d Z', 'm___3 Z', 'd___y Z'];
	let friendsList = [681985929, 732423754, 918908158, 981988128, 964204346, 43980511, 140595219, 16079058, 313955569];
	let friendsListN = ['s___7 V', 's___1 V', 'j___5 V', 'e___0 V', 'x___4 V', 'z___i V', 's___d Z', 'm___3 Z', 'd___y Z'];
	//friendsList.reverse();

	let hfs = $persistentStore.read('澆水互助好友') || '';
	if (hfs == '其他') { hfs = true; } else { hfs = false; }
	if (hfs) {
		friendsList.push(2186783); // 燕秋
		friendsList.push(32817980); // 怡芳
		friendsListN.push('c___0');
		friendsListN.push('y___g');
	}

	let json = JSON.parse(body);
	if (json.code == 0) {
		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'farm' + 's';
			let tsid = 'E';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.c = json.data.userWater.totalHelpFriendCount - json.data.userWater.remainingHelpFriendCount;
			s.s = json.data.userWater.remainingHelpFriendCount;
			if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }

		try {
			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let tsn = 'farm' + 's';
			let tsid = 'F';
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let tasks = JSON.parse(rs);
			let ts = {}, s = {};
			if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
			if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
			s.c = json.data.userWater.totalHelpedCount - json.data.userWater.remainingHelpedCount;
			s.s = json.data.userWater.remainingHelpedCount;
			if (s.c > 0 || s.s > 0) { s.f = s.s == 0; }
			ts[tsid] = s;
			tasks[tsn] = ts;
			$persistentStore.write(JSON.stringify(tasks), dataName);
		} catch (e) { console.log(e); }


		let fs = json.data.friends;
		let k = 0;
		let k2 = 0;

		for (let i = 0; i < fs.length; i++) {
			let f = fs[i];
			friendsList.some((xf, xfi) => { // 主要清單優先
				if (xf == f.id) {
					if (f.name.includes('***')) {
						fs[i].name = ` ${friendsListN[xfi]} `; fs[i].contactName = '互助水友';
					}
					else { fs[i].name += ' V'; }
					// fs[i].interactData.gaveWater = false;
					fs.sortType = 0;
					fs.splice(k, 0, f); fs.splice(i + 1, 1); k++; k2++;
					return true;
				}
			});
		}
		// 延續 上面的 k index
		friendsList.forEach((flid, flidi) => {
			if (`${flid}` != hcc.SPC_U && !fs.some(f => { if (f.id == flid) { return true; } })) {
				fs.splice(k, 0, {
					"id": flid,
					"name": friendsListN[flidi],
					"contactName": "*互助水友*",
					"avatarUrl": "",
					"interactTypes": [0],
					"interactData": {
						"gaveWater": false,
						"receivedWater": false
					},
					"sortType": 0
				});
				k++;
			}

		});

		json.data.friends = fs;
	}
	body = JSON.stringify(json);
	$done({ body });
}