const bcrypt = require('bcryptjs');

const session = require('express-session');

const User = require('../models/user');

const Chat = require('../models/chat');
 
const Account = require('../models/account');

const nodemailer = require('nodemailer');

const flash = require('connect-flash');

//const flash = require('connect-flash');

const sendgridTransport = require('nodemailer-sendgrid-transport');

/*const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
         
         api_key : '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'
    }
}));*/


//// L A N D I N G     P A G E 
exports.getLp = (req , res ,next) => {
    if(req.session.isLoggedIn){
       /*() const friends = req.user.contacts.friends;

           return  res.render('chatList' , {
            path : '/chatlist',
            name : req.session.user.name,
            friends  : friends
        });*/
       return   res.redirect('/chatlist');
         }
         res.render('landing' , {
            path : '/',
           
         });
    }
    
    

//////  P H O N E NO  V E R I FI C AT I O N
exports.getVerified = (req , res ,next) => {

    let message = req.flash('error');
    if(message.length > 0)
    {
        message = message[0];
    }
    res.render('pverify' , {
        path : '/verify',
        errorMessage :  message
       
    });
};
 
exports.postVerified = (req , res ,next) => {
    const number = req.body.phoneNo;

    if(number.length === 10){
        User.findOne({phoneNo : number}).
        then(userDoc => {
            if(userDoc){
                console.log('already exists');
                req.flash('error' , 'Number already exists');
                return res.redirect('/verify');
            }
            res.render('otp' , {
                path : '/otp',
                phoneNo : number
        });
 
        }).catch(err=>{
            console.log(err);
        });
      
    }
    else{
        console.log('incorrect number');
        res.redirect('/verify');
    }
    
};

exports.getOTP = (req,res , next) => {
  /*  let message = req.flash('error');
    if(message.length > 0)
    {
        message = message[0];
    }
    else{
        message = null;
    }*/
    res.render('otp', {
        path : '/otp',
      // errorMessage : message
      });
};

exports.postOTP = (req , res , next) => {
    const otp = req.body.otp;
    const phoneNo = req.body.phoneNo;
   // console.log(otp);
   // console.log(phoneNo);
     if(otp === '1234'){
          res.render('auth' , {
           path : '/signup',
            phoneNo : phoneNo,
            errorMessage : null
        });
        console.log('correct otp');
    }
     else{
      /*   req .flash('error' , 'Incorrect OTP');
         let message = req.flash('error');
      if(message.length > 0)
     {
        message = message[0];
    }
    else{
        message = null;
    }*/
          res.render('otp' ,{
            path : '/otp',
            phoneNo : phoneNo,
            
        });
        console.log('Incorrect OTP');
        
    }
};


////// SIGN UP PAGE

exports.getSignUp = (req , res , next)=>{
     
    let message = req.flash('error');

      if(message.length > 0)
     {
        message = message[0];
    }
    else{
        message = null;
    }

     res.render('auth' , {
        path : '/signup',
        pageTitle : 'Signup',
        errorMessage : message,
        phoneNo : null
        
     });
};




/*exports.postLogin = (req , res , next) => {
    req.session.isLoggedIn = true;
}*/

exports.postSignUp = (req,res,next) => {
       
    const name = req.body.name;
    const gender = req.body.gender;
    const number = req.body.phoneNo;
    const password = req.body.password;
    let value = false;
   
    if(password.length < 8)
            {
                value = true;
            }
 if(value)
     {
         req.flash('error'  ,  'Password must contains atleast 8 characters');
         let message = req.flash('error');

         if(message.length > 0)
        {
           message = message[0];
         }
       else{
           message = null;
         }
   
     return   res.render('auth' , {
           path : '/signup',
           pageTitle : 'Signup',
           errorMessage : message,
           phoneNo : number
           
        });
     }

    User.findOne({phoneNo : number})
    .then(UserDoc => {
        if(UserDoc){
            console.log('NUMBER ALREADY EXISTS')
            return res.render('auth' ,{
                path : '/signup',
                phoneNo : number

            });
     }
        return bcrypt.hash(password , 12).
        then(hashedPassword => {
         //   const account = new Account({
         //       phoneNo : number
         //   });
             const users = new User({
                 name : name,
                 gender : gender,
                 image : 'not set',
                 status : 'Hey , I am using V Messenger ',
                 phoneNo : number,
                 password : hashedPassword
             });
          //   users.save().
           //  then(result=>{
          //       console.log('user added');
          //   }).
          //   catch(err=> {
           //      console.log(err);
//});
            console.log('user added');
             return users.save();
    
    }).
     then(result => {
         const user = result._id;
         const chat = new Chat({
             user : user,
            });
            chat.save().then(result=>{
              console.log('chat area created');
            }).
            catch(err=> {
                console.log(err);
            });
         res.redirect('/login');
        
    })
    .catch(err => {
        console.log(err);
    });
 
});
     
}
exports.getProfile = (req , res ,next) => {

const  status = req.user.status;
const  name  = req.user.name;
const avatar = req.user.image;
const number  = req.user.phoneNo;
    res.render('profile' , {
        path : '/profile',
        status : status,
        name : name, 
        avatar : avatar,
        phone : number
     });
}





exports.getLogin = (req , res , next) => {

        let message = req.flash('error');
        if(message.length > 0){
            message = message[0];
        }
        else{
            message = null;
        }
        
        console.log(req.session.isLoggedIn);
        res.render('login' ,{
        path : '/login',
        errorMessage : message,
          
        });
};

exports.postLogin = (req , res ,next) => {
    
    const number = req.body.phoneNo;
    const password = req.body.password;
    User.findOne({phoneNo : number})
    .then(user => {
        if(!user){
            console.log('User not found');
            req.flash('error' , 'Invalid Credentials');
            return res.redirect('/login');
        }
        bcrypt.compare(password , user.password)
        .then(doMatch=>{
            if(!doMatch)
            {   console.log('INCORRECT PASSWORD');
                req.flash('error' , 'Invalid Credentials');
                return res.redirect('/login');
            }
            if(doMatch)
            {
                
                req.session.isLoggedIn = true;
                req.session.user = user;
                 return req.session.save(err=>{
                  console.log(err);
                 res.redirect('/chatlist');
                    
                });
            }
            return res.redirect('/login');
        })
        .
        catch(err=> {
            console.log(err);
            res.redirect('/login');
        })
    });
    
}

exports.postLogOut = (req , res , next) => {  
    req.session.destroy(() => {
        res.redirect('/login');
    })
}




     


