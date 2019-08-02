const express = require('express');
const axios = require('axios');

const router = express.Router();
const str62keys = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

router.get('/:userId/:mblogHexId', async (req, res) => {
  const userId = req.params.userId;
  const mblogHexId = req.params.mblogHexId;
  const url = `https://m.weibo.cn/detail/${transformId(mblogHexId)}`;
  
  try {
    const reply = await axios.get(url);
    const html = reply.data;
    const content = /\"text\"\:\s\"(.+)\"/.exec(html)[1].replace(/<\/?[^>]*>/g, '');
    const releaseTime = transformDate(/\"created\_at\"\:\s\"(.*)\"/.exec(html)[1]);
    const commentCount = parseInt(/\"comments\_count\"\:\s(\d+)/.exec(html)[1]);

    res.send(JSON.stringify({
      status: 200,
      data: {
        content: content,
        releaseTime: releaseTime,
        commentCount: commentCount,
        mblogHexId: mblogHexId,
        mblogUrl: `https://weibo.com/${userId}/${mblogHexId}`
      }
    }));

  } catch (err) {
    console.log(err);
    return {
      status: 500
    }
  }

});

function transformId(hexId) {
  let id = '';

  for (let i = hexId.length - 4; i > -4; i -= 4) {
    const offset1 = i < 0 ? 0 : i;
    const offset2 = i + 4;
    const str62 = hexId.substring(offset1, offset2);
    str10 = String(str62to10(str62));

    if (offset1 > 0) {
      while (str10.length < 7) {
        str10 = '0' + str10;
      }
    }
    id = str10 + id;
  }

  return id;
}

function str62to10 (str62) {
  let i10 = 0;

  for (let i = 0; i < str62.length; i++) {
    const n = str62.length - i - 1;
    const s = str62[i];
    i10 += str62keys.indexOf(s) * Math.pow(62, n);
  }

  return i10;
};

function transformDate(str) {
  const date = new Date(str).toISOString();
  const m = /(\d{4}\-\d{2}\-\d{2})T(\d{2}\:\d{2}\:\d{2})/.exec(date);
  return `${m[1]} ${m[2]}`;
}

module.exports = router;