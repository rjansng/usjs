var body = $response.body;
var json = JSON.parse(body);
if (json.data.hasOwnProperty('browseTime')) {
    json.data.browseTime = 0;
    body = JSON.stringify(json);
    $done({ body });
}
else {
    console.log(body);
    console.log(json.data);
    $done({});
}
