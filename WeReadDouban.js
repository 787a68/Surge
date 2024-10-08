let api_key = $argument; // 请将$argument替换为实际的API密钥值

// 解析响应体中的JSON数据并检查ISBN值
let body = JSON.parse($response.body);
if (!body.isbn) {
    body.authorSeg.unshift({"words":"无ISBN","highlight":0});
    $done({body: JSON.stringify(body)});
} else {
    // 使用ISBN值构建API URL并发起GET请求
    $httpClient.get(`https://openapi.youdianzishu.com/metadata?api_key=${api_key}&isbn=${body.isbn}`, (error, response, data) => {
        let json = JSON.parse(data);
        let rating = json.data.douban_rating ? `豆瓣${json.data.douban_rating}分` : "无评分";
        body.authorSeg.unshift({"words": rating, "highlight":0});
        $done({body: JSON.stringify(body)});
    });
}
