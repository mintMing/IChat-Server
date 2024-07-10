const mailer = require("nodemailer");
const certificate = require("../config/certificate");


// 传输方式
const transporter = mailer.createTransport({
    service: "qq",
    auth: {
        user: certificate.qq.user,
        pass: certificate.qq.pass,
    },
});
// 发送注册邮箱
const emailSignUp = (email, res)=> {
    const options = {
        from: "2570803883@qq.com",
        to: email,
        subject: "感谢您在Instant Chat注册",
        html: `<span>Instant Chat欢迎您的加入</span><a href="http://localhost:5173/">点击</a>`,
    };
    transporter.sendMail(options, (err, msg)=> {
        if(err) {
            res.send(err);
        } else {
            res.send("邮箱发送成功！");
        }
    });
};

module.exports = { emailSignUp  };