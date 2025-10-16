let title = '取得 Cookie Token';
let version = 'v20240115';
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let SimulateUserID = ($persistentStore.read('偽裝的UserID') || '').trim();
if (SimulateUserID != '' && SimulateUserID == 'NULL') { $persistentStore.write(null, '偽裝的UserID'); SimulateUserID = ''; }
if (SimulateUserID != '') { let SUIDs = SimulateUserID.split(' '); ShopeeUserID = SUIDs[0]; }
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserIdMITM = $persistentStore.read('UseUserIdMITM') || '';
console.log(UseUserIdMITM);

let UseHTTPS = $persistentStore.read('使用HTTPS') || '';
if (UseHTTPS != '否') { UseHTTPS = true; } else { UseHTTPS = false; }
Date.prototype.format = function (format = '1') {
	if (format == '0') { format = 'yyyy/MM/dd HH:mm:ss.S'; }
	else if (format == '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
	else if (format == '2') { format = 'yyyy/MM/dd'; }
	else if (format == '3') { format = 'HH:mm:ss'; }
	else if (format == '4') { format = 'MM/dd'; }
	else if (format == '5') { format = 'HH:mm'; }
	let o = {
		"M+": this.getMonth() + 1, //month  
		"d+": this.getDate(),    //day  
		"h+": this.getHours(),   //hour  
		"H+": this.getHours(),   //hour  
		"m+": this.getMinutes(), //minute  
		"s+": this.getSeconds(), //second  
		"q+": parseInt((this.getMonth() + 3) / 3),  //quarter 季
		"S": this.getMilliseconds().toString().padEnd(3, '0') //millisecond  
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

if (ShopeeUserID != '' && UseUserIdMITM != '1') {
  $done({ response: { status: 404, headers: {}, body: "" } });
}
else {

  let showNotification = true;

  function surgeNotify(subtitle = '', message = '') {
    $notification.post('🍤 蝦皮 token', subtitle, message, { 'openUrl': 'shopeetw://' });
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

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
  }

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
  function cookieToString(cookieObject) { let string = ''; for (const [key, value] of Object.entries(cookieObject)) { string += `${key}=${value};` } return string; }

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
        const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];
        const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
        if (cookie) {
          const cookieObject = parseCookie(cookie);
          let shopeeInfo = getSaveObject('ShopeeInfo' + _ShopeeUserID);
          if (typeof (shopeeInfo) == 'string') { shopeeInfo = JSON.parse(shopeeInfo); }
          if (_ShopeeUserID == '') {
            if (shopeeInfo.hasOwnProperty('TokenError')) { delete shopeeInfo.TokenError; }
            $persistentStore.write(null, 'ShopeeTokenError');
          }

          // let cns = ['SPC_SEC_SI', 'REC_T_ID', 'SPC_AFTID', 'SPC_CLIENTID', 'SPC_B_SI'
          //   , 'shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'
          //   , 'csrftoken', 'shopee_token', 'shopid', 'username'
          //   , 'SPC_F', 'SPC_EC', 'SPC_R_T_ID', 'SPC_R_T_IV', 'SPC_SI', 'SPC_ST', 'SPC_T_ID', 'SPC_T_IV', 'SPC_U', 'SPC_DID'];
          let cns = ['SPC_EC', 'SPC_F', 'SPC_DID', 'SPC_R_T_ID', 'SPC_R_T_IV', 'SPC_SI', 'SPC_ST', 'SPC_T_ID', 'SPC_T_IV', 'SPC_U'];
          let cnsALL = ['SPC_SEC_SI', 'REC_T_ID', 'SPC_AFTID', 'SPC_CLIENTID', 'SPC_B_SI'
            , 'shopee_app_version', 'shopee_rn_bundle_version', 'shopee_rn_version'
            , 'csrftoken', 'shopee_token', 'shopid', 'username', 'userid'];
          let tokenInfo = {};
          let tokenInfoALL = {};
          cns.forEach(cn => {
            if (cn in cookieObject && cookieObject[cn] != null) { tokenInfo[cn] = cookieObject[cn]; tokenInfoALL[cn] = cookieObject[cn]; }
            else if (cn in shopeeInfo.token && shopeeInfo.token != null) { tokenInfo[cn] = shopeeInfo.token[cn]; tokenInfoALL[cn] = shopeeInfo.token[cn]; }
            else if ('tokenAll' in shopeeInfo && cn in shopeeInfo.tokenAll && shopeeInfo.tokenAll[cn] != null) { tokenInfoALL[cn] = shopeeInfo.tokenAll[cn]; }
          });
          cnsALL.forEach(cn => {
            if (cn in cookieObject && cookieObject[cn] != null) { tokenInfoALL[cn] = cookieObject[cn]; }
            else if (cn in shopeeInfo.token && shopeeInfo.token != null) { tokenInfoALL[cn] = shopeeInfo.token[cn]; }
            else if ('tokenAll' in shopeeInfo && cn in shopeeInfo.tokenAll && shopeeInfo.tokenAll[cn] != null) { tokenInfoALL[cn] = shopeeInfo.tokenAll[cn]; }
          });

          shopeeInfo.userAgent = ua;
          shopeeInfo.date = Date.now();
          shopeeInfo.date2 = new Date().format('0');
          shopeeInfo.csrfToken = cookieObject.csrftoken;
          shopeeInfo.shopeeToken = cookieObject.shopee_token;
          shopeeInfo.userId = cookieObject.userid;
          shopeeInfo.shopId = cookieObject.shopid;
          shopeeInfo.userName = cookieObject.username;

          shopeeInfo.token = tokenInfo;
          shopeeInfo.tokenAll = tokenInfoALL;
          shopeeInfo.cookieToken = cookieToString(shopeeInfo.token);
          shopeeInfo.cookieAll = cookieToString(shopeeInfo.tokenAll);
          if (!shopeeInfo.cookieAll.includes('shopee_token=')) shopeeInfo.cookieAll += `shopee_token=${shopeeInfo.shopeeToken};`;
          if (!shopeeInfo.cookieAll.includes('csrftoken=')) shopeeInfo.cookieAll += `csrftoken=${shopeeInfo.csrfToken};`;
          if (!shopeeInfo.cookieAll.includes('shopid=')) shopeeInfo.cookieAll += `shopid=${shopeeInfo.shopId};`;
          if (!shopeeInfo.cookieAll.includes('userid=')) shopeeInfo.cookieAll += `userid=${shopeeInfo.token.SPC_U};`;
          if (!shopeeInfo.cookieAll.includes('username=')) shopeeInfo.cookieAll += `username=${shopeeInfo.userName};`;
          if (!shopeeInfo.cookieAll.includes('SPC_EC=')) shopeeInfo.cookieAll += `SPC_EC=${shopeeInfo.token.SPC_EC};`;

          let shopeeHeaders = {
            'Cookie': shopeeInfo.cookieAll,
            'Content-Type': 'application/json',
          }
          let config2 = {
            shopeeHeaders: shopeeHeaders,
            userID: shopeeInfo.token.SPC_U,
          }
          shopeeInfo.config = config2;

          config.userID = cookieObject.SPC_U;
          config.shopeeInfo = shopeeInfo;
          // if (ShopeeUserID != '' && ShopeeUserID != cookieObject.SPC_U) { ShopeeUserID = ''; } // UserId 不同時 用本機
          let save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo' + _ShopeeUserID);
          if (!save) {
            return reject(['保存失敗 ‼️', '無法儲存 token']);
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

  async function PostData() {
    return new Promise((resolve, reject) => {
      let found = true;
      try {
        let pd = {
          headers: {
            'Content-Type': 'application/json',
            'X-KEY': '23986fb730f9260b653bb96ab0d776e3'
          },
          url: `http${UseHTTPS ? 's' : ''}://sdany.org/usjs/shopee/proc/ProcData.ashx1`,
          body: JSON.stringify({
            UserId: `${config.userID}`,
            DataMode: 'ShopeeInfo',
            DataInfo: JSON.stringify(config.shopeeInfo, null, 4)
            //DataInfo: Base64.encode(JSON.stringify(config.shopeeInfo, null, 4))
          })
        };
        //console.log(pd);
        try {
          //console.log('POST');
          $httpClient.post(pd, function (error, response, data) {
            if (error) {
              // console.log(error);
            }
            else if (response.status === 200) {
              let json = JSON.parse(data);
              if (json.code === 0) { }
              else {
                // console.log(json.data);
              }
            }
            return resolve(found);
          });

        } catch (e2) {
          // console.log('ERROR 2');
          // console.log(e2);
          return resolve(found);

        }
      } catch (e) {
        // console.log('ERROR 1');
        // console.log(e);
        return resolve(found);

      }
    });
  }
  async function PostData2() {
    return new Promise((resolve, reject) => {
      let found = true;
      try {
        let pd = {
          headers: {
            'Content-Type': 'application/json',
            'X-KEY': '23986fb730f9260b653bb96ab0d776e3'
          },
          url: `http${UseHTTPS ? 's' : ''}://sdany.org/usjs/shopee/proc/ProcData.ashx1`,
          body: JSON.stringify({
            UserId: `${config.userID}`,
            DataMode: 'ShopeeFarmInfo',
            DataInfo: config.ShopeeFarmInfo
          })
        };
        //console.log(pd);
        try {
          //console.log('POST');
          $httpClient.post(pd, function (error, response, data) {
            if (error) {
              // console.log(error);
            }
            else if (response.status === 200) {
              let json = JSON.parse(data);
              if (json.code === 0) { }
              else {
                // console.log(json.data);
              }
            }
            return resolve(found);
          });

        } catch (e2) {
          // console.log('ERROR 2');
          // console.log(e2);
          return resolve(found);

        }
      } catch (e) {
        // console.log('ERROR 1');
        // console.log(e);
        return resolve(found);

      }
    });
  }

  let config = {};

  (async () => {
    console.log('ℹ️ 蝦皮取得 token v20230213.1');
    try {
      if (isManualRun(true, false)) {
        throw '請勿手動執行此腳本';
      }

      await getToken();
      console.log('✅ token 保存成功');
      surgeNotify('保存成功 🍪', '');

      if (_ShopeeUserID == '') {
        try {
          let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
          let tsn = 'shopee' + 's';
          let tsid = 'ERROR';
          let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
          let tasks = JSON.parse(rs);
          let ts = {}, s = {}
          if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
          if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
          if (s.c > 0) {
            s.c = 0
            s.f = false;
            ts[tsid] = s;
            tasks[tsn] = ts;
            $persistentStore.write(JSON.stringify(tasks), dataName);
          }
        } catch (e) { console.log(e); }

        $persistentStore.write(null, 'ShopeeTokenError');
      }


    } catch (error) {
      handleError(error);
    }
    $done({});
  })();
}