// https://games.shopee.tw/api-gateway/pet/ads/countdown_end_noti
// https:\/\/games\.shopee\.tw\/api-gateway\/pet\/ads\/countdown_end_noti
let title = '鈕蛋機會 30秒商品廣告';
let caption = '' + title;
let version = 'v20230825';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

Date.prototype.format = function (format = '1', mode = 1) {
	if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.fff'; }
	else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format === '2') { format = 'yyyy/MM/dd'; }
	else if (format === '3') { format = 'HH:mm:ss'; }
	else if (format === '4') { format = 'MM/dd'; }
	else if (format === '5') { format = 'HH:mm'; }
	let o = {
		"M+": this.getMonth() + 1, //month  
		"d+": this.getDate(),    //day  
		"h+": this.getHours(),   //hour  
		"H+": this.getHours(),   //hour  
		"m+": this.getMinutes(), //minute  
		"s+": this.getSeconds(), //second  
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"f+": this.getMilliseconds(),  //millisecond  
		"S": this.getMilliseconds() //millisecond  
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length === 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	if (format.match(/\/|\-/g)) {
		if (mode == 0) { return new Date(format); }
		else if (mode == 2) { return new Date(format).getTime(); }
	} else if (format.match(/:/g)) {
		if (mode == 0) { return new Date('0 ' + format); }
		else if (mode == 2) { return new Date('0 ' + format).getTime(); }
	}
	return format;
};
let DTND = new Date().format('2', 2);

if ($request.method == 'POST') {
	var body = $response.body;
	var json = JSON.parse(body);
	if (json.code == 0) {

		try {
			let gmp = { 'dataTime': DTND };
			$persistentStore.write(JSON.stringify(gmp), 'pet_need_twist' + _ShopeeUserID);
		} catch (error) { }

	}
}
$done({});
