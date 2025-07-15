let title = '桌上曲棍球 選單';
let caption = '過濾 ' + title;
let version = 'v20230914';

// https://idgame.shopee.tw/crash-ball/api/v1/events/ab894e82f6d97121
// https:\/\/idgame\.shopee\.tw\/crash-ball\/api\/v1\/events\/ab894e82f6d97121

let UseCoins = $persistentStore.read('桌上曲棍球用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

if ($request.method === 'GET' && !UseCoins) {
	let body = $response.body;
	let json = JSON.parse(body);
	// console.log(json);

	try {
		if (json.hasOwnProperty('data')) {

			let items = [];
			json.data.config.item_list_10.some(d => {
				if (d.dropdown_6 == "practice") {
					items.push(d);
					//items.push(d);
					return true;
				}
			});
			json.data.config.item_list_10 = items;

			body = JSON.stringify(json);
			$done({ body });
		}
	} catch (error) {
		$done({});
	}
}
else {
	$done({});
}