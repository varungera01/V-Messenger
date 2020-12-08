const User = require('../models/user');
const Group = require('../models/group');

exports.getChat = (req , res , next) => {
    const uId = req.params.userId;  
    const uid = req.query.room;
   // console.log(uid);
  //  console.log(uId);
     User.findById(uId)
     .then(person => {
         const  avatar = person.image;
        res.render('chat' , {
            receiver : person.name.toUpperCase(),
            path : '/chat',
            title : 'chatt',
            name :  JSON.stringify(req.session.user.name),
            avatar : avatar
        
          
        });
     }).catch(err=>{
         console.log(err);
     });
};

exports.getGroupChat = (req , res , next) => {
   // const  = req.params.groupId;  
    const gId = req.query.room;
   // console.log(uid);
  //  console.log(uId);
     Group.findById(gId)
     .then(group => {
        res.render('groupChat' , {
            receiver : group.g_name.toUpperCase() ,
            path : '/groupChat',
            title : 'Groupchat',
            name :  JSON.stringify(req.session.user.name),
            senderId :  JSON.stringify(req.session.user._id),
            
          
        });
     }).catch(err=>{
         console.log(err);
     });
};


exports.getchatList = (req , res , next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    const gender =  req.user.gender;
    let avatar = req.user.image;
    let random_no = Math.floor(Math.random() * 5)
   // console.log(random_no);
    let image;
    if(avatar === 'not set')
          {
              if(gender === 'Male')
                 {
                    switch (random_no)
                     {
                        case 0:
                           image = '/images/M-avatar/fa1.jpg';
                          break;
                        case 1:
                           image= '/images/M-avatar/fa2.jpg';
                          break;
                        case 2:
                           image = '/images/M-avatar/fa3.jpg';
                          break;
                        case 3:
                          image = '/images/M-avatar/fa4.jpg';
                          break;
                        case 4:
                          image  = '/images/M-avatar/fa5.jpg';
                          break;
                       }
                }
                else{
                    switch (random_no)
                     {
                        case 0:
                          image = '/images/f-avatar/wa1.jpg';
                          break;
                        case 1:
                          image = '/images/f-avatar/wa2.jpg';
                          break;
                        case 2:
                           image = '/images/f-avatar/wa3.jpg';
                          break;
                        case 3:
                          image = '/images/f-avatar/wa4.jpg';
                          break;
                        case 4:
                          image = '/images/f-avatar/wa5.jpg';
                          break;
                       }
                }
                //console.log(image);
                req.user.setImage(image).
    then(result=> {
     console.log('IMAGE SET');
    }).
    catch(err=> {
        console.log(err);
    });
    }

    
    const friends = req.user.contacts.friends;
    const groups = req.user.groups;
    let status = req.user.status;
     avatar = req.user.image;
     const phone  = req.user.phoneNo;
    // console.log(avatar);
   
     res.render('chatList' , {
        path : '/chatlist',
        name :     req.session.user.name,
        id :   req.session.user._id,
        friends  : friends,
        groups : groups,
        status : status,
        gender : gender,
       avatar :  avatar,
       phone : phone
    });
 };


exports.getGroups = (req , res , next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }

    const friends = req.user.contacts.friends;
    res.render('groups' , {
        path : '/chatlist',
        friends : friends ,
        name :     req.session.user.name,
        id :     req.session.user._id,
    });
};
