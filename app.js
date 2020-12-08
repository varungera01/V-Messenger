const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
//const flash = require('connect-flash');
const mongoose = require('mongoose');
const Chat = require('./models/chat');
 

const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');
const Group = require('./models/group');

const flash = require('connect-flash');
const SimpleCrypto = require("simple-crypto-js").default;

//const authRoutes = require('./routes/auth');



const app = express();

const store = new MongoDBStore({
  uri : 'mongodb+srv://varun__gera:Amroha@01@cluster0.e7oms.mongodb.net/ChatMessenger',
  collection : 'sessions'
});

const csrfProtection = csrf();
app.use(flash());
app.use(express.json({limit : '1mb'}));


const http = require('http').createServer(app);

const io = require('socket.io')(http);

app.set('view engine' , 'ejs');
app.set('views' , 'views');

const authRoutes = require('./routes/auth');

const chatRoutes  = require('./routes/chat');

app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'vfgdesfahysgbhjbsxnjhbj' ,
  resave : false ,
  saveUninitialized :false ,
 store : store
}));

app.use(csrfProtection);

 app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req , res , next)=> {

  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});



app.use(authRoutes);
//app.use(errorController.get404);

app.use(chatRoutes);
app.post('/api' , (req , res , next) => {
      res.setHeader('Access-Control-Allow-Origin' , '*');
      res.setHeader('Access-Control-Allow-Methods' , 'GET , POST , PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers' , 'Conent-type , Authorization');
     //  console.log(req.body);
       const data = req.body;
       let groupId;
      // console.log(data);
        const  members = data.group;
       // console.log(members);
        const group = new Group({
          g_name : data.group_name,
          groupMates : data.group

        });
         group.save().
         then(result=>{
           
           groupId = result._id;
         //  console.log(groupId);

           members.forEach(member => {
            const  id = mongoose.Types.ObjectId(member.id);
            User.findById(id).then(user => {
                 user.createGroup(data , groupId).then(result=>{
                   console.log('GROUP ADDED');
                   
                   
                 }).
                 catch(err=> {
                   console.log(err);
                 });
            });
       });
         }).
         catch(err=>{
           console.log(err);
         });

          //  const  gname = data.group_name;
        
    
        res.json({
        status : 'success',
        group : data.group,
        group_name : data.group_name
    });
       //return res.redirect('/chalist');
  });


  app.post('/updateBio' , (req , res , next) => {
    res.setHeader('Access-Control-Allow-Origin' , '*');
    res.setHeader('Access-Control-Allow-Methods' , 'GET , POST , PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers' , 'Content-type , Authorization');
    
    const data = req.body;
    
     const status = data.bio;
       req.user.updateBio(status).
       then(result=> {
         console.log('bio updated');
       }).
       catch(err=> {
         console.log(err);
       });

       res.json({
        status : 'success',
         bio : data
    });
     
  });
///////////////////////////////  S O C K E T S /////////////////////////////////

  io.on('connection' , (socket) => {

    room = socket.handshake.query.room;
    receiver = socket.handshake.query.receiver;
    socket.join(room , () => {
              console.log('room joined');
    });

  
              const x = room;
              const y = receiver;
              console.log(x , y);
            
              if(x !== y) {
              Chat.findOne({user : x}).
                 then(user =>{
                   let messages = user.messages;
                    //console.log(messages);
                    const  box  = messages.find(message=>{
                      return message.receiver === y;
                    });
                     const docs = box.inbox;
                 //  console.log(docs);
                   //io.to('some room').emit('some event');
                   socket.emit('load old messages' , docs);

             }).
             catch(err=>{
               console.log(err);
             });
              }
          
        
        
    
    
    socket.on('disconnect', () => {
    socket.leave(room);
    console.log('disconnected');
     });

     socket.on('send_notifications', (name, callback) => {
         console.log(name);
         //socket.broadcast.to(receiver).emit('send_notifications' , name); 
    });

    socket.on('typing' , (data)  =>{
        const rec = data.receiverId;
        socket.broadcast.to(rec).emit('typing' , data);
    });

    socket.on('typing' , (data)  =>{
      const rec = data.receiverId;
      socket.broadcast.to(rec).emit('typing' , data);
  });

    // socket.broadcast.to(receiver).emit('send-notifications' , 

    socket.on('g_message' , (msg , callback) => {
     // console.log(msg);
      const senderChatID = msg.senderId;//room
       const receiverChatID = msg.receiverId;
    
       const createdAt  = msg.createdAt;
       const  user = msg.user;
       const  message = msg.message;

       socket.broadcast.to(receiverChatID).emit('g_message',{
        senderId : senderChatID,   
        receiverId : receiverChatID,//room
        user : user,
        message : message,
        createdAt : createdAt
 });
   callback()
});
     
     socket.on('message', (msg , callback) => {

       const senderChatID = msg.senderId;//room
       const receiverChatID = msg.receiverId;
    
       const createdAt  = msg.createdAt;
       const  user = msg.user;
       const  message = msg.message;
       value = false;
      
       Chat.findOne({user : senderChatID}).
       then(user=> {
               const messages  = user.messages;
              // console.log(messages);
              // console.log(user);
                //console.log(receiver);
           user.addMessage(message , 'me' , receiverChatID , createdAt) ;

        Chat.findOne({ user : receiverChatID}).
        then(person=>{
          person.addMessage(message , 'receiver' , senderChatID , createdAt);
        }).
        catch(err=>{
              console.log(err);
        });
          
             socket.broadcast.to(receiverChatID).emit('message',{
             senderId : senderChatID,   
             receiverId : receiverChatID,//room
             user : user,
             message : message,
             createdAt : createdAt
      });
        callback()
      }).
        catch(err=> {
          console.log(err);
        });
});
         

  });

     




mongoose.connect(
  'mongodb+srv://varun__gera:Amroha@01@cluster0.e7oms.mongodb.net/ChatMessenger?retryWrites=true&w=majority',
  {
    useNewUrlParser: true
  }
)
.then(result =>  {
  http.listen(3000 , ()=>{
    console.log('Database Connected');
    console.log('SERVER IS RUNNING');
  });
}).catch(err=> {
  console.log(err);
});

  
  // console.log(room);

     /* socket.on('typing' , (name) =>{
        socket.broadcast.emit('typing' , name);
     });*/

 /*let msg = {
  senderId : senderId,
  receiverId : receiver,
  user : name,
  message : message.trim()
};*/


 



/*socket.on('typing' , (name) =>{
    socket.broadcast.emit('typing' , name);*/

   /* socket.on('message' , (msg) => {
      socket.broadcast.emit('message' , msg);
    });*/



   // /console.log(room);
    // console.log(receiver);
   /*
     Chat.findOne({user : room}).
     then(user=>{
         
            let messages  = user.messages;
            let inbox =   messages.find(()=>{
                if(messages.receiver === receiver) {
                  value1 = true;
                 }
            });
     }).
     catch(err=>{
         console.log(err);
     });
         */
