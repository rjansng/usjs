let title = '取得 手動 站外澆水 數據';
let version = 'v20230702';
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

let isReq = false;
let body = null;
try {
	body = $response.body;
} catch (e) {
	isReq = true;
}
let url = $request.url;
if (isReq) {
	console.log(url);
	if (url.match(/^https:\/\/games\.shopee\.tw\/farm\/api\/message\/get\?page=1&pageSize=\d{2}$/i)) {
		$request.url = $request.url.replace(/(.+pageSize=)\d{2}$/i, '$1300');
		console.log($request.url);
		$done({ url: $request.url });
	} else { $done({}); }
}
if (body) {

	let json = JSON.parse(body);
	if (json.code === 0) {
		let dts = ['', '1朋友給35水', '2站外給10水', '3朋友求水', '4作物狀態', '', '6朋友來搖樹', '7自己去朋友搖樹', '8取得道具', ''];
		let ms = json.data.messages;
		let GetC = 0;
		let ms2 = [];
		for (let i = 0; i < ms.length; i++) {
			let m = ms[i];
			let d = '';
			if (m.type <= 9) { d = dts[m.type]; }
			if (d === '') {
				console.log(`\n\n${m.type}\n${JSON.stringify(m.data)}`);
			} else {
				//console.log(`\n\n${d}\n${JSON.stringify(m.data)}`);
			}
			if (m.type != 2 && m.type != 5 && m.type <= 7) { }
			else {
				ms2.push(m);
				let dtn = new Date(new Date().format("2")).getTime();
				// console.log('\n');
				// console.log(new Date(m.CreateTime).format("1"));
				//console.log(m);

				if (m.type === 2 && m.CreateTime >= dtn) {
					//if (m.data.Count > 0 && m.data.Exp === 10) {
					// console.log(m);
					try {
						let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
						let tsn = 'farms';
						let tsid = 'D';
						let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
						let tasks = JSON.parse(rs);
						let ts = {}, s = {};
						if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
						if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
						if (!s.f && s.s === 0 && s.c === 0) { s.s = 5; }
						if (m.data.Count > 0 && m.data.Exp === 10) {
							if (m.data.Count > s.c) { s.c = m.data.Count; s.s = 5 - s.c; }
						}
						GetC = s.c;
						s.f = s.c >= 5;
						ts[tsid] = s;
						tasks[tsn] = ts;
						$persistentStore.write(JSON.stringify(tasks), dataName);
					} catch (e) { console.log(e); }
					//}
				}
			}
		}
		json.data.messages = ms2;
	}
	body = JSON.stringify(json);
	//console.log('\n\n' + body);
	$done({ body });
}