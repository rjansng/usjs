let version = 'v20231224';
let headers = $response.headers;
let ct = headers['content-type'] || headers['Content-Type'];
let body = $response.body;
let jd = null;
try {
    console.log($request.method + '\n');
    if (ct) { console.log(ct + '\n'); }
    else { console.log('Not Content-Type\n'); }

    if (ct && ct.match(/video\/x-flv/i)) {
        console.log(headers);
    }
    if (body) {
        console.log(body);
    }
    else {
        console.log('Not Body');
    }
}
catch (error) {
    console.log(`ERROR: ${error}`);
    console.log(body);
}

$done({});