let version = 'v20240215';
let title = 'Shopee 商城 Banner';


if (($persistentStore.read('蝦皮商城過濾') || '') == '是') {
	try {
		// let body = $response.body;
		// if (body) {
		// 	let obj = JSON.parse(body);
		// 	if ('data' in obj && 'space_banners' in obj.data) {
		// 		obj.data.space_banners = [];
		// 	}
		// 	body = JSON.stringify(obj);
		// 	$done({ body });
		// }
		// else {
		console.log('REQUEST');
		let dt = new Date();
		let rbody = JSON.stringify(
			{
				"data": {
					"space_banners": [
						{
							"ratio": 3.3333333,
							"space_key": "RN-TW-MALL_CAROUSEL_01",
							"banners": []
						}
					]
				}
			}

		);
		$done({
			response: {
				status: 200,
				headers: {
					'date': dt.toUTCString(),
					'content-type': 'application/json',
				},
				body: rbody
			}
		});
		// }




	} catch (error) {
		$done({});
	}
} else {
	$done({});
}