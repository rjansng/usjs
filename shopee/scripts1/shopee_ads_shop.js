var body = $response.body;
var json = JSON.parse(body);
var d = json.data.decoration;
var t18 = null;
for (var i = d.length - 1; i >= 0; i--) {
  //for (var i = 0; i < d.length; i++) {
  if (d[i].type == 18) {
    t18 = d[i];
    break;
  }

}
var dd = [];
dd.push(t18);  // .unshift 置頂
json.data.decoration = dd;

//console.log(json);
body = JSON.stringify(json);
//console.log(body);
$done({ body });
