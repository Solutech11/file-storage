const documents = require('../models/documents');
const user = require('../models/user');
const cloudinary= require('cloudinary')
const date = require('date-and-time')// helps us arange our date for us
const router = require('express').Router()

router.get('/',async(req,res)=>{
    const sess= req.session
    //checking our session 
    if (sess.user) {
        try {
            const check = await user.findOne({email:sess.user})// icheck if email is in session
            
            if (check) {//if seession value exist
                
                res.render('add',{msg:''})//render the add page
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


router.post('/',async(req,res)=>{
    const sess= req.session//getting session
    const collect = req.body//getting data sent from user

    // if the user is in session 
    if (sess.user) {
        //promise to run code nd return all error at the end
        try {
            const check = await user.findOne({email:sess.user}) //collecting user data from db through the user session
            const file =req.files.doc//collecting file input from user

            if (check) {//userdata exist
                //user input validation
                if (collect.Name!=null &&collect.desc!=null) {
                if ((collect.Name).length>4 &&(collect.desc).length>4 ) {

                    //validating filetype we are accepting
                    if (file.mimetype=='application/msword'||file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'|| file.mimetype=='application/vnd.ms-powerpoint'||file.mimetype=='application/vnd.openxmlformats-officedocument.presentationml.presentation'|| file.mimetype=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'|| file.mimetype=='application/vnd.ms-excel') {
                        const now = new Date()//calling our date for now
                        //saving the document excluding the document link so we would save the document with a special id in cloudinary
                        const newdoc = new documents({userid:check._id, Name: collect.Name, desc:collect.desc, date: date.format(now,'hh:mm A, DD MMM, YYYY'),docLink:'pr', publicID:'pr' })
                        
                        const save= await newdoc.save()

                        //this is were the file uploaded ... resource is to tell cloudinary if we are showcasing images video or not. public id directs us to folder we saving at and aslo giving the file its right name
                        const upload =await cloudinary.v2.uploader.upload(file.tempFilePath,{resource_type: "raw", public_id:`theresa/documentmanager/${save._id+file.name}`})
                        //after file uploads, we will edit and add the file url to the db
                        await documents.updateOne({_id:save._id},{docLink:upload.secure_url, publicID:upload.public_id})
                        //after all take us back to home page
                        res.redirect('/')
                        } else {
                            //check if mimetype is pdf
                            if (file.mimetype=='application/pdf') {
                                const now = new Date()
                                const newdoc = new documents({userid:check._id, Name: collect.Name, desc:collect.desc, date: date.format(now,'hh:mm A, DD MMM, YYYY'),docLink:'pr', publicID:'pr' })
                                
                                const save= await newdoc.save()
                                const upload =await cloudinary.v2.uploader.upload(file.tempFilePath,{resource_type: "auto", public_id:`theresa/documentmanager/${save._id+file.name}`})
                                await documents.updateOne({_id:save._id},{docLink:upload.secure_url, publicID:upload.public_id})
                                
                                res.redirect('/')
                            } else {
                                res.render('add',{msg:'invalid filetype'})
                            }
                        }
                    }else{
                        res.render('add',{msg:'fill the form'})

                    }
                } else {
                    res.render('add',{msg:'fill the form'})
                }
                
            } else {
                sess.destroy()
                res.status(404).render('404')
            }
        } catch (error) {
            console.log(error);
            res.render('add',{msg:'error occured'})

        }
        
    } else {
        res.status(404).render('404')

    }
    
})


module.exports = router