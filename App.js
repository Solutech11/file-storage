//starting express app
const express = require('express')
const app = express()
//prt
const port = 3000


//middlewares

//morgan: its used to test ur app the routes its going to nd speed
const morgan =require('morgan')
app.use(morgan('dev'))

//used to accept post from client form
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

//environment variable used to store variables that can be used nd called anywhere
require('dotenv').config()

//session: stores a user data a key that can be used to access user information and deprive other from getting access from any page that doesnt belong to them
// call it auth... like an authorizer to authorize users to get a page or deprive them from a certain page
// user must login or regiser to get any page in this website
const session = require('express-session')
app.use(session({secret:process.env.sessionsecret,resave:true, saveUninitialized:true,cookie:{
    expires:2678400000// when the session should expire
}}))

//this is used to accept uploading of files
const fileupload= require('express-fileupload')
app.use(fileupload({useTempFiles:true}))//allows storage on a temporary file path

//its a plateform for storing files
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret

})// configuring your details

//seting your view engine
app.set('view engine','ejs')

//setting your static folder for css and images nd...
app.use(express.static('public'))


//this is what connect and perform operation in DB
const mongoose = require('mongoose')
mongoose.connect(process.env.mongolink,{useNewUrlParser:true, useUnifiedTopology:true}).then(res=>{// this connects to db, db link in dot env 
    if(res){
        console.log('db connected');
        //after db is connected routes are being runned
        app.listen(port, ()=> console.log('running'))
    }else{
        console.log('db not connected');
    }
}).catch(err=>console.log(err))// promise to log db error if any



////////////////////////////////////routes//////////////////////////////////

app.use('/', require('./router/home'))// home or general route
app.use('/register', require('./router/register'))// register route
app.use('/login', require('./router/login'))//login route
app.use('/add', require('./router/add'))// add item route



//404 page route
app.use((req,res)=>{
    res.status(404).render('404')
})