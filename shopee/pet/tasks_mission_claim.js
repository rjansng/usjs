// ver 20230702
let ShopeeUserID = $persistentStore.read('ShopeeUserID') || '';
let _ShopeeUserID = ''; if (ShopeeUserID != '') _ShopeeUserID = `_${ShopeeUserID}`;
if (ShopeeUserID != '') { console.log(ShopeeUserID); }
let UseUserId = $persistentStore.read('UseUserId') || '';
if (UseUserId != '1') { ShopeeUserID = ''; _ShopeeUserID = ''; console.log('使用本機資料。'); }

const caption = '領取任務獎勵';
const title = '🍤 蝦蝦果園' + caption;
const version = 'v20241021';
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

let rewards = [];

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

async function delay(seconds) {
  console.log(`⏰ 等待 ${seconds} 秒`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

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

async function getRewardList() {
  return new Promise((resolve, reject) => {
    try {
      const getListRequest = {
        url: `https://games.shopee.tw/farm/api/task/listV2?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
      };
      $httpClient.get(getListRequest, function (error, response, data) {
        if (error) {
          return reject(['取得列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            const taskGroups = obj.data.userTasks;
            for (let i = 0; i < taskGroups.length; i++) {
              const taskList = taskGroups[i];
              for (let j = 0; j < taskList.length; j++) {
                const task = taskList[j];
                const taskId = task.taskInfo.Id;
                const taskName = task.taskInfo.taskName;
                const taskFinishNum = task.taskFinishNum;
                if (task.canReward === true) {
                  rewards.push({
                    taskId: taskId,
                    taskName: taskName,
                    taskFinishNum: taskFinishNum
                  });
                }
              }
            }

            try {
              let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
              let tsn = 'farm' + 's';
              let tsid = 'TS';
              let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
              let tasks = JSON.parse(rs);
              let ts = {}, s = {};
              if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
              if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
              s.s = rewards.length;
              s.f = s.c > 0 && s.s === 0;
              ts[tsid] = s;
              tasks[tsn] = ts;
              $persistentStore.write(JSON.stringify(tasks), dataName);
            } catch (e) { console.log(e); }

            if (rewards.length) {
              console.log(`✅ 取得列表成功，總共有 ${rewards.length} 個任務可領取獎勵`);
              return resolve();
            }
            else {
              return reject(['取得列表失敗 ‼️', '沒有可領取的獎勵']);
            }
          } else {
            return reject(['取得列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得列表失敗 ‼️', error]);
    }
  });
}

async function claimReward(reward) {
  return new Promise((resolve, reject) => {
    try {
      const taskId = reward.taskId;
      const taskName = reward.taskName;
      const taskFinishNum = reward.taskFinishNum;

      const claimRewardRequest = {
        url: `https://games.shopee.tw/farm/api/task/reward/claim?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
        body: {
          taskId: taskId,
          taskFinishNum: taskFinishNum,
          isNewUserTask: false,
          forceClaim: false,
        },
      };

      $httpClient.post(claimRewardRequest, function (error, response, data) {
        if (error) {
          return reject(['領取失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              console.log(`✅ 領取「${taskName}」成功`);

              try {
                let found = false;
                let tsidT = 'TGX';
                if (taskName.includes('今日打卡3次')) { found = true; tsidT = 'TCI'; }
                else if (taskName.includes('消消樂') && !taskName.includes('蝦幣')) { found = true; tsidT = 'TG1'; }
                else if (taskName.includes('夾夾樂') && !taskName.includes('蝦幣')) { found = true; tsidT = 'TG2'; }
                else if (taskName.includes('寵物村')) { found = true; tsidT = 'TG3'; }
                else if (taskName.includes('泡泡王')) { found = true; tsidT = 'TG4'; }
                else if (taskName.includes('飛刀')) { found = true; tsidT = 'TG5'; }
                else if (taskName.includes('拼拼樂')) { found = true; tsidT = 'TG6'; }
                else if (taskName.includes('幫站內朋友澆水10次')) { found = true; tsidT = 'TE3'; }
                else if (taskName.includes('幫站內朋友澆水3次')) { found = true; tsidT = 'TE2'; }
                else if (taskName.includes('幫站內朋友澆水1次')) { found = true; tsidT = 'TE1'; }
                else if (taskName.includes('收到站內朋友助水10次')) { found = true; tsidT = 'TF3'; }
                else if (taskName.includes('收到站內朋友助水3次')) { found = true; tsidT = 'TF2'; }
                else if (taskName.includes('收到站內朋友助水1次')) { found = true; tsidT = 'TF1'; }
                else if (taskName.includes('消消樂使用蝦幣1次')) { found = true; tsidT = 'TGB1'; }
                else if (taskName.includes('夾夾樂使用蝦幣1次')) { found = true; tsidT = 'TGB2'; }

                let dataName = 'ShopeeGamePlayed' + _ShopeeUserID;
                let tsn = 'farm' + 's';
                let tsid = 'TS';
                let rs = $persistentStore.read(dataName) || '{"gameTime":0}';
                let tasks = JSON.parse(rs);
                let ts = {}, s = {}, sT = {};
                if (tasks.hasOwnProperty(tsn)) { ts = tasks[tsn]; }
                if (ts.hasOwnProperty(tsid)) { s = ts[tsid]; } else { s = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
                if (ts.hasOwnProperty(tsidT)) { sT = ts[tsidT]; } else { sT = { 'c': 0, 'l': 0, 's': 0, 'f': false, 'd': [], 'r': '' }; }
                s.c++;
                if (s.s > 0) { s.s--; }
                s.f = s.c > 0 && s.s === 0;
                s.r += `\n🔆${taskName}`;
                ts[tsid] = s;
                if (found) {
                  sT.c++;
                  sT.f = true;
                  ts[tsidT] = sT;
                }
                tasks[tsn] = ts;
                $persistentStore.write(JSON.stringify(tasks), dataName);
              } catch (e) { console.log(e); }

              return resolve();
            } else if (obj.code === 409004) {
              return reject(['領取失敗 ‼️', `無法領取「${taskName}」。作物狀態錯誤，請檢查是否已收成`]);
            } else {
              return reject(['領取失敗 ‼️', `無法領取「${taskName}」，錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['領取失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['領取失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園領取任務獎勵 v20230119.1');
  try {
    await preCheck();
    await getRewardList();

    for (let i = 0; i < rewards.length; i++) {
      await delay(0.5);
      await claimReward(rewards[i]);
    }
    console.log('✅ 領取所有獎勵')
    loonNotify('已領取所有獎勵 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
