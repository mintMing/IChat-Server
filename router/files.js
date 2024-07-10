const multer = require("multer");
const mkdir = require("../dao/mkdir");

// 控制文件存储
// diskStorage 控制磁盘文件存储
const storage = multer.diskStorage({
    // 确定上传的文件应存储在哪个文件夹中。
    destination: (req, file, cb)=> {
        const url = req.body.url;
        console.log(url)
        mkdir.mkdirs("../data/" + url, err=> {
            console.log(err);
        });
        // console.log("user"+user);
        cb(null, "./data/" + url)
    },
    // 确定文件夹中文件的名称。
    filename: (req, file, cb)=> {
        // 文件的命名
        const name = req.body.name;
        // 后缀名
        const type = file.originalname.replace(/.+\./, ".");
        cb(null, name + type);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // 限制文件大小为最多20MB
});

module.exports = (app)=> {
      
    app.post("/files/upload", upload.array('photos', 10), (req, res, next)=> {
        console.log("--")
        // 获取文件名 由前端并接
        const fname = req.files[0].filename;
        res.send(fname);
        // req.files 是 `photos` 文件数组的信息
        // req.body 将具有文本域数据，如果存在的话
    })
}