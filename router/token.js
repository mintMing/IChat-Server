app.post('/refresh-token', async (req, res) => { 
    try {  
      const refreshToken = req.body.refreshToken; // 假设刷新令牌是通过请求体发送的  
      const { accessToken, refreshToken: newRefreshToken } = await refreshToken(refreshToken);  
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, ... });  
      // 可以选择将新的刷新令牌存储在其他地方  
      res.send({ message: 'Token refreshed successfully' });  
    } catch (error) {  
      res.status(401).send({ error: 'Failed to refresh token' });  
    }  
  });
