const dbserver = require("../dao/dbserver");
const mailServer = require("../dao/emailserver");

// 用户注册
const ser_signUp = (req, res)=> {
    const { name, email, pwd }  = req.body;
    // res.send({name, email, pwd})
    // 发送邮箱
    mailServer.emailSignUp(email, res);
    dbserver.buildUser(name, email, pwd, res);
};

// 用户或邮箱是否占用判断
const ser_judgeOccupy = (req, res)=> {
    const usernameOrEmail  = req.params.usernameOrEmail;
    dbserver.matchUserInfo(usernameOrEmail, res);
};

module.exports = { ser_signUp, ser_judgeOccupy };