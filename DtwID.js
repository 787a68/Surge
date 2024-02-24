var requestBody = $request.body;

$persistentStore.write(requestBody.toString(), "dtwid");

$done({});
