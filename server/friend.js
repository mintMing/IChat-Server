const dbserver = require("../dao/dbserver");

// 好友申请
const ser_applyFriend = (req, res)=> {
    const data = req.body;
    dbserver.applyFriend(data, res);
}

// 更新好友状态
const ser_upFriState = (req, res)=> {
    const data = req.body;
    dbserver.updateFriendState(data, res);
}

// 删除/拒绝好友
const ser_delFriend = (req, res)=> {
    const data = req.body;
    dbserver.delFriend(data, res);
}

module.exports = {
    ser_applyFriend,
    ser_upFriState,
    ser_delFriend,
}