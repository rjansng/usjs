let showNotification = true;
let showLog = true;
let title = 'BatchList';
const version = 'v20250529';
function loonNotify(subtitle = '', message = '', url = 'loon://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };

//$persistentStore.write(null, '關閉好康資訊');
let showInfo1 = $persistentStore.read('顯示好康資訊B1') || '';
if (showInfo1 == '是') { showInfo1 = true; } else { showInfo1 = false; }
let showInfo2 = $persistentStore.read('遊戲連結切換') || '';
if (showInfo2 == '是') { showInfo2 = true; } else { showInfo2 = false; }

let body = $response.body;

let json = JSON.parse(body);
//console.log(json);
let b1 = json.data.banners;
let found = [0, 0];
console.log(`${showInfo1 ? '顯示' : '隱藏'} Banner 1`);
console.log(`遊戲連結切換: ${showInfo2}`);
for (let i = 0; i < b1.length; i++) {
	if (!b1[i].hasOwnProperty('banners')) {
		//loonNotify('發現有異。');
		console.log(json.data);
		break;
	}
	console.log(`Banner ${i + 1}`);

	let b2 = b1[i].banners;
	let bb = [];
	for (let j = 0; j < b2.length; j++) {
		let b = b2[j];
		let url = b.navigate_params.url;
		if ((showInfo1 || !showInfo1 && b1.length > 1 && i > 0) && url && (url.match(/^https:\/\/shopee\.tw\/m\//i)
			&& url.match(/.+\.tw\/m\/(knifethrow|collectibles|candyrush|puzzlebubble|[^\/]+game)/i)
			|| url.match(/^https:\/\/games\.shopee\.tw\//i))
			&& !(url.match(/^.+\.tw\/m\/\d+\.\d+\.\d+-USER$/i)
				// || url.match(/^.+\.tw\/m\/kyc$/i)
				// || url.match(/^.+\.tw\/m\/mid-month-sale$/i)
				// || url.match(/^.+\.tw\/m\/NIKEBOD.+$/i)
				|| url.match(/^.+\.tw\/m\/future\.lab\.Wl14BMedWU\.sbd$/i)
				// || url.match(/^.+\.tw\/m\/burgerking$/i)
				// || url.match(/^.+\.tw\/m\/HLkitwat$/i)
				// || url.match(/^.+\.tw\/m\/electronicthree$/i)
				// || url.match(/^.+\.tw\/m\/literature-fiction$/i)
				// || url.match(/^.+\.tw\/m\/coolpcsbd.+$/i)
				// || url.match(/^.+\.tw\/m\/\d{4}[^\/]+$/i)
				// || url.match(/^.+\.tw\/m\/[^\/]+\d{4}$/i)
				// || url.match(/^.+\.tw\/m\/DP-[^\/]+$/i)
			)
		) {
			console.log(`⭕️ ${url}`);
			bb.push(b);
			// if (i === 1) {
			// 	if (url.match(/^.+\/m\/knifethrow$/i)) { found[0] = true; }
			// 	else if (url.match(/^.+\/m\/collectibles$/i)) { found[1] = true; }
			// }
		}
		else {
			console.log(`❌ ${url}`);
		}
	}
	if (i === 1) {
		if (false) {
			if (!found[0]) {
				console.log(`Add knifethrow`);
				console.log(`⭕️ https://shopee.tw/m/knifethrow`);
				bb.push(
					{
						"id": 173249,
						"start": 1677340800,
						"end": 1679759999,
						"banner_image": "https://cf.shopee.tw/file/sg-11134004-23020-o1iswj2dkvnv0c",
						"navigate_params": {
							"config": {},
							"navbar": {
								"multilang_title": "{\"default\":\"積分兌換好禮\",\"en\":\"\",\"zh-Hans\":\"\",\"zh-Hant\":\"積分兌換好禮\"}",
								"title": "積分兌換好禮"
							},
							"url": "https://shopee.tw/m/knifethrow"
						},
						"type": 10001,
						"display": {
							"mobile": true,
							"pc": false
						},
						"banner_image_tall": "",
						"data": {}
					}
				);
			}
			else if (!found[1]) {
				console.log(`Add collectibles`);
				console.log(`⭕️ https://shopee.tw/m/collectibles`);
				bb.push(
					{
						"id": 173635,
						"start": 1678204800,
						"end": 1679155199,
						"banner_image": "https://cf.shopee.tw/file/sg-11134004-23030-z1xmhh9q4cov94",
						"navigate_params": {
							"config": {},
							"navbar": {
								"multilang_title": "{\"default\":\"抽iPhone 14\",\"en\":\"\",\"zh-Hans\":\"\",\"zh-Hant\":\"抽iPhone 14\"}",
								"title": "抽iPhone 14"
							},
							"url": "https://shopee.tw/m/collectibles"
						},
						"type": 10001,
						"display": {
							"mobile": true,
							"pc": false
						},
						"banner_image_tall": "",
						"data": {}
					}
				);
			}
		}
		bb.push(
			{
				"id": 176348,
				"start": 1685548800,
				"end": 1690819199,
				"banner_image": "https://cf.shopee.tw/file/sg-11134004-7qvem-lh8sy9z0rffe44",
				"navigate_params": {
					"config": {},
					"navbar": {
						"multilang_title": "{\"default\":\"貪食蛇\",\"en\":\"\",\"zh-Hans\":\"\",\"zh-Hant\":\"貪食蛇\"}",
						"title": "貪食蛇"
					},
					"url": "https://games.shopee.tw/pet-worms-game/?activity=480d67df44babcaf"
				},
				"type": 10001,
				"display": {
					"mobile": true,
					"pc": false
				},
				"banner_image_tall": "",
				"data": {}
			});
		// bb.push(
		// 	{
		// 		"id": 176348,
		// 		"start": 1685548800,
		// 		"end": 1690819199,
		// 		"banner_image": "https://cf.shopee.tw/file/sg-11134004-7qvem-lh8sy9z0rffe44",
		// 		"navigate_params": {
		// 			"config": {},
		// 			"navbar": {
		// 				"multilang_title": "{\"default\":\"桌上曲棍球\",\"en\":\"\",\"zh-Hans\":\"\",\"zh-Hant\":\"桌上曲棍球\"}",
		// 				"title": "桌上曲棍球"
		// 			},
		// 			"url": "https://games.shopee.tw/pet-crashball/?activity=ab894e82f6d97121"
		// 		},
		// 		"type": 10001,
		// 		"display": {
		// 			"mobile": true,
		// 			"pc": false
		// 		},
		// 		"banner_image_tall": "",
		// 		"data": {}
		// 	});
		// bb.push(
		// 	{
		// 		"id": 176348,
		// 		"start": 1685548800,
		// 		"end": 1690819199,
		// 		"banner_image": "https://cf.shopee.tw/file/sg-11134004-7qvem-lh8sy9z0rffe44",
		// 		"navigate_params": {
		// 			"config": {},
		// 			"navbar": {
		// 				"multilang_title": "{\"default\":\"桌上曲棍球\",\"en\":\"\",\"zh-Hans\":\"\",\"zh-Hant\":\"桌上曲棍球\"}",
		// 				"title": "桌上曲棍球 2"
		// 			},
		// 			"url": "https://games.shopee.tw/pet-crashball/?activity="
		// 		},
		// 		"type": 10001,
		// 		"display": {
		// 			"mobile": true,
		// 			"pc": false
		// 		},
		// 		"banner_image_tall": "",
		// 		"data": {}
		// 	});


		let bb3 = ['\/m\/fruitgame', '\/m\/petgame', '\/pet-worms-game\/.+', '\/pet-crashball\/.+', '\/m\/collectibles', '\/m\/knifethrow'];
		let bb4 = ['\/luckydraw', '\/m\/clawgame', '\/puzzle-?bobble\/', '\/shopeecandy'];
		for (let i = bb3.length; i >= 0; i--) {
			let b = bb3[i];
			let re = new RegExp('^.+' + b + '$', 'i');
			bb.some((x, j) => {
				let url = x.navigate_params.url;
				if (url.match(re)) {
					if (showInfo2 && url.match(/\/m\/petgame/i)) { x.navigate_params.url = 'https://games.shopee.tw/pet/?activity=b711c6148c210f8f&__shp_runtime__=true'; }
					else if (showInfo2 && url.match(/\/m\/fruitgame/i)) { x.navigate_params.url = 'https://games.shopee.tw/farm/?Entrypoint=Gamepage'; }
					// else if (showInfo2 && url.match(/\/m\/collectibles/i)) { }
					// else if (showInfo2 && url.match(/\/m\/knifethrow/i)) { }
					if (showInfo2) { console.log(`\t\tTo ${x.navigate_params.url}`); }
					bb.splice(0, 0, x); bb.splice(j + 1, 1); return true;
				}
			});
		}
		for (let i = bb4.length; i >= 0; i--) {
			let b = bb4[i];
			let re = new RegExp('^.+' + b + '.+$', 'i');
			bb.some((x, j) => {
				let url = x.navigate_params.url;
				if (url.match(re)) {
					// if (showInfo2 && url.match(/\/m\/candyrush/i)) { }
					// else if (showInfo2 && url.match(/\/m\/puzzle-?bubble/i)) { }
					// else if (showInfo2 && url.match(/\/m\/clawgame/i)) { }
					// if (showInfo2) { console.log(`\t\tTo ${x.navigate_params.url}`); }
					bb.push(x); bb.splice(j, 1); return true;
				}
			});
		}
	}
	json.data.banners[i].banners = bb;
}
body = JSON.stringify(json);
// console.log('\n\n' + body);
$done({ body });