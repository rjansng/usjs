let knifethrowMode = $persistentStore.read('蝦蝦飛刀模式') || '';
let km = 0;
if (knifethrowMode == '0干擾') { km = 1; }
else if (knifethrowMode == '0干擾;調整2') { km = 2; }
else if (knifethrowMode == '0干擾;調整3') { km = 3; }
if (km == 0) { console.log('預設模式，不調整。'); $done({}); }
else {
	console.log(`蝦蝦飛刀模式: ${knifethrowMode}`);

	let showNotification = true;
	let showLog = true;
	let title = '蝦蝦飛刀';
	function loonNotify(subtitle = '', message = '', url = 'shopeetw://') { if (showNotification) { $notification.post(title, subtitle, message, { 'openUrl': url }); } if (showLog) { console.log(`${title}\t${subtitle}\t${message}`); } };

	var body = $response.body;
	var json = JSON.parse(body);
	var ds = json.difficulty;
	console.log('\n\n' + body);
	for (let i = 0; i < ds.length; i++) {
		// 干擾數
		ds[i].initial_knife_num = 0;
		// 每關的飛刀數調整
		if (km == 2) {
			if (ds[i].level === 1) { ds[i].knife_num = 15; }
			else if (ds[i].level === 3) { ds[i].knife_num = 9; }
			else if (ds[i].level === 6) { ds[i].knife_num = 9; }
			else if (ds[i].level === 9) { ds[i].knife_num = 9; }
			else if (ds[i].level === 10) { ds[i].knife_num = 10; }
		}
		else if (km == 3) {
			if (ds[i].level === 1) { ds[i].knife_num = 20; }
			else if (ds[i].level === 3) { ds[i].knife_num = 8; }
			else if (ds[i].level === 4) { ds[i].knife_num = 8; }
			else if (ds[i].level === 6) { ds[i].knife_num = 8; }
			else if (ds[i].level === 9) { ds[i].knife_num = 8; }
			else if (ds[i].level === 10) { ds[i].knife_num = 9; }
		}
	}
	body = JSON.stringify(json);
	console.log('\n\n' + body);
	loonNotify($script.name, '套用成功');
	$done({ body });
}