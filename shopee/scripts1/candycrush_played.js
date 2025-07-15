// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

console.log('蝦皮消消樂自動玩過。');

function rnd(len = 16) { return (Math.random() * 10 ** 20).toFixed(0).substring(0, len); }
function getCookie(nnn, v = 0) {
  var sc1 = shopeeCookie.split(nnn + '=');
  var sc2 = ''; var returnData = '';
  if (sc1.length === 2) { sc2 = sc1[1].split(';'); if (sc2.length > 1) { returnData = sc2[0]; } }
  if (v == 0) { returnData = ' ' + nnn + '=' + returnData + ';'; }
  return returnData;
}

function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    if (key !== 'SPC_EC') { string += `${key}=${value};`; }
  }
  return string;
}
const ShopeeInfo = $persistentStore.read('ShopeeInfo' + _ShopeeUserID);
let shopeeInfo = !ShopeeInfo || ShopeeInfo.length === 0 ? {} : JSON.parse(ShopeeInfo);
const shopeeCookie = `${cookieToString(shopeeInfo.token)}shopee_token=${shopeeInfo.shopeeToken};`;
const shopeeCSRFToken = shopeeInfo.csrfToken;


let ShopeeUserID2 = getCookie('SPC_U', 1);
console.log(ShopeeUserID2);

const shopeeHeadersHtml = {
  'Content-Type': 'text/html',
  'Cookie': shopeeCookie,
  // 'x-user-id': ShopeeUserID2,
  // 'X-CSRFToken': shopeeCSRFToken,
};
const shopeeHeaders = {
  'Content-Type': 'application/json',
  'Cookie': shopeeCookie,
  // 'x-user-id': ShopeeUserID2,
  // 'X-CSRFToken': shopeeCSRFToken,
};

var urlStart = 'https://games.shopee.tw/shopeecandy/?smtt=9&deep_and_web=1&activity=1731357eb13431cb';
var urlPost = 'https://games.shopee.tw/api-gateway/candycrush_api/round/add?activityCode=1731357eb13431cb&slotCode=9e1941bb20a51f73';

var dataRequestHtml = {
  url: urlStart,
  headers: shopeeHeadersHtml,
};

var token = (new Date()).getTime().toString();
var dataResponse = {
  url: urlPost,
  headers: shopeeHeaders,
  body: {
    "isFree": 1,
    "isPropGuided": false,
    "marker": token + "_0." + rnd() + "_1672730792831",
    "roundId": 2,
    "propMetaIdList": [],
    "timeLimitPropMetaIdList": [],
    "commonFlag": 2,
    "requestId": "AxJMo8pm7cs5ca7OM8_" + ShopeeUserID2 + "_" + token,
    "isRandom": false
  }
};

function dataGetHtml() {
  console.log('連接遊戲首頁...');
  $httpClient.get(dataRequestHtml, function (error, response, data) {
    if (error) {
      console.log(error);
      console.log(data);
      $done({});
    } else {
      if (response.status === 200) {
        console.log('連接遊戲首頁' + '成功。');
        dataPost();
      } else {
        console.log(response.status);
        console.log(data);
        $done({});
      }
    }
  });
}

function dataPost() {
  console.log('連接遊戲自動玩過...');
  $httpClient.post(dataResponse, function (error, response, data) {
    if (error) {
      console.log(error);
      console.log(data);
      $done({});
    } else {
      if (response.status === 200) {
        try {
          var json = JSON.parse(data);
          if (json.code === 0) {
            console.log('自動玩過' + '成功。');
            console.log(`剩餘次數 : ${json.data.chance}`);
            //console.log(json.data);
            //console.log(json.data);

            try {
              let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
              let tsn = 'candycrush' + 's';
              let tsid = 'C';
              let tsidF = 'D';
              let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
              let tasks = JSON.parse(rs);
              let ts = {}, s = {}, sF = {};
              if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
              if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
              if (ts.hasOwnProperty(tsidF)) { sF = ts[tsidF]; } else { sF = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
              s.c++;
              s.f = s.c > 0;
              sF.c++;
              sF.f = sF.c > 0;
              sF.s = json.data.chance;

              ts[tsid] = s;
              ts[tsidF] = sF;
              tasks[tsn] = ts;
              $persistentStore.write(JSON.stringify(tasks), dataName);
            } catch (e) { console.log(e); }
      
      
          }
          else {
            console.log('自動玩過' + '失敗。' + json.msg);
            console.log(json);
          }
        } catch (error) {
          console.log('ERR:' + error);
          console.log(data);
        }
        $done({});
      } else {
        console.log(response.status);
        console.log(data);
        $done({});
      }
    }
  });
}

//dataGetHtml();
dataPost();
