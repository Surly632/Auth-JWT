const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email:{
        type:String,
        max:50,
        required:true,
        unique:true,
        lowercase:true
    },
    username:{
        type:String,
        max:20,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        max:20,
        required:true
    },
    tokens:{
        type:Array,
        default:[]
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);
module.exports = {User};