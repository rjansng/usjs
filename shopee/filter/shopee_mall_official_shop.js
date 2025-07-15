let version = 'v20240215';
let title = 'Shopee 商城 品牌旗艦店';

if (($persistentStore.read('蝦皮商城過濾') || '') == '是') {
	try {
		// let body = $response.body;
		// if (body) {
		// 	let obj = JSON.parse(body);
		// 	if ('data' in obj && 'official_shops' in obj.data) {
		// 		obj.data.official_shops = [];
		// 		obj.data.total = obj.data.official_shops.length;
		// 	}
		// 	body = JSON.stringify(obj);
		// 	$done({ body });
		// }
		// else {
			let dt = new Date();
			let rbody = JSON.stringify(
				{
					"error": 0,
					"data": {
						"total": 0,
						"official_shops": []
					},
					"error_msg": null
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