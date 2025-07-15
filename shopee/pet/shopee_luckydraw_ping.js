let title = 'Luckydraw PING';
let caption = '過濾 ' + title;
let version = 'v20240117';

// https://idgame.shopee.tw/worms/api/v2/ping
function generateUUID(e = 32) {
	var t = "0123456789ABCDEF",
		a = t.length,
		n = "";
	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n;
}

if ($request.method === 'GET') {
	let dt = new Date();
	let rbody = JSON.stringify({
		"code": 0,
		"data": null,
		"timestamp": Date.now(),
		"msg": "",
		"traceID": generateUUID().toLowerCase()
	});
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': dt.toUTCString(),
				'content-type': 'application/json; charset=UTF-8',
			},
			body: rbody
		}
	});
}
else {
	$done({});
}
