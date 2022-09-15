const mongoose= require('mongoose')// calling mongoose

const Schema= mongoose.Schema// creating a schema to structure ur keys

// assigning ur schema keys
const docs= new Schema({
    userid:{// this user id will reference to the owner of athe certain document
        required:true,
        type:String
    },
    Name:{
        required:true,
        type:String
    },
    desc:{
        required:true,
        type:String
    },
    date:{
        required:true,
        type:String
    },
    docLink:{
        required:true,
        type:String
    },
    publicID:{
        required:true,
        type:String
    }
})

//creating model to be stored in db ... forst docs is db name second is the schema
module.exports= mongoose.model('docs',docs)