const dbserver = require("../dao/dbserver");

// 按要求获取用户列表
const ser_getUserList = (req, res)=> {
    const uId = req.body.uId;
    const state = req.body.state;
    dbserver.getUserList(uId, state, res);
}

// 按要求获取一条一对一消息
const ser_getLastMsg = (req, res)=> {
    const uId = req.body.uId;
    const fId = req.body.fId;
    console.log(uId+fId)
    dbserver.getLastMsg(uId, fId, res);
}

// 未读信息数
const ser_unreadMsg = (req, res)=> {
    const uId = req.body.uId;
    const fId = req.body.fId;
    dbserver.unreadMsg(uId, fId, res);
}

// 变更为已读
const ser_updateMsgState = (req, res)=> {
    const uId = req.body.uId;
    const fId = req.body.fId;
    dbserver.updateMsgState(uId, fId, res);
}

// 按要求获取群列表
const ser_getGroup = (req, res)=> {
    const uId = req.body.uId;
    dbserver.getGroup(uId, res);
}

// 按要求获取群消息
const ser_getLastGroupMsg = (req, res)=> {
    const gId = req.body.gId;
    dbserver.getLastGroupMsg(gId, res);
}

// 变更群信息为已读
const ser_updateGroupMsgState = (req, res)=> {
    const gId = req.body.gId;
    const uId = req.body.uId;
    dbserver.updateGroupMsgState(gId, uId, res);
}


module.exports = {
    ser_getUserList,
    ser_getLastMsg,
    ser_unreadMsg,
    ser_updateMsgState,
    ser_getGroup,
    ser_getLastGroupMsg,
    ser_updateGroupMsgState,
}