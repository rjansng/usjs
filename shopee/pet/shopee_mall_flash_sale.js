let version = 'v20240215';
let title = 'Shopee 商城 限時特價';

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

let dts = parseInt(new Date(new Date().format("2") + ' 00:00:00').getTime() / 1000);
let dte = parseInt(new Date(new Date().format("2") + ' 23:59:59').getTime() / 1000);

if (($persistentStore.read('蝦皮商城過濾') || '') == '是') {
	try {
		// let body = $response.body;
		// if (body) {
		// 	console.log('RESPONSE');
		// 	let obj = JSON.parse(body);
		// 	if ('data' in obj && 'items' in obj.data) {
		// 		obj.data.items = [];
		// 	}
		// 	body = JSON.stringify(obj);
		// 	$done({ body });
		// }
		// else {
		console.log('REQUEST');
		let dt = new Date();
		let rbody = JSON.stringify(
			{
				"data": {
					"items": [],
					"session": {
						"status": 1,
						"start_time": dts,
						"end_time": dte,
						"promotionid": 200518477828097
					},
					"total": 0
				},
				"bff_meta": null,
				"error": 0,
				"error_msg": null
			}
		);
		$done({
			response: {
				status: 200,
				headers: {
					'date': dt.toUTCString(),
					'content-type': 'application/json',
				},
				body: rbody
			}
		});
		// }

	} catch (error) {
		console.log('ERR');
		console.log(error);

		$done({});
	}
} else {
	$done({});
}