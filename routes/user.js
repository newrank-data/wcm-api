const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const reply = await axios.get(`https://m.weibo.cn/api/container/getIndex?type=uid&value=${userId}`);
    const userInfo = reply.data.data.userInfo;
    res.send(JSON.stringify({
      status: 200,
      data: {
        userId: userId,
        userName: userInfo.screen_name,
        userAvatar: userInfo.profile_image_url,
        userUrl: `https://weibo.com/u/${userId}`
      }
    }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({
      status: 404
    }));
  }
});

module.exports = router;
