const Model = require("../model/dbmodel");
const bcrypt = require("./bcrypt");
const jwt = require("./jwt");


const User = Model.UserModel.model("User");
const Friend = Model.FriendModel.model("Friend");
const Group = Model.GroupModel.model("Group");
const GroupUser = Model.GroupUserModel.model("GroupUser");
const Message = Model.MessageModel.model("Message");
const GroupMeg = Model.GroupMegModel.model("GroupMeg");

// 新建用户
const buildUser = async (name, email, pwd, res)=> {
    try {
        const hashPwd = await bcrypt.encryption(pwd);
        const data = {
            name,
            password: hashPwd,
            email,
        };
        const user = new User(data);
        // 更新文档
        await user.save();
        return res.status(200).send({ status: 200 });

    } catch(err) {
        console.error("Error during buildUser check:", err);
        return res.status(500).json({ message: "ISE" });
    }
};

// 匹配用户名或邮箱
const matchUserInfo = async (usernameOrEmail, res)=> {
    const query = {
        $or: [
            { name: usernameOrEmail },
            { email:usernameOrEmail },
        ],
    };

    try {
        // 0 则数据库中没有该用户可以注册，大于0表示该用户已经注册
        const result = await User.countDocuments(query);
        return res.status(200).send({ status: 200, occupied: result > 0 });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 用户登录验证
const userMatch = async (usernameOrEmail, pwd, res)=> { // data 为第一个字段
    const query = { 
        $or: [
            { "name": usernameOrEmail }, 
            { "email": usernameOrEmail },
        ],
    };
    // 输出字段 1 输出 0 不输出
    const output = { "name": 1, "imgurl": 1, "password": 1 };

    try {
        const user  = await User.findOne(query, output).exec();
        if (!user) {  
            return res.status(404).send({ status: 404, message: "User not found" });
        }
        console.log(user)
        const pwdMatch = await bcrypt.verifyPassword(pwd, user.password);
        if (pwdMatch) {
            const accessToken = jwt.generateToken({ id: user._id } );
            // token有效期为5小时
            const expiresIn = 18000;
            const responseData = {
                id: user._id,  
                name: user.name,  
                imgurl: user.imgurl,
                accessToken,
                expiresIn,
            };  
            console.log("200")
            return res.status(200).send({ status: 200, data: responseData });  
        } else {  
            return res.status(401).send({ status: 401, message: "Password mismatch" });  
        }  
    } catch(err) {
        console.error("Error during userMatch check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 搜索用户
const userDetail = async (searchTerm, res)=> {
    let query;

    if (searchTerm === "IChat") {
        query = {}; // 搜索所有用户
    } else {
        query = { 
            $or: [ 
                { "name": { $regex: searchTerm, $options: "i" } }, // 不区分大小写
                { "email": { $regex: searchTerm, $options: "i" } },
            ],
        };
    }
    const output = { "name": 1, "email": 1, "imgurl": 1 };

    try {
        const result = await User.find(query, output).exec();

        if (result.length === 0) {
            return res.status(404).send({ status: 404, message: "No users found" });
        } else {
            return res.status(200).send({ status: 200, users: result });
        }

    } catch(err) {
        console.error("Error during searchUser search:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 判断是否为好友
const isFriend = async (uId, fId, res)=> {
    const query = {
        "userId": uId,
        "friendId": fId,
        "state": 0,
    };

    try {
        const result = await Friend.findOne(query).exec();

        if (result) {
            // 是好友
            return res.status(200).send({ status: 200 });
        } else {
            // 不是好友
            return res.status(400).send({ status: 400, message: "They are not friends" });
        }

    } catch(err) {
        console.error("Error during isFriend check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 搜索群
const searchGroup = async (searchTerm, res)=> {
    let query;

    if(searchTerm === "IChat") {
        query = {};
    } else {
        query = {
            "name": { $regex: searchTerm, $options: "i" }
        };
    }

    const output = {
        "name": 1,
        "imgurl": 1,
    };

    try {
        const result = await Group.find(query, output).exec();

        if (result) {
            return res.status(200).send({ status: 200 });
        } else {
            return res.status(400).send({ status: 400, message: "No groups found" });
        }

    } catch(err) {
        console.error("Error during searchGroup check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 是否在群内
const isFriInGroup = async (uId, gId, res)=> {
    const query = {
        "userId": uId,
        "groupId": gId,
    }

    try {
        const result = await GroupUser.findOne(query).exec();

        if (result) {
            return res.status(200).send({ status: 200 });
        } else {
            return res.status(400).send({ status: 400, message: "User is not in the group" });
        }

    } catch(err) {
        console.error("Error during isFriInGroup check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
}

// 用户详情信息
const userDetailInfo = async (userId, res)=> {
    const query = { "_id": userId };
    // 除密码外
    const output = { "password": 0 };

    try {
        const result = await User.findOne(query, output).exec();

        if(result) {
            return res.status(200).send({ status: 200, result });
        } else {
            return res.status(404).send({ status: 400, message: "User not found" });
        }
    } catch(err) {
        console.error("Error during userDetail check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
};

// 用户信息修改
// 更新函数
const updateUserById = async (userId, updateData)=> {
    try {
        // new 返回更新后的文档
        const resultUpdate = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return { success: true, result:  resultUpdate };
    } catch(err) {
        console.error("Error during update:", err);
        return { success: false, error: err };
    }
}

// 信息修改
const userUpdate = async (data, res)=> {
    let updatestr = {};
    const userId = data.id;
    const updateType = data.type;
    const updateData = data.data;

    try {
        // 判断是否是修改密码请求
        if(typeof data.pwd !== "undefined") {
            // 匹配用户
            const user  = await User.findById(data.id).select("password").exec();
            if (!user) {
                return res.status(404).send({ status: 404, message: "User not found" });
            }

            // 验证密码
            const pwdMatch = await bcrypt.verifyPassword(data.pwd, user.password);
            if (!pwdMatch) {
                return res.status(400).send({ status: 400, message: "Password verification failed" });
            }

            // 如果为修改密码
            if (data.type === "pwd") {
                const pwdHash = await bcrypt.encryption(data.data);
                updatestr["password"] = pwdHash;
            } else {
                updatestr[updateType] = updateData;
                // 除了当前用户（_id不等于userId）外，具有相同updateType字段和updateData值的其他用户
                const existingUser = await User.findOne({ _id: { $ne: userId }, [updateType]: updateData }).exec();
                if (!existingUser) {
                    return res.status(409).send({ status: 409, message: `${updateType} already exists` });
                }
            }
        } else {
            // 普通字段更新
            updatestr[updateType] = updateData;
            const existingUser = await User.findOne({ _id: { $ne: userId }, [updateType]: updateData }).exec();
            if (!existingUser) {
                return res.status(409).send({ status: 409, message: `${updateType} already exists` });
            }
        }

        const { success, result } = await updateUserById(userId, updatestr);
        if (success) {
            return res.status(200).send({ status: 200, result });
        } else {
            return res.status(500).json({ status: 500, message: "ISE" });
        }
    } catch(err) {
        console.error("Error during userUpdate check:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
}

// 修改好友昵称
const friendMarkName = async (data, res)=> {
    const query = {
        "userId": data.uId,
        "friendId": data.fId,
    }
    const updatestr = { $set: { "markname": data.name } };

    try {
        const result = await Friend.updataOne(query, updatestr, { new: true }).exec();
        // nModified 0 表示没有文档被更新
        if (result.nModified === 0) {
            return res.status(404).send({ status: 404, message: "Friend record not found or not updated" });
        }

        return res.status(200).send({ status: 200, result });
    } catch(err) {
        console.error("Error during update:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
}

// 获取好友昵称
const getFriendName = async (data, res)=> {
    const query = {
        "userId": data.uId,
        "friendId": data.fId,
    }
    const output = { "markname": 1 };

    try {
        const result = await User.find(query, output).exec();

        if (result) {
            return res.status(200).send({ status: 200, result });
        } else {
            return res.status(400).send({ status: 400 });
        }

    } catch(err) {
        console.error("Error during update:", err);
        return res.status(500).json({ status: 500, message: "ISE" });
    }
}

// 好友操作
// 添加好友表
const buildFriend = async (uId, fId, state, res)=> {
    const data = {
        userId: uId,
        friendId: fId,
        state,
        lastTime: new Date(),
    }

    try {
        const friend = new Friend(data);
        await friend.save();
        // 反馈不能多个反馈
        // res.status(200).send({status: 200 });
    } catch(err) {
        console.error("Error during buildFriend:", err);
        throw err; 
        //return res.status(500).json({ message: "ISE" });
    }
}

// 好友申请词：添加一对一信息表
const insertMsg = async (uId, fId, msg, type, res)=> {
    const data = {
        userId: uId,
        friendId: fId,
        message: msg,
        types: type,
        state: 1,
    }

    try {
        const message = new Message(data);
        await message.save();

        res.status(200).send({ status: 200 });
    } catch(err) {
        console.error("Error during insertMsg check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 更新好友最后通讯时间
const upFriendLastTime = async (uId, fId)=> {
    const query = { 
        $or: [
            {"userId": uId, "friendId": fId}, 
            {"userId": fId, "friendId": uId}
        ] 
    };

    const update = { $set: {"lastTime": new Date() }};

    try {
        await Friend.updateMany(query, update);

        // 反馈不能多个反馈
        //res.status(200).send({ status: 200 });
    } catch(err) {
        console.error("Error during upFriendLastTime check:", err);
         // 反馈不能多个反馈
        //return res.status(500).json({ message: "ISE" });
    }
}
 
// 好友申请
const applyFriend = async (data, res)=> {
    const query = { "userId": data.uId, "friendId": data.fId };

    try {
        const result = await Friend.countDocuments(query).exec();
        // 初次申请
        if(result === 0) {
            await buildFriend(data.uId, data.fId, 2);
            await buildFriend(data.fId, data.uId, 1);
        } else {
            // 已经申请过好友
            await upFriendLastTime(data.uId, data.fId);
            // await upFriendLastTime(data.fId, data.uId);
        }
        // 添加消息
        await insertMsg(data.uId, data.fId, data.msg, 0, res)

    } catch(err) {
        console.error("Error during applyFriend check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 更新好友状态
const updateFriendState = async (data, res)=> {
    const { uId, fId } = data;
    const query = { 
        $or: [
            {"userId": uId, "friendId": fId}, 
            {"userId": fId, "friendId": uId}
        ] 
    };
    try {
        await Friend.updateMany(query, {"state": 0});
        res.status(200).send({ status: 200 });
    } catch(err) {
        console.error("Error during applyFriend check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 删除/拒绝好友
const delFriend = async (data, res)=> {
    const { uId, fId } = data;
    const query = { 
        $or: [
            {"userId": uId, "friendId": fId}, 
            {"userId": fId, "friendId": uId}
        ] 
    };
    try {
        await Friend.deleteMany(query, {"state": 0});
        res.status(200).send({ status: 200 });
    } catch(err) {
        console.error("Error during applyFriend check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 按要求获取用户列表
const getUserList = async (uId, state, res)=> {
    try {
        // 查找friendId关联的user对象
        const allFri = await Friend.find({})
            .where({ "userId": uId, "state": state })
            .populate("friendId")
            .sort({ "lastTime": -1 })
            .exec();

        const result = allFri.map((ver)=> ({
            id: ver.friendId._id,
            name: ver.friendId.name,
            markname: ver.markname,
            imgurl: ver.friendId.imgurl,
            lastTime: ver.lastTime,
        }));
        res.status(200).send({ status: 200, result });
    } catch(err) {
        console.error("Error during userList check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 按要求获取最后一条信息
const getLastMsg = async (uId, fId, res)=> {
    try {
        const lastMsg  = await Message.findOne({
            $or: [
                { "userId": uId, "friendId": fId }, 
                { "userId": fId, "friendId": uId },
            ] 
        })
        .sort({ "time": -1 })
        .exec();
        
        if (lastMsg) {
            const result = {
                message: lastMsg.message,
                time: lastMsg.time,
                types: lastMsg.types,
            };
            console.log(lastMsg)
            res.status(200).send({ status: 200, result });
        } else {
            res.status(404).send({ status: 404, message: "No messages found" });
        }
        
    } catch(err) {
        console.error("Error during userList check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 未读信息数
const unreadMsg = async (uId, fId, res)=> {
    const query = { 
        "userId": uId, 
        "friendId": fId,
        "state": 1,
    };

    try {
        const result  = await Message.countDocuments(query).exec();

        res.status(200).send({ status: 200, result });
        
    } catch(err) {
        console.error("Error during unreadMsg check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 变更为已读
const updateMsgState = async (uId, fId, res)=> {
    const query = { 
        "userId": uId, 
        "friendId": fId,
        "state": 1,
    };

    const update = { "state": 0 };

    try {
        await Message.updateMany(query, update).exec();

        res.status(200).send({ status: 200 });
        
    } catch(err) {
        console.error("Error during unreadMsg check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 按要求获取群列表
const getGroup = async (uId, res)=> {
    try {
        // id 用户所在群
        const userInGroups = await GroupUser.find({})
            .where({ "userId": uId })
            .populate("groupId")
            .sort({ "lastTime": -1 })
            .exec();

        const result = userInGroups.map((ver)=> ({
            gId: ver.groupId._id,
            name: ver.groupId.name,
            markname: ver.markname,
            imgurl: ver.groupId.imgurl,
            lastTime: ver.lastTime,
            tip: ver.tip,
        }));
        res.status(200).send({ status: 200, result });
    } catch(err) {
        console.error("Error during userList check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 按要求获取群消息
const getLastGroupMsg = async (gId, res)=> {
    try {
        const groupMsg = await GroupMeg.findOne({})
            .where({ "groupId": gId })
            .populate("userId")
            .sort({ "time": -1 })
            .exec();

        if(groupMsg) {
            const result = {
                message: ver.message,
                time: ver.time,
                types: ver.types,
                name: ver.userId.name,
            };
            res.status(200).send({ status: 200, result });
        } else {
            res.status(404).send({ status: 404, message: "No messages found" });
        }

        res.status(200).send({ status: 200, result });
    } catch(err) {
        console.error("Error during userList check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}

// 变更群信息为已读
const updateGroupMsgState = async (gId, uId, res)=> {
    const query = { 
        "userId": uId, 
        "groupId": gId,
    };

    const update = { "tip": 0 };

    try {
        await Message.updateOne(query, update).exec();
        res.status(200).send({ status: 200 });
        
    } catch(err) {
        console.error("Error during updateGroupMsgState check:", err);
        return res.status(500).json({ message: "ISE" });
    }
}





module.exports = { 
    buildUser, 
    matchUserInfo,
    userMatch,
    userDetailInfo,
    isFriend,
    searchGroup,
    isFriInGroup,
    userDetail,
    userUpdate,
    friendMarkName,
    getFriendName,
    applyFriend,
    updateFriendState,
    delFriend,
    getUserList,
    getLastMsg,
    unreadMsg,
    updateMsgState,
    getGroup,
    getLastGroupMsg,
    updateGroupMsgState,
};