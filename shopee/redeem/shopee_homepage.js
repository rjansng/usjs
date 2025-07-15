let version = 'v20240215';
let title = 'Shopee Home Page';

Date.prototype.format = function (format = '1') {
	if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
	else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format === '2') { format = 'yyyy/MM/dd'; }
	else if (format === '3') { format = 'HH:mm:ss'; }
	else if (format === '4') { format = 'MM/dd'; }
	else if (format === '5') { format = 'HH:mm'; }
	let o = {
		"M+": this.getMonth() + 1, //month 月
		"d+": this.getDate(),    //day 日
		"h+": this.getHours(),   //hour 時
		"H+": this.getHours(),   //hour 時
		"m+": this.getMinutes(), //minute 分 
		"s+": this.getSeconds(), //second 秒
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
	}
	let re = new RegExp(/(y+)/);
	if (re.test(format)) { format = format.replace(re, (this.getFullYear() + "").substr(4 - format.match(re)[1].length)); }
	for (let k in o) {
		let r = RegExp("(" + k + ")");
		if (r.test(format)) {
			let fr = format.match(r)[1];
			format = format.replace(fr, fr.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

let dts = parseInt(new Date(new Date().format("2") + ' 00:00:00').getTime() / 1000);
let dte = parseInt(new Date(new Date().format("2") + ' 23:59:59').getTime() / 1000);

if (($persistentStore.read('蝦皮首頁過濾') || '') == '是') {
	let body = $response.body;
	if (body) {
		let obj = JSON.parse(body);
		if ('error' in obj && obj.error == 0 && 'data' in obj && 'business_data' in obj.data) {
			obj.data.business_data.component_list = [
				"search_prefills",
				"new_user_zone",
				"new_user_zone",
				// "landing_page_banners",
				"announcement",
				// "campaign_modules",
				"home_squares",
				// "skinny_banners",
				// "cutline",
				// "new_user_zone",
				// "flash_sales",
				// "home_squares",
				"new_user_zone",
				"new_user_zone",
				"new_user_zone",
				// "live_streaming",
				// "daily_discover"
			];

			if ('landing_page_banners' in obj.data.business_data
				&& 'data' in obj.data.business_data.landing_page_banners
				&& 'endpoint1' in obj.data.business_data.landing_page_banners.data
				&& 'data' in obj.data.business_data.landing_page_banners.data.endpoint1
				&& 'banners' in obj.data.business_data.landing_page_banners.data.endpoint1.data
			) {
				obj.data.business_data.landing_page_banners.data.endpoint1.data.banners = [];
				// obj.data.business_data.landing_page_banners.data.endpoint1.data.banners.push(
				// 	{
				// 		"display": { "mobile": true },
				// 		"id": 62564,
				// 		"image_hash": "http://lo.on/black.png",
				// 		"navigate_params": { "url": "" },
				// 		"banner_image_tall": "http://lo.on/black.png",
				// 		"banner_metadata": {
				// 			"source": 1,
				// 			"banner_id": 62564,
				// 			"tag": 0,
				// 			"team_id": 1,
				// 			"dl_json_data": "{\"space_group_id\":6,\"slot_tracking_id\":0}",
				// 			"slot_id": 2,
				// 			"campaign_unit_id": 60061,
				// 			"display_text": "TEST",
				// 		},
				// 		"is_placeholder": false
				// 	}
				// );
			}
			// if ('new_user_zone' in obj.data.business_data) {
			// 	obj.data.business_data.new_user_zone = {
			// 		"is_1st_screen": true,
			// 		"data": {
			// 			"endpoint1": {
			// 				"data": {
			// 					"top_visual": {
			// 						"top_visual_image": "https://cf.shopee.tw/file/tw-50009109-90b472876e3ee301c6f4bc33eb5a3dfe",
			// 						"top_visual_image_ratio": 6,
			// 						"top_visual_image_url": "rn/@shopee-rn/coins/COINS_HOME"
			// 					},
			// 					"order": [
			// 						"top_visual",
			// 						"banner",
			// 						"welcome_items"
			// 					],
			// 					"layout_type": 2
			// 				}
			// 			}
			// 		},
			// 		"failure_handling": 1,
			// 		"load_data_endpoint": {
			// 			"endpoint1": {}
			// 		}
			// 	};
			// }

			let b_text = '', b_url = '', b_img = '', b_p = 0, b_id = 0;
			b_text = '我的蝦幣';
			b_url = 'rn/@shopee-rn/coins/COINS_HOME';
			b_img = 'https://cf.shopee.tw/file/tw-50009109-d2ee82271d7691089274a15f1abf9683_xxhdpi';


			if ('home_squares' in obj.data.business_data
				&& 'data' in obj.data.business_data.home_squares
				&& 'endpoint1' in obj.data.business_data.home_squares.data
				&& 'data' in obj.data.business_data.home_squares.data.endpoint1
				&& 'banners' in obj.data.business_data.home_squares.data.endpoint1.data
			) {
				// obj.data.business_data.home_squares.data.endpoint1.data.banners = [];
				obj.data.business_data.home_squares.data.endpoint1.data.banners.forEach(b => {
					if (b.position > b_p) { b_p = b.position; }
					if (b.id > b_id) { b_id = b.id; }
				});
				b_p++; b_id++;
				// obj.data.business_data.home_squares.data.endpoint1.data.banners.push(
				// 	{
				// 		"id": b_id, "start": dts, "end": dte, "position": b_p,
				// 		"display": { "mobile": true, "pc": true },
				// 		"navigate_params": {
				// 			"url": b_url, "config": {},
				// 			"navbar": {
				// 				"title": "{\"default\":\"" + b_text + "\",\"en\":\"Shopee Prizes\",\"zhHans\":\"" + b_text + "\",\"zhHant\":\"" + b_text + "\"}",
				// 				"multilang_title": "{\"default\":\"" + b_text + "\",\"en\":\"Shopee Prizes\",\"zhHans\":\"" + b_text + "\",\"zhHant\":\"" + b_text + "\"}"
				// 			}
				// 		},
				// 		"data": {}, "type": 13, "banner_image": "https://cf.shopee.tw/file/fb3c1ae6fa9a5dcb7e014cb3eb1da332_xxhdpi"
				// 	}
				// );
				// obj.data.business_data.home_squares.data.endpoint1.data.banners.push(
				// 	{
				// 		"end": dte,
				// 		"position": b_p,
				// 		"display": {
				// 			"mobile": true,
				// 			"pc": true
				// 		},
				// 		"id": b_id,
				// 		"start": dts,
				// 		"navigate_params": {
				// 			"url": "rn/@shopee-rn/coins/COINS_HOME",
				// 			"config": {},
				// 			"navbar": {
				// 				"title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}",
				// 				"multilang_title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}"
				// 			}
				// 		},
				// 		"data": {},
				// 		"type": 13,
				// 		"banner_image": "https://cf.shopee.tw/file/fb3c1ae6fa9a5dcb7e014cb3eb1da332_xxhdpi"
				// 	}
				// );
				// obj.data.business_data.home_squares.data.endpoint1.data.banners.push(
				// 	{
				// 		"end": dte,
				// 		"position": b_p,
				// 		"display": {
				// 			"mobile": true,
				// 			"pc": true
				// 		},
				// 		"id": b_id,
				// 		"start": dts,
				// 		"navigate_params": {
				// 			"url": "rn/@shopee-rn/coins/COINS_HOME",
				// 			"config": {},
				// 			"navbar": {
				// 				"title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}",
				// 				"multilang_title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}"
				// 			}
				// 		},
				// 		"data": {},
				// 		"type": 13,
				// 		"banner_image": "https://cf.shopee.tw/file/fb3c1ae6fa9a5dcb7e014cb3eb1da332_xxhdpi"
				// 	}
				// );
				// obj.data.business_data.home_squares.data.endpoint1.data.banners.push(
				// 	{
				// 		"end": dte,
				// 		"position": b_p,
				// 		"display": {
				// 			"mobile": true,
				// 			"pc": true
				// 		},
				// 		"id": b_id,
				// 		"start": dts,
				// 		"navigate_params": {
				// 			"url": "rn/@shopee-rn/coins/COINS_HOME",
				// 			"config": {},
				// 			"navbar": {
				// 				"title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}",
				// 				"multilang_title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}"
				// 			}
				// 		},
				// 		"data": {},
				// 		"type": 13,
				// 		"banner_image": "https://cf.shopee.tw/file/fb3c1ae6fa9a5dcb7e014cb3eb1da332_xxhdpi"
				// 	}
				// );
				// obj.data.business_data.home_squares.data.endpoint1.data.banners.push(
				// 	{
				// 		"end": dte,
				// 		"position": b_p,
				// 		"display": {
				// 			"mobile": true,
				// 			"pc": true
				// 		},
				// 		"id": b_id,
				// 		"start": dts,
				// 		"navigate_params": {
				// 			"url": "rn/@shopee-rn/coins/COINS_HOME",
				// 			"config": {},
				// 			"navbar": {
				// 				"title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}",
				// 				"multilang_title": "{\"default\":\"我的蝦幣\",\"en\":\"Shopee Prizes\",\"zhHans\":\"我的蝦幣\",\"zhHant\":\"我的蝦幣\"}"
				// 			}
				// 		},
				// 		"data": {},
				// 		"type": 13,
				// 		"banner_image": "https://cf.shopee.tw/file/fb3c1ae6fa9a5dcb7e014cb3eb1da332_xxhdpi"
				// 	}
				// );
			}
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].text_color = '#FFFFFF';
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].background_color = '#000000';

			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].min_icon_per_row = 5;
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].max_row = 5;
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].max_icon = 20;
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].scrollable = true;
			// obj.data.business_data.home_squares.data.endpoint3.data.layouts[0].card_display = 1;


			obj.data.business_data.new_user_zone = {
				"is_1st_screen": true,
				"data": {
					"endpoint1": {
						"data": {
							"top_visual": {
								"top_visual_image": "http://lo.on/trans.png",
								"top_visual_image_ratio": 5,
								"top_visual_image_url": ""
							},
							"order": [
								"top_visual",
								"banner",
								"welcome_items"
							],
							"layout_type": 0
						}
					},
				},
				"failure_handling": 2,
				"load_data_endpoint": {
					"endpoint1": {},
				}
			};
			obj.data.business_data.skinny_banners = {
				"is_1st_screen": true,
				"data": {
					"frc_ui_style": 0,
					"endpoint1": {
						"data": {
							"ratio": 3.3333333,
							"space_key": "NT-TW-HOME_SKINNY_01",
							"banners": [
								{
									"click_sections": [
										{
											"target_url": b_url,
											"image_width_percentage": 29.833334
										},
										{
											"target_url": b_url,
											"image_width_percentage": 40.333332
										},
										{
											"target_url": b_url,
											"image_width_percentage": 29.833334
										}
									],
									"image_hash": "http://lo.on/trans.png",
									"number_of_sections": 3,
									"target_url": b_url,
									"image_url": "http://lo.on/trans.png",
									"banner_metadata": {
										"source": 1,
										"banner_id": 62606,
										"tag": 0,
										"team_id": 1,
										"dl_json_data": "{\"space_group_id\":10,\"slot_tracking_id\":0}",
										"slot_id": 1,
										"campaign_unit_id": 60104
									},
									"is_placeholder": false
								}
							]
						}
					}
				},
				"failure_handling": 1,
				"load_data_endpoint": {
					"endpoint1": {}
				}
			};

			// 避免 418 驗證
			if ('search_prefills' in obj.data.business_data
				&& 'data' in obj.data.business_data.search_prefills) {
				if ('endpoint1' in obj.data.business_data.search_prefills.data
					&& 'data' in obj.data.business_data.search_prefills.data.endpoint1) {
					if ('items' in obj.data.business_data.search_prefills.data.endpoint1.data) {
						obj.data.business_data.search_prefills.data.endpoint1.data.items = [];
					}
					if ('ordered_prefills' in obj.data.business_data.search_prefills.data.endpoint1.data
						&& obj.data.business_data.search_prefills.data.endpoint1.data.ordered_prefills
						&& obj.data.business_data.search_prefills.data.endpoint1.data.ordered_prefills.length > 0
					) {
						if ('items' in obj.data.business_data.search_prefills.data.endpoint1.data.ordered_prefills[0]) {
							obj.data.business_data.search_prefills.data.endpoint1.data.ordered_prefills[0].items = [];
						}
					}
				}
				if ('endpoint5' in obj.data.business_data.search_prefills.data
					&& 'data' in obj.data.business_data.search_prefills.data.endpoint5) {
					if ('prefills' in obj.data.business_data.search_prefills.data.endpoint5.data) {
						obj.data.business_data.search_prefills.data.endpoint5.data.prefills = [];
					}
				}
			}

		}
		body = JSON.stringify(obj);
		$done({ body });
	}
} else {
	$done({});
}