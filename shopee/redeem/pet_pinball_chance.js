let title = '彈珠台 選單';
let caption = '過濾 ' + title;
let version = 'v20240316';

let UseCoins = $persistentStore.read('彈珠台用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

// https://games.shopee.tw/api-gateway/pet/game/get_pinball_chance?activityCode=b711c6148c210f8f&eventCode=0244d69e637bbb73&
// https:\/\/games\.shopee\.tw\/api-gateway\/pet\/game\/get_pinball_chance\?activityCode=b711c6148c210f8f&eventCode=0244d69e637bbb73&

if ($request.method == 'GET' && !UseCoins) {
	let body = $response.body;
	let ShowBodyLog = ($persistentStore.read('ShowBodyLog') || '');
	if (ShowBodyLog == '是') { ShowBodyLog = true; } else { ShowBodyLog = false; }
	if (ShowBodyLog) { console.log('\n\n'); console.log(body); console.log('\n\n'); }

	let obj = JSON.parse(body);
	let ShowJsonLog = ($persistentStore.read('ShowJsonLog') || '');
	if (ShowJsonLog == '是') { ShowJsonLog = true; } else { ShowJsonLog = false; }
	if (ShowJsonLog) { console.log('\n\n'); console.log(obj); console.log('\n\n'); }

	let fPBC = $persistentStore.read('彈珠台過濾機台') || '';
	if (fPBC == '是') { fPBC = true; } else { fPBC = false; }
	try {
		if (obj.hasOwnProperty('data')) {
			let items = [];
			obj.data.chances.forEach(d => {
				if (d.entranceID == 3) {
					d.used = 0;
					d.left = 0;
				}
				else { items.push(d); }

				// if (d.entranceID == 1) { items.push(d); }
				// else if (d.entranceID == 2) { items.push(d); }
				// else if (d.entranceID == 3) { items.push(d); }
				// else {
				// 	// if (d.left > 5) {
				// 		d.used = 0;
				// 		d.left = 0;
				// 	// }
				// 	// else { items.push(d); }
				// }
			});
			if (fPBC) {
				obj.data.chances = items;
				console.log(obj);
				$persistentStore.write(null, '模擬彈珠台2');
			}

			body = JSON.stringify(obj);
			$done({ body });
		}
	} catch (error) {
		$done({});
	}
}
else {
	$done({});
}