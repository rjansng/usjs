let version = 'v20240215';
let title = 'Shopee Get Mall Page';

if (($persistentStore.read('蝦皮商城過濾') || '') == '是') {
	let body = $response.body;
	if (body) {
		let obj = JSON.parse(body);
		if ('error' in obj && obj.error == 0 && 'data' in obj && obj.data) {
			if ('page' in obj.data && obj.data.page && 'data' in obj.data.page && obj.data.page.data) {
				// obj.data.page.data = [];
				obj.data.page.data = obj.data.page.data.filter((d, i) => {
					console.log(i);
					if ('data' in d && d.data && 'data' in d.data && d.data.data) {
						if ('space_banners' in d.data.data) {
							if (d.data.data.space_banners.length > 0) {
								console.log(`banners: ${d.data.data.space_banners[0].banners.length}`);
								d.data.data.space_banners[0].banners = [];
							}
						}
						if ('mall_squares' in d.data.data) {
							console.log(`mall_squares: ${d.data.data.mall_squares.length}`);
							d.data.data.mall_squares = [];
						}
						if ('items' in d.data.data) {
							console.log(`items: ${d.data.data.items.length}`);
							d.data.data.items = [];
						}
						if ('brands' in d.data.data) {
							console.log(`brands: ${d.data.data.brands.length}`);
							d.data.data.brands = [];
						}
						if ('sections' in d.data.data) {
							console.log(`sections: ${d.data.data.sections.length}`);
							d.data.data.sections = [];
						}

					}

					if ('configurations' in d && d.configurations && 'children' in d.configurations && d.configurations.children.length > 0) {
						if ('style' in d.configurations.children[0] && d.configurations.children[0].style && d.configurations.children[0].style.header_text) {
							let header_text = d.configurations.children[0].style.header_text;
							console.log(header_text);
							if (header_text == '為你推薦' || header_text == '分類' || header_text == '專屬品牌') {
								return false;
							}

						}
						if ('data' in d.configurations.children[0] && d.configurations.children[0].data) {
							if ('placeholders' in d.configurations.children[0].data && d.configurations.children[0].data.placeholders.length > 0) {
								console.log(`placeholders: ${d.configurations.children[0].data.placeholders.length}`);
								d.configurations.children[0].data.placeholders = [];
							}
							if ('hotspots' in d.configurations.children[0].data && d.configurations.children[0].data.hotspots.length > 0) {
								console.log(`hotspots: ${d.configurations.children[0].data.hotspots.length}`);
								d.configurations.children[0].data.hotspots = [];
							}
							if ('image_slices' in d.configurations.children[0].data && d.configurations.children[0].data.image_slices.length > 0) {
								console.log(`image_slices: ${d.configurations.children[0].data.image_slices.length}`);
								d.configurations.children[0].data.image_slices = [];
							}
							if ('vouchers' in d.configurations.children[0].data && d.configurations.children[0].data.vouchers.length > 0) {
								console.log(`vouchers: ${d.configurations.children[0].data.vouchers.length}`);
								d.configurations.children[0].data.vouchers = [];
								return false;
							}

						}
					}
					if ('configurations' in d && d.configurations && 'meta' in d.configurations && d.configurations.meta) {
						let metaname = d.configurations.meta.name;
						console.log(metaname);
						if (metaname.includes('new ')) { return true; }
						if (metaname.includes(' 商城') && metaname.includes('折券') || metaname.includes('大牌店家')) {
							return false;
						}
					}
					return false;
				});
			}
		}
		body = JSON.stringify(obj);
		$done({ body });
	}
} else {
	$done({});
}