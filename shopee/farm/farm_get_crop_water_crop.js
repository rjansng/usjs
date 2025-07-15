let title = '取得 作物 Crop';

let version = 'v20231129';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let waterCrop = $persistentStore.read('重新取得澆水作物數據') || '';
if (waterCrop == '是') { waterCrop = true; } else { waterCrop = false; $persistentStore.write(null, '重新取得澆水作物數據'); }

let showNotification = false;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
  if (showNotification) {
    $notification.post(title, subtitle, message, { 'openUrl': url });
  }
  if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
};
function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}

let body = $response.body;
if (body) {
  let jb = JSON.parse(body);
  if (waterCrop) {
    if ('code' in jb && 'data' in jb) {
      let ShopeeFarmInfoWaterToken = JSON.parse($persistentStore.read('ShopeeFarmInfoWaterToken' + _ShopeeUserID) || '{"token":[],"body":null}');
      ShopeeFarmInfoWaterToken.body = jb;
      let ShopeeFarmInfoWaterTokenCount = ShopeeFarmInfoWaterToken.token.length;
      $persistentStore.write(JSON.stringify(ShopeeFarmInfoWaterToken), 'ShopeeFarmInfoWaterToken' + _ShopeeUserID);
      loonNotify(`作物 保存成功 🌱`, `Water Token Count: ${ShopeeFarmInfoWaterTokenCount}`);
    }
  }

}

$done({});
