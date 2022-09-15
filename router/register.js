const user = require('../models/user')// user model
const bcrypt= require('bcrypt')//for hashing password
const router = require('express').Router()

router.get('/',(req,res)=>{
    res.render('register',{msg:''})//render our register page
})


//post route for register
router.post('/',async(req,res)=>{
    const sess= req.session //getting session
    const collect= req.body//getting data sent from user

    //promise to run code nd return all error at the end
    try {
        //user input validation
        if (collect.username!=null && collect.email!=null && collect.pass!=null) {
            if ((collect.username).length>4 &&(collect.email).length>4 &&(collect.pass).length>4) {

                const chk= await user.findOne({email:collect.email})//checking if the email put by user exist ... this is beause u cant have two of the same email in a db
                if (chk) {// if email exist
        res.render('register',{msg:'email already exist'})
                    
                } else {//email doesnt exist
                    const adduser= new user({email:collect.email, Name:collect.username, password: bcrypt.hashSync(collect.pass,10)})//process of saving user ... in password side the first item is user password second is sand 
                    adduser.save()// to save
                    sess.user= collect.email// store user in a session with ur server
                    res.redirect('/')//after that takes us to home page
                }
            
                //if iput valitation are false
            } else {
        res.render('register',{msg:'Fill the form'})
                
            }
        } else {
        res.render('register',{msg:'Fill the form'})
            
        }
    } catch (error) {
        console.log(error);
        res.render('register',{msg:'error occured'})
    }
})

module.exports = router