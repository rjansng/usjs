// http://sdany.somee.com/usjs/shopee_crop_filter.js
Date.prototype.format = function (format = '1') {
    if (format === '0') { format = 'yyyy/MM/dd HH:mm:ss.fff'; }
    else if (format === '1') { format = 'yyyy/MM/dd HH:mm:ss'; }
    else if (format === '2') { format = 'yyyy/MM/dd'; }
    else if (format === '3') { format = 'HH:mm:ss'; }
    var o = {
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
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  };
  
let body = $response.body;
let json = JSON.parse(body);
let ds2 = [];
let ds = json.data.cropMetas;
console.log(ds.length);
let dn = new Date();
let _dy = dn.getFullYear();
let _dm = dn.getMonth();
let _dd = dn.getDate();
let hw = 50 / 3; // water/hour 50w/3h

for (let j = 0; j < 30; j++) {

    dn = new Date(_dy, _dm, _dd + j);
    let dnd = (dn.getMonth() + 1) + '/' + dn.getDate();
    for (let i = ds.length - 1; i >= 0; i--) {
        let sd = new Date(ds[i].config.startTime);
        let ed = new Date(ds[i].config.endTime);
        let sdd = (sd.getMonth() + 1) + '/' + sd.getDate();
        let edd = (ed.getMonth() + 1) + '/' + ed.getDate();
        if (j === 0) {
          console.log(`${(i + 1).toString().padStart(3, '0')}:${sd.format('4')}-${ed.format('4')},${d.config.totalExp},${d.name}`);
          //console.log(`${(i + 1).toString().padStart(3, '0')}:${sd.format('4')}-${ed.format('4')},${d.rewardMetaVo.type},${d.price != 0 ? 1 : 0},${d.config.totalExp},${d.curNum}/${d.totalNum},${d.name}`);
        }
  
        if (!ds[i].flag && ds[i].price == 0 && sd <= dn && ed >= dn) {
            //if (!(ds[i].price > 0 || sdd != edd) && sdd == dnd) {
            //ds[i].thumbnailText = '(需要 ' + (Math.ceil((ds[i].config.totalExp / (60.0 / 3.6) / 24) * 100) / 100).toString() + ' 天)\n' + ds[i].thumbnailText;
            let needDays = parseFloat(ds[i].config.needDays);
            let totalExp = parseInt(ds[i].config.totalExp);
            if (!ds[i].thumbnailText.includes("天)")) {
                let ii0 = false;
                if (ds[i].thumbnailText.match(/^\d+蝦幣$/i)) { ii0 = true; }
                let cct = 0; let h3 = 0; let h2 = 0; let ii = 0;
                while (cct < totalExp) {
                    if (h2 == 12) { if (ii === 0 && ii0 || ii > 0) { cct += 870; } ii++; h2 = 0; }
                    else { cct += hw; h3++; h2++; }
                }
                // console.log('\n預計還需時間1：' + h3 + '時；' + (Math.ceil((h3 / 24) * 10) / 10) + '天 (依時間水量計算。測試)');

                //ds[i].thumbnailText = (parseInt(needDays) > 0 ? needDays + '天' : (totalExp / 100) + '小時')
                //    + '(預估 ' + (Math.ceil((h3 / 24) * 10) / 10).toString() + ' 天)\n' + ds[i].thumbnailText;
                ds[i].thumbnailText = '(' + (Math.ceil((h3 / 24) * 10) / 10).toString() + '天) ' + ds[i].thumbnailText;
            }
			ds[i].flag = true;
            ds2.push(ds[i]);
        }
    }
}

json.data.cropMetas = ds2;
console.log(ds2.length);
body = JSON.stringify(json);
$done({ body });
