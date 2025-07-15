let version = 'v20240217';
let title = 'Shopee Pages Bottom Tabs Bar';

// shopee_pages_bottom_tab_bar
$persistentStore.write(null, '蝦皮底部按鈕');
if (($persistentStore.read('蝦皮底部按鈕調整') || '') == '是') {
	try {
		let body = $response.body;
		if (body) {
			let obj = JSON.parse(body);
			if ('error' in obj && obj.error == 0 && 'data' in obj && obj.data
				&& 'bottom_tab_bar' in obj.data && obj.data.bottom_tab_bar
			) {
				if ('tabs' in obj.data.bottom_tab_bar && obj.data.bottom_tab_bar.tabs
					&& obj.data.bottom_tab_bar.tabs.length > 0
				) {
					obj.data.bottom_tab_bar.tabs.forEach(tab => {
						if (tab.messages) { tab.messages = null; }
					});
					// obj.data.bottom_tab_bar.tabs.unshift(obj.data.bottom_tab_bar.tabs[obj.data.bottom_tab_bar.tabs.length - 1]);
					// obj.data.bottom_tab_bar.tabs.pop();
					obj.data.bottom_tab_bar.tabs.reverse();
				}
				// console.log(obj.data.bottom_tab_bar.tabs);
			}

			body = JSON.stringify(obj);
			$done({ body });
		}

	} catch (error) {
		console.log('ERR:');
		$done({});
	}
	$done({});
} else {
	$done({});
}