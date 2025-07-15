let body = null;
body = $response.body;
if (body) {
	let json = JSON.parse(body);
	if (json.code === 0) {
		let ffhs = $persistentStore.read('FarmFriendHelpStatus') || '[]';
		let fss = JSON.parse(ffhs); // FriendsStatus
		// 資料調整
		if (fss) {
			let f = json.data.user;
			let c = json.data.crops[0];
			if (fss.some(x => {
				if (x.id === f.id) {
					x.name = f.name;
					x.cropName = c.meta.name;
					x.cropTime = new Date().getTime();
					console.log(`${x.id} (${x.name}) ${x.cropName}`);
					return true;
				}
			})) {
			};
			$persistentStore.write(JSON.stringify(fss), 'FarmFriendHelpStatus');
		}
	}
}
$done({});
