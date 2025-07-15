let version = 'v20231223';
let headers = $response.headers;
let ct = headers['content-type'] || headers['Content-Type'];
let body = $response.body;
let hasChange = false;
let jd = null;
try {
    if (ct.match(/\/json/i)) {
        jd = JSON.parse(body);
        let showJD = false;
        let msg = '';
        let url = $request.url;
        if (url.match(/.+\/coin\/user_config.+/i)) {
            if ('coins_per_claim' in jd.data && jd.data.coins_per_claim > 0) {
                msg += ' 蝦幣: ';
                msg += jd.data.coins_per_claim; // 單次可領蝦幣數
                msg += ' / ';
                msg += parseFloat((jd.data.coins_per_claim * jd.data.claim_times_left).toFixed(2));
                msg += ' 等待: ';
                msg += jd.data.required_watch_time; // 等待秒數
                msg += '秒';
                if (jd.data.remain_locks == 0) { msg += ' 已結束'; } //  有多少lock數量
                if (jd.data.claim_times_left == 0) { msg += ' 已領完'; } // 可領次數

                $persistentStore.write(JSON.stringify(jd.data), 'ShopeeLiveCoin');

                // if (jd.data.claim_times_left > 6) {
                //     $notification.post('蝦皮直播 蝦幣資訊', msg, '', { 'openUrl': '' });
                // }
                /*
                can_claim 是否可領
                */

            }
            else {
                $persistentStore.write(null, 'ShopeeLiveCoin');
            }
            showJD = true;
        }
        else if (url.match(/.+\/coin\/lock/i)) {
            if ('require_wait_time' in jd.data) {
                // let wait_time = parseInt($persistentStore.read('蝦皮直播等待秒數測試') || '0');
                // console.log(wait_time);
                // if (wait_time > 0) {
                //     hasChange = true;
                //     jd.data.require_wait_time = wait_time * 60;
                // } else if (wait_time < 0 && jd.data.require_wait_time > 360) {
                //     hasChange = true;
                //     jd.data.require_wait_time -= 60;
                // }
                console.log(`鎖定成功，需等待 ${jd.data.require_wait_time} 秒`);
                $persistentStore.write(null, '蝦皮直播等待秒數測試'); // 待移除
            }
            else {

            }
        }
        else {
            showJD = true;
        }

        if (msg != '') { console.log(msg); console.log('\n'); }
        if (showJD) {
            console.log('Body Data');
            console.log(jd);
        }

    }
}
catch (error) {
    console.log(`ERROR: ${error}`);
    console.log(body);
}

if (hasChange) {
    console.log('Change Data');
    $done({ body: JSON.stringify(jd) });

} else {
    console.log('No Change');
    $done({});
}
