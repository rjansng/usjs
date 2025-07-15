let version = 'v20240205';

let isGui = false;
let isRefresh = true;
if ($request && $request.url.match(/http:\/\/lo.on\/simulate.+/i)) { isGui = true; console.log('GUI手動執行。\n'); }
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
let dtDN = new Date(dtD).AddDay(1).getTime();
let dtDT2355 = new Date(dtDN - 300000).getTime();

if (isGui) {
	let query = $request.url.match(/http:\/\/lo.on\/simulate\?(.+)$/i)[1];
	let qs = query.split('&');
	let html_title = '';
	let html_title2 = '';
	let html_content = '';
	let showPageBack = false;
	if (qs.length > 0) {
		showPageBack = true;
		let qss = qs[0].split('=');
		html_title = '偽裝的UserID';
		if (qss[0].match(/^page$/i)) {
			showPageBack = false;
			if (qss[1].match(/^main$/i)) {
				if (qs.length > 1) {
					let q = qs[1].split('=');
					if (q[0] == 'uid') {
						let _suid = $persistentStore.read('偽裝的UserID') || '';
						let _suids = _suid.split(' ');
						if (_suid != '') { html_title2 = `<span style="font-size:1.2em;">目前偽裝: </span><span style="font-size:1.2em;color:red;">${_suid}</span>\n\n`; }

						if (q[1] == '43980511') {
							['58710081 ww2feel']
								.forEach(suid => {
									html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${suid.replace(/ /g, ';')}">${suid}</a>\n\n`;
								});
						}
						else if (q[1] == '732423754' || q[1] == '681985929' || q[1] == '918908158') {
							['981988128 Sdany.5s.eason101520', '918908158 Sdany.6sP.jieguan285', '964204346 淑真.11.x30frnz4m4', '578729974 淑敏.15P.shuminyang916', '1116124017 柔榛.SE2.w1srzzknet', '664774607 芸淇.8P.ul5fenn_pw']
								.forEach(suid => {
									let suid2 = suid.split(' ');
									if (suid2[0] != q[1]) {
										if (suid2[0] == _suids[0]) {
											html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;color:red;"> ${suid2[1]}</span>\n\n`;
										}
										else {
											html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;"> ${suid2[1]}</span>\n\n`;
										}
									}
									else { // 本機 不用 LINK
										html_content += `<span style="font-size:1.5em;color:green">${suid}</span> <span style="font-size:1.5em;color:blue;">(本機)</span>\n\n`;
									}
								});
							let isShow = $persistentStore.read('顯示偽裝的資訊次要') || '';
							if (isShow == '是') { isShow = true; } else { isShow = false; }
							if (isShow) {
								['681985929 Sdany.i8P.sdany9357', '732423754 Sdany.i7P.sdany5751']
									.forEach(suid => {
										let suid2 = suid.split(' ');
										if (suid2[0] != q[1]) {
											if (suid2[0] == _suids[0]) {
												html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;color:red;"> ${suid2[1]}</span>\n\n`;
											}
											else {
												html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;"> ${suid2[1]}</span>\n\n`;
											}
										}
										else { // 本機 不用 LINK
											html_content += `<span style="font-size:1.5em;color:green">${suid}</span> <span style="font-size:1.5em;color:blue;">(本機)</span>\n\n`;
										}
									});

							}
							let isShowO = $persistentStore.read('顯示偽裝的資訊其它') || '';
							if (isShowO == '是') { isShowO = true; } else { isShowO = false; }
							if (isShowO) {
								['43980511 zongancai', '313955569 danny', '140595219 summer', '16079058 mybaby', '58710081 ww2feel']
									.forEach(suid => {
										let suid2 = suid.split(' ');
										html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;"> ${suid2[1]}</span>\n\n`;
										// html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=${encodeURIComponent(suid)}">${suid}</a>\n\n`;
									});

							}
						}
						html_content += `\n<a style="font-size:1.5em;" href="http://lo.on/simulate?suid=null"><span style="color:red;">清除 偽裝的UserID</span></a>\n\n`;
						$persistentStore.write(null, 'ShopeeFarmLink');
						// let slink = $persistentStore.read('ShopeeFarmLink') || '';
						// if (slink != '') {
						// 	html_content += `<a style="font-size:1.5em;" href="${slink}">站外澆水測試</a>\n${slink}\n`;
						// }
						isRefresh = false;
					}
				}
				else {
					html_content = `測試頁面。\n`;
					html_content += JSON.stringify($request.headers, null, 4);
				}
			}
			else if (qss[1].match(/^list$/i)) { // tasks_check_list_cloud
				//578729974  shuminyang916  iPhone 15 Pro
				['981988128 Sdany.5s.eason101520', '918908158 Sdany.6sP.jieguan285', '964204346 淑真.11.x30frnz4m4', '578729974 淑敏.15P.shuminyang916', '1116124017 柔榛.SE2.w1srzzknet', '664774607 芸淇.8P.ul5fenn_pw'
					, '681985929 Sdany.8P.sdany9357', '732423754 Sdany.7P.sdany5751'
					, '43980511 zongancai', '313955569 danny', '140595219 summer', '16079058 mybaby', '58710081 ww2feel'
				]
					.forEach(suid => {
						let suid2 = suid.split(' ');
						html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate/tasks_check_list_cloud?suid=${encodeURIComponent(suid)}">${suid2[0]}</a><span style="font-size:1.5em;"> ${suid2[1]}</span>\n\n`;
						// html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate/tasks_check_list_cloud?suid=${encodeURIComponent(suid)}">${suid}</a>\n\n`;
						// html_content += `<a style="font-size:1.5em;" href="http://lo.on/simulate/tasks_check_list_cloud?suid=${encodeURIComponent(suid + ';')}">${suid} S</a>\n\n`;
					});


				isRefresh = false;
			}
		}
		else if (qss[0].match(/^suid$/i)) {
			if (qss[1].match(/^null$/i)) {
				$persistentStore.write(null, '偽裝的UserID');
				html_content = `偽裝的UserID：已清除`;
				showPageBack = false;
			}
			else {
				let suid = decodeURIComponent(qss[1]);
				$persistentStore.write(suid, '偽裝的UserID');
				html_content = `偽裝的資料：${suid}\n`;
				let suids = suid.split(' ');
				let ShopeeUserID = suids[0];
				let _ShopeeUserID = '';
				html_content = `偽裝的UserID：${ShopeeUserID}\n`;
				console.log(`SUID: ${ShopeeUserID}`);
				if (ShopeeUserID != '') { _ShopeeUserID = `_${ShopeeUserID}`; }
				let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
				let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
				let scores = JSON.parse(rs);
				html_content += `檔案時間: ${new Date(scores.gameTime).format("0")}\n`;
				console.log(`檔案時間: ${new Date(scores.gameTime).format("0")}`);
				let reset = false;
				if (dtDT >= dtDT2355) { dtD = dtDN; } // 每日 2355 刷新
				if (scores.gameTime != dtD) { scores = {}; scores.gameTime = dtD; reset = true; html_content += `每日任務刷新`; console.log(`每日任務刷新`); }
				else { html_content += 'OK!\n'; console.log(`OK!`); }

				let idss = 'shopee,candycrush,puzzle_bobble_be,clawbox,knifethrow,farm,pet';
				let ids = idss.split(',');
				ids.forEach(xids => { if (!scores.hasOwnProperty(`${xids}s`)) { scores[`${xids}s`] = {}; reset = true; } });

				if (reset) { $persistentStore.write(JSON.stringify(scores), dataName); }

				html_content += `<br>請 <a style="font-size:1.5em;" href="http://lo.on/simulate/get_cloud_token">從 Cloud 取得 TOKEN</a>\n\n`;

			}
		}

	}
	let dt = new Date();
	///*header{position:fixed; top:0;left:0;right:0;border-bottom: 1px black solid;background-color: white;}\*/
	let rbody = '<html><head><meta charset="utf-8" />'
		+ '<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale:1, maximum-scale=1, user-scalable=1">'
		+ '<style>\
		content *,footer *{font-size:1.2em;}\
		header,footer{display:block;width:100%;z-index:9;}\
		header{position:fixed;top:0;left:0;right:0;border-bottom:1px black solid;background-color:white!important;z-index:9;}\
		content{display:block;white-space:pre;z-index:5;}\
		footer{text-align:center;}\
		content{margin:0 0 80px 0;position:relative;}\
		footer{position:fixed;padding:10px 0;bottom:0;left:0;right:0;border-top:1px black solid;background-color:white;z-index:9;}\
		h1,h2{margin:0;}'
		+ (html_title2 != '' ? 'header{height:80px;}content{padding-top:90px;}' : 'header{height:50px;}content{padding-top:60px;}')
		+ '</style>'
		+ '</head><body>'
		+ '<header><h1>'
		+ html_title
		+ '</h1>'
		+ html_title2
		+ '</header>'
		+ '<content>'
		+ html_content.replace(/\n/g, '<br>')
		+ '</content>';
	rbody += '<footer>';
	rbody += '👉 請按左上角「←」反回';
	if (isRefresh) rbody += '，並下拉頁面重整';
	rbody += '。 👈';
	if (showPageBack) {
		rbody += '<br><button onclick="history.back()" style="padding:5px 10px;">This Page Back</button>';
	}
	rbody += '</footer>'
		+ '</body></html>';
	$done({
		response: {
			status: 200,
			headers: {
				'date': dt.toUTCString(),
				'content-type': 'text/html',
			},
			body: rbody
		}
	});

}
else {
	console.log('手動執行無效。');
	$done({});
}

