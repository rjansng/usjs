let rbody =
{
    "error": 0,
    "error_msg": "",
    "data": {
        "update_time": 1706096400,
        "version": "v2",
        "sections": [
            {
                "total": 1,
                "key": "game",
                "index": [{ "data_type": "ads", "key": "ads::0" }],
                "data": {
                    "ads": [
                        {
                            "itemid": 0,
                            "shopid": 0,
                            "name": "",
                            "label_ids": [],
                            "image": "",
                            "images": [],
                            "stock": 14508,
                            "status": 1,
                            "ctime": 1676903975,
                            "sold": 805,
                            "liked_count": 2374,
                            "cmt_count": 0,
                            "flag": 720896,
                            "cb_option": 0,
                            "item_status": "normal",
                            "item_type": 0,
                            "transparent_background_image": "",
                            "currency": "TWD",
                            "brand": "",
                            "global_brand": {
                                "brand_id": 1099594,
                                "display_name": ""
                            },
                            "liked": true,
                            "view_count": 0,
                            "historical_sold": 0,
                            "videos": [],
                            "preview_info": null,
                            "tier_variations": [],
                            "is_cc_installment_payment_eligible": true,
                            "is_non_cc_installment_payment_eligible": false,
                            "price": 0,
                            "price_min": 0,
                            "price_max": 0,
                            "price_before_discount": 0,
                            "price_min_before_discount": -1,
                            "price_max_before_discount": -1,
                            "hidden_price_display": "",
                            "show_discount": 0,
                            "raw_discount": 0,
                            "discount": "",
                            "size_chart": "",
                            "item_rating": {
                                "rating_star": 4.946573124662709,
                                "rating_count": [],
                                "rcount_with_image": 388,
                                "rcount_with_context": 650
                            },
                            "is_adult": false,
                            "is_official_shop": false,
                            "show_free_shipping": false,
                            "is_preferred_plus_seller": true,
                            "is_shopee_verified": true,
                            "badge_icon_type": 0,
                            "is_mart": false,
                            "adsid": 62164583,
                            "campaignid": 41954097,
                            "deduction_info": "",
                            "info": "",
                            "can_use_wholesale": false,
                            "wholesale_tier_list": [],
                            "bundle_deal_info": null,
                            "add_on_deal_info": {
                                "add_on_deal_id": 149376224198658,
                                "add_on_deal_label": "加價購",
                                "sub_type": 0,
                                "status": 1
                            },
                            "exclusive_price_info": null,
                            "is_live_streaming_price": false,
                            "deep_discount_skin": null,
                            "is_on_flash_sale": false,
                            "flash_sale_stock": 0,
                            "voucher_info": null,
                            "item_card_display_price": {
                                "item_id": 22826003259,
                                "model_id": 108039631986,
                                "promotion_type": 0,
                                "promotion_id": 0,
                                "price": 488000000,
                                "strikethrough_price": 0,
                                "discount": 0,
                                "discount_text": ""
                            },
                            "item_card_display_label": null,
                            "video_info_list": [],
                            "shop_name": ""
                        }
                    ]
                },
                "has_more": false,
                "pagination_type": "batch"
            }
        ]
    }
}

    ;

// rbody.data.sections[0].data.ads.push(rbody.data.sections[0].data.ads[0]);
// rbody.data.sections[0].data.ads.push(rbody.data.sections[0].data.ads[0]);
// rbody.data.sections[0].data.ads.push(rbody.data.sections[0].data.ads[0]);
// rbody.data.sections[0].data.ads.push(rbody.data.sections[0].data.ads[0]);
// rbody.data.sections[0].data.ads.push(rbody.data.sections[0].data.ads[0]);
// rbody.data.sections[0].total = rbody.data.sections[0].data.ads.length;
rbody.data.update_time = parseInt(Date.now() / 1000);
$done({
    response: {
        status: 200, headers: {
            'server': 'SGW',
            'date': new Date().toUTCString(),
            'content-type': 'application/json',
        }, body: JSON.stringify(rbody)
    }
});
