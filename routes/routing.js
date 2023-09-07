const express = require('express')
const router = express.Router()
const User = require('../utils/userModel')
const bcrypt = require('bcrypt')
const List = require('../utils/listModel')

const isLoggedIn = async (req, res , next)=>{
    if (req.session['username']) {
        next()
    } else {
        return res.status(301).redirect('/login')
    }                                                                                                       
}

const isNotLoggedIn = async(req,res,next) => {
    if (req.session['username']) {
        res.status(403).redirect('/')
    } else {
        next()
    } 
}

router.get('/', (req, res)=>{
    return res.render('index',{name:req.session["username"]})
})

router.get('/register',isNotLoggedIn,(req, res)=>{
    return res.render('register', {user:'guest',name:req.session["username"]})
})

router.get('/login',isNotLoggedIn,(req, res)=>{
    return res.render('login', {user:"guest",name:req.session["username"]})
})



router.post('/register', async (req, res)=>{
    console.log(req.body.name)
    console.log(req.body['email'])
    username = req.body.name
    email = req.body.email
    phone = req.body.phone
    password = req.body.password

    const encryptedPassowrd = bcrypt.hashSync(password, 10) // sync
    console.log(encryptedPassowrd)
    const user = new User({
        username:username,
        email:email,
        phone:phone,
        password:encryptedPassowrd
    })
    
    let result = await User.findOne({ email: email });
    console.log(result)
    if (result != null) {
        return res.render('register', {user: "exist",name:req.session["username"]})
    }else {
        try{
            let result = await user.save()
            await console.log(`Saved successfully result : ${result}`)
            await res.redirect('/login')
        } catch (error) {
            console.log(error);
            return res.redirect('/register')
        }
    }    
})

router.post('/login', async(req, res)=>{
    console.log(req.body.email)
    console.log(req.body['password'])
    let email = req.body.email
    let password = req.body['password']
    let result = await User.findOne({ email: email });
    console.log(result)
    if (result == null) {
        return res.render('login', {user: "null",name:req.session["username"]})
    }else {
        resultPassword = result.password
        const same = await bcrypt.compareSync(password, resultPassword)
        console.log(same)
        if(same) {
            req.session["username"] = result.username; 
            res.render('index',{name:req.session["username"]})
        } else {
            res.render('login', {user:"",name:req.session["username"]})
        }
        
    } 
    
})

router.get('/logout',isLoggedIn,function(req, res){
    req.session.destroy(function(){});
    res.redirect('/');
    });

router.get('/list', async (req, res, next)=>{
    let result = await List.find();
    console.log(result)
    res.render('list', {articles : result,name:req.session["username"]})
})

router.get('/create',isLoggedIn, (req,res,next)=>{
    res.render('create',{name:req.session["username"]})
})

router.post('/create', async (req,res,next)=>{
    title = req.body.title
    author = req.body.author
    desc = req.body.desc
    console.log(title)

    const list = new List({
        title:title,
        author:author,
        desc:desc
    })

    try{
        let result = await list.save()
        await console.log(`Saved successfully result : ${result}`)
        await res.redirect('/list')
    } catch (error) {
        console.log(error);
        return res.redirect('/create')
    }
})

var ObjectId = require('mongoose').Types.ObjectId;
router.get('/delete/:id', async (req,res)=>{
    await List.deleteOne({_id:new ObjectId(req.params)})
    
    res.redirect('/list')
})

router.get('/:id',async (req,res)=>{
    result = await List.findOne({_id:new ObjectId(req.params)})
    console.log(result)
    title = result.title
    author = result.author
    desc = result.desc
    res.render('edit', {
        name:req.session["username"],
        data:{
            title:title,
            author:author,
            desc:desc,
            id: result._id
        }
    })

})

router.post('/edit/:id',async (req ,res)=>{
    title = req.body.title
    author = req.body.author
    desc = req.body.desc
    await List.updateOne(
        {_id:new ObjectId(req.params)}, 
        { title: title ,author:author ,desc: desc })
    
    res.redirect("/list")
})

module.exports = router