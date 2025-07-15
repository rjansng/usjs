try {
    let url = $request.url;
    let headers = $request.headers;
    let ct = headers['content-type'] || headers['Content-Type'];
    console.log($request.method + '\n');
    if (ct) { console.log(ct + '\n'); }
    if (url.match(/\/play-[^\-\/]+-las\.(livetech|livestream)\.shopee\.tw\/.+/i)) {
        console.log(headers);
        console.log('\n');
    }
    let body = $request.body;
    // if ($request.method == 'POST') { console.log(body); }
    // else {
    if (body) { console.log(body); }
    else { console.log('Not Body'); }
    // }
    let f1 = $persistentStore.read('蝦皮直播過濾聊天室') || '';
    f1 = f1 != '否';
    let f2 = $persistentStore.read('蝦皮直播過濾影像流') || '';
    f2 = !(f2 == '否' || f2 == '偽裝');

    let USE_REJECT_DROP = false;
    let USE_REJECT_DICT = true;
    let USE_REJECT = false;
    let responseSpace = false;
    let fakeJB = {};
    let fakeHeaders = {
        // 'server': 'SGW',
        // 'date': new Date().toUTCString(),
        'Content-Type': 'application/json; charset=utf-8',
        'Connection': 'close',
    };
    if (f1 && url.match(/chatroom-live\.shopee\.tw/i)) {
        // USE_REJECT_DROP = true;
        fakeJB = { "code": 0, "msg": "success", "data": { "message": [], "e2e_message": [], "system": {}, "timestamp": parseInt((new Date().getTime()) / 1000), "poll_interval": 60 } };
    }
    // else if (f2 && url.match(/http:\/\/[^\/]+\/play-[^\-\/]+-las\.livetech\.shopee\.tw\/.+/i)) {
    //     USE_REJECT_DROP = true;
    // }
    // else if (f2 && (url.match(/\/play-[^\.\/]+\.[^\.\/]+\.shopee\.tw\//i))) {
    //     USE_REJECT_DROP = true;
    // }
    else if (f2 && (url.match(/\/play-[^\.\/]+\.[^\.\/]+\.shopee\.[^\/\.]+\//i))) { // (ws|spe|bs)
        USE_REJECT_DROP = true;
    }
    else if (f2 && url.match(/\/play_param\/session/i)) { // 這個會影響 直播影片流 沒擋掉 會出現一直出現網路異常
        // USE_REJECT_DROP = true;
        //responseSpace = true;
    }
    else if (url.match(/\/session\/[^\/]+\/preset_message/i)) {
        fakeJB = { "err_code": 0, "err_msg": "成功", "data": { "messages": [], "interval": 60 } };
    }
    else if (url.match(/\/host\/[^\/]+\/follow/i)) {
        // USE_REJECT_DICT = false;
        fakeJB = { "err_code": 0, "err_msg": "成功", "data": { "followed": true } };
    }
    else if (url.match(/\/popular_play_list\/session/i)) {
        fakeJB = { "err_code": 0, "err_msg": "成功", "data": { "next_offset": 10, "has_more": false, "list": [] } };
    }
    else if (url.match(/\/session\/[^\/]+\/follow\/[^\/]+\/campaign/i)) {
        USE_REJECT = true;
    }
    else if (url.match(/^https:\/\/live\.shopee\.tw\/api\/v1\/.+/i)) {
        let url_filter = [
            '\/homepage\/banner',
            '\/topscroll',
            '\/pop_up\/',
            '\/adspot\/',
            '\/rcmd\/collect',
            '\/popular_play_list\/session',
            '\/host\/[^\/]+\/follow',
            '\/auto_show_item',
            '\/session_list\/refresh_online_session',
        ];
        let url_filter2 = [
            '\/liked_friend',
            '\/follow\/[^\/]+\/campaign',
            '\/more_items.+',
            '\/voucher\/auto_show',
            '\/voucher\/resident',
            '\/sp_items.+',
            '\/sp_items\/noti',
        ];
        if (url_filter.some(uf => { let re = new RegExp(uf, 'i'); if (url.match(re)) { return true; } })) {
            // USE_REJECT_DICT = true;
        }
        else if (url.match(/^.+\/api\/v1\/session\/[^\/]+\/.+/i)
            && url_filter2.some(uf => { let re = new RegExp(uf, 'i'); if (url.match(re)) { return true; } })) {
            // USE_REJECT_DICT = true;
        }
        else {
            USE_REJECT_DICT = false;
        }
    }
    else {
        USE_REJECT_DICT = false;
    }

    if (USE_REJECT_DICT) {
        console.log('FAKE');
        if (responseSpace) {
            $done({ response: { status: 200, headers: fakeHeaders, body: "" } });
        }
        else if (USE_REJECT) {
            console.log('REJECT 404');
            $done({ response: { status: 404, headers: {}, body: "" } });
        }
        else if (USE_REJECT_DROP) {
            console.log('REJECT-DROP');
            $done();
        } else {
            console.log('REJECT-DICT 200');
            $done({ response: { status: 200, headers: fakeHeaders, body: JSON.stringify(fakeJB) } });
        }
    }
    else { $done({}); }
}
catch (error) {
    console.log(`ERROR: ${error}`);
    $done({});
}

