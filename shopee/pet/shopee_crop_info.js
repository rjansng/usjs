
function cookieToString(cookieObject) {
    let string = '';
    for (const [key, value] of Object.entries(cookieObject)) {
        if (key !== 'SPC_EC') { string += `${key}=${value};`; }
    }
    return string;
}
const ShopeeInfo = $persistentStore.read('ShopeeInfo');
let shopeeInfo = !ShopeeInfo || ShopeeInfo.length === 0 ? {} : JSON.parse(ShopeeInfo);
const shopeeCookie = `${cookieToString(shopeeInfo.token)}shopee_token=${shopeeInfo.shopeeToken};`;
const shopeeCSRFToken = shopeeInfo.csrfToken;
//   const shopeeCropToken = $persistentStore.read('ShopeeCropToken') || '';
//   const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
    'Content-Type': 'application/json',
    'Cookie': shopeeCookie,
    // 'X-CSRFToken': shopeeCSRFToken,
};
const harvestRequest = {
    url: 'https://games.shopee.tw/farm/api/orchard/context/get?skipGuidance=0',
    headers: shopeeHeaders,
};
Date.prototype.format = function (format) {
    if (!(format)) format = 'yyyy/MM/dd';
    let o = {
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
    for (let k in o) if (new RegExp("(" + k + ")").test(format))
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
let calDate = function (a, b) {
    //let a = new Date(2022, 10, 1, 5, 6, 7);
    //let b = new Date(2022, 11, 29, 6, 8, 10);
    let y = parseInt((b.getTime() - a.getTime()) / 1000);
    //let f = y % 1000; y -= f; y = y / 1000;
    let s = y % 60; y -= s; y = y / 60;
    let m = y % 60; y -= m; y = y / 60;
    let h = y % 24; y -= h; y = y / 24;
    let d = y;// % 30; y -= d; y = y / 30;
    //let M = y % 12; y -= M; y = y / 12;
    return `${d}天 ${h}時 ${m}分 ${s}秒`;
    //return `${y}年 ${M}月 ${d}天 ${h}時 ${m}分 ${s}秒`;
};

$httpClient.get(harvestRequest, function (error, response, data) {
    //console.log(error);
    //console.log(response);
    if (error) {
        console.log(error);
    } else {
        if (response.status === 200) {
            try {
                const obj = JSON.parse(data);
                //console.log(data);
                //console.log(obj.code);
                if (obj.code === 0) {
                    let crop = obj.data.crops[0];
                    let cropName = crop.meta.name;
                    let totalExp = crop.meta.config.totalExp;
                    let hw = 50 / 3; // water/hour 50w/3h
                    let cct = 0, h3 = 0, h2 = 0;
                    let cct2 = 0, h32 = 0, h22 = 0;
                    let cct3 = 0, h33 = 0, h23 = 0;
                    let cct4 = 0, h34 = 0, h24 = 0;

                    console.log(`\n作物名稱：${cropName}`);
                    console.log('\n預估 (系統)：' + (parseInt(crop.meta.config.needDays) > 0 ? (crop.meta.config.needDays) + '天' : (totalExp / 100) + '小時'))
                    console.log('預估 (純澆水400)：' + (Math.ceil((totalExp / hw) * 100) / 100).toString() + '時；\t'
                        + (Math.ceil((totalExp / hw / 24) * 100) / 100).toString() + '天。');
                    {
                        cct = 0, h3 = 0, h2 = 0;
                        while (cct < totalExp) {
                            if (h2 == 12) { cct += 470; h2 = 0; } // 470 870
                            else { cct += hw; h3++; h2++; }
                        }
                        cct2 = 0, h32 = 0, h22 = 0;
                        while (cct2 < totalExp) {
                            if (h22 == 12) { cct2 += 880; h22 = 0; } // 880 1280
                            else { cct2 += hw; h32++; h22++; }
                        }
                        cct3 = 0, h33 = 0, h23 = 0;
                        while (cct3 < totalExp) {
                            if (h23 == 12) { cct3 += 1230; h23 = 0; } // 1230 1630
                            else { cct3 += hw; h33++; h23++; }
                        }
                        // cct4 = 0, h34 = 0, h24 = 0;
                        // while (cct4 < totalExp) {
                        //     if (h24 == 12) { cct4 += 1540; h24 = 0; } // 1540 1940
                        //     else { cct4 += hw; h34++; h24++; }
                        // }
                        // console.log('預估 (1940/D)：' + h34 + '時；\t' + (Math.ceil((h34 / 24) * 10) / 10) + '天。\t(20個朋友+2蝦幣300水滴)');
                        console.log('預估 (1630/D)：' + h33 + '時；\t' + (Math.ceil((h33 / 24) * 10) / 10) + '天。\t(20個朋友)');
                        console.log('預估 (1280/D)：' + h32 + '時；\t' + (Math.ceil((h32 / 24) * 10) / 10) + '天。\t(10個朋友)');
                        console.log('預估 ( 870/D)：' + h3 + '時；\t' + (Math.ceil((h3 / 24) * 10) / 10) + '天。\t( 3個朋友)');
                    }
                    let ct = new Date(crop.createTime);
                    let mt = new Date(crop.modifyTime);
                    let st = new Date(crop.selfWaterTime);
                    let isHarvest = true;
                    //console.log(crop.meta.config,crop.meta.status);
                    if (crop.state == 102 || crop.state == 101) {
                        console.log('作物已收成。');
                    }
                    else if (crop.state == 100) {
                        console.log('作物已經可以收成。');
                    }
                    else {
                        isHarvest = false;
                        let cl = crop.meta.config.levelConfig[`${crop.state}`];
                        //console.log(cl);
                        console.log(`\n第 ${crop.state} 階段，水量 ${cl.exp - crop.exp}/${cl.exp}`);
                        let cl1 = crop.meta.config.levelConfig['1'];
                        let cl2 = crop.meta.config.levelConfig['2'];
                        let cl3 = crop.meta.config.levelConfig['3'];
                        let cc = 0;
                        if (crop.state > 1) { cc += cl1.exp; }
                        if (crop.state > 2) { cc += cl2.exp; }
                        cc += crop.exp;
                        // console.log('\n總需水量：' + totalExp);
                        // console.log('已澆：' + cc);
                        // console.log('還需：' + (totalExp - cc));
                        console.log(`\n目前水量 : ${cc}/${(totalExp - cc)}/${totalExp}`);
                        let needW = totalExp - cc;

                        cct = cc, h3 = 0, h2 = 0; ii = 0;
                        while (cct < totalExp) {
                            if (h2 == 12) { if (ii > 0) { cct += 470; } ii++; h2 = 0; }
                            else { cct += hw; h3++; h2++; }
                        }
                        cct2 = cc, h32 = 0, h22 = 0; ii = 0;
                        while (cct2 < totalExp) {
                            if (h22 == 12) { if (ii > 0) { cct2 += 880; } ii++; h22 = 0; }
                            else { cct2 += hw; h32++; h22++; }
                        }

                        // console.log('\n預估還需時間 (純澆水)：' + (Math.ceil((needW / 16) * 100) / 100).toString() + '時；\t'
                        //     + (Math.ceil((needW / 16 / 24) * 100) / 100).toString() + '天。');
                        console.log('\n預估還需時間 (1280/D)：' + h32 + '時；\t' + (Math.ceil((h32 / 24) * 10) / 10) + '天。');
                        console.log('預估還需時間 ( 870/D)：' + h3 + '時；\t' + (Math.ceil((h3 / 24) * 10) / 10) + '天。');
                    }

                    console.log('\n種植時間：' + ct.format('yyyy/MM/dd hh:mm:ss'));
                    console.log('澆水時間：' + st.format('yyyy/MM/dd hh:mm:ss'));
                    console.log('異動時間：' + mt.format('yyyy/MM/dd hh:mm:ss'));
                    let cdays = parseInt((st.getTime() - ct.getTime()) / 1000 / 60 / 60 / 24 * 100) / 100;
                    console.log('\n作物時間：' + cdays + '天；\t' + calDate(ct, st));
                    if (!isHarvest) {
                        let cdays2 = cdays + (Math.ceil((h32 / 24) * 10) / 10);
                        console.log('作物時間 (1280/D)：' + cdays2 + '天');
                        let cdays3 = cdays + (Math.ceil((h3 / 24) * 10) / 10);
                        console.log('作物時間 ( 870/D)：' + cdays3 + '天');
                    }
                }
            } catch (error) {
                console.log('ERR:' + error);
            }
        } else {
            console.log(response.status);
        }
    }
    //    $done({});
});

