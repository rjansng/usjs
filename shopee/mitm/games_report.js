// https://games.shopee.tw/game/stats/api/v2/report
let title = 'GAME REPORT';
let caption = '過濾 ' + title;
let version = 'v20230821';

if ($request.method == 'POST') {
	let rebody = JSON.stringify({
		"msg": "success",
		"data": null,
		"code": 0
	});
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': new Date().toUTCString(),
				'content-type': 'application/json; charset=UTF-8'
			},
			body: rebody
		}
	});
}
else {
	$done({});
}