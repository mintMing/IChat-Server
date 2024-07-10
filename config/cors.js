const cors = require("cors");

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    // 允许发送Cookie 
    credentials: true,
    // 允许的HTTP头 
    allowedHeaders: [
        "Origin", 
        "X-Requested-With", 
        "Content-Type", 
        "Accept", 
        "api-version",
        "authorization",
    ],  
    methods: ["GET", "POST", "PUT"],
    // preflightContinue: false // 可选，默认值为true。指定OPTIONS请求是否应继续转发到下一个中间件  
    // optionsSuccessStatus: 200, // 一些遗留浏览器（IE11，各种SmartTVs）不支持204  
};

module.exports = cors(corsOptions);