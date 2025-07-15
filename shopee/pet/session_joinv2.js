let hasChange = false;
let body = $response.body;
let jd = null;
try {
    jd = JSON.parse(body);

    let msg = '';
    if ('err_code' in jd && 'data' in jd && jd.err_code == 0 && 'session' in jd.data) {
        // console.log(jd.data);
        hasChange = true;
        let f2 = $persistentStore.read('蝦皮直播過濾影像流') || '';
        console.log('蝦皮直播過濾影像流');
        console.log(f2);
        f2 = !(f2 == '否' || f2 == '偽裝');
        console.log(f2);
        if (f2) {
            console.log(`PLAY_URL: ${jd.data.session.play_url}`);
            jd.data.session.play_url = '';
        }
        let f3 = $persistentStore.read('蝦皮直播淨化內容') || '';
        f3 = f3 != '否';
        console.log(jd);
        if (f3) {
            // jd.data.session.cover_pic = 'http://lo.on/black.png';
            // jd.data.session.avatar = 'http://lo.on/black.png';
            jd.data.session.title = '';
            jd.data.session.username = '';
            jd.data.session.nickname = '';
            jd.data.session.subtitle = '';
            jd.data.session.origin_title = '';
            jd.data.session.description = '';
            jd.data.session.like_cnt = 0;
            jd.data.session.is_seller = false;
            jd.data.session.share_cnt = 0;
            jd.data.session.items_cnt = 0;
        }
        // jd.data.session.play_url = '';
        // jd.data.session.push_url = '';
        jd.data.session.items_cnt = 0;
        // jd.data.share_url = '';
    }

    // $notification.post('蝦皮直播 蝦幣資訊', msg, '', { 'openUrl': '' });
    if (msg != '') { console.log(msg); console.log('\n'); }
    console.log(jd.data);
}
catch (error) {
    console.log(`ERROR: ${error}`);
}

if (hasChange) {
    console.log('Change Data');
    $done({ body: JSON.stringify(jd) });

} else {
    console.log('No Change');
    $done({});
}
