const User = require('../models/user');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

function isstringinvalid(string) {
    if(string == undefined || string.length=== 0){
        return true;
    }else {
        return false;
    }
}
function isUserexist(email,phonenumber){
    const user = User.findAll({where : { email, phonenumber }})
    if(user){
        return true;
    }
    else{
        return false;
    }
}
// function generationAccessToken(id,name,ispremiumuser){
//     return jwt.sign({ userId : id , name:name ,ispremiumuser }, 'subhajit')
//  }

exports.signUp = async (req,res,next) => {
    try{
        const { name, email , phonenumber,password } = req.body;
        console.log('email',email,password,phonenumber)
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad params . something is missing"})
        }
        else if(isUserexist(email,phonenumber)){
            return res.status(403).json({err: "User already Exist"})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err,hash) => {
        await User.create( { name:name,email:email,phonenumber:phonenumber,password:hash})
           res.status(201).json({message: 'Succesfully done'})
           })
    } catch(err) {
        res.status(500).json(err);

    }
}

// exports.login = async (req,res) => {
//     try {
//         const { email,password } = req.body ;
//         console.log(email);
//         if( isstringinvalid(email) || isstringinvalid(password)){
//             return res.status(400).json({err: "Bad params . something is missing"})
//         }
      
//         const user = await User.findAll({where : { email }})
//         if(user.length > 0) {
//             bcrypt.compare(password,user[0].password, (err,result) => {
//                 if(err){
//                     throw new Error('something went wrong')
//                 }
//                 if(result === true){
//                     return res.status(200).json({ success: true, message: "User Logged in Successfully",token: generationAccessToken(user[0].id,user[0].name, user[0].ispremiumuser), user: user})
//                 } else {
//                     return res.status(401).json({ success:false, message: "Password is incorrect"})
//                 }
//             })
//         } else {
//             return res.status(404).json({success: false, message:"User doesn't exist"})
//         }
//     } catch(err) {
        
//         res.status(500).json({message:err , success:false})

//     }
// }