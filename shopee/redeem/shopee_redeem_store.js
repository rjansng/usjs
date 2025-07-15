var isReq = false;
var body = null;
try {
	body = $response.body;
} catch (e) {
	isReq = true;
}
var url = $request.url;
if (isReq) {
	console.log(url);
	if (url.match(/^https:\/\/games\.shopee\.tw\/gameplatform\/api\/v\d\/redeem_store\/item_list\/store\/\d+.+/i)
		&& url.match(/.+appid=.+/i)
		//&& url.match(/.+redeem_store_token=[^=&]+/i)
		//&& url.match(/.+guest=1/i)
		&& url.match(/.+limit=20/i)
		&& url.match(/.+offset=0/i)) {
		$request.url = $request.url.replace(/(.+limit=)20(.+)/i, '$190$2');
		console.log($request.url);
		$done({ url: $request.url });
	} else { $done({}); }
}
if (body) {
	var json = JSON.parse(body);
	// console.log('\n');
	// console.log(body);
	var item_list = json.data.item_list;

	var il = [];
	//for (var i = item_list.length - 1; i >= 0; i--) {
	for (var i = 0; i < item_list.length; i++) {
		console.log(`${(i + 1)}\t類別 : ${item_list[i].item_type}\t\t名稱 : ${item_list[i].name}`);
		if (item_list[i].item_type == 1) //  1 折價券 4  蝦幣   || item_list[i].item_type == 3  兌換券
		{

		}
		else {
			console.log(`數量 : ${item_list[i].left_amount} ${item_list[i].total_amount}`);
			if (item_list[i].item_type == 4) { item_list[i].name += ` (${item_list[i].points_to_redeem})`; }
			try {
				if (item_list[i].item_type == 3) { item_list[i].name += ` (${item_list[i].cost})`; }
				if (item_list[i].item_type == 6) { item_list[i].name += ` (${item_list[i].cost})`; }
			} catch (e) {

			}
			il.push(item_list[i]);
		}
	}

	json.data.item_list = il;
	json.data.total = il.length;

	body = JSON.stringify(json);

	// console.log('\n');
	// console.log(body);

	$done({ body });
}