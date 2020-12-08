const express =  require('express');

const chatController = require('../controllers/chat');

const friendController = require('../controllers/friends');


const isAuth =  require('../middleware/is-auth');


const router = express.Router();

//router.get('/chat' , isAuth , chatController.getChat);

router.get('/chatlist' ,isAuth ,  chatController.getchatList);

router.post('/addfriend' , isAuth , friendController.postAddFriend); 

router.get('/chat/:userId' , isAuth , chatController.getChat);

router.get('/groupChat/:groupId' , isAuth , chatController.getGroupChat)

router.get('/groups' , isAuth , chatController.getGroups);

module.exports = router;

