// https://mall.shopee.tw/userstats_record/record
// https://mall.shopee.tw/userstats_record/batchrecord
// https:\/\/mall\.shopee\.tw\/userstats_record\/batchrecord
let title = 'USERSTATS RECORD';
let caption = '過濾 ' + title;
let version = 'v20230824';

if ($request.method == 'POST') {
	$done({
		response: {
			status: 200,
			headers: {
				'server': 'SGW',
				'date': new Date().toUTCString(),
				'content-type': 'application/octet-stream',
				'alt-svc': 'h3=":443"; ma=2592000',
			}
		}
	});
}
else {
	$done({});
}