const jwt = require("jsonwebtoken");
const { jwtConfig }  = require("../config/certificate");

const generateToken = (user)=> {
    return jwt.sign(user, jwtConfig.secret, { expiresIn: "1h" });
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports = { generateToken, verifyToken };



/**
 * 刷新令牌和访问令牌
 * 问题：前端自动刷新和重新请求
 */
/*
// 生成一个新的access token
const generateToken = (id)=> {
    const payload = { id, time: new Date() };
    // 生成 JWT 字符串
    const token = jwt.sign(payload, secret, {
        expiresIn: 15 * 60,
    });
    return token;
};

// 验证access token
const verifyToken = async (tok)=> {
    try {
        const decoded = await jwt.verify(tok, secret);
        return decoded;
        // return 1;
    } catch(err) {
        console.error("Token verification failed:", err.message); // 记录错误信息
        // return 0; // 验证失败
        throw new Error("Invalid token");
    }
};

// 生成刷新token
const generateRefreshToken = (id)=> {
    const payload = { id, time: new Date() };
    const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: 7 * 24 * 60 * 60, // 7天有效期
    });
    return refreshToken;
};

// 验证刷新token并获取新的访问token
const refreshToken = async (refreshTok)=> {
    try {
        const decoded = await jwt.verify(refreshTok, refreshSecret);
        // 在刷新access token时重新生成一个新的refresh token
        const newAccessToken = generateToken(decoded.id);  
        const newRefreshToken = generateRefreshToken(decoded.id);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        console.error("Refresh token verification failed:", err.message);  
        throw new Error("Invalid refresh token"); // 抛出错误
    }
};


module.exports = { 
    generateToken, 
    verifyToken,
    generateRefreshToken,
    refreshToken,
};
*/