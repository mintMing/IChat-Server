const bcrypt = require("bcryptjs");

// 生成哈希
const encryption = (password)=> {
    // 工作因子
    const saltRounds = 10; 
    const salt = bcrypt.genSaltSync(saltRounds);
    // 生成hash密码
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};
// 验证密码
const verifyPassword = (originPwd, hashPwd)=> {
    const match = bcrypt.compareSync(originPwd, hashPwd);
    return match;
};

module.exports = { encryption, verifyPassword };