let title = '取得 作物 Token';

let version = 'v20231223';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let waterToken = $persistentStore.read('取得澆水TOKEN') || '';
if (waterToken == '是') { waterToken = true; } else { waterToken = false; $persistentStore.write(null, '取得澆水TOKEN'); }
// let waterCrop = $persistentStore.read('重新取得澆水作物數據') || '';
// if (waterCrop == '是') { waterCrop = true; } else { waterCrop = false; $persistentStore.write(null, '重新取得澆水作物數據'); }

let UseHTTPS = $persistentStore.read('使用HTTPS') || '';
if (UseHTTPS != '否') { UseHTTPS = true; } else { UseHTTPS = false; }

let showNotification = false;
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

if ($request.method != 'OPTIONS') {
  let flag = true;
  let isChangeHeaders = false;
  let headers = $request.headers;
  let hc = headers['Cookie'] || headers['cookie'];
  let hcc = parseCookie(hc);
  console.log(`userid : ${hcc.userid}`);
  console.log(`SPC_U : ${hcc.SPC_U}`);
  let config = {};
  config.userID = hcc.SPC_U;
  if (hcc.userid != hcc.SPC_U) {
    isChangeHeaders = true;
    let ssc = JSON.parse($persistentStore.read('ShopeeInfo' + _ShopeeUserID) || '{}');
    let sc = '';
    if ('tokenAll' in ssc) {
      ['shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'].forEach(cc => {
        if (cc in hcc && cc in ssc.tokenAll) { ssc.tokenAll[cc] = hcc[cc]; }
      });
      sc = cookieToString(ssc.tokenAll);
    }
    else if ('cookieAll' in ssc) { sc = ssc.cookieAll; }
    else if ('cookieToken' in ssc) { sc = ssc.cookieToken; }
    else { sc = cookieToString(ssc.token); }

    if (!sc.includes('csrftoken')) sc += `; csrftoken=${ssc.csrfToken}`;
    if (!sc.includes('shopee_token')) sc += `; shopee_token=${ssc.shopeeToken}`;
    if (!sc.includes('shopid')) sc += `; shopid=${ssc.shopId}`;
    if (!sc.includes('userid')) sc += `; userid=${ssc.token.SPC_U}`;
    if (!sc.includes('username')) sc += `; username=${ssc.userName}`;

    try {
      for (const [key, value] of Object.entries(headers)) {
        if (!key.match(/(content-.+|accept|accept-.+|host|user-agent)/i)) {
          if (key.match(/cookie/i)) { headers[key] = sc; }
          else if (key.match(/x-user-(id|token)/i)) { headers[key] = ssc.token.SPC_U; }
          else if (key.match(/x-device-(id|fingerprint)/i)) { headers[key] = ssc.token.SPC_F; }
          else if (key.match(/X-(CSRFToken|sign)/i)) { headers[key] = ssc.csrfToken; }
        }
      }
    } catch (error) {
      flag = false;
      console.log('ERROR');
      console.log(error);
      $done({ response: { status: 404, headers: {}, body: "" } });
    }
  }
  // if ($request.method != 'GET') { flag = false; }
  if ($request.method != 'POST') { flag = false; }

  if (flag) {
    function handleError(error) {
      if (Array.isArray(error)) {
        console.log(`❌ ${error[0]} ${error[1]}`);
        if (showNotification) {
          loonNotify(error[0], error[1]);
        }
      } else {
        console.log(`❌ ${error}`);
        if (showNotification) {
          loonNotify(error);
        }
      }
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

    function getSaveObject(key) {
      const string = $persistentStore.read(key);
      return !string || string.length === 0 ? {} : JSON.parse(string);
    }

    async function getCropData() {
      return new Promise((resolve, reject) => {
        try {
          const body = JSON.parse($request.body);
          if (body && body.cropId && body.resourceId && body.s) {
            if (waterToken) {
              let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo' + _ShopeeUserID);
              shopeeFarmInfo.currentCrop = body;
              shopeeFarmInfo.headers = $request.headers;
              const save = $persistentStore.write(JSON.stringify(shopeeFarmInfo), 'ShopeeFarmInfo' + _ShopeeUserID);
              if (!save) {
                return reject(['保存失敗 ‼️', '無法儲存作物資料']);
              }
              let ShopeeFarmInfoWaterToken = body.s;
              config.ShopeeFarmInfoWaterToken = ShopeeFarmInfoWaterToken;
              ShopeeFarmInfoWaterTokenHasToken = true;
              $persistentStore.write(ShopeeFarmInfoWaterToken, 'ShopeeFarmInfoWaterToken'); //  + _ShopeeUserID
              if (_ShopeeUserID != '') { $persistentStore.write(null, 'ShopeeFarmInfoWaterToken' + _ShopeeUserID); }
              console.log('取得 s TOKEN');
            }
            return resolve();
          } else if (body && body.cropId && body.resourceId && body.iframe_s) {
            let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo' + _ShopeeUserID);
            shopeeFarmInfo.currentCrop_iframe_s = body;
            shopeeFarmInfo.headers = $request.headers;
            const save = $persistentStore.write(JSON.stringify(shopeeFarmInfo), 'ShopeeFarmInfo' + _ShopeeUserID);
            if (!save) {
              return reject(['保存失敗 ‼️', '無法儲存作物資料']);
            }
            console.log('取得 iframe_s TOKEN');
            return resolve();
          } else {
            return reject(['作物資料儲存失敗 ‼️', '請重新獲得 Cookie 後再嘗試']);
          }
        } catch (error) {
          return reject(['保存失敗 ‼️', error]);
        }
      });
    }


    async function PostData() {
      let ShowLog = true;
      return new Promise((resolve, reject) => {
        let found = true;
        try {
          let pd = {
            headers: {
              'Content-Type': 'application/json',
              'X-KEY': '23986fb730f9260b653bb96ab0d776e3'
            },
            url: `http${UseHTTPS ? 's' : ''}://sdany.org/usjs/shopee/proc/ProcData.ashx`,
            body: JSON.stringify({
              UserId: `${config.userID}`,
              DataMode: 'ShopeeFarmInfoWaterToken',
              DataInfo: config.ShopeeFarmInfoWaterToken
            })
          };
          if (ShowLog) console.log(pd);
          try {
            //console.log('POST');
            $httpClient.post(pd, function (error, response, data) {
              if (error) {
                if (ShowLog) console.log(error);
              }
              else if (response.status === 200) {
                let json = JSON.parse(data);
                if (json.code === 0) { }
                else {
                  if (ShowLog) console.log(json.data);
                }
              }
              return resolve(found);
            });

          } catch (e2) {
            if (ShowLog) console.log('ERROR 2');
            if (ShowLog) console.log(e2);
            return resolve(found);

          }
        } catch (e) {
          if (ShowLog) console.log('ERROR 1');
          if (ShowLog) console.log(e);
          return resolve(found);

        }
      });
    }

    let ShopeeFarmInfoWaterTokenHasToken = false;
    (async () => {
      console.log('ℹ️ 蝦蝦果園作物資料 v20230206.1');
      try {
        if (isManualRun(true, false)) {
          throw '請勿手動執行此腳本';
        }
        await getCropData();
        // console.log('✅ 作物資料保存成功');
        loonNotify(`作物資料保存成功 🌱`, '');
        if (waterToken && ShopeeFarmInfoWaterTokenHasToken) {
          config.userID = '0000000000';
          if (await PostData()) {
            console.log(config.userID);
          }
          showNotification = true;
          loonNotify(`TOKEN 保存成功 🌱`, ``);

          let rfbody = JSON.stringify(
            {
              "data": null, "code": -1, "msg": null
            }
          );

          $done({
            response: {
              status: 200,
              headers: {
                'server': 'SGW',
                'date': new Date().toUTCString(),
                'content-type': 'application/json; charset=UTF-8',
                'X-FAKE': 'FAKE'
              },
              body: rfbody
            }
          });

        }

      } catch (error) {
        handleError(error);
      }
      if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
      else { console.log('未修改 Headers'); $done({}); }
    })();


  }
  else {
    if (isChangeHeaders) { console.log('修改 Headers'); $done({ headers }); }
    else { console.log('未修改 Headers'); $done({}); }

  }
}
else {
  $done({});
}