const dbserver = require("../dao/dbserver");

// 用户详情
const ser_userDetail = (req, res)=> {
    const id = req.params.userId;
    
    dbserver.userDetailInfo(id, res);
};

// 用户信息修改
const ser_userUpdate = (req, res)=> {
    const data = req.body;
    dbserver.userUpdate(data, res);
};

// 修改好友昵称
const ser_friendMarkName = (req, res)=> {
    const data = req.body;
    dbserver.friendMarkName(data, res);
};

// 修改好友昵称
const ser_getFriendName = (req, res)=> {
    const data = req.body;
    dbserver.getFriendName(data, res);
};

module.exports = {
    ser_userDetail,
    ser_userUpdate,
    ser_friendMarkName,
    ser_getFriendName,
};