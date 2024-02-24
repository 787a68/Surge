/*
# Wechat Mini Program
//gh_e72f45c43cc1 snans.huiyipro.com
答题王ID = type=http-request,pattern=^https:\/\/snans\.huiyipro\.com\/api\/question\/getQuestion,requires-body=1,script-path=https://raw.githubusercontent.com/787a68/Surge/Script/DtwID.js
答题王 = type=http-response,pattern=^https:\/\/snans\.huiyipro\.com\/api\/question\/getQuestion,requires-body=1,script-path=https://raw.githubusercontent.com/787a68/Surge/Script/Dtw.js,timeout=30,argument=500
*/

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function answerQuestion(userId, openId, level, question) {
  const { id: questionId, answer, num } = question;
  const useTime = Math.ceil(Math.random() * 3);

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
          const delayTime = parseInt($argument) || 1000;
          await delay(delayTime); // 除第一个请求外，每次请求间隔延迟时间
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
