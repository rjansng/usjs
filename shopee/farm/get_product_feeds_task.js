let title = '💰我的蝦幣 商店 秒數 0 領任務';
let version = 'v20230901';

let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
// let UseUserIdMITM = $persistentStore.read('UseUserIdMITM') || '';
// console.log(UseUserIdMITM);
// if (ShopeeUserID != '' && UseUserIdMITM != '1') {
// 	$done({ response: { status: 404, headers: {}, body: "" } });
// }
// else {
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

// let FeedTask = { datetime: new Date().getTime(), hasTask: true };
var body = $response.body;
var json = JSON.parse(body);
console.log(json);

if (json.hasOwnProperty('data') && json.data != null && json.data.hasOwnProperty('browse_time')) {
	json.data.browse_time = 0;
	//json.data.pause_time = 31;
	//console.log(json.data);
	body = JSON.stringify(json);
	//$persistentStore.write(JSON.stringify(FeedTask), 'ShopeeFeedsTaskFinish');
	$persistentStore.write(JSON.stringify({ dataTime: new Date().getTime() }), 'ShopeeFeedsTaskBrowseTime' + _ShopeeUserID);
	$done({ body });
}
else {
	//FeedTask.hasTask = false;
	//$persistentStore.write(JSON.stringify(FeedTask), 'ShopeeFeedsTaskFinish');

	//(^https:\/\/shopee\.tw\/api\/v4\/market_coin\/get_product_feeds\?count=)\d+ header $11

	//console.log(body);
	$done({});
}
// }