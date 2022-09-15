const user = require('../models/user')
const bcrypt= require('bcrypt')

const router = require('express').Router()

//render login route
router.get('/',(req,res)=>{
    res.render('login',{msg:''})
})


//sends a post for login
router.post('/',async(req,res)=>{
    const sess= req.session// session
    const collect= req.body// user input

    //promise to run code nd return all error at the end
    try {
        //user input validation
        if (collect.email!=null && collect.pass!=null) {
            if ((collect.email).length>4 &&(collect.pass).length>4) {

                const chk= await user.findOne({email:collect.email})// this is to check if user email exist inso he can be logged in
                if (chk) {//user exist
                    const chkpass= bcrypt.compareSync(collect.pass, chk.password)// using becrypt to compare the user login password nd db hashed password
                    if (chkpass==true) {//ife password is correct
                        sess.user= collect.email// save user session
                        res.redirect('/')
                    } else {//validations are wrong
        res.render('login',{msg:'Incorrect Password'})
                        
                    }
                } else {
        res.render('login',{msg:'user doesnt exist'})
                    
                }
            } else {
        res.render('login',{msg:'Fill the form'})
                
            }
        } else {
        res.render('login',{msg:'Fill the form'})
            
        }
    } catch (error) {
        console.log(error);
        res.render('login',{msg:'error occured'})
    }
})

module.exports = router