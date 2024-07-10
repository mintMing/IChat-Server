const dbserver = require("../dao/dbserver");

// 用户搜索
const ser_userDetail = (req, res)=> {
    const data = req.body.data;
    dbserver.userDetail(data, res);
};

// 判断是否为好友
const ser_isFriend = (req, res)=> {
    const uId = req.body.uId;
    const fId = req.body.fId;
    dbserver.isFriend(uId, fId, res);
}

// 搜索群
const ser_searchGroup = (req, res)=> {
    const data = req.body.data;
    dbserver.searchGroup(data. res);
}

// 是否在群内
const ser_isFriInGroup = (req, res)=> {
    const uId = req.body.uId;
    const gId = req.body.gId;
    dbserver.isFriInGroup(uId, gId, res);
}

module.exports = {
    ser_userDetail,
    ser_isFriend,
    ser_searchGroup,
    ser_isFriInGroup,
}