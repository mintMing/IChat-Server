const dbserver = require("../dao/dbserver");
const emailserver = require("../dao/emailserver");
const signup  = require("../server/signup");
const signin = require("../server/signin");
const search = require("../server/search");
const userdetail = require("../server/userdetail");
const friend = require("../server/friend");
const index = require("../server/index");

module.exports = (app)=> {
    app.post("/mail", (req, res)=> {
        let mail = req.body.mail;
        emailserver.emailSignUp(mail, res);
        res.send(mail);
    });

    /**
     * restful api规范
     * 用户相关接口
     */
    /**
     * 登录和注册
     */
    // 注册
    app.post("/users", (req, res)=> {
        signup.ser_signUp(req, res);
    });
    // 匹配用户名/邮箱
    app.get("/users/check/:usernameOrEmail", (req, res)=> {
        signup.ser_judgeOccupy(req, res);
    });
    // 登录
    app.post("/users/login", (req, res)=> {
        signin.ser_signIn(req, res);
    });

    // 搜索页面
    // 搜索用户
    app.get("/users/search/:userName", (req, res)=> {
        search.ser_userDetail(req, res);
    });

    /**
     * 用户数据
     */
    // 用户详情信息
    app.get("/users/:userId", (req, res)=> {
        console.log("==")
        userdetail.ser_userDetail(req, res);
    });


    
    // 非 restful api 规范

    // 判断是否为好友
    app.post("/search/isFriend", (req, res)=> {
        search.ser_friend(req, res);
    });
    // 搜索群 
    app.post("/search/group", (req, res)=> {
        search.ser_group(req, res);
    });
    // 是否在群内 
    app.post("/search/group", (req, res)=> {
        search.ser_friInGroup(req, res);
    });


    // 用户信息修改 
    app.post("/user/update", (req, res)=> {
        userdetail.ser_userUpdate(req, res);
    });
    // 修改好友昵称 
    app.post("/user/markname", (req, res)=> {
        userdetail.ser_friendMarkName(req, res);
    });
    // 获取好友昵称 
    app.post("/user/getFriendName", (req, res)=> {
        userdetail.ser_getFriendName(req, res);
    });

    // 好友操作
    // 申请好友
    app.post("/friend/applyFriend", (req, res)=> {
        console.log("--");
        friend.ser_applyFriend(req, res);
    });
    // 更新好友状态
    app.post("/friend/updateFriendState", (req, res)=> {
        console.log("--");
        friend.ser_upFriState(req, res);
    });
    // 删除/拒绝好友
    app.post("/friend/delFriend", (req, res)=> {
        console.log("--");
        friend.ser_delFriend(req, res);
    });
    // 获取好友列表
    app.post("/index/getFriendList", (req, res)=> {
        console.log("--");
        index.ser_getUserList(req, res);
    });
    // 获得最后一条信息
    app.post("/index/getLastMsg", (req, res)=> {
        console.log("--");
        index.ser_getLastMsg(req, res);
    });
    // 未读信息数
    app.post("/index/getUnreadMsg", (req, res)=> {
        console.log("--");
        index.ser_unreadMsg(req, res);
    });
    // 变更为已读
    app.post("/index/updateMsgState", (req, res)=> {
        console.log("--");
        index.ser_updateMsgState(req, res);
    });

    // 群
    // 按要求获取群列表
    app.post("/index/getGroupList", (req, res)=> {
        console.log("--");
        index.ser_getGroup(req, res);
    });
    // 按要求获取群消息
    app.post("/index/getGroupMsg", (req, res)=> {
        console.log("--");
        index.ser_getLastGroupMsg(req, res);
    });
    // 变更群信息为已读
    app.post("/index/updateGroupMsgState", (req, res)=> {
        console.log("--");
        index.ser_updateGroupMsgState(req, res);
    });
}