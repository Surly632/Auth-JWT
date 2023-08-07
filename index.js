const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createerror = require('http-errors');
const dotenv = require('dotenv');
  dotenv.config();
require('./helpers/init_mongodb');
const app = express();

const authRoute = require('./routes/auth').router;
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/auth',authRoute);
app.use(async(req,res,next)=>{next(createerror.NotFound())});


app.get('/',async (req,res)=>{
    res.json({status:true,message:"Homepage"});
    return;
})




app.listen(process.env.PORT,()=>{
    console.log(`Server is listening to port: ${process.env.PORT} ...`);
})