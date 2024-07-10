const dbserver = require("../dao/dbserver");

// 登录
const ser_signIn = (req, res)=> {
    const data = req.body.data;
    const pwd = req.body.pwd;
    dbserver.userMatch(data, pwd, res);
};

module.exports = { ser_signIn };