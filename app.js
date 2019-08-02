const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const userRouter = require('./routes/user');
const mblogRouter = require('./routes/mblog');
const commentRouter = require('./routes/comment');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/user', userRouter);
app.use('/mblog', mblogRouter);
app.use('/comment', commentRouter);

module.exports = app;
