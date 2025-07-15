let version = 'v20231226';
let headers = $response.headers;
let ct = headers['content-type'] || headers['Content-Type'];
let body = $response.body;
let jd = null;
try {
    if (ct.match(/\/json/i)) {
        jd = JSON.parse(body);
        let showJD = true;
        let msg = '';
        if ('draw' in jd.data) {
            if ('play_info' in jd.data.draw && jd.data.draw.play_info != null) {
                let pi = jd.data.draw.play_info;
                msg += `\n今天剩餘次數: ${pi.daily_play_times}/${pi.daily_play_limit}`;
                // console.log(`總次數: ${jd.data.draw.play_info}`);
            }
            if ('draw_info' in jd.data.draw && jd.data.draw.draw_info != null) {
                let di = jd.data.draw.draw_info;
                msg += '';
                if (di.state == 1 && di.draw_type == 3) {
                    msg += `\n預算: ${parseFloat(di.budget)}\t已發出: ${parseFloat(di.give_out_amount)}`;
                    msg += `\n可轉次數: ${di.play_limit}\t已轉次數: ${jd.data.draw.play_info.play_times}`;
                    let max_coin = 0;
                    if ('prize_info' in di && di.prize_info != null && di.prize_info.length > 0) {
                        di.prize_info.forEach(p => { if (parseFloat(p.amount) > max_coin) { max_coin = parseFloat(p.amount); } })
                    }
                    if (di.start_time > new Date().getTime()) {
                        let waits = ((di.start_time - new Date().getTime()) / 1000).toFixed();
                        let draw_id = $persistentStore.read('蝦皮直播轉盤ID等待');
                        if (draw_id == null || draw_id != di.draw_id.toString() || waits < 20) {
                            draw_id = di.draw_id.toString();
                            $persistentStore.write(draw_id, '蝦皮直播轉盤ID等待');
                            let draw_play = $persistentStore.read('蝦皮直播轉盤通知') || '';
                            if (draw_play != '否') {
                                $notification.post(`蝦幣轉盤 將在 ${waits} 秒後開始`, '', '', { 'openUrl': '' });
                            }
                        }
                    }
                    else {
                        msg += `\n最多 ${max_coin} 蝦幣`;
                        let draw_id = $persistentStore.read('蝦皮直播轉盤ID');
                        if (draw_id == null || draw_id != di.draw_id.toString()) {
                            draw_id = di.draw_id.toString();
                            $persistentStore.write(draw_id, '蝦皮直播轉盤ID');
                            if (di.play_limit - jd.data.draw.play_info.play_times > 0) {
                                let draw_play = $persistentStore.read('蝦皮直播轉盤通知') || '';
                                if (draw_play != '否') {
                                    $notification.post(`蝦幣轉盤 最大 ${max_coin} 蝦幣`, '', '', { 'openUrl': '' });
                                }
                            }
                            // if (di.min_delay_time > 0 || di.max_delay_time > 0) {
                            //     $notification.post(`蝦幣轉盤 ${di.min_delay_time} ${di.max_delay_time}`, '', '', { 'openUrl': '' });
                            // }
                        }
                        $persistentStore.write(null, '蝦皮直播轉盤ID等待');

                    }
                }
                else {
                    $persistentStore.write(null, '蝦皮直播轉盤ID');
                }
                if (di.state != 1) { msg += `狀態: ${di.state == 2 ? '結束' : di.state}`; }
                if (di.draw_type != 3) { msg += `DRAW TYPE: ${di.draw_type}`; }
            }
        }

        if (msg != '') { console.log(msg); console.log('\n'); }
        if (showJD) console.log(jd.data);
    }
}
catch (error) {
    console.log(`ERROR: ${error}`);
    console.log(body);
}

$done({});