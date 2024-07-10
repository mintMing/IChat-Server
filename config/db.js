let mongoose = require("mongoose");
// IPv6 问题 ???
let db = mongoose.createConnection("mongodb://127.0.0.1:27017/InstantChat");

db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=> {
    console.info("mongodb 连接成功！！！");
});

module.exports = db;