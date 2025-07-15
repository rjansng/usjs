let title = '💰我的蝦幣 偽裝兌換券類別清單';
let caption = '過濾 ' + title;
let version = 'v20240119';

let rbody = JSON.stringify({
	"error": null,
	"data": {
		"list": [
			{
				"app_icon": "ef76d17b8eeb5eb9f58ca7b56ad047d2",
				"category_name": "熱門好券",
				"display_order": 1,
				"category_id": 0
			},
			{
				"app_icon": "3db308da51510dba3e277c71fcd1ba3e",
				"category_name": "蝦皮優惠",
				"display_order": 2,
				"category_id": 10
			},
			{
				"app_icon": "67449cc8eae79b9401115fee6c7c537c",
				"category_name": "美妝美食",
				"display_order": 4,
				"category_id": 3
			},
			{
				"app_icon": "17d5eedcff494648dbf428a5bae13540",
				"category_name": "女生流行",
				"display_order": 5,
				"category_id": 4
			},
			{
				"app_icon": "8d5499d1e60d96ab007ac3bb8644cd94",
				"category_name": "母嬰居家",
				"display_order": 6,
				"category_id": 5
			},
			{
				"app_icon": "2d9ab3ab1a8dde2e89329c469fd83057",
				"category_name": "3C家電",
				"display_order": 7,
				"category_id": 6
			},
			{
				"app_icon": "525fac09f36a02614f4d5ad60a1fa3c2",
				"category_name": "戶外運動",
				"display_order": 8,
				"category_id": 7
			},
			{
				"app_icon": "d7d4dfbf71878383774e040f54c30761",
				"category_name": "寵物/遊戲",
				"display_order": 9,
				"category_id": 8
			},
			{
				"app_icon": "8d764e662e8b6ae3ff22194a6d425537",
				"category_name": "男生流行",
				"display_order": 10,
				"category_id": 9
			}
		]
	},
	"error_msg": null
});

$done({
	response: {
		status: 200, headers: {
			'server': 'SGW',
			'date': new Date().toUTCString(),
			'content-type': 'application/json; charset=UTF-8',
		}
		, body: rbody
	}
});
