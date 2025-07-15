Date.prototype.format = function (format) {
  if (!(format)) format = 'yyyy/MM/dd';
  var o = {
      "M+": this.getMonth() + 1, //month  
      "d+": this.getDate(),    //day  
      "h+": this.getHours(),   //hour  
      "H+": this.getHours(),   //hour  
      "m+": this.getMinutes(), //minute  
      "s+": this.getSeconds(), //second  
      "q+": parseInt((this.getMonth() + 3) / 3),  //quarter  
      "S": this.getMilliseconds() //millisecond  
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
              ("00" + o[k]).substr(("" + o[k]).length));
  return format;
};
Date.prototype.AddSecond = function (intNum) {
  sdate = new Date(this);
  sdate.setSeconds(sdate.getSeconds() + intNum);
  return sdate;
};
Date.prototype.AddMinute = function (intNum) {
  sdate = new Date(this);
  sdate.setMinutes(sdate.getMinutes() + intNum);
  return sdate;
};
Date.prototype.AddHour = function (intNum) {
  sdate = new Date(this);
  sdate.setHours(sdate.getHours() + intNum);
  return sdate;
};
Date.prototype.AddDay = function (intNum) {
  sdate = new Date(this);
  sdate.setDate(sdate.getDate() + intNum);
  return sdate;
};
Date.prototype.AddMonth = function (intNum) {
  sdate = new Date(this);
  sdate.setMonth(sdate.getMonth() + intNum);
  return sdate;
};
Date.prototype.AddYear = function (intNum) {
  sdate = new Date(this);
  sdate.setFullYear(sdate.getFullYear() + intNum);
  return sdate;
};
var calDate = function (a, b) {
  //var a = new Date(2022, 10, 1, 5, 6, 7);
  //var b = new Date(2022, 11, 29, 6, 8, 10);
  var y = parseInt((b.getTime() - a.getTime()) / 1000);
  //var f = y % 1000; y -= f; y = y / 1000;
  var s = y % 60; y -= s; y = y / 60;
  var m = y % 60; y -= m; y = y / 60;
  var h = y % 24; y -= h; y = y / 24;
  var d = y;// % 30; y -= d; y = y / 30;
  //var M = y % 12; y -= M; y = y / 12;
  return `${d}天 ${h}時 ${m}分 ${s}秒`;
  //return `${y}年 ${M}月 ${d}天 ${h}時 ${m}分 ${s}秒`;
};


var ShopeeCropFake = $persistentStore.read('ShopeeCropFake') || '';
if (ShopeeCropFake != '') {
  var data = ShopeeCropFake;


  const json = JSON.parse(data);
  if (json.code === 0) {
      var crop = json.data.crops[0];
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
          var cct3 = 0; var h33 = 0; var h23 = 0;
          while (cct3 < totalExp) {
              if (h23 == 12) { cct3 += 1170; h23 = 0; }
              else { cct3 += 16; h33++; h23++; } // (60 / 3.6) = 16.66
          }
          var cct4 = 0; var h34 = 0; var h24 = 0;
          while (cct4 < totalExp) {
              if (h24 == 12) { cct4 += 1350; h24 = 0; }
              else { cct4 += 16; h34++; h24++; } // (60 / 3.6) = 16.66
          }
          console.log('預估時間 (1350/D)：' + h34 + '時；\t\t' + (Math.ceil((h34 / 24) * 10) / 10) + '天。');
          console.log('預估時間 (1170/D)：' + h33 + '時；\t\t' + (Math.ceil((h33 / 24) * 10) / 10) + '天。');
          console.log('預估時間 ( 460/D)：' + h32 + '時；\t\t' + (Math.ceil((h32 / 24) * 10) / 10) + '天。');
          console.log('預估時間 ( 340/D)：' + h3 + '時；\t\t' + (Math.ceil((h3 / 24) * 10) / 10) + '天。');
      }
      var ct = new Date(crop.createTime);
      var mt = new Date(crop.modifyTime);
      var st = new Date(crop.selfWaterTime);
      var rewards = json.data.rewards;
      if (rewards.length > 0) {
          console.log('作物狀態待更新。');
      }
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
          var needW = totalExp - cc;

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

      console.log('\n種植時間：' + ct.format('yyyy/MM/dd hh:mm:ss'));
      console.log('澆水時間：' + st.format('yyyy/MM/dd hh:mm:ss'));
      console.log('異動時間：' + mt.format('yyyy/MM/dd hh:mm:ss'));
      var cdays = parseInt((st.getTime() - ct.getTime()) / 1000 / 60 / 60 / 24 * 100) / 100;
      console.log('\n作物時間：' + cdays + '天；\t' + calDate(ct, st));
      var cdays2 = cdays + (Math.ceil((h32 / 24) * 10) / 10);
      console.log('作物時間 (460/D)：' + cdays2 + '天');
      var cdays3 = cdays + (Math.ceil((h3 / 24) * 10) / 10);
      console.log('作物時間 (340/D)：' + cdays3 + '天');
  }

  //console.log('\n' + json.data.crops[0].meta.config.endTime);
  var eDT = new Date(json.data.crops[0].meta.config.endTime);
  json.data.crops[0].meta.config.endTime = new Date(eDT.setMonth(eDT.getMonth() + 1)).getTime();
  //console.log('\n' + json.data.crops[0].meta.config.endTime);

  var body = JSON.stringify(json);

  console.log('\n模擬作物成功。');

  $done({ body });

}
else {
  console.log('無作物資料，請先取得作物。');
}
$done({});

