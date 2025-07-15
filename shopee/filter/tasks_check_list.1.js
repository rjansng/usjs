let _date_ = '';
let isGui = false;
try {
	if ($request && $request.url.match(/^http:\/\/lo.on\/.+/i)) { isGui = true; console.log('GUI手動執行。\n'); }
	if (isGui && $request.url.match(/^https:\/\/.+\?.+$/i)) {
		let query = $request.url.match(/^https:\/\/.+\?(.+)$/i)[1];
		if (query.match(/date=(202\d{5})$/i)) { _date_ = query.match(/date=(202\d{5})$/i)[1]; }
	}
} catch (error) { }
let html = '';
let _Simulate = '';
let ShopeeUserID = '';
let SimulateUserID = '';
SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
if (!isGui) {
	let ShopeeUserIDs = $persistentStore.read('OD指定UserID') || '';
	let ShopeeUserID_ = $persistentStore.read('ShopeeUserID') || '';
	if (ShopeeUserID_ != '') { ShopeeUserID = ShopeeUserID_; }
	else if (ShopeeUserIDs != '') { ShopeeUserID = ShopeeUserIDs; }
}

let argd = '';
try { if ($argument && $argument != '') { argd = $argument; } } catch (error) { }
let _ShopeeUserID = '';
if (argd != '') { ShopeeUserID = argd; }
if (ShopeeUserID == '0') { ShopeeUserID = ''; argd = ''; }
else if (ShopeeUserID != '') {
	_ShopeeUserID = `_${ShopeeUserID}`;
	if (argd == '') _Simulate = '_Simulate';
}
if (ShopeeUserID == '') {
	console.log('UserId : 本機資料\n');
	//console.log('未指定 Shopee UserID 不處理。');
	// $done({});
}
else { console.log(`UserId : ${ShopeeUserID}\n`); }

let UseHTTPS = $persistentStore.read('使用HTTPS') || '';
if (UseHTTPS != '否') { UseHTTPS = true; } else { UseHTTPS = false; }

