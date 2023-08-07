const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const user = require('../models/user').User;
const bcrypt = require('bcrypt');
const token = require('../routes/tokens')
const verify = require('../helpers/verifyToken').verifytoken;


router.post('/signup',async(req,res,next)=>{
   try {
    const email = req.body.email;
    const username = req.body.username;
    if(!email && !username) {
      res.json({success:false,message:"No username and email!"});
      throw createError.BadRequest();
    }
    const found = await user.findOne({email:email});

    if(found) {
     res.json({success:false,message:"User exists"}) ;
     throw createError.Conflict('User Already Exists!');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.pass,salt);
     const newUser = new user({
        email:req.body.email,
        username:req.body.username,
        pass:hash
     })
     const data = await newUser.save();
     const {pass,...others} = data._doc;
     res.json({status:true,data:others});
     return;
   } catch (err) {
     console.log(err.message);
   }
})
router.post('/login',async (req,res)=>{
   try {
    const found = await user.findOne({username:req.body.username});
    if(!found) res.status(419).send('user nor found!');

     const accessToken = await token.createAccessToken(req.body);
     const refreshToken = await token.createRefreshToken(req.body);
     console.log(found._doc,refreshToken);
     const foundCookie = req.cookies.refreshToken; 
    //  if(!refreshToken)
         await found.updateOne({$push:{tokens:refreshToken}});
     await token.sendRefreshToken(req,res,refreshToken);
     await token.sendAccessToken(req,res,accessToken);
   } catch (err) {
     console.log(err.message);
   }
})
router.post('/protected',verify,async (req,res)=>{
  try {
    const email = req.user.email;
    const curUser  = await user.findOne({email:email});
    console.log(curUser._doc);
    if(curUser)
    res.status(201).json({success:true, message:"Your protected data",data:curUser._doc})
  else 
   res.status(404).json({success:false,message:"User not found!"});
  } catch (err) {
    console.log(err);
    res.json({success:false});
  }
})

router.post('/refresh-token',verify,async(req,res)=>{
   try {
    const email = req.user.email;    
    const curUser = await user.findOneAndUpdate({email:email},{$pull:{tokens:token}});
    if(!curUser) res.json({success:false,message:"user does not exist"});
    
    const accessToken = await token.createAccessToken(req.body);
    const refreshToken = await token.createRefreshToken(req.body); 
    await curUser.updateOne({$push:{tokens:refreshToken}});
    const cookieToekn = req.cookies.refreshToken;
    /* I need to check if the refteshToken Stored in database and cookie token is same. Then: */
    
    res.clearCookie('refreshToken',{path:'/refresh_token'});
    token.sendRefreshToken(req,res,refreshToken);
    token.sendAccessToken(req,res,accessToken);

    res.status(201).json({success:true,Message:"tokens generated"});
    
   } catch ( err) {
      console.log(err.message);
   }
})
router.delete('/logout',verify,async (req,res)=>{
  const token = req.cookies.refreshToken;
  const email = req.user.email;
  const curUser = await user.findOneAndUpdate({email:email},{$pull:{followers:token}});
  res.clearCookie('refreshtoken',{path:'/refresh_token'});
    res.json({status:true,message:"logged out"});
})


module.exports={router};