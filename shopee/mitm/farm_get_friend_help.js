let title = '取得 果園 幫好友澆水 記錄';
let version = 'v20231204';

let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let showNotification = true;
let showLog = true;
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
  if (showNotification) {
    $notification.post(title, subtitle, message, { 'openUrl': url });
  }
  if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
};
function parseCookie(cookieString) {
  return cookieString
    .split(';')
    .map(v => v.split('='))
    .filter((v) => v.length > 1)
    .reduce((acc, v) => {
      let value = decodeURIComponent(v[1].trim());
      for (let index = 2; index < v.length; index++) {
        if (v[index] === '') {
          value += '=';
        }
      }
      acc[decodeURIComponent(v[0].trim())] = value;
      return acc;
    }, {});
}
function cookieToString(cookieObject) {
  let string = ''; for (const [key, value] of Object.entries(cookieObject)) {
    if (string != '') { string += '; '; }
    string += `${key}=${value}`;
  } return string;
}
function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}
function isManualRun(checkRequest = false, checkResponse = false) {
  if (checkRequest) {
    return typeof $request === 'undefined' || ($request.body && JSON.parse($request.body).foo === 'bar');
  }
  if (checkResponse) {
    return typeof $response === 'undefined' || ($response.body && JSON.parse($response.body).foo === 'bar');
  }
  return false;
}

console.log(`ℹ️ ${title} ${version}`);
if (isManualRun(true, false)) {
  console.log('請勿手動執行此腳本');
}
else {
  try {

    let rbody = $response.body;
    let body = JSON.parse(rbody);
    if ('code' in body && 'data' in body) {
      if (body.code == 0 && 'crop' in body.data) {
        console.log(body.data.crop.userId);

        try {
          let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
          let tsn = 'farm' + 's';
          let tsid = 'E';
          let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
          let tasks = JSON.parse(rs);
          let ts = {}, s = {};
          if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
          if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
          if (s.c == 0 && s.s == 0) { s.s = 10; }
          s.c++;
          if (s.s > 0) { s.s--; }
          if (s.s == 0) { s.f = true; }
          ts[tsid] = s;
          tasks[tsn] = ts;
          $persistentStore.write(JSON.stringify(tasks), dataName);
        } catch (e) { console.log(e); }
      }
    }
  } catch (error) {

  }

}

$done({});