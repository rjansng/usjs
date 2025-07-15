let hasChange = false;
let body = $response.body;
let jd = null;
try {
    jd = JSON.parse(body);

    let msg = '';
    if ('err_code' in jd && 'data' in jd && jd.err_code == 0 && 'list' in jd.data) {
        if (jd.data.list.length > 0) {
            let fc1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣1') || '0');
            let fcp1 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.1') || '0');
            let fcp2 = parseInt($persistentStore.read('蝦皮直播過濾蝦幣.2') || '0');
            let fc = fc1 + fcp1 / 10 + fcp2 / 100;
            // console.log(`fc0: ${fc0}`);
            //let fc = parseFloat($persistentStore.read('蝦皮直播過濾蝦幣') || '0');
            $persistentStore.write(null, '蝦皮直播過濾蝦幣');
            console.log(`fc: ${fc}`);

            let ct = $persistentStore.read('蝦皮直播蝦幣標示') || '';
            if (ct == '否') { ct = false; } else { ct = true; }
            if (ct) {
                hasChange = true;
                console.log('蝦皮直播蝦幣標示');
                jd.data.list.forEach(x => {
                    x.item.play_url = '';
                    let isRemove = false;
                    let item_title = '';
                    if ('coins_per_claim' in x.item) {
                        // if (x.item.claims_per_session_per_viewer == 0) { item_title += `已領完 `; }
                        item_title += `${x.item.coins_per_claim}/${x.item.claims_per_session_per_viewer}`;
                        if (x.item.coins_per_claim < fc) { isRemove = true; }
                    }
                    else if (fc > 0) { isRemove = true; }
                    // if (x.item.has_draw) { item_title += `${item_title != '' ? ' ' : ''}抽獎(${x.item.draw_type})`; }
                    // if (x.item.has_voucher) { item_title += `${item_title != '' ? ' ' : ''}優惠券`; }
                    if (isRemove) {
                        // x.item.shop_id = 0;
                        x.item.cover_pic = '';
                        x.item.avatar = '';
                        // x.item.status = 0;
                        x.item.title = '';
                        x.item.username = '';
                        x.item.subtitle = '';
                        x.item.nick_name = '';
                        x.item.real_username = '';
                        x.item.share_url = '';
                        //x.item.endpage_url = '';
                        x.item.origin_title = '';
                        x.item.is_seller = false;

                        x.item.has_voucher = false;
                        x.item.has_streaming_price = false;
                        x.item.has_draw = false;
                        // x.item.ccu = 0;

                        // if (x.streaming_price_timer != null) { x.streaming_price_timer.sp_end_time = x.item.start_time + 1; }
                        if (x.cover_info != null) { x.cover_info.replace_cover = ''; }
                        if (x.session_promotion != null) {
                            x.session_promotion = {
                                "free_shipping": false,
                                "free_shipping_special": false,
                                "flash_sale": false,
                                "cod": false,
                                "streaming_price": false,
                                "ongoing_platform_streaming_price": false
                            }
                        }

                    }
                    // x.item.cover_pic = 'http://lo.on/black.png';
                    // x.item.avatar = 'http://lo.on/black.png';

                    x.item.username = item_title;

                });

                console.log('Sort');
                jd.data.list.sort(function (a, b) {
                    // boolean false == 0; true == 1
                    // console.log(a.item.coins_per_claim);
                    // console.log(b.item.coins_per_claim);
                    // console.log('');
                    if (!('coins_per_claim' in a.item)) { a.item.coins_per_claim = -1; }
                    if (!('coins_per_claim' in b.item)) { b.item.coins_per_claim = -1; }
                    if ('coins_per_claim' in a.item && 'coins_per_claim' in b.item) {
                        return a.item.coins_per_claim - b.item.coins_per_claim;
                    }
                    // else if ('coins_per_claim' in a.item && !('coins_per_claim' in b.item)) { return true; }
                    return false;
                })
                console.log('Reverse');
                jd.data.list.reverse();
            }

        }
    }

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
