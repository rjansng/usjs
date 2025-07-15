let version = 'v20230916';

let isGui = false;
if ($request && $request.url.match(/http:\/\/lo.on\/simulate.+/i)) { isGui = true; console.log('GUI手動執行。\n'); }

if (isGui) {
	let html_title = '偽裝的UserID';
	let html_content = '<h3>「蝦皮App 偽裝 Headers」插件 未啟用</h3>';
	html_content+='<h4>請先啟用插件「蝦皮App 偽裝 Headers」</h4>'
	let dt = new Date();
	let rbody = '<html><head><meta charset="utf-8" />'
		+ '<meta name="viewport" content="width=device-width, initial-scale=1,minimum-scale:1, maximum-scale=1, user-scalable=1">'
		+ '<style>'
		+ 'header,content,footer { display: block; white-space: pre;}'
		+ 'footer{padding-top:5px;text-align:center;}'
		+ '</style>'
		+ '</head><body>'
		+ '<h1>'
		+ html_title
		+ '</h1>'
		+ '<content>'
		+ html_content
		+ '</content>';
	rbody += '<footer>'
		+ '👉 請按左上角「←」反回。 👈';
	rbody += '</footer>'
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

