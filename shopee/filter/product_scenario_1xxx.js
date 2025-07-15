var body = $response.body;
var json = JSON.parse(body);
if ('data' in json && 'scenario' in json.data && 'browse_time' in json.data.scenario) {
    json.data.scenario.browse_time = 0;
    body = JSON.stringify(json);
    $done({ body });
}
else {
    console.log(body);
    console.log(json.data);
    $done({});
}
