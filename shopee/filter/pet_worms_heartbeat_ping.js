let title = '貪食蛇 Heart Beat PING';
let caption = '過濾 ' + title;
let version = 'v20240115';

// https://idgame.shopee.tw/worms/api/v2/ping

if ($request.method === 'OPTIONS') {
	let dt = new Date();
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': dt.toUTCString(),
				'access-control-allow-credentials': 'true',
				'access-control-allow-methods': 'POST, GET, OPTIONS, PUT, DELETE',
				'access-control-allow-origin': 'https://games.shopee.tw',
				'access-control-allow-headers': 'exclude-healthcheck',
				'allow': 'GET, OPTIONS'
			}
		}
	});
}
else if ($request.method === 'GET') {
	let dt = new Date();
	let rbody = JSON.stringify({ "msg": "success", "code": 0 });
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': dt.toUTCString(),
				'content-type': 'application/json; charset=UTF-8',
				'access-control-allow-credentials': 'true',
				'access-control-allow-methods': 'POST, GET, OPTIONS, PUT, DELETE',
				'access-control-allow-origin': 'https://games.shopee.tw',
			},
			body: rbody
		}
	});
}
else {
	$done({});
}