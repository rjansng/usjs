let title = '桌上曲棍球 PING';
let caption = '過濾 ' + title;
let version = 'v20230820';

// https://idgame.shopee.tw/crash-ball/api/v1/ping

if ($request.method === 'GET') {
	let dt = new Date();
	let rbody = JSON.stringify({
		"data": {
			"environment": "live",
			"app_name": "crash-ball-api-server-be",
			"country": "tw",
			"message": "ok",
			"server_timestamp": parseInt(dt.getTime() / 1000)
		}
	});
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': dt.toUTCString(),
				'content-type': 'application/json; charset=UTF-8',
				// "content-length": `${rbody.length}`,
				'access-control-allow-credentials': 'true',
				'access-control-allow-origin': 'https://games.shopee.tw',
				'vary': 'Origin',
				'X-FAKE': 'FAKE'
			},
			body: rbody
		}
	});
}
else {
	$done({});
}