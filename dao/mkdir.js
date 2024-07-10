// 递归地创建指定路径中的所有目录

const fs = require("fs");
const path = require("path");

const mkdirs = (pathname, callback)=> {
    // 是否为绝对路径
    pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
    // 获取相对路径
    pathname = path.relative(__dirname, pathname);
    // 平台差异 Linux /  Windows \ 
    const floders = pathname.split(path.sep);
    let pre = "";
    floders.forEach(floder=> {
        try {
            // 文件已经创建
            // 获取文件或目录的状态信息
            const _stat = fs.statSync(path.join(__dirname, pre, floder));
            // 检查某个路径是否是目录
            const hashMkdir = _stat && _stat.isDirectory();
            if(hashMkdir) {
                callback
            }
        } catch(err) {
            try {
                // 创建目录
                fs.mkdirSync(path.join(__dirname, pre, floder));
                callback && callback(null);
            } catch(err) {
                callback && callback(error);
            }
        }
        // 路径拼合
        pre = path.join(pre, floder);
    });
}

module.exports = { mkdirs };