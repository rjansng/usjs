var body = $response.body;
var json = JSON.parse(body);
json.data.sections[0].data.item = [];
json.data.sections[0].index = [];
body = JSON.stringify(json);
$done({ body });