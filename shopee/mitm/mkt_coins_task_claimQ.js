let caption = '每日任務 領任務蝦幣 Req';
let title = '💰我的蝦幣 ' + caption;
const version = 'v20230615';

var body = $request.body;
var json = JSON.parse(body);
console.log(json);

json.datetime = new Date().getTime();
$persistentStore.write(JSON.stringify(json), 'mkt_coins_task_claim');
$done({});
