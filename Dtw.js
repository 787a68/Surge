function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function answerQuestion(userId, openId, level, question) {
  const { id: questionId, answer, num } = question;
  const useTime = Math.ceil(Math.random() * 10);

  return new Promise(resolve => {
    $httpClient.post(
      {
        url: 'https://snans.huiyipro.com/api/answer/question',
        headers: {
          ...$request.headers,
          'Accept-Encoding': 'gzip,compress,br,deflate',
        },
        body: JSON.stringify({
          wxUserId: userId,
          openId,
          questionId,
          answer,
          level,
          num,
          useTime,
          theNth: level,
        }),
      },
      (error, response, body) => {
        const answerData = JSON.parse(body || '{}');
        if (error || answerData.success === false) {
          console.log(`答案提交失败，题目ID：${questionId}，错误信息：${error || '请求错误'}，${answerData.message || ''}`);
        }
        resolve(); // 标记当前请求已完成
      }
    );
  });
}

async function main() {
  const storedData = $persistentStore.read('dtwid');

  if (storedData) {
    const { userId, openId, level: storedLevel } = JSON.parse(storedData);
    const level = parseInt(storedLevel) + 1;

    const response = $response.body;
    const { data: { questions } } = JSON.parse(response);

    try {
      for (const [index, question] of questions.entries()) {
        if (index !== 0) {
          await delay(1000); // 除第一个请求外，每次请求间隔1秒
        }
        await answerQuestion(userId, openId, level, question);
      }
    } catch (error) {
      console.error('发生错误：', error);
    } finally {
      $done({});
    }
  } else {
    console.log('未找到存储的数据');
    $done({});
  }
}

main();