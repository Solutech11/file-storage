const mongoose= require('mongoose')

const Schema= mongoose.Schema

const user= new Schema({
    email:{
        required:true,
        type:String,
        unique:true
    },
    Name:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
    
})


module.exports= mongoose.model('user',user)