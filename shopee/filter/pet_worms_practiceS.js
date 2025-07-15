let title = '貪食蛇 RES';
let caption = '過濾 ' + title;
let version = 'v20231108';

let UseCoins = $persistentStore.read('貪食蛇用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

if ($request.method == 'POST' && !UseCoins) {
	let body = $response.body;
	//console.log(body);

	try {
		let json = JSON.parse(body);
		//console.log(json);

		if (json.hasOwnProperty('data') && json.data.hasOwnProperty('user')) {
			// console.log('修改前');
			// console.log(json.data.user.play_limit);
			json.data.user.play_limit.remaining = 0;
			json.data.user.play_limit.max = 0;
			// console.log('修改後');
			// console.log(json.data.user.play_limit);
			body = JSON.stringify(json);
			$done({ body });
		}
		else {
			$done({});
		}

	} catch (error) {
		console.log(error);
		console.log(body);

		$done({});
	}
}
else {
	$done({});
}