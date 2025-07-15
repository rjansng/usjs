let body = null;
body = $response.body;
if (body) {
	let json = JSON.parse(body);
	if (json.code === 0) {
		json.data.games = [];
	}
	body = JSON.stringify(json);
}
$done({ body });
