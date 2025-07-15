let title = '取得 果園廣告商店 Token';

let version = 'v20230710';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }

// let showNotification = true;
// let showLog = true;
// function loonNotify(subtitle = '', message = '', url = 'shopeetw://') {
//   if (showNotification) {
//     $notification.post(title, subtitle, message, { 'openUrl': url });
//   }
//   if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); }
// };
// function parseCookie(cookieString) {
//   return cookieString
//     .split(';')
//     .map(v => v.split('='))
//     .filter((v) => v.length > 1)
//     .reduce((acc, v) => {
//       let value = decodeURIComponent(v[1].trim());
//       for (let index = 2; index < v.length; index++) {
//         if (v[index] === '') {
//           value += '=';
//         }
//       }
//       acc[decodeURIComponent(v[0].trim())] = value;
//       return acc;
//     }, {});
// }
// function cookieToString(cookieObject) {
//   let string = ''; for (const [key, value] of Object.entries(cookieObject)) {
//     if (string != '') { string += '; '; }
//     string += `${key}=${value}`;
//   } return string;
// }
// function getSaveObject(key) {
//   const string = $persistentStore.read(key);
//   return !string || string.length === 0 ? {} : JSON.parse(string);
// }

// if ($request.method != 'OPTIONS') {
//   let flag = true;
//   let headers = $request.headers;
//   let hc = headers['Cookie'] || headers['cookie'];
//   let hcc = parseCookie(hc);
//   console.log(`userid : ${hcc.userid}`);
//   console.log(`SPC_U : ${hcc.SPC_U}`);

//   if (hcc.userid != hcc.SPC_U) {
//     let ssc = JSON.parse($persistentStore.read('ShopeeInfo' + _ShopeeUserID) || '{}');
//     let sc = '';
		if ('tokenAll' in ssc) {
			['shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'].forEach(cc => {
				if (cc in hcc && cc in ssc.tokenAll) { ssc.tokenAll[cc] = hcc[cc]; }
			});
			sc = cookieToString(ssc.tokenAll);
		}
		else if ('cookieAll' in ssc) { sc = ssc.cookieAll; }
		else if ('cookieToken' in ssc) { sc = ssc.cookieToken; }
		else { sc = cookieToString(ssc.token); }

//     sc += `; csrftoken=${ssc.csrfToken}`;
//     sc += `; shopee_token=${ssc.shopeeToken}`;
//     if (ssc.hasOwnProperty('shopId')) { sc += `; shopid=${ssc.shopId}`; }
//     sc += `; userid=${ssc.token.SPC_U}`;
//     sc += `; username=${ssc.userName}`;

//     try {
//       for (const [key, value] of Object.entries(headers)) {
//         if (!key.match(/(content-.+|accept|accept-.+|host|user-agent)/i)) {
//           if (key.match(/cookie/i)) { headers[key] = sc; }
//           else if (key.match(/x-user-(id|token)/i)) { headers[key] = ssc.token.SPC_U; }
//           else if (key.match(/x-device-(id|fingerprint)/i)) { headers[key] = ssc.token.SPC_F; }
//           else if (key.match(/X-(CSRFToken|sign)/i)) { headers[key] = ssc.csrfToken; }
//         }
//       }
//     } catch (error) {
//       flag = false;
//       console.log('ERROR');
//       console.log(error);
//       $done({ response: { status: 404, headers: {}, body: "" } });
//     }
//   }
//   // if ($request.method != 'GET') { flag = false; }
//   // if ($request.method != 'POST') { flag = false; }

//   if (flag) {
    let UseUserIdMITM = $persistentStore.read('UseUserIdMITM') || '';
    console.log(UseUserIdMITM);
    if (ShopeeUserID != '' && UseUserIdMITM != '1') {
      $done({ response: { status: 404, headers: {}, body: "" } });
    }
    else {

      let showNotification = true;

      function surgeNotify(subtitle = '', message = '') {
        $notification.post('🍤 蝦蝦果園道具商店 token', subtitle, message, { 'openUrl': 'shopeetw://' });
      };

      function handleError(error) {
        if (Array.isArray(error)) {
          console.log(`❌ ${error[0]} ${error[1]}`);
          if (showNotification) {
            surgeNotify(error[0], error[1]);
          }
        } else {
          console.log(`❌ ${error}`);
          if (showNotification) {
            surgeNotify(error);
          }
        }
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

      async function getToken() {
        return new Promise((resolve, reject) => {
          try {
            const body = JSON.parse($request.body);
            if (body && body.s) {
              let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo' + _ShopeeUserID);
              shopeeFarmInfo.groceryStoreToken = body.s;
              const save = $persistentStore.write(JSON.stringify(shopeeFarmInfo, null, 4), 'ShopeeFarmInfo' + _ShopeeUserID);
              if (!save) {
                return reject(['保存失敗 ‼️', '無法儲存 token']);
              } else {
                return resolve();
              }
            } else {
              return reject(['作物資料儲存失敗 ‼️', '請重新獲得 Cookie 後再嘗試']);
            }
          } catch (error) {
            return reject(['保存失敗 ‼️', error]);
          }
        });
      }

      (async () => {
        console.log('ℹ️ 蝦蝦果園取得道具商店 token v20230125.1');
        try {
          if (isManualRun(true, false)) {
            throw '請勿手動執行此腳本';
          }
          await getToken();
          console.log(`✅ 道具商店 token 保存成功`);
          surgeNotify('保存成功 ✅', '');
        } catch (error) {
          handleError(error);
        }
        $done({ headers });
      })();
    }


//   }
//   else {
//     $done({ headers });
//   }
// }
// else {
//   $done({});
// }
