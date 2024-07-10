const express = require("express");
const { apiVersionMiddleware, verifyTokenMiddle } = require("./middlewares/middlewares");
const corsConfig = require("./config/cors");


const app = express();
const port = 3000;

// 设置跨域
app.use(corsConfig);

// 导入路由
require("./router/index")(app); // 传递 app 实例
require("./router/files")(app);


app.use(express.json());

// 验证 api 版本
app.use(apiVersionMiddleware);

// 验证 Token
app.use(verifyTokenMiddle);

// 获取静态路径
app.use(express.static(__dirname + "/data"));

// 404 页面
app.use((req, res, next)=> {
    let err = new Error("Not Fount");
    err.status = 404;
    next(err);
});

// 错误处理
app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.send(err.messgae);
    next(err);
});

app.listen(port, ()=> {
    console.log(`应用程序在端口${port}上侦听!!! `);
});