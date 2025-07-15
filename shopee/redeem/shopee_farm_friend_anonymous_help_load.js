function Env() {
	LN = typeof $loon != "undefined";
	SG = typeof $httpClient != "undefined" && !LN;
	QX = typeof $task != "undefined";
	read = (key) => {
		if (LN || SG) return $persistentStore.read(key);
		if (QX) return $prefs.valueForKey(key);
	}
	write = (key, val) => {
		if (LN || SG) return $persistentStore.write(key, val);
		if (QX) return $prefs.setValueForKey(key, val);
	}
	notice = (title, subtitle, message, url) => {
		if (LN) $notification.post(title, subtitle, message, url);
		if (SG) $notification.post(title, subtitle, message, { url: url });
		if (QX) $notify(title, subtitle, message, { "open-url": url });
	}
	get = (url, cb) => {
		if (LN || SG) { $httpClient.get(url, cb); }
		if (QX) { url.method = 'GET'; $task.fetch(url).then((resp) => cb(null, {}, resp.body)); }
	}
	post = (url, cb) => {
		if (LN || SG) { $httpClient.post(url, cb); }
		if (QX) { url.method = 'POST'; $task.fetch(url).then((resp) => cb(null, {}, resp.body)); }
	}
	put = (url, cb) => {
		if (LN || SG) { $httpClient.put(url, cb); }
		if (QX) { url.method = 'PUT'; $task.fetch(url).then((resp) => cb(null, {}, resp.body)); }
	}
	log = (message) => console.log(message);
	done = (value = {}) => { $done(value) }
	return { LN, SG, QX, read, write, notice, get, post, put, log, done };
}
let $ = new Env();

let url = 'http://www.sdany.org/usjs/shopee/_shopee/shopee3/shopee_farm_friend_anonymous_help.js';
console.log('GET ' + url);

let options = {
	url: url,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
	}
}

let headers = null;
let isReq = false;
let body = null;
try {
	body = $response.body;
	headers = $response.headers;
} catch (e) {
	isReq = true;
	headers = $request.headers;
}
//headers["User-Agent"] = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Beeshop locale=zh-Hant version=29718 appver=29718 rnver=1675419708 shopee_rn_bundle_version=5068009 Shopee language=zh-Hant app_type=1";
if (isReq) {
	headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
	$done({ headers });
}
if (body) {

	body = body.replace(/(\<html\>)/i, "$1<script>for(let i=localStorage.length-1;i>=0;i--){if(localStorage.key(i).includes('share_key_')){console.log(localStorage.key(i));localStorage.removeItem(localStorage.key(i));}}</script>");

	$.get(options, (error, response, data) => {
		if (error) {
			console.log(error);
			console.log(data);
			$done({ headers, body });
		} else {
			if (response.status === 200) {
				try {
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