//const bcrypt = require('bcryptjs');

//const session = require('express-session');

const User = require('../models/user');
const Chat = require('../models/chat');

//const Account = require('../models/account');

exports.postAddFriend = (req , res , next)=> {

  // const groups = req.user.contacts;
    
    const  number = req.body.phoneNo;
    User.findOne({phoneNo : number}).

       then(userDoc => {
           if(!userDoc){
               console.log('user not found');
               return res.redirect('/chatList');
           }
          Chat.findOne({user : req.user._id}).
          then(user=>{
              user.addReceiver(userDoc._id);
          }).
          catch(err=>{
              console.log(err);
          });
        
            return req.user.addFriend(userDoc).
             then(result=> {

            console.log('friend added');
            res.redirect('/chatlist');
        }).
        catch(err=> {
            console.log(err);
        });
       });
    
};













/*exports.postAddFriend = (req , res , next)=> {
    
    const  number = req.body.phoneNo;
    User.findOne({phoneNo : number}).

       then(userDoc => {
           if(!userDoc){
               console.log('user not found');
               return res.redirect('/chatList');
           }
           console.log('User Exist');
           
           return req.user.addFriend(userDoc).
            then(result=> {

            console.log('friend added');
            res.redirect('/chatlist');
        }).
        catch(err=> {
            console.log(err);
        });
       });
    
};*/