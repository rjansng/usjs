let title = '彈珠台 開始資訊';
let caption = '取得 ' + title;
let version = 'v20230925';

// https://games.shopee.tw/api-gateway/pet/game/begin_pinball?version=2&activityCode=b711c6148c210f8f&eventCode=725fb5b149170d68&costCoins=0&entranceID=1&token=1695610275084
// https:\/\/games\.shopee\.tw\/api-gateway\/pet\/game\/begin_pinball\?

if ($request.method == 'GET') {
	let body = $response.body;
	let json = JSON.parse(body);

	try {
		if (json.hasOwnProperty('code') && json.code == 0) {
			let url = $request.url;
			let costCoins = url.match(/costCoins=(\d+)/i)[1];
			let entranceID = url.match(/entranceID=(\d+)/i)[1];
			costCoins = parseInt(costCoins);
			entranceID = parseInt(entranceID);
			let ppi = { 'costCoins': costCoins, 'entranceID': entranceID };
			console.log('pet_pinball_info');
			console.log(ppi);
			$persistentStore.write(JSON.stringify(ppi), 'pet_pinball_info');
		}
	} catch (error) {
		console.log('ERROR');
		console.log(error);
	}
	$done({});
}
else {
	$done({});
}