/*
# Wechat Mini Program
//gh_e72f45c43cc1 snans.huiyipro.com
答题王ID = type=http-request,pattern=^https:\/\/snans\.huiyipro\.com\/api\/question\/getQuestion,requires-body=1,script-path=https://raw.githubusercontent.com/787a68/Surge/Script/DtwID.js
答题王 = type=http-response,pattern=^https:\/\/snans\.huiyipro\.com\/api\/question\/getQuestion,requires-body=1,script-path=https://raw.githubusercontent.com/787a68/Surge/Script/Dtw.js
*/

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomUseTime() {
  return Math.floor(Math.random() * 5) + 1; // 生成1到5的随机数
}

async function answerQuestion(userId, openId, level, questions) {
  const postData = questions.map((question, index) => ({
    openId,
    answer: question.answer,
    theNth: level,
    useTime: getRandomUseTime(),
    level,
    questionId: question.id,
    num: index + 1,
    wxUserId: userId
  }));

  return new Promise(resolve => {
    $httpClient.post(
      {
        url: 'https://snans.huiyipro.com/api/answer/question',
        headers: {
          ...$request.headers,
          'Accept-Encoding': 'gzip,compress,br,deflate',
        },
        body: JSON.stringify(postData),
      },
      (error, response, body) => {
        const answerData = JSON.parse(body || '{}');
        if (error || answerData.success === false) {
          console.log(`答案提交失败，错误信息：${error || '请求错误'}，${answerData.message || ''}`);
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
      await answerQuestion(userId, openId, level, questions);
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