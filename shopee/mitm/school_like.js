// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

let caption = '幫好友按讚';
let title = '自動' + caption;
const version = 'v20231127';
let showNotification = true;
let showLog = true;
let config = null;
let dataList = [];
const NotShowNotification = $persistentStore.read('NotShowNotification'); if (NotShowNotification) { showNotification = false; }
const NotShowLog = $persistentStore.read('ShowLog'); if (NotShowLog) { showLog = false; }
function getRnd(len = 16) { return (Math.random() * 10 ** 20).toFixed(0).substring(0, len); }
function getToken() { return (new Date()).getTime().toString(); }
function loonNotifyArray(m) { if (Array.isArray(m)) { loonNotify(m[0], m[1]); } else { loonNotify(m); } };
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
function handleError(error) {
	let sl = showLog; showLog = false; let msg = '❌';
	if (Array.isArray(error)) {
		for (let i = 0; i < error.length; i++) {
			const e = error[i]; msg += (i > 1 ? '\n' : ' ') + `${e}`;
		}
	}
	else { msg += ` ${error}`; }
	console.log(msg); loonNotifyArray(error); showLog = sl;
}
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length === 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }
async function delay(seconds) { console.log(`\t\t\t\t\t\t\t⏰ 等待 ${seconds} 秒`); return new Promise((resolve) => { setTimeout(() => { resolve(); }, seconds * 1000); }); }
function GetDataConfig(item = -1, method = 'POST', url = '', title = '', content = '') {
	if (item === -1) {
		return {
			'item': item, 'method': method, 'url': url, 'title': title, 'content': content, 'memo': ''
			, 'dataRequest': { url: '', headers: config.shopeeHeaders, body: null }, 'func': ud[6],
		};
	}
	let ud = UrlData[item];
	let dc = {
		'item': item, 'method': ud[0], 'title': ud[1], 'content': ud[2], 'url': ud[3], 'memo': '',
		'dataRequest': { url: '', headers: null, body: null }, 'func': ud[6],
	};
	let params = null;
	params = ud[5];
	if (dc.method === 'POST') { dc.dataRequest.body = DataPostBodyList[dc.item]; }
	dc.dataRequest.headers = config.shopeeHeaders;
	if (params && params.length > 0) {
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			dc.url = dc.url.replace(`\{${p}\}`, config[p]);
		}
	}
	dc.dataRequest.url = dc.url;
	return dc;
}
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

