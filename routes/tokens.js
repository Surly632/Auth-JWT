const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
async function createAccessToken(user) {
  return jwt.sign({email:user.email}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});
}

async function createRefreshToken(user) {
    return jwt.sign({email:user.email}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
  }
async function sendAccessToken(req,res,accessToken) {
   res.json({accessToken:accessToken});
}
async function sendRefreshToken(req,res,refreshToken) {
     res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        path:'/refresh_token'
     })
}

  module.exports= {createAccessToken,createRefreshToken,sendAccessToken,sendRefreshToken};