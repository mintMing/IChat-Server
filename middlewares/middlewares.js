const { verifyToken }  = require("../dao/jwt");

const apiVersionMiddleware = (req, res, next)=> {
    const apiVersion = req.headers["api-version"];
    console.log(req.headers)
    const supportedVersion = ["v1"];
    if(!apiVersion || !supportedVersion.includes(apiVersion)) {
        return res.status(400).send("Unsupported API version.");  
    }

    // 将版本号添加到请求对象中
    req.apiVersion = apiVersion;  

    next(); // 调用下一个中间件
};

const verifyTokenMiddle = async (req, res, next)=> {
    const noTokenPaths = ["/users/login", "/another-path-without-token"];

    // if (req.method === 'OPTIONS') {  
    //     res.sendStatus(205); // No Content，表示预检请求成功  
    //     return;
    // }

    if(noTokenPaths.includes(req.path)) {
        // 如果是登录请求或不需要token的请求，则直接跳过
        next();
    } else {
        const token = req.headers["authorization"];
        console.log(req.headers) // undefined
        console.log(req.method)
        if(token) {
            const tokenPart = token.split(" ")[1]; // "Bearer <token>"
            try {
                req.decoded = await verifyToken(tokenPart);
                next();
            } catch (err) {
                res.status(403).json({ status: 403, message: "Invalid token" });
            }
        } else {
            res.status(403).json({ status: 403, message: "No token provided" });
        }
    }
}

module.exports = { apiVersionMiddleware, verifyTokenMiddle };