Date.prototype.format = function (format = '1') {
	if (format == '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
	else if (format == '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format == '2') { format = 'yyyy/MM/dd'; }
	else if (format == '3') { format = 'HH:mm:ss'; }
	else if (format == '4') { format = 'MM/dd'; }
	else if (format == '5') { format = 'HH:mm'; }
	let o = {
		"M+": this.getMonth() + 1, //month  
		"d+": this.getDate(),    //day  
		"h+": this.getHours(),   //hour  
		"H+": this.getHours(),   //hour  
		"m+": this.getMinutes(), //minute  
		"s+": this.getSeconds(), //second  
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};
Date.prototype.AddDay = function (intNum) {
	sdate = new Date(this);
	sdate.setDate(sdate.getDate() + intNum);
	return sdate;
};
Date.prototype.AddMinute = function (intNum) {
	sdate = new Date(this);
	sdate.setMinutes(sdate.getMinutes() + intNum);
	return sdate;
};

let dtDT = new Date().getTime();
let dtD = new Date(new Date().format('2')).getTime();
let _date = new Date(dtD).format('2').replace(/\//g, '');
try { _date = __date; } catch (error) { }
if (_date_ != '') { _date = _date_; }
let _dd_ = _date.substr(0, 4) + '/' + _date.substr(4, 2) + '/' + _date.substr(6, 2);
let _dd = new Date(_dd_);
let _DTD = _dd.getTime();
let _DTY = _dd.AddDay(-1).format('yyyyMMdd');
let _DTT = _dd.AddDay(1).format('yyyyMMdd');
let dtDN = new Date(dtD).AddDay(1).getTime();
//let dtDT2355 = new Date(dtD).AddDay(1).AddMinute(-5).getTime();
let dtDT2355 = new Date(dtDN - 300000).getTime();
// console.log(new Date(dtDT).format("0"));
// console.log(new Date(dtD).format("0"));
// console.log(new Date(dtDN).format("0"));
// console.log(new Date(dtDT2355).format("0"));
// console.log('');

let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
let showNotification = true;
let showLog = true;
let title = '🍤搶蝦幣💰每日任務 總覽';
let version = 'v20250529';
function telegramNotify(title, subtitle = '', message = '') {
	let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
	if (TelegramUrl != '') {
		let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
		$httpClient.get(telegramData, function (error, response, data) { });
	}
}
// telegramNotify('🍤 Test', 'AA', 'BBB');
function loonNotify(subtitle = '', message = '', url = 'loon://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
function getSaveObject(key) { const string = $persistentStore.read(key); return !string || string.length == 0 ? {} : JSON.parse(string); }
function isEmptyObject(obj) { return Object.keys(obj).length == 0 && obj.constructor == Object ? true : false; }
function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }


try {
	const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
	if (!isEmptyObject(shopeeInfo)) {
		if ('date' in shopeeInfo) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'GETTOKEN';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {}
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				s.c = 1;
				s.f = true;
				s.r = new Date(shopeeInfo.date).format('MM/dd HH:mm');
				ts[tsid] = s;
				tasks[tsn] = ts;
				$persistentStore.write(JSON.stringify(tasks), dataName);
			} catch (e) { console.log(e); }

		}
		if ('lastDate' in shopeeInfo) {
			try {
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let tsn = 'shopee' + 's';
				let tsid = 'TU';
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let tasks = JSON.parse(rs);
				let ts = {}, s = {};
				if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
				if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
				let ddd = new Date(shopeeInfo.lastDate).format('MM/dd HH:mm');
				if (s.r != ddd) {
					s.c++;
					s.f = true;
					s.r = ddd;
					ts[tsid] = s;
					tasks[tsn] = ts;
					$persistentStore.write(JSON.stringify(tasks), dataName);
				}
			} catch (e) { console.log(e); }

		}
	}

} catch (error) {

}

console.log(new Date().format());
console.log(title);
let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
let scores = JSON.parse(rs);
let idss_not = ['knifethrow'];
let idss = 'shopee,candycrush,puzzle_bobble_be,clawbox,knifethrow,farm,pet';
let idssn = '🦐蝦皮  ,🔶消消樂,🫧泡泡王,🎮夾夾樂,🔪飛刀  ,🌱果園,🐥寵物村';
let ids = idss.split(',');
let idsn = idssn.split(',');
let shopee = {};
shopee.shopeetasks_ids = [];
shopee.shopeetasks2_ids = [
	{ 'id': 'SB0', 'name': '覽推30秒', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST1', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST2', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST45', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST47', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST48', 'name': '覽推30秒', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST19652', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST20230', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST16112', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST16515', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST17253', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST16113', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST17250', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST17847', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST17849', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST17850', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST19138', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST19140', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST18490', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST18491', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST19651', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST20227', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST20228', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST20229', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST21222', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST21223', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST21224', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST21225', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST21043', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22863', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22864', 'name': '玩寵物村', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22865', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22866', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22869', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST22691', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23565', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23566', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23567', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23568', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23569', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23570', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23571', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23572', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23573', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST23574', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST25188', 'name': '玩夾夾樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST25189', 'name': '玩消消樂', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'ST15677', 'name': '覽30秒1 ', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST16300', 'name': '覽30秒2 ', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST15676', 'name': '覽30秒 1', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST16111', 'name': '覽30秒 2', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST17336', 'name': '覽30秒 1', 't': 'H', 'h': '🎁💰;需要手動' },
	{ 'id': 'ST17337', 'name': '覽30秒 2', 't': 'H', 'h': '🎁💰;需要手動' },

	{ 'id': 'VL1', 'name': '優惠券1 ', 't': 'H', 'h': ';🎁我的優惠券 電子票券' },
	{ 'id': 'VL2', 'name': '優惠券2 ', 't': 'H', 'h': ';🎁我的優惠券 合作商家' },
	// ST25886   ST25758  ST25754
];
shopee.pet2_ids = [
	{ 'id': 'TD101', 'name': '餵食    ', 't': 'H', 'h': '餵食寵物2次 75' },
	{ 'id': 'TD102', 'name': '        ', 't': 'H', 'h': 'TD102' },
	{ 'id': 'TD103', 'name': '聊天    ', 't': 'H', 'h': '在學校聊天室發言1次 75' },
	{ 'id': 'TD104', 'name': '求飼料  ', 't': 'H', 'h': '在學校請求飼料2次 75' },
	{ 'id': 'TD105', 'name': '贈送飼料', 't': 'H', 'h': '在學校贈送他人飼料2次 75' },
	{ 'id': 'TD106', 'name': '按讚他人', 't': 'H', 'h': '按讚他人3次 75' },
	{ 'id': 'TD107', 'name': '遊樂場玩', 't': 'H', 'h': '在遊樂場玩遊戲 1 次 150' },
	{ 'id': 'TD108', 'name': '園體課  ', 't': 'H', 'h': '去學校上團體課 150' },
	{ 'id': 'TD109', 'name': '瀏覽衣櫥', 't': 'H', 'h': '瀏覽衣櫥頁面1次 75' },
	{ 'id': 'TD110', 'name': '拜訪好友', 't': 'H', 'h': '前往學校拜訪不同人家2次 75' },
	{ 'id': 'TD111', 'name': '換裝    ', 't': 'H', 'h': '幫寵物換裝(需儲存)1次 150' },
	{ 'id': 'TD112', 'name': '服裝抽樂', 't': 'H', 'h': '在服裝抽抽樂抽1次 150' },
	{ 'id': 'TD113', 'name': '購衣造型', 't': 'H', 'h': '在衣櫥直購任一造型1次 150' },
	{ 'id': 'TD114', 'name': '家園主題', 't': 'H', 'h': '前往家園主題頁 75' },
	{ 'id': 'TD115', 'name': '        ', 't': 'H', 'h': 'TD115' },
	{ 'id': 'TD116', 'name': '        ', 't': 'H', 'h': 'TD116' },
	{ 'id': 'TD117', 'name': '        ', 't': 'H', 'h': 'TD117' },
	{ 'id': 'TD118', 'name': '        ', 't': 'H', 'h': 'TD118' },
	{ 'id': 'TD119', 'name': '蝦幣猜拳', 't': 'H', 'h': '蝦幣玩猜拳1次 150' },
	{ 'id': 'TD120', 'name': '踢足球  ', 't': 'H', 'h': '去學校踢足球一次 150' },
	{ 'id': 'TD121', 'name': '找碴    ', 't': 'H', 'h': '去學校上美術課(找碴) 150' },
	{ 'id': 'TD122', 'name': '金頭腦  ', 't': 'H', 'h': '去學校上通職課(金頭腦) 150' },
	{ 'id': 'TD123', 'name': '賽跑    ', 't': 'H', 'h': '去學校上體育課(賽跑) 150' },
	{ 'id': 'TD124', 'name': '        ', 't': 'H', 'h': 'TD124' },
	{ 'id': 'TD125', 'name': '        ', 't': 'H', 'h': 'TD125' },
	{ 'id': 'TD126', 'name': '蝦幣食蛇', 't': 'H', 'h': '蝦幣玩貪食蛇1次 150' },
	{ 'id': 'TD127', 'name': '蝦幣曲棍', 't': 'H', 'h': '蝦幣玩桌上曲棍球1次 150' },
	{ 'id': 'TD128', 'name': '寵物扭蛋', 't': 'H', 'h': '抽寵物扭蛋1次 500' },
	{ 'id': 'TD129', 'name': '蝦幣抽寵', 't': 'H', 'h': '蝦幣抽寵物1次 500' },
	{ 'id': 'TD130', 'name': '覽推60扭', 't': 'H', 'h': '在免費寵物扭蛋瀏覽推薦商品 60 秒 75' },
	{ 'id': 'TD131', 'name': '        ', 't': 'H', 'h': 'TD131' },
	{ 'id': 'TD132', 'name': '蝦幣彈珠', 't': 'H', 'h': '蝦幣玩彈珠台1次 150' },
	{ 'id': 'TD133', 'name': '        ', 't': 'H', 'h': 'TD133' },
	{ 'id': 'TD134', 'name': '免費猜拳', 't': 'H', 'h': '免費玩猜拳1次 75' },
	{ 'id': 'TD135', 'name': '免費食蛇', 't': 'H', 'h': '免費玩貪食蛇1次 75' },
	{ 'id': 'TD136', 'name': '免費曲棍', 't': 'H', 'h': '免費玩桌上曲棍球1次 75' },
	{ 'id': 'TD137', 'name': '免費彈珠', 't': 'H', 'h': '免費玩彈珠台1次 75' },
	{ 'id': 'TD138', 'name': '蝦幣廚神', 't': 'H', 'h': '蝦幣玩小廚神1次 150' },
	{ 'id': 'TD139', 'name': '        ', 't': 'H', 'h': 'TD139' },
	{ 'id': 'TD140', 'name': '        ', 't': 'H', 'h': 'TD140' },
	{ 'id': 'TD141', 'name': '        ', 't': 'H', 'h': 'TD141' },
	{ 'id': 'TD142', 'name': '        ', 't': 'H', 'h': 'TD142' },
	{ 'id': 'TD143', 'name': '        ', 't': 'H', 'h': 'TD143' },
	{ 'id': 'TD144', 'name': '        ', 't': 'H', 'h': 'TD144' },
	{ 'id': 'TD145', 'name': '        ', 't': 'H', 'h': 'TD145' },
	{ 'id': 'TD201', 'name': '新手導覽', 't': 'H', 'h': '完成新手導覽 100P' },
	{ 'id': 'TD202', 'name': '請求飼料', 't': 'H', 'h': '在學校請求飼料1次 100P' },
	{ 'id': 'TD203', 'name': '        ', 't': 'H', 'h': 'TD203' },
	{ 'id': 'TD204', 'name': '學校遊戲', 't': 'H', 'h': '去學校玩課程遊戲1次 100P' },
	{ 'id': 'TD205', 'name': '聊天P   ', 't': 'H', 'h': '在學校聊天室發言1次 100P' },
	{ 'id': 'TD206', 'name': '拜訪好友', 't': 'H', 'h': '前往學校拜訪不同人家1次 100P' },
	{ 'id': 'TD207', 'name': '升級主題', 't': 'H', 'h': '升級家園主題 200P' },
	{ 'id': 'TD208', 'name': '換裝P   ', 't': 'H', 'h': '幫寵物換裝(需儲存)1次 200P' },
	{ 'id': 'TD209', 'name': '蝦幣猜拳', 't': 'H', 'h': '蝦幣玩猜拳1次 400P' },
	{ 'id': 'TD210', 'name': '蝦幣抽寵', 't': 'H', 'h': '蝦幣抽寵物1次 500P' },
	{ 'id': 'TD211', 'name': '提領蝦幣', 't': 'H', 'h': '提領蝦幣1次 300P' },
	{ 'id': 'TD212', 'name': '覽推30扭', 't': 'H', 'h': '在免費寵物扭蛋瀏覽推薦商品 30 秒 100P' },
	{ 'id': 'TD213', 'name': '寵物扭蛋', 't': 'H', 'h': '抽寵物扭蛋1次 200P' },
	{ 'id': 'TD214', 'name': '寵物扭蛋', 't': 'H', 'h': '查看宿舍1次 100P' },
	{ 'id': 'TD215', 'name': '        ', 't': 'H', 'h': 'TD215' },
	{ 'id': 'TD216', 'name': '        ', 't': 'H', 'h': 'TD216' },
	{ 'id': 'TD217', 'name': '        ', 't': 'H', 'h': 'TD217' },
	{ 'id': 'TD218', 'name': '        ', 't': 'H', 'h': 'TD218' },
	{ 'id': 'TD219', 'name': '        ', 't': 'H', 'h': 'TD219' },
	{ 'id': 'TD220', 'name': '        ', 't': 'H', 'h': 'TD220' },

];
shopee.shopee_ids = [
	{ 'id': 'GETTOKEN', 'name': 'GetToken', 't': 'H', 'h': '🔓實名制 Token' },
	{ 'id': 'TU', 'name': 'UDToken', 't': 'X', 'h': '🔄更新 Token' },
	{ 'id': 'ERROR', 'name': 'TokenErr', 't': 'H', 'h': '❌Token過期 請重取實名制Token🚫' },
	{ 'id': 'SC', 'name': '蝦幣    ', 't': 'H', 'h': '💰' },
	{ 'id': 'MT0', 'name': '0 元券  ', 't': 'H', 'h': '🎁💰' },
	{ 'id': 'CI', 'name': '每日簽到', 't': 'X', 'h': '🎁💰' },

	// 接 shopeetasks2_ids
	// 接 shopeetasks_ids
];
shopee.candycrush_ids = [
	{ 'id': 'P', 'name': '點數      ', 't': 'H', 'h': '💎' },
	{ 'id': 'A', 'name': '分享得 1點 ', 't': 'X', 'h': '❤️' },
	{ 'id': 'B', 'name': '每日登入獎勵', 't': 'X', 'h': '🔓' },
	{ 'id': 'C', 'name': '玩過 1次   ', 't': 'X', 'h': '🌱任務10💧' },
	{ 'id': 'D', 'name': '玩        ', 't': 'T', 'h': '' },
	{ 'id': 'Z', 'name': '兌換獎勵   ', 't': 'H', 'h': '💎兌換🎁' },
];
shopee.puzzle_bobble_be_ids = [
	{ 'id': 'P', 'name': '點數      ', 't': 'H', 'h': '💎' },
	{ 'id': 'A', 'name': '每日登入獎勵', 't': 'X', 'h': '🔓' },
	{ 'id': 'B', 'name': '玩過 1次   ', 't': 'X', 'h': '🌱任務10💧' },
	{ 'id': 'C', 'name': '玩        ', 't': 'T', 'h': '' },
	{ 'id': 'Z', 'name': '兌換獎勵   ', 't': 'H', 'h': '💎兌換🎁' },
];
shopee.clawbox_ids = [
	{ 'id': 'A', 'name': '分享 +1', 't': 'X', 'h': '❤️' },
	{ 'id': 'B', 'name': '玩過 1次', 't': 'X', 'h': '🌱任務10💧' },
	{ 'id': 'C', 'name': '玩Start ', 't': 'H', 'h': '💛 +2' },
	{ 'id': 'CE', 'name': '夾到物品', 't': 'H', 'h': '🎁可得蝦幣' },
];
shopee.knifethrow_ids = [
	{ 'id': '', 'name': '總時間', 't': 'TT', 'ids': 'ALL', 'TB': '2023/02/26', 'TE': '2023/03/25 23:54:00' },
	{ 'id': 'A', 'name': '分享 +1', 't': 'H', 'h': '❤️目前沒有 (曾經擁有)' },
	{ 'id': 'B', 'name': '玩過 1次', 't': 'X', 'h': '🌱任務10💧' },
	{ 'id': 'C', 'name': '開始丟 ', 't': 'T', 'h': '💎可兌換🎁' },
	{ 'id': 'CE', 'name': '得分   ', 't': 'S', 'h': '得分' },
	{ 'id': 'X', 'name': '獎勵    ', 't': 'X', 'h': '🎁' },
	{ 'id': 'SY', 'name': '昨日點數', 't': 'H', 'h': '💎' },
	{ 'id': 'SD', 'name': '減少點數', 't': 'H', 'h': '💎' },
	{ 'id': 'SA', 'name': '增加點數', 't': 'H', 'h': '💎' },
	{ 'id': 'ST', 'name': '現在點數', 't': 'H', 'h': '💎' },
	{ 'id': 'Z', 'name': '兌換獎勵', 't': 'H', 'h': '💎兌換🎁' },
];
shopee.farm_ids = [
	{ 'id': 'FC', 'name': '目前作物   ', 't': 'P', 'h': '' },
	{ 'id': 'FW', 'name': '作物狀態   ', 't': 'P', 'h': '' },
	{ 'id': 'FU', 'name': '更新狀態   ', 't': 'H', 'h': '' },
	{ 'id': 'A1', 'name': '今日種植   ', 't': 'H', 'h': '' },
	{ 'id': 'A2', 'name': '今日收成   ', 't': 'H', 'h': '' },
	{ 'id': 'B', 'name': '品牌商店水滴', 't': 'H', 'h': '💧50xN' },
	// { 'id': 'B2', 'name': '品牌商店水滴', 't': 'H', 'h': '2💧50' },
	{ 'id': 'C', 'name': '瀏覽商店水滴', 't': 'T', 'h': '💧30x3 3h/次' },
	{ 'id': 'E', 'name': '幫朋友澆水 ', 't': 'T', 'h': '💧10x15' },   // 20231116 改版 20次改10次  對方得 20水 自己得 10水  240501 改15次
	{ 'id': 'F', 'name': '收到朋友助水', 't': 'T', 'h': '💧20x15' },  // 20231116 改版 20次改10次  35水改20水               240501 改15次
	{ 'id': 'D', 'name': '站外澆水   ', 't': 'T', 'h': '💧10x5' },
	{ 'id': 'G', 'name': '搖樹       ', 't': 'H', 'h': '💧5x10' },
	{ 'id': 'K', 'name': '買免費道具 ', 't': 'X', 'h': '(週六) 1-2次' },
	{ 'id': 'SB', 'name': '今日簽到獎勵', 't': 'X', 'h': '任務欄' },
	{ 'id': 'CI', 'name': '今日打卡 3次', 't': 'T', 'h': '任務欄' },
	{ 'id': 'PU', 'name': '使用道具   ', 't': 'H', 'h': '' },

	{ 'id': 'T-', 'name': '領水滴', 't': '-', 'h': '' },
	{ 'id': 'TCI', 'name': '今日打卡 3次', 't': 'X', 'h': '💧50' },
	{ 'id': 'TF1', 'name': '收到澆水 1 ', 't': 'X', 'h': '💧30' },
	{ 'id': 'TF2', 'name': '收到澆水 3 ', 't': 'X', 'h': '💧50' },
	{ 'id': 'TF3', 'name': '收到澆水 10', 't': 'X', 'h': '💧100' },
	{ 'id': 'TE1', 'name': '幫澆水 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TE2', 'name': '幫澆水 3   ', 't': 'X', 'h': '💧20' },
	{ 'id': 'TE3', 'name': '幫澆水 10  ', 't': 'X', 'h': '💧30' },
	{ 'id': 'TG1', 'name': '消消樂 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG2', 'name': '夾夾樂 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG3', 'name': '寵物村 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG4', 'name': '泡泡王 1   ', 't': 'X', 'h': '💧10' },
	{ 'id': 'TG5', 'name': '蝦飛刀 1   ', 't': 'H', 'h': '💧10' },
	{ 'id': 'TG6', 'name': '拼拼樂 1   ', 't': 'H', 'h': '💧10' },
	{ 'id': 'TGB1', 'name': '消消樂 1蝦幣', 't': 'H', 'h': '💧100' },
	{ 'id': 'TGB2', 'name': '夾夾樂 1蝦幣', 't': 'H', 'h': '💧100' },
	{ 'id': 'TS', 'name': '領取水滴獎勵', 't': 'X', 'h': '💧💦任務欄 11 項' },
];
shopee.pet_ids = [
	{ 'id': 'PT', 'name': '點數    ', 't': 'T', 'h': '💎' },
	{ 'id': 'CT', 'name': '撲滿蝦幣', 't': 'T', 'h': '💰' },
	{ 'id': 'CTF', 'name': '餵食撲幣', 't': 'H', 'h': '💰' },
	{ 'id': 'FC', 'name': '飼料    ', 't': 'T', 'h': '🍿' },
	{ 'id': 'SL', 'name': '按贊    ', 't': 'T', 'h': '❤️' },
	{ 'id': 'W1', 'name': '年輕寵物', 't': 'T', 'h': '' },
	{ 'id': 'W2', 'name': '退休寵物', 't': 'T', 'h': '' },
	{ 'id': 'L', 'name': '領飼料  ', 't': 'H', 'h': ' 3次' },
	{ 'id': 'FO', 'name': '領飼料  ', 't': 'T', 'h': ' 3次' },
	{ 'id': 'K', 'name': '送飼料  ', 't': 'H', 'h': '10次' },
	{ 'id': 'FG', 'name': '送飼料  ', 't': 'T', 'h': '10次' },
	{ 'id': 'FF', 'name': '餵食    ', 't': 'T', 'h': '🍿' },
	{ 'id': 'GT', 'name': '跳床    ', 't': 'H', 'h': '' }, // t:P  6/1 跳床
	{ 'id': 'GM', 'name': '音樂    ', 't': 'H', 'h': '' }, // t:P  7/1 音樂
	{ 'id': 'PTI', 'name': '寵物扭蛋', 't': 'H', 'h': ';手動' },
	{ 'id': 'PTIB', 'name': '30秒扭蛋', 't': 'H', 'h': ';手動' },
	{ 'id': 'PIA', 'name': '寵物互動', 't': 'H', 'h': '100 💎' },
	{ 'id': 'GG3C', 'name': '彈珠台💰', 't': 'H', 'h': '💰;不定期' },
	{ 'id': 'GG3', 'name': '彈珠台💎', 't': 'H', 'h': ' 50 💎;進遊戲直接退出' },
	{ 'id': 'GG2', 'name': '曲棍球', 't': 'T', 'h': '500 💎' },  // (After) 500,200,100,0
	{ 'id': 'GG1', 'name': '貪食蛇  ', 't': 'T', 'h': '500 💎' },
	{ 'id': 'C', 'name': '踢足球  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 5, 'l3': 7 },  // 20 40 60
	{ 'id': 'G', 'name': '找碴    ', 't': 'E', 'h': '100 💎', 'l1': 3, 'l2': 6, 'l3': 9 },  // 20 20 60
	{ 'id': 'F', 'name': '賽跑    ', 't': 'B', 'h': '210 💎', 'l1': 4, 'l2': 2, 'l3': 1 },  // 30 60 120
	{ 'id': 'E', 'name': '金頭腦  ', 't': 'A', 'h': '120 💎', 'l1': 3, 'l2': 6, 'l3': 10 }, // 20 40 60
	{ 'id': 'H', 'name': '團體賽  ', 't': 'C', 'h': ' 80 💎', 'l1': 30, 'l2': 60, 'l3': 90 }, // 20 60 裝
	{ 'id': 'Z', 'name': '兌換獎勵', 't': 'H', 'h': '💎兌換🎁' },

	{ 'id': 'T-', 'name': '每日任務', 't': '-', 'h': '' },
	{ 'id': 'CI', 'name': '每日簽到', 't': 'H', 'h': '🍿' },
	// 接 pet2

];
// ss.some(x => { if (x == x) { return true; } });
if (isGui) html += `現在時間: ${new Date().format("0")}\n`;
//if (isGui) html += `檔案時間: ${new Date(scores.gameTime).format("0")}\n`;
console.log(`檔案時間: ${new Date(scores.gameTime).format("0")}`);
let reset = false;
if (dtDT >= dtDT2355) { dtD = dtDN; } // 每日 2355 刷新
if (scores.gameTime != dtD) { scores = {}; scores.gameTime = dtD; reset = true; console.log('每日任務刷新'); }
ids.forEach((xids, xidsi) => {
	if (idss_not.some(x => { if (x == xids) { return true; } })) { return; }
	// if (xids == 'knifethrow') { return; }
	if (isGui) html += '\n' + ''.padEnd(40, '_ ') + ` ${idsn[xidsi]}\n`;
	console.log('\n' + ''.padEnd(40, '_ ') + ` ${idsn[xidsi]}`);  // title 1

	if (shopee.hasOwnProperty(`${xids}_ids`)) {
		let oids = shopee[`${xids}_ids`];
		// 加入 tasks id
		if (xids == 'shopee') {
			let suts = scores['shopeetasks_ids'];
			if (suts == null) suts = [];
			suts.forEach(ut => {
				if (oids.some(o => { return o.id == `ST${ut.id}`; })) { } else {
					let tn = `ST${ut.id}`;
					if (ut.task_name.includes('寵物村')) { tn = '玩寵物村'; }
					else if (ut.task_name.includes('消消樂')) { tn = '玩消消樂'; }
					else if (ut.task_name.includes('夾夾樂')) { tn = '玩夾夾樂'; }
					else if (ut.task_name.includes('拼拼樂')) { tn = '玩拼拼樂'; }
					else if (ut.task_name.includes('合盒樂')) { tn = '玩合盒樂'; }
					else if (ut.task_name.includes('短影音') && ut.task_name.includes('30')) { tn = '短影音30'; }
					else if (ut.task_name.includes('短影音') && ut.task_name.includes('60')) { tn = '短影音60'; }
					else if (ut.task_name.includes('短影音')) { tn = '短影音'; }
					else if (ut.task_name.includes('看直播') && ut.task_name.includes('30')) { tn = '看直播30'; }
					else if (ut.task_name.includes('看直播') && ut.task_name.includes('40')) { tn = '看直播40'; }
					else if (ut.task_name.includes('看直播') && ut.task_name.includes('50')) { tn = '看直播50'; }
					else if (ut.task_name.includes('看直播')) { tn = '看直播'; }
					else if (ut.task_name.includes('推薦商品') && ut.task_name.includes('1/2')) { tn = '覽30秒 1'; }
					else if (ut.task_name.includes('推薦商品') && ut.task_name.includes('2/2')) { tn = '覽30秒 2'; }
					else if (ut.task_name.includes('推薦商品') && ut.task_name.includes('秒')) { tn = '推薦商品'; }
					oids.push({ 'id': `ST${ut.id}`, 'name': tn, 't': 'H', 'h': '🎁💰' });
				}
			});
			let ss2 = shopee.shopeetasks2_ids;
			ss2.forEach(ss => {
				if (oids.some(o => { return o.id == ss.id; })) { } else { oids.push(ss); }
			});
		}
		else if (xids == 'pet') {
			let ss2 = shopee.pet2_ids;
			ss2.forEach(ss => {
				if (oids.some(o => { return o.id == ss.id; })) { } else { oids.push(ss); }
			});
			// oids.some(o => { if (o.id == 'TD120') { console.log(o); return true; } });
		}

		let ss = {};
		if (scores.hasOwnProperty(`${xids}s`)) { ss = scores[`${xids}s`]; }
		oids.forEach(o => {
			if (o.id == '' || o.name == '') return;
			let p2 = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' };
			if (!ss.hasOwnProperty(o.id)) { ss[o.id] = p2; }
		});
		let ts = '\t';
		if (xidsi == 1 || xidsi == 2) { ts = ''; }
		else if (xidsi == 5) { ts = ''; }
		//else if (xidsi == 6) {  }
		let ids = [];
		if (isGui) html += `\t名稱\t\t次數\t狀態\t說明 獲得獎勵\t\t\n`;
		console.log(`\t名稱\t\t次數\t狀態\t說明 獲得獎勵\t\t`);
		oids.forEach((o, i) => {
			if (!o.name || o.name == '' || !o.t) return;
			if (o.id == '' && o.t == 'TT' && o.hasOwnProperty('ids')) {
				ids = [];
				let TB = new Date(o.TB).getTime();
				let TE = new Date(o.TE).getTime();
				let DTN = new Date().getTime();
				if (DTN < TB || DTN > TE) { ids = o.ids.split(','); }
				return;
			}
			if (ids.length > 0 && ids[0] == 'ALL') { return; }
			if (ids.length > 0 && ids.some(x => { if (x == o.id) { return true; } })) { ids.splice(0, 1); return; }
			if (o.id.includes('-') && o.t == '-') {
				if (isGui) html += `\n` + ''.padEnd(26, ' - ') + ` 👉 ${o.name} 👈` + (o.h && o.h != '' ? ` ${o.h}` : '') + '\n';
				console.log(`\n` + ''.padEnd(26, ' - ') + ` 👉 ${o.name} 👈` + (o.h && o.h != '' ? ` ${o.h}` : '')); return;
			}   // title 2
			let s = ss[o.id];
			if (!s.hasOwnProperty('r')) { s.r = ''; }
			let msg = `${o.name}\t${ts}${s.c}`;
			let msg2 = '';
			if (s.f) { msg2 += '✅'; }
			else if (!s.f && s.c > 0) { msg2 += '⭕️'; }
			else if (o.t == 'V') { msg2 += '🚫'; }
			else if (o.t != '' && o.t != 'T' && o.t != 'P') { msg2 += '❌'; }
			else { msg2 += '⚠️'; }
			//if (o.t == 'T') { if (s.s > 0 && s.c == 0) { msg2 = s.s; } }
			let msgh = '';
			if (o.h.indexOf(';') >= 0) {
				let tmp = o.h.split(';');
				o.h = tmp[0];
				msgh = tmp[1];
				if (`${s.r}`.trim() != '' || s.d.length > 0) { msgh = ''; } else { o.h += msgh; }
			}
			msg += `\t${msg2}\t${o.h + (o.h != '' ? ' ' : '')}`;
			if (['A', 'B', 'C', 'E', 'S'].some(x => {
				if (x == o.t) { return true; }
			})) {
				if (o.t == 'A') {
					msg += s.l == 1 ? ' 20' : (s.l == 2 ? ' 60' : '120');
				}
				else if (o.t == 'B') {
					msg += s.l == 1 ? ' 30' : (s.l == 2 ? ' 90' : '210');
				}
				else if (o.t == 'C') {
					msg += s.l == 1 ? ' 20' : (s.l == 2 ? ' 80' : ' 80');
				}
				else if (o.t == 'E') {
					msg += s.l == 1 ? ' 20' : (s.l == 2 ? ' 40' : '100');
				}
				msg += ` S:${s.s}` + (s.l == 3 ? ' 💯' : '');
			}

			msg += `${(['T', 'H'].some(x => {
				if (x == o.t && (x == 'T' || x == 'H' && (s.c > 0 || s.s > 0 || s.f))) { return true; }
			})
				? (s.s == 0 ? '' : `C:${s.s * (o.id == 'SD' ? -1 : 1)}`) : '')
				} `;
			let srs = [];
			if (s.r != '') { srs = `${s.r}`.split(/\n/g); }
			if (srs.length > 0) {
				if (srs.length == 1) { msg += `${`${s.r}`.replace(/(\r|\n)/g, '')}` }
				else {
					msg += `${s.r}`.replace(/\n/g, '\n\t\t\t\t\t');
				}
			}
			// msg += `${s.r == '' ? '' : s.r.replace(/\n/g, '\n\t\t\t\t\t')} `;
			if (['A', 'B', 'C', 'E'].some(x => { if (x == o.t) { return true; } })) { }
			else {
				if (s.d && s.d.length > 0) {
					if (s.d.length == 1) { msg += `${s.d[0]}`; }
					else {
						s.d.forEach(xd => { msg += `\n\t\t\t\t\t${xd} `; });
					}
				}
			}
			if ((o.t == 'H' || o.id == 'H' && o.t == 'C') && s.c == 0 && s.s == 0 && !s.f) { return; }
			if (isGui) html += msg.replace(' (打卡後3小時可再打卡一次)', '') + '\n';
			console.log(msg.replace(' (打卡後3小時可再打卡一次)', ''));
		});
		scores[`${xids}s`] = ss;
	}
});
// console.log(`\n\n${ title } `);
// console.log('\n✅已完成\t⭕️未完成\t❌未執行\t🚫不適用\t⚠️待確認腳本資訊')
if (isGui) html += '\n✅已完成 ⭕️未完成 ❌需要手動執行 ⚠️可能有';
console.log('\n✅已完成 ⭕️未完成 ❌需要手動執行 ⚠️可能有')

if (reset) { $persistentStore.write(JSON.stringify(scores), dataName); }



async function preCheck() {
	return new Promise((resolve, reject) => {
		const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
		if (isEmptyObject(shopeeInfo)) {
		}
		const shopeeHeaders = {
			'Cookie': `${cookieToString(shopeeInfo.token)}`,
			'Content-Type': 'application/json',
		}

		config = {
			shopeeInfo: shopeeInfo,
			shopeeHeaders: shopeeHeaders,
			userID: shopeeInfo.token.SPC_U,
		}
		return resolve();
	});
}
async function PostData() {
	return new Promise((resolve, reject) => {
		let found = true;
		try {

			let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
			let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
			let json = JSON.parse(rs);
			json.update_time = new Date().getTime();
			rs = JSON.stringify(json);
			let pd = {
				headers: {
					'Content-Type': 'application/json',
					'X-KEY': '23986fb730f9260b653bb96ab0d776e3'
				},
				url: 'http' + (UseHTTPS ? 's' : '') + '://sdany.org/usjs/shopee/proc/ProcData.ashx',
				body: JSON.stringify({
					UserID: `${config.userID}`,
					DataMode: 'ShopeeStatusInfo' + _Simulate,
					DataInfo: rs
				})
			};
			//console.log(pd);
			try {
				//console.log('POST');
				$httpClient.post(pd, function (error, response, data) {
					if (error) {
						// console.log(error);
					}
					else if (response.status == 200) {
						let json = JSON.parse(data);
						if (json.code == 0) { }
						else {
							// console.log(json.data);
						}
					}
					return resolve(found);
				});

			} catch (e2) {
				// console.log('ERROR 2');
				// console.log(e2);
				return resolve(found);

			}
		} catch (e) {
			// console.log('ERROR 1');
			// console.log(e);
			return resolve(found);

		}
	});
}

let config = {};
(async () => {
	let 傳送每日任務 = $persistentStore.read('傳送每日任務') || '';
	if (傳送每日任務 != '否') {
		try {
			//if (ShopeeUserID == '' || argd != '') {
			await preCheck();  // 取得 userID
			if (await PostData()) {
				console.log('\n\n');
				console.log(`${argd} ${_Simulate} ${ShopeeUserID} ${config.userID}`);
			}
			//}
		} catch (error) {
			console.log(error);
		}
	}

	if (isGui) {

		let dt = new Date();
		let rbody = '<html><head><meta charset="utf-8" />'
			+ '<meta name="viewport" content="width=device-width, initial-scale=0.55,minimum-scale:0.01, maximum-scale=5, user-scalable=1">'
			+ '<style>\
			header,footer{display:block;width:100%;}\
			content{display:block;width:720px;}\
			pre{tab-size:58px; white-space: pre-wrap; word-break: break-all;}\
			header{position:fixed;top:0;left:0;right:0;border-bottom:1px black solid;background-color:white!important;z-index:9;}\
			header{height:80px;}\
			content{margin-top:90px;margin-bottom:80px;position:relative;z-index:5;}\
			footer{padding:10px 0;text-align:center;}\
			footer{position:fixed;bottom:0;left:0;right:0;border-top:1px black solid;background-color:white!important;z-index:9;}\
			footer *{font-size:1.2em;}\
			h2{display:block;width:100%;text-align:center;}\
			.c_r{color:red;}\
			</style>'
			+ '</head><body>'
			+ `<header><h1>每日任務 總覽 <span class="c_r">(${SimulateUserID == '' ? '本機' : SimulateUserID})</span></h1>`
			// rbody += '<h2><a href="http://lo.on/simulate/tasks_check_list_cloud?date=' + _DTY + '">PREV</a>';
			// if (dtD != _DTD) { rbody += ' , <a href="http://lo.on/simulate/tasks_check_list_cloud?date=' + _DTT + '">NEXT</a>'; }
			// rbody += '</h2>'
			+ '</header><content><pre>'
			+ html.replace(/\n/g, '<br>')
			+ '</pre></content>'
			+ '<footer>'
			+ '👉 請按左上角「←」反回。 👈' // ，並下拉頁面重整
			+ '</footer>'
			+ '</body></html>';

		$done({
			response: {
				status: 200,
				headers: {
					'server': 'SGW',
					'date': dt.toUTCString(),
					'content-type': 'text/html',
					'X-FAKE': 'FAKE'
				},
				body: rbody
			}
		});

	}
	else { $done({}); }
})();
