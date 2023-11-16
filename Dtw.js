var storedData = $persistentStore.read("dtwid");

if (storedData) {
  var data = JSON.parse(storedData);
  var userId = data.userId.toString();
  var openId = data.openId.toString();
  var level = parseInt(data.level) + 1;

  var response = $response.body;
  var responseData = JSON.parse(response);
  var questions = responseData.data.questions;

  var answerRequests = questions.map(function (question, index) {
    var answer = question.answer;
    var questionId = question.id;
    var num = index + 1;

    var useTime = Math.ceil(Math.random() * 15); // 生成 1 到 15 之间的随机整数

    return {
      method: 'POST',
      url: 'https://snans.huiyipro.com/api/answer/question',
      headers: $request.headers, // 使用原有请求的头部信息
      body: JSON.stringify({
        wxUserId: userId,
        openId: openId,
        questionId: questionId,
        answer: answer,
        level: level,
        num: num,
        useTime: useTime,
        theNth: level
      })
    };
  });

  // 批量发送答案请求
  answerRequests.forEach(function (request, index) {
    setTimeout(function () {
      $httpClient.post(request, function (error, response, body) {
        var questionId = questions[index].id;
        if (!error && response.statusCode == 200) {
          var answerData = JSON.parse(body);
          if (answerData.success) {
            console.log("答案提交成功，题目ID：" + questionId);
          } else {
            console.log("答案提交失败，题目ID：" + questionId);
          }
        } else {
          console.log("答案提交失败，题目ID：" + questionId + "，错误信息：" + (error || "请求错误"));
        }
      });
    }, index * 500); // 每次请求间隔0.5秒
  });
} else {
  console.log("未找到存储的数据");
}

$done({});