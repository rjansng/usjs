function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    if (key !== 'SPC_EC') { string += `${key}=${value};`; }
  }
  return string;
}
const ShopeeInfo = $persistentStore.read('ShopeeInfo');
let shopeeInfo = !ShopeeInfo || ShopeeInfo.length === 0 ? {} : JSON.parse(ShopeeInfo);
const shopeeCookie = `${cookieToString(shopeeInfo.token)}SPC_EC=${shopeeInfo.spcEc};shopee_token=${shopeeInfo.shopeeToken};`;
const shopeeCSRFToken = shopeeInfo.csrfToken;

const shopeeHeaders = {
  'Content-Type': 'application/json',
  'Cookie': shopeeCookie,
};
const harvestRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/context/get?skipGuidance=0',
  headers: shopeeHeaders,
};
console.log('取得作物中');

$httpClient.get(harvestRequest, function (error, response, data) {
  if (error) {
    console.log(error);
  } else {
    if (response.status === 200) {
      var s = $persistentStore.write(data, 'ShopeeCropFake');
      if (s) { console.log('儲存作物成功。'); }
      try {
        const obj = JSON.parse(data);
        if (obj.code === 0) {
          var crop = obj.data.crops[0];
          var cropName = crop.meta.name;
          var totalExp = crop.meta.config.totalExp;

          console.log(`\n作物名稱：${cropName}`);
          console.log('\n預估時間 (系統)：' + (parseInt(crop.meta.config.needDays) > 0 ? (crop.meta.config.needDays) + '天' : (totalExp / 100) + '小時'))
          console.log('預估時間 (純澆水)：' + (Math.ceil((totalExp / 16) * 100) / 100).toString() + '時；\t'
            + (Math.ceil((totalExp / 16 / 24) * 100) / 100).toString() + '天。');
          {
            var cct = 0; var h3 = 0; var h2 = 0;
            while (cct < totalExp) {
              if (h2 == 12) { cct += 340; h2 = 0; }
              else { cct += 16; h3++; h2++; } // (60 / 3.6) = 16.66
            }
            var cct2 = 0; var h32 = 0; var h22 = 0;
            while (cct2 < totalExp) {
              if (h22 == 12) { cct2 += 460; h22 = 0; }
              else { cct2 += 16; h32++; h22++; } // (60 / 3.6) = 16.66
            }
            console.log('預估時間 ( 460/D)：' + h32 + '時；\t\t' + (Math.ceil((h32 / 24) * 10) / 10) + '天。');
            console.log('預估時間 ( 340/D)：' + h3 + '時；\t\t' + (Math.ceil((h3 / 24) * 10) / 10) + '天。');
          }
          var ct = new Date(crop.createTime);
          var mt = new Date(crop.modifyTime);
          var st = new Date(crop.selfWaterTime);
          var rewards = obj.data.rewards;
          if (rewards.length > 0) {
            console.log('作物狀態待更新。');
            //console.log(rewards);
            //console.log('作物已收成。');
            //var ctaUrl = obj.data.rewards.rewardItems[0].itemExtraData.ctaUrl;
            //var luckyDrawAwardName = obj.data.rewards.rewardItems[0].itemExtraData.luckyDrawAwardName;
          }
          //console.log(crop.meta.config,crop.meta.status);
          if (crop.state == 102 || crop.state == 101) {
            console.log('作物已收成。');
          }
          else if (crop.state == 100) {
            console.log('作物已經可以收成。');
          }
          else {
            var cl = crop.meta.config.levelConfig[`${crop.state}`];
            //console.log(cl);
            console.log(`\n作物第 ${crop.state} 階段，還需要 ${cl.exp - crop.exp}/${cl.exp} 水量。`);
            var cl1 = crop.meta.config.levelConfig['1'];
            var cl2 = crop.meta.config.levelConfig['2'];
            var cl3 = crop.meta.config.levelConfig['3'];
            var cc = 0;
            if (crop.state > 1) { cc += cl1.exp; }
            if (crop.state > 2) { cc += cl2.exp; }
            cc += crop.exp;
            console.log('\n總需水量：' + totalExp);
            console.log('已澆：' + cc);
            console.log('還需：' + (totalExp - cc));

            var cct = cc; var h3 = 0; var h2 = 0;
            while (cct < totalExp) {
              if (h2 == 12) { cct += 340; h2 = 0; }
              else { cct += 16; h3++; h2++; }
            }
            var cct2 = cc; var h32 = 0; var h22 = 0;
            while (cct2 < totalExp) {
              if (h22 == 12) { cct2 += 460; h22 = 0; }
              else { cct2 += 16; h32++; h22++; } // (60 / 3.6) = 16.66
            }

            console.log('預估還需時間 (460/D)：' + h32 + '時；\t\t' + (Math.ceil((h32 / 24) * 10) / 10) + '天。');
            console.log('預估還需時間 (340/D)：' + h3 + '時；\t\t' + (Math.ceil((h3 / 24) * 10) / 10) + '天。');
          }
        }
      } catch (error) {
        console.log('ERR:' + error);
      }
    } else {
      console.log(response.status);
    }
  }
  $done({});
});
