var body = $response.body;
var json = JSON.parse(body);
json.data = {};

//json.data.items=[];  <-- 不能用這個會錯誤。
//if (json.data.hasOwnProperty('items') && json.data.items.length > 0) {


//  json.data.items[0].label_ids = [];
//  json.data.items[0].images = [];
//  json.data.items[0].video_info_list = [];
//  json.data.items[0].tier_variations = [];
//  json.data.items[0].item_rating.rating_count = [0, 0, 0, 0, 0, 0];
//  json.data.items[0].global_cat.catid = [];
//  json.data.items[0].fe_cat_paths[0].fe_cat_ids = [];

//  json.data.items[0].is_official_shop = false;
//  json.data.items[0].show_official_shop_label = false;
//  json.data.items[0].show_official_shop_label_in_title = false;
//  json.data.items[0].can_use_bundle_deal = false;
//  json.data.items[0].image = "";
//  json.data.items[0].name = "";
//  json.data.items[0].transparent_background_image = "";
//  json.data.items[0].shop_name = "";
//  json.data.items[0].cmt_count = 0;
//  json.data.items[0].shopid = 0;
//  json.data.items[0].itemid = 0;

//  json.data.items[0].price = 0;
//  json.data.items[0].discount = '';
//  json.data.items[0].historical_sold = 0;
//  json.data.items[0].price_min = 0;
//  json.data.items[0].price_max = 0;

//}
body = JSON.stringify(json);
$done({body});
