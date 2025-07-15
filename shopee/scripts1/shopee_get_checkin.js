let title = '取得 CheckIn Token';

let version = 'v20231214';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;

let showNotification = true;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮簽到 token', subtitle, message, { 'openUrl': 'shopeetw://' });
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

async function getCheckinPayload() {
  return new Promise((resolve, reject) => {
    try {
      console.log($request.body);
      const payload = JSON.parse($request.body);
      if (payload) {
        let shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
        shopeeInfo.checkinPayload = payload;
        shopeeInfo.checkinPayloadHeaders = $request.headers;
        const save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo' + _ShopeeUserID);
        if (!save) {
          return reject(['保存失敗 ‼️', '無法儲存簽到資料']);
        } else {
          return resolve();
        }
      } else {
        return reject(['保存失敗 ‼️', '請重新登入']);
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

async function postCheckinPayload() {
  return new Promise((resolve, reject) => {
    try {
      console.log($request.body);
      const payload = JSON.parse($request.body);
      if (payload) {
        let shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
        shopeeInfo.checkinPayload = payload;
        shopeeInfo.checkinPayloadHeaders = $request.headers;
        const save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo' + _ShopeeUserID);
        if (!save) {
          return reject(['保存失敗 ‼️', '無法儲存簽到資料']);
        } else {
          return resolve();
        }
      } else {
        return reject(['保存失敗 ‼️', '請重新登入']);
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦皮取得簽到資料 v20230608.1');
  try {
    if (isManualRun(true, false)) {
      throw '請勿手動執行此腳本';
    }

    if (_ShopeeUserID == '') {
      await getCheckinPayload();
      console.log('✅ 簽到資料保存成功');
      surgeNotify('保存成功 🍪', '');
    }
    else {
      // 使用 偽裝資料簽到

      $done({ response: { status: 500, headers: { 'X-FAKE': 'FAKE' }, body: "" } });

    }
  } catch (error) {
    handleError(error);
    console.log('回傳異常');
    $done({ response: { status: 500, headers: { 'X-FAKE': 'FAKE' }, body: "" } });
    //   let rfbody = JSON.stringify(
    //     {
    //         "data": null, "bff_meta": null, "error": 71210052, "error_msg": "failed to finish product feeds task and claim"
    //     }
    // );

    // $done({
    //     response: {
    //         status: 200,
    //         headers: {
    //             'server': 'SGW',
    //             'date': new Date().toUTCString(),
    //             'content-type': 'application/json; charset=UTF-8',
    //             'X-FAKE': 'FAKE'
    //         },
    //         body: rfbody
    //     }
    // });

    //$done(); //中斷執行
    return;
  }
  $done({});
})();
