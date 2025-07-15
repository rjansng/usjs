let body = null;
body = $response.body;
if (body) {
	let json = JSON.parse(body);
	if (json.code === 0) {
		let ffhs = $persistentStore.read('FarmFriendHelpStatus') || '[]';
		let fss = JSON.parse(ffhs); // FriendsStatus
		// 資料調整
		if (fss) {
			let fs = json.data.friendsRank;
			for (let i = fs.length - 1; i >= 0; i--) {
				let f = fs[i];
				fss.some(x => {
					if (x.id === f.id && f.relationType === -1) {
						f.name = x.name;
						return true;
					}
				});
			}
			json.data.friendsRank = fs;
		}
	}
	body = JSON.stringify(json);
}
$done({ body });
