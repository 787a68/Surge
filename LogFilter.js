// 定义正则表达式匹配规则
const regex = /\blogs?\b/i;

// 结束脚本并返回匹配结果
$done({ matched: regex.test($request.hostname) });
