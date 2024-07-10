const db = require("../config/db");
const mongoose = require("mongoose"); // Mongoose是一个用于在Node.js中操作MongoDB的库
// Schema是用来定义MongoDB集合中文档的结构的
const Schema = mongoose.Schema;

// 用户表
const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sex: { type: String, default: "Male", enum: ["Male", "Female", "Other"] },
    birthday: { type: Date },
    phone: { type: Number },
    explain: { type: String },
    imgurl: { type: String, default: "OIP1.jpg" },
}, { timestamps: { createdAt: "register", updatedAt: "updated" } });

// 好友表
const FriendSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // 0 已为好友  1 申请中 2 申请发送方
    state: { type: String, enum: ["0", "1", "2"], required: true },
    markname: { type: String },
    time: { type: Date, default: Date.now },
    // 最后通讯时间
    lastTime: { type: Date, default: Date.now },
});

// 一对一信息表
const MessageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    // 0 文字 1 图片链接 2 音频链接
    types: { type: String, required: true },
    time: { type: Date, default: Date.now },
    // 0 已读 1 未读
    state: { type: Number, default: 0 }
});

// 群信息表
const GroupSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    imgurl: { type: String, default: "group.png" },
    time: { type: Date, default: Date.now },
    state: { type: Number, default: 1 },
});

// 群成员表
const GroupUserSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    tip: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
    shield: { type: Number, default: 0 },
    // 最后通讯时间
    lastTime: { type: Date },
});

// 群消息表
const GroupMegSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    types: { type: String, required: true },
    time: { type: Date, default: Date.now },
});

// 将SchemaUser编译成一个模型，并命名为"User"。模型是操作数据库文档的接口
const UserModel = db.model("User", UserSchema);
const FriendModel = db.model("Friend", FriendSchema);
const MessageModel = db.model("Message", MessageSchema);
const GroupModel = db.model("Group", GroupSchema);
const GroupUserModel = db.model("GroupUser", GroupUserSchema);
const GroupMegModel = db.model("GroupMeg", GroupMegSchema);

module.exports = {
    UserModel,
    FriendModel,
    MessageModel,
    GroupModel,
    GroupUserModel,
    GroupMegModel,
};