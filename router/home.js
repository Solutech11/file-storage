const documents = require('../models/documents');
const user = require('../models/user'),
cloudinary= require('cloudinary')//calling our cloudinary
const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    //checking if user is in session
    if (sess.user) {
        try {
            //collecting user data from db through the user session
            const check = await user.findOne({email:sess.user})
            
            //userdata exist
            if (check) {
                const userDoc=await documents.find({userid:check._id})// collect all the users document in accordance with user id
                res.render('home',{userDoc, Name:check.Name})// render home ejs nd parsering user name nd all of this usrs document
            } else {
                sess.destroy()
                res.redirect('/register')
            }
        } catch (error) {
            console.log(error);
        }
        
    } else {
        res.redirect('/register')
    }
    
})

router.get('/delete/:id',async(req,res)=>{
    const sess= req.session
    const _id= req.params.id
    if (sess.user) {
        try {
            const check = await user.findOne({email:sess.user})
            
            if (check) {
                if (_id.length==24) {
                    const userDoc=await documents.findOne({userid:check._id,_id})
                    if (userDoc) {
                        await cloudinary.v2.uploader.destroy(userDoc.publicID,{resource_type:'raw'})
                        await documents.deleteOne({_id, userid:check._id})
                        res.redirect('/')
                    } else {
                res.status(404).render('404')
                        
                    }
                } else {
                res.status(404).render('404')
                    
                }
                
            } else {
                sess.destroy()
                res.status(404).render('404')
            }
        } catch (error) {
            console.log(error);
        }
        
    } else {
                res.status(404).render('404')
    }
    
})
module.exports = router