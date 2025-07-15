var body = $response.body;
var json = JSON.parse(body);
//console.log(json);
var d = json.data.props;
var dd = [];
for (var i = 0; i < d.length; i++) {
	if (d[i].price != 0) {
		// delete d[i];
	}
	else {
		dd.push(d[i]);
	}
}
//console.log(json);
json.data.props = dd;
body = JSON.stringify(json);
console.log(body);
$done({ body });

