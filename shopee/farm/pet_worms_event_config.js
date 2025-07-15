let title = '貪食蛇 基本資料';
let caption = '過濾 ' + title;
let version = 'v20230914';

let CameraZoom = $persistentStore.read('貪食蛇視野大小') || '0';
if (CameraZoom == '預設') { CameraZoom = '0'; }
try { CameraZoom = parseFloat(CameraZoom); } catch (error) { CameraZoom = 0; }

let UseCoins = $persistentStore.read('貪食蛇用蝦幣玩') || '';
if (UseCoins == '是') { UseCoins = true; }
else { UseCoins = false; }

if ($request.method === 'GET') {
	let body = $response.body;
	let json = JSON.parse(body);
	// console.log(json);
	// https://idgame.shopee.tw/worms/api/v2/event-config/480d67df44babcaf?need_gameplay_config=true&need_arena_config=true
	// https:\/\/idgame\.shopee\.tw\/worms\/api\/v2\/event-config\/480d67df44babcaf\?need_gameplay_config=true&need_arena_config=true
	try {
		if (json.hasOwnProperty('data')
			&& json.data.hasOwnProperty('special_event_data')) {
			let isModify = false;
			// json.data.special_event_data.free_boosters['1'] = 30;
			// json.data.special_event_data.free_boosters['2'] = 30;
			// json.data.special_event_data.free_boosters['3'] = 30;

			console.log(json.data.special_event_data);
			if (!UseCoins) {
				isModify = true;
				let lobby = json.data.special_event_data.lobby[0];
				json.data.special_event_data.lobby = [];
				json.data.special_event_data.lobby.push(lobby);
			}

			console.log(json.data.gameplay_config);

			if (CameraZoom > 0) {
				isModify = true;
				json.data.gameplay_config.camera_zoom = CameraZoom; // 2
			}
			// json.data.gameplay_config.player_speed = 300;  // 230
			// json.data.minimap_ratio= 0.4;
			// json.data.asian_cuisine_food_points= 50;
			// json.data.speed_boost_turning_radius_multiplier= 1.5;
			// json.data.player_speed = 500; // 230
			// json.data.food_magnet_grabber_size_multiplier= 3;
			// json.data.food_grabber_multiplier= 4;
			// json.data.booster_zoom_out_duration = 30;
			// json.data.zoom_out_multiplier = 2;  // 1.5
			// json.data.booster_speed_duration= 30;
			// json.data.booster_magnet_duration= 30;
			// json.data.food_spawn= 10;
			if (isModify) {
				body = JSON.stringify(json);
				$done({ body });
			}
			else {
				$done({});
			}
		}
	} catch (error) {
		console.log(error);
		$done({});
	}
}
else {
	$done({});
}