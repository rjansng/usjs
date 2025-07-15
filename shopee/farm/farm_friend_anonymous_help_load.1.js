let version = 'v20230809';
function Env() {
	LN = typeof $loon != "undefined";
	read = (key) => {
		if (LN) return $persistentStore.read(key);
	}
	write = (key, val) => {
		if (LN) return $persistentStore.write(key, val);
	}
	notice = (title, subtitle, message, url) => {
		if (LN) $notification.post(title, subtitle, message, url);
	}
	get = (url, cb) => {
		if (LN) { $httpClient.get(url, cb); }
	}
	post = (url, cb) => {
		if (LN) { $httpClient.post(url, cb); }
	}
	put = (url, cb) => {
		if (LN) { $httpClient.put(url, cb); }
	}
	log = (message) => console.log(message);
	done = (value = {}) => { $done(value) }
	return { LN, read, write, notice, get, post, put, log, done };
}
let $ = new Env();

let url = 'https://sdany.somee.com/usjs/shopee/filter/farm_friend_anonymous_help.js';
console.log('GET ' + url);

let options = {
	url: url,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
	}
}

let headers = null;
let isReq = false;
let isRes = false;
let body = null;
try {
	body = $response.body;
	headers = $response.headers;
	isRes = true;
} catch (e) {
	try {
		headers = $request.headers;
		isReq = true;
	} catch (e) {
		console.log('Not Mitm');
		console.log('下載 FarmHelpJS');
		$.get(options, (error, response, data) => {
			if (error) {
				console.log(error);
				console.log(data);
			} else {
				if (response.status === 200) {
					try {
						console.log('寫入 FarmHelpJS');
						$.write(data, 'FarmHelpJS');
						console.log('處理完成。');
					} catch (error) {
						console.log('ERR : ' + error);
						console.log(data);
					}
				} else {
					console.log(response.status);
					console.log(data);
				}
			}
			$done({});
		});
	}
}

if (isRes || isReq) {
	//headers["User-Agent"] = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=zh-Hant version=29718 appver=29718 rnver=1675419708 shopee_rn_bundle_version=5068009 Shopee language=zh-Hant app_type=1";
	headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
	headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
	if (isReq) {
		$done({ headers });
	}
	if (body) {

		body = body.replace(/(\<html\>)/i, "$1<script>for(let i=localStorage.length-1;i>=0;i--){if(localStorage.key(i).includes('share_key_')){console.log(localStorage.key(i));localStorage.removeItem(localStorage.key(i));}}</script>");

		let FarmHelpJS = $.read('FarmHelpJS');
		if (FarmHelpJS != null) {
			console.log('載入 FarmHelpJS');
			body = body.replace("</body>", "<script data-loon=\"true\">" + FarmHelpJS + "</script></body>");
			$done({ headers, body });
		}
		else {
			console.log('下載 FarmHelpJS');
			$.get(options, (error, response, data) => {
				if (error) {
					console.log(error);
					console.log(data);
					$done({ headers, body });
				} else {
					if (response.status === 200) {
						try {
							console.log('寫入 FarmHelpJS');
							$.write(data, 'FarmHelpJS');
							console.log('載入 FarmHelpJS');
							body = body.replace("</body>", "<script data-loon=\"true\">" + data + "</script></body>");
						} catch (error) {
							console.log('ERR : ' + error);
							console.log(data);
						}
					} else {
						console.log(response.status);
						console.log(data);
					}
					$done({ headers, body });
				}
			});

		}
	}
}