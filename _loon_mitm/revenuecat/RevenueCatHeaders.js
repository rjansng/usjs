delete $request.headers["x-revenuecat-etag"];
delete $request.headers["X-RevenueCat-ETag"];
$done({headers:$request.headers});