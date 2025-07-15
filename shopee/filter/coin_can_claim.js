let version = 'v20231221';

function telegramNotify(title, subtitle = '', message = '') {
    let TelegramUrl = $persistentStore.read('TelegramUrl') || '';
    if (TelegramUrl != '') {
        let telegramData = { url: TelegramUrl + encodeURIComponent(title + (subtitle != '' ? '\n' : '') + subtitle + (message != '' ? '\n' : '') + message) };
        $httpClient.get(telegramData, function (error, response, data) { });
    }
}
// async function dataPost(dc, item = -1) {
//     return new Promise((resolve, reject) => {
//         try {
//             let msg = `\t🌐 ${dc.title} ...`;
//             if (item >= 0) { msg += ` (${item})`; }
//             console.log(msg);
//             $httpClient.post(dc.dataRequest, function (error, response, data) {
//                 if (error) {
//                     return reject([`${content}失敗 ‼️`, '連線錯誤']);
//                 } else {
//                     if (response.status === 200) {
//                         return resolve(data);
//                     } else {
//                         return reject([`執行失敗 ‼️`, response.status, data]);
//                     }
//                 }
//             });

//         } catch (error) {
//             return reject([`執行失敗 ‼️`, error]);
//         }
//     });
// }

// async function ProcData1(data, dc) {
//     return new Promise((resolve, reject) => {
//         let found = false;
//         let jd = JSON.parse(data);
//         console.log(jd);
//         return resolve(found);
//     });
// }



try {
    let body = $response.body;
    let jb = JSON.parse(body);

    if ('err_code' in jb && 'err_msg' in jb && 'data' in jb && jb.err_code == 0) {
        let msg = '';
        let ShopeeLiveCoin = JSON.parse($persistentStore.read('ShopeeLiveCoin') || '{}');
        if ('coins_per_claim' in ShopeeLiveCoin && ShopeeLiveCoin.coins_per_claim > 0) {
            msg = ` 領 ${ShopeeLiveCoin.coins_per_claim} 蝦幣`;
        }
        else { msg = ' 領蝦幣通知'; }
        let ShopeeLiveCoinClaim = $persistentStore.read('ShopeeLiveCoinClaim');
        if (ShopeeLiveCoinClaim != null) {
            //$persistentStore.write(null, 'ShopeeLiveCoinClaim');
            // console.log(ShopeeLiveCoinClaim.body);
            // console.log('');
            // console.log(ShopeeLiveCoinClaim.headers);
            // console.log('');
            // (async () => {
            //     try {
            //         let dc = {
            //             url: $request.url.replace('/coin/can_claim', '/coin/claim'),
            //             headers: ShopeeLiveCoinClaim.headers,
            //             body: ShopeeLiveCoinClaim.body,
            //             func: ProcData1
            //         };
            //         await dataPost(dc, item).then(data => dc.func(data, dc)).then(r => { flag = r });
            //     } catch (error) {
            //         handleError(error);
            //     }
            // })();
            $persistentStore.write(null, 'ShopeeLiveCoinClaim');
        }
        $persistentStore.write(null, '通知LOON');
        $persistentStore.write(null, '通知TG');

        let nloon = $persistentStore.read('蝦皮直播領蝦幣通知LOON') || '';
        if (nloon == '否') { nloon = false; } else { nloon = true; }
        let ntg = $persistentStore.read('蝦皮直播領蝦幣通知TG') || '';
        if (ntg != '是') { ntg = false; } else { ntg = true; }
        if (ntg) { telegramNotify('蝦皮直播' + msg, ''); }
        else if (nloon) { $notification.post('蝦皮直播' + msg, '', '', { 'openUrl': '' }); }
    }
    // console.log(msg);

    console.log('\n');
    console.log(jb);
}
catch (error) {
    console.log(`ERROR: ${error}`);
}

$done({});