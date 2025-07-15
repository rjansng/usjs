let hasChange = false;
let body = $response.body;
let jd = null;
try {
    jd = JSON.parse(body);

    let msg = '';
    if ('err_code' in jd && 'data' in jd && jd.err_code == 0 && 'list' in jd.data) {
        let ct = $persistentStore.read('蝦皮直播顯示為你推薦') || '';
        // console.log(ct);
        if (ct == '否') { ct = false; } else { ct = true; }
        if (ct) {
            hasChange = true;
            // jd.data.list = [];
            // jd.data.has_more = false;
            // jd.data.next_offset = 0;
            let jb = {};
            $done({ response: { status: 200, body: JSON.stringify(jb) } });
        }
    }
    else { console.log(jd); }

    // $notification.post('蝦皮直播 蝦幣資訊', msg, '', { 'openUrl': '' });
    if (msg != '') { console.log(msg); console.log('\n'); }
    // console.log(jd);
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
