// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '水滴任務 打卡';
const title = '🍤 蝦蝦果園' + caption;
const version = 'v20240201';
let showNotification = true;
let needLastNotify = true;
let showLog = true;
let config = null;
let dataList = [];
const NotShowNotification = $persistentStore.read('NotShowNotification'); if (NotShowNotification) { showNotification = false; }
const NotShowLog = $persistentStore.read('ShowLog'); if (NotShowLog) { showLog = false; }
function getRnd(len = 16) { return (Math.random() * 10 ** 20).toFixed(0).substring(0, len); }
function getToken() { return (new Date()).getTime().toString(); }
function loonNotifyArray(m) { if (Array.isArray(m)) { loonNotify(m[0], m[1]); } else { loonNotify(m); } };
function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };
function handleError(error) {
  let sl = showLog; showLog = false; let msg = '❌';
  if (Array.isArray(error)) {
    for (let i = 0; i < error.length; i++) {
      const e = error[i]; msg += (i > 1 ? '\n' : ' ') + `${e}`;
    }
  }
  else { msg += ` ${error}`; }
  console.log(msg); loonNotifyArray(error); showLog = sl;
}

function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
}

function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    string += `${key}=${value};`
  }
  return string;
}

Date.prototype.format = function (format = '1') {
  if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.fff'; }
  else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
  else if (format === '2') { format = 'yyyy/MM/dd'; }
  else if (format === '3') { format = 'HH:mm:ss'; }
  else if (format === '4') { format = 'MM/dd'; }
  else if (format === '5') { format = 'HH:mm'; }
  let o = {
    "M+": this.getMonth() + 1, //month  
    "d+": this.getDate(),    //day  
    "h+": this.getHours(),   //hour  
    "H+": this.getHours(),   //hour  
    "m+": this.getMinutes(), //minute  
    "s+": this.getSeconds(), //second  
    "q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
    "f+": this.getMilliseconds(),  //millisecond  
    "S": this.getMilliseconds() //millisecond  
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o) if (new RegExp("(" + k + ")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length === 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
};

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '沒有新版 token']);
    }
    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

async function checkIn() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://games.shopee.tw/farm/api/task/action?t=' + new Date().getTime(),
        headers: config.shopeeHeaders,
        body: { actionKey: 'act_Check_In' },
      };
      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['打卡失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            // console.log(obj);
            if (obj.msg === 'success') {
              if (obj.data.hasNextCheckIn) {
                config.msg = `NEXT: ${(new Date(obj.data.nextCheckInTime * 1000)).format('3')}`;
              }
              return resolve();
            } else if (obj.msg === 'false') {
              return reject(['打卡失敗 ‼️', '每日只能打卡三次，今日已完成打卡任務']);
            } else if (obj.msg === 'task check in invalid time') {
              return reject(['打卡失敗 ‼️', '打卡間隔少於三小時']);
            } else {
              return reject(['打卡失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['打卡失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['打卡失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園自動打卡 v20230115.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    config.msg = '';
    await checkIn();
    console.log('✅ 打卡成功');

    try {
      let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
      let tsn = 'farm' + 's';
      let tsid = 'CI';
      let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
      let tasks = JSON.parse(rs);
      let ts = {}, s = {};
      if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
      if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
      if (s.c === 0 && s.s === 0 && !s.f) { s.s = 3; }
      s.c++;
      if (s.s > 0) { s.s--; }
      s.f = s.c > 0 && s.s === 0;
      s.r = config.msg;
      ts[tsid] = s;
      tasks[tsn] = ts;
      $persistentStore.write(JSON.stringify(tasks), dataName);
    } catch (e) { console.log(e); }

    loonNotify('打卡成功 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
