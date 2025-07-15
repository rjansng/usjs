// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '免費道具';
const title = '🍤 蝦蝦果園' + caption;
const version = 'v20230401';
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

let buyFreeItemRequest = null;

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

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '找不到 token']);
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

async function getWaterStoreItem() {
  return new Promise((resolve, reject) => {
    try {
      const waterStoreItemListRequest = {
        // Type=1 道具商店
        // Type=2 免費水滴商店 
        url: `https://games.shopee.tw/farm/api/prop/list?storeType=1&typeId=&isShowRevivalPotion=true&t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
      };
      $httpClient.get(waterStoreItemListRequest, function (error, response, data) {
        if (error) {
          return reject(['取得道具列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const props = obj.data.props;
              let found = false;
              for (const prop of props) {
                if (prop.price === 0) {
                  found = true;
                  if (prop.buyNum < prop.buyLimit) {
                    buyFreeItemRequest = {
                      url: `https://games.shopee.tw/farm/api/prop/buy/v2?t=${new Date().getTime()}`,
                      headers: config.shopeeHeaders,
                      body: {
                        propMetaId: prop.propMetaId,
                      }
                    };
                    return resolve(prop.name);
                  }
                  else {
                    showNotification = false;

                    try {
                      let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
                      let tsn = 'farm' + 's';
                      let tsid = 'K';
                      let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
                      let tasks = JSON.parse(rs);
                      let ts = {}, s = {};
                      if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
                      if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
                      s.c++;
                      s.f = true;
                      s.d.push(`今日已購買免費 ${prop.name}`);
                      ts[tsid] = s;
                      tasks[tsn] = ts;
                      $persistentStore.write(JSON.stringify(tasks), dataName);
                    } catch (e) { console.log(e); }

                    return reject(['沒有可購買的免費道具 ‼️', `本日已購買免費${prop.name}`]);
                  }
                }
              }
              if (!found) {
                showNotification = false;

                try {
                  let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
                  let tsn = 'farm' + 's';
                  let tsid = 'K';
                  let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
                  let tasks = JSON.parse(rs);
                  let ts = {}, s = {};
                  if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
                  if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
                  s.c++;
                  s.f = true;
                  s.d.push(`🚫本日無免費道具`);
                  ts[tsid] = s;
                  tasks[tsn] = ts;
                  $persistentStore.write(JSON.stringify(tasks), dataName);
                } catch (e) { console.log(e); }
                return reject(['取得道具列表失敗 ‼️', '本日無免費道具']);
              }
            } else {
              return reject(['取得道具列表失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['取得道具列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得道具列表失敗 ‼️', error]);
    }
  });
}

async function buyFreeItem() {
  return new Promise((resolve, reject) => {
    try {
      $httpClient.post(buyFreeItemRequest, function (error, response, data) {
        if (error) {
          return reject(['購買道具失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              return resolve();
            }
            else {
              return reject(['購買道具失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['購買道具失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['購買道具失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園免費道具 v20230128.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    const itemName = await getWaterStoreItem();
    console.log('✅ 取得特價商店道具列表成功');
    await buyFreeItem();
    console.log('✅ 購買免費道具成功');
    console.log(`ℹ️ 獲得 ${itemName}`);

    try {
      let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
      let tsn = 'farm' + 's';
      let tsid = 'K';
      let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
      let tasks = JSON.parse(rs);
      let ts = {}, s = {};
      if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
      if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
      s.c++;
      s.f = true;
      s.d.push(`🔆${itemName}`);
      ts[tsid] = s;
      tasks[tsn] = ts;
      $persistentStore.write(JSON.stringify(tasks), dataName);
    } catch (e) { console.log(e); }

    loonNotify(
      '購買免費道具成功 ✅',
      `獲得 👉 ${itemName} 💎`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
