// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

console.log('設定自動「蝦皮泡泡王」玩過');
if ($persistentStore.write('1', 'shopee_puzzle-bobble-be_played' + _ShopeeUserID)) {
  console.log('設定成功。');
}
else {
  console.log('設定失敗。');
}
$done({});