async function dataGet(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.get(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`執行失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						return resolve(data);
					} else {
						return reject([`執行失敗 ‼️`, response.status, data]);
					}
				}
			});
		} catch (error) {
			return reject([`執行失敗 ‼️`, error]);
		}
	});
}
async function dataPost(dc, item = -1) {
	return new Promise((resolve, reject) => {
		try {
			let msg = `🌐 ${dc.title} ...`;
			if (item >= 0) { msg += ` (${item})`; }
			console.log(msg);
			$httpClient.post(dc.dataRequest, function (error, response, data) {
				if (error) {
					return reject([`${content}失敗 ‼️`, '連線錯誤']);
				} else {
					if (response.status === 200) {
						return resolve(data);
					} else {
						return reject([`執行失敗 ‼️`, response.status, data]);
					}
				}
			});

		} catch (error) {
			return reject([`執行失敗 ‼️`, error]);
		}
	});
}
async function preCheck() {
	return new Promise((resolve, reject) => {
		const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
		if (isEmptyObject(shopeeInfo)) {
			return reject(['檢查失敗 ‼️', '沒有 蝦皮 Token']);
		}
		const shopeeHeaders = {
			'Cookie': `${cookieToString(shopeeInfo.tokenAll)}`,
			'Content-Type': 'application/json',
		}

		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
		}
		console.log('✅ 檢查成功\n');
		return resolve();
	});
}
// some true ,  every false


async function ProcData1(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			if (!found && json.data.games) {
				for (let i = 0; i < json.data.games.length; i++) {
					const g = json.data.games[i];
					if (g.app_id === config.appid) {
						found = true;
						// https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true",
						config.activityId = g.link_url.replace(/^.+\/\?activity=([0-9a-f]+)(&.+)?/i, '$1');
						config.activityName = g.app_name;
						console.log(`AID : ${config.activityId}`);
						break;
					}
				}
			}
			if (!found) {
				console.log('找不到寵物村遊戲');
				console.log(json.data);
			}
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData2(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			found = true;
			config.event_code = json.data.eventCode;
			if (json.data.hasOwnProperty('pets') && json.data.pets && json.data.pets.length > 0) {
				config.petID = json.data.pets[0].petID;
			}
			if (json.data.hasOwnProperty('mainPet') && json.data.mainPet) {
				config.petID = json.data.mainPet.petID;
			}
			else {
				console.log('需設定主要的寵物。');
				//found = false;
			}
			console.log(`EID : ${config.event_code}`);
			console.log(`PID : ${config.petID}`);
		}
		else {
			return reject([`執行失敗 ‼️`, json.msg, data]);
		}
		return resolve(found);
	});
}
async function ProcData3(data, dc) {
	return new Promise((resolve, reject) => {
		// let data = document.getElementById('jfContent_pre').innerText;
		// let config = {};
		// let friendsList = [];
		let dtNT = new Date().getTime(); // 當時
		let dtND = new Date(new Date(dtNT).format('2')).getTime(); // 當日
		let dtNT10 = dtND + 10 * 3600 * 1000; // 當天 10 時

		let ffhs = $persistentStore.read('PetStatus' + _ShopeeUserID) || '[]';
		let fss = JSON.parse(ffhs); // FriendsStatus
		// 資料調整
		if (fss) {
			// for (let i = 0; i < fss.length; i++) {
			// 	let f = fss[i];
			// 	if (!f.hasOwnProperty('isMove')) { f.isMove = false; }
			// 	if (!f.isMove
			// 		&& !friendsList.some(x => { if (x === f.id) { return true; } })
			// 		&& fss.some(x => { if (x.id === f.id && x.frgiveMe === 0) { return true; } })) {
			// 		f.isMove = true; fss.push(f); fss.splice(i, 1); i--;
			// 	}
			// }
			fss.forEach((x) => {
				//x.isMove = false;
				// if (x.checkTime === new Date('2023/04/01').getTime()) { // RESET
				// 	x.frgiveMe = 0;
				// 	x.lastTime = 0;
				// }
				x.checkTime = dtND;
				x.isMove = false;
			});
		}
		config.fss = fss;
		// console.log(fss);
		let found = true;
		let json = JSON.parse(data);
		if (json.code === 0) {
			if (json.data.hasOwnProperty('friends') && json.data.friends.length) {
				let fs = json.data.friends;
				let fs2 = [];
				//console.log(`️👌已幫助`);
				let helpCount = 0;
				let friendWill = [];
				friendsList.forEach((x) => { friendWill.push(x); });
				let k = 0;
				let k2 = 0;

				// 排除非寵物村
				for (let i = fs.length - 1; i >= 0; i--) {
					let f = fs[i];
					if (!f.gameUser) { fs.splice(i, 1); }
				}

				for (let i = 0; i < fs.length; i++) {
					let f = fs[i];
					if (!friendsList.some((xf) => { // 主要清單優先
						if (xf === f.userID) {
							friendWill.some((x, xi) => { if (x === f.userID) { friendWill.splice(xi, 1); return true; } });
							fs.splice(k, 0, f); fs.splice(i + 1, 1); k++; k2++; return true;
						}
					})
					) {
						fs.splice(k2, 0, f); fs.splice(i + 1, 1); k2++;
					}
				}
				//console.log(fs);
				fs.forEach((f, i) => {
					let fx = {};
					let fxi = -1;
					if (!fss.some((x, xi) => { if (x.id === f.userID) { fx = x; fxi = xi; return true; } })) {
						fx = {
							id: f.userID, name: f.userName, cName: f.contactName  // , pid: f.petID, pName: f.petName
							, lastTime: 0
							, giveMe: 0
							, giveHe: 0
							, checkTime: 0
							, likeTime: 0
							, leftGiveLike: 0
						};
						config.fss.push(fx);
						//fss = config.fss;
						fxi = config.fss.length - 1;
					}
					// console.log(fx);
					f.userName = fx.name; f.contactName = fx.cName;
					if (fx.lastTime < dtND && f.foodInteract.giveMe) {
						config.fss[fxi].giveMe++; config.fss[fxi].lastTime = dtND;
					}

					if (dtND > fx.likeTime) {
						fs2.push(fx);
					} else {
						fx.leftGiveLike = 1;
						helpCount++;
						console.log(`${helpCount.toString().padStart(2, ' ')}: ${f.userID} (${f.userName}) ${fx.giveMe}`);
					}
					// // 好友 是果園使用者 有作物 幫助朋友水量
					// if (f.interactData.helpThisFriendCnt != 0) {
					// 	helpCount++;
					// 	friendsList.some((x) => { if (x === f.id) { config.friendsCount--; return true; } });
					// 	console.log(`${helpCount.toString().padStart(2, ' ')}: ${f.id} (${f.name}) ${fx.frgiveMe} (${fx.cropName})`);
					// }
					// if (f.interactData.helpThisFriendCnt === 0) { // 尚未澆水
					// 	friendsList.some((x) => { if (x === f.id) { config.friendsCount--; return true; } });
					// 	fs2.push(f);
					// }
				});

				friendWill.forEach((x) => {
					fs2.push({
						id: x, name: `列表ID ${x}`, cName: ''
					});
					fs2.splice(0, 0, fs2[fs2.length - 1]); fs2.splice(fs2.length - 1, 1);
				});
				//console.log(fs2);

				console.log('👀待幫助');
				for (let i = 0; i < fs2.length; i++) {
					let f = fs2[i];
					//console.log(f);

					if (!f.hasOwnProperty('isMove')) { f.isMove = false; }
					if (!f.isMove
						&& !friendWill.some(x => { if (x.id === f.id) { return true; } })
						&& fss.some(x => { if (x.id === f.id && x.frgiveMe === 0) { return true; } })) {
						f.isMove = true; fs2.push(f); fs2.splice(i, 1); i--;
					}
					else {
						console.log(`${(i + 1).toString().padStart(2, ' ')}: ${f.id} (${f.name}) (${f.cName})`);
					}
				}
				//console.log(fs2);

				//if (dtNT > dtNT10) { config.friendsCount = 0; } // 開放預留
				config.friends = fs2;
				//console.log(fs);
				if (fs2.length > 0) { found = true; }
				//if (d.remainingHelpFriendCount > 0) { found = true; }

				for (let i = 0; i < config.fss.length; i++) {
					let f = config.fss[i];
					if (!f.hasOwnProperty('isMove')) { f.isMove = false; }
					if (!f.isMove
						&& !friendsList.some(x => { if (x === f.id) { return true; } })
						&& f.frgiveMe === 0) {
						f.isMove = true; config.fss.push(f); config.fss.splice(i, 1); i--;
					}
				}
				$persistentStore.write(JSON.stringify(config.fss), 'PetStatus' + _ShopeeUserID);
				// console.log(config.fss);
				//found =false;
				try {
					let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
					let tsn = 'pet' + 's';
					let tsid = 'SL';
					let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
					let tasks = JSON.parse(rs);
					let ts = {}, s = {};
					if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
					if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
					s.s = fs2.length;
					//s.s = config.remainingHelpFriendCount;
					s.f = s.c > 0 && s.s === 0;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				} catch (e) { console.log(e); }

			}
			else {
				console.log('沒有朋友');
			}
		}
		//console.log(fss);
		return resolve(found);
	});
}
async function ProcData4(data, dc) {
	return new Promise((resolve, reject) => {
		let found = false;
		let json = JSON.parse(data);
		if (json.code === 0) {
			config.friends[config.friendIndex].name = json.data.userInfo.gameName;

			try {
				config.fss.some((x, i) => {
					if (x.id === config.friendId) {
						config.fss[i].name = json.data.userInfo.gameName;
						//config.fss[i].leftGiveLike = json.data.leftGiveLike;
						config.fss[i].likeTime = new Date().getTime();
						return true;
					}
				});
				$persistentStore.write(JSON.stringify(config.fss), 'PetStatus' + _ShopeeUserID);
			} catch (error) { }

			if (!json.data.leftGiveLike) {
				config.friends[config.friendIndex].leftGiveLike = !json.data.leftGiveLike;
			}
			else {
				found = true;
			}
		}
		else {
			console.log('❌執行失敗。' + json.msg);
			console.log(data);
		}
		return resolve(found);
	});
}
async function ProcData5(data, dc) {
	return new Promise((resolve, reject) => {
		let found = true;
		let json = JSON.parse(data);
		if (json.code === 0) {
			config.friends[config.friendIndex].leftGiveLike = 0;
			console.log('❤️ 成功！\n');
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'pet' + 's';
				let tsid = 'SL';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				if (s.s > 0) { s.s--; }
				s.c++;
				s.f = s.c > 0 && s.s === 0;
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }
		}
		else {
			console.log('❌ 失敗！\n' + json.msg);
			console.log(data);
		}

		return resolve(found);
	});
}
// https://games.shopee.tw/api-gateway/pet/friend/list?activityCode=b711c6148c210f8f&eventCode=1dc0c8914b227e83&offset=0&count=100&queryType=1
let UrlData = [[],
['!GET', '取得遊戲清單C2', '取得', 'https://games.shopee.tw/gameplatform/api/v2/game_reco/games/channels/2', '', , ProcData1],
['GET', '取得寵物資訊', '取得', 'https://games.shopee.tw/api-gateway/pet/home?activityCode={activityId}&eventCode=&', '', ['activityId'], ProcData2],
['GET', '取得好友清單', '取得', 'https://games.shopee.tw/api-gateway/pet/friend/list?activityCode={activityId}&eventCode={event_code}&offset=0&count=100&queryType=1', '', ['activityId', 'event_code'], ProcData3],
['GET', '取得好友資訊', '取得', 'https://games.shopee.tw/api-gateway/pet/school/interact_info?activityCode={activityId}&eventCode={event_code}&userID={friendId}', '', ['activityId', 'event_code', 'friendId'], ProcData4],
['POST', '幫好友按讚', '執行', 'https://games.shopee.tw/api-gateway/pet/school/like?activityCode={activityId}&eventCode={event_code}', '', ['activityId', 'event_code'], ProcData5],
];
let DataPostBodyList = [, , , , , {
	"userID": 0
},
];
// 32536572 daisquirrel 手動 4蝦幣
// 主要的好友 // sdany9357,sdany5751,jieguan285,eason101520,15Pro,jen,i8-2                     ,zongancai,summer520wind,mybaby7023    ,ww2feel,danny335201314
let friendsList = [681985929, 732423754, 918908158, 981988128, 578729974,1116124017, 964204346, 664774607, 43980511, 140595219, 16079058, 2186783]; // , 58710081, 313955569
let friendsListN = ['8P    ', '7P     ', '6sP    ', '5s     ', '15Pro  ','SE2     ', '11P    ', '8P-2   ', 'zongancai', 'summer', 'mybaby', 'cutestudent00'];

function preInit() {
	config.activityId = 'b711c6148c210f8f';
	config.friendId = '';
	config.friendIndex = -1;
	config.deviceId = config.shopeeInfo.token.SPC_F;
	config.SPC_U = config.shopeeInfo.token.SPC_U;
	config.petID = '';
	config.caption = caption;
	config.title = title;
	config.friends = [];
	friendsList.some((x, i) => { if (x.toString() === config.SPC_U) { friendsList.splice(i, 1); return true; } }); // 移除自己 無法對自己按讚
	config.friendsCount = friendsList.length;
}

const forMaxCount = 100;
(async () => {
	console.log(`ℹ️ ${title} ${version}`);
	console.log(`${new Date().format('0')}`);
	try {
		await preCheck();
		preInit();
		//console.log(friendsList);
		//return;
		let flag = true;
		let runCount = 0;
		let item = -1;
		for (let i = 1; i < UrlData.length; i++) {
			if (!flag) { break; }
			item = -1;
			//console.log(i);
			if (i === 4) {
				//if (config.remainingHelpFriendCount - config.friendsCount > 0) {
				config.friendIndex++;
				let found = false;
				//console.log(config.friends);
				for (let i = config.friendIndex; i < config.friends.length; i++) {
					let f = config.friends[i];
					if (!f.id) { continue; }
					config.friendId = f.id;
					item = config.friendIndex;
					//item = config.remainingHelpedCount;
					console.log(`${(item + 1).toString().padStart(2, ' ')}: ${f.id} (${f.name}) ${f.cName}`);
					found = true;
					break;
				}
				flag = found;
				if (!found) { break; }
				//}
				DataPostBodyList[i + 1].userID = config.friendId;
				await delay(0.5);
			}
			else if (i === 5) {
				runCount++;
			}

			let dc = GetDataConfig(i);
			//console.log(`\n🌐 ${dc.method} URL : ${dc.url}\n`);
			if (flag && dc.method === 'GET') {
				await dataGet(dc).then(data => dc.func(data, dc)).then(r => { flag = r });
			} else if (flag && dc.method === 'POST') {
				await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
			}
			if (i === 3 && !flag) { break; }
			if (i === 4 && !flag) { flag = true; i = 3; }
			if (i === 5 && flag) { i = 3; }
			if (runCount >= forMaxCount) { console.log(`超過執行限制次數 ${forMaxCount}，中止執行。`); break; }
			if (runCount > 50) { console.log(`!! Need Debug !! ★★★ 迴圈 ${runCount}/${forMaxCount} ★★★`) };

		}
		console.log('');
		// console.log(JSON.stringify(config.fss).replace(/,"last/ig, ',\n"last').replace(/},/ig, '},\n'));
		console.log('\n有果寵物狀態');
		config.fss.forEach((x, xi) => {
			console.log(`${(xi + 1).toString().padStart(2, ' ')}: ${x.id} (${x.name}) ${x.giveMe}`);
		});
		console.log('');
		let msg = '✅ 處理已完成';
		console.log(msg);


		// try {
		// 	let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
		// 	let tsn = 'pet' + 's';
		// 	let tsid = 'SL';
		// 	let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
		// 	let tasks = JSON.parse(rs);
		// 	let ts = {}, s = {};
		// 	if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
		// 	if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
		// 	s.c = config.totalHelpFriendCount - config.remainingHelpFriendCount
		// 	s.s = config.remainingHelpFriendCount;
		// 	s.f = s.c > 0 && s.s === 0;
		// 	ts[tsid] = s;
		// 	tasks[tsn] = ts;
		// 	$persistentStore.write(JSON.stringify(tasks), dataName);
		// } catch (e) { console.log(e); }

		// loonNotify(msg);
	} catch (error) {
		handleError(error);
	}
	$done({});
})();

