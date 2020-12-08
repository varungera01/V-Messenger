const express = require('express');

const authController = require('../controllers/auth');

const isAuth =  require('../middleware/is-auth');

const router = express.Router();

router.get('/' ,authController.getLp);

router.get('/verify' , authController.getVerified);

router.post('/verify' , authController.postVerified);

//router.post('/verify2' , authController.postVerified2);

router.get('/signup' , authController.getSignUp);

router.post('/signup' , authController.postSignUp);

router.get('/login' , authController.getLogin);

router.post('/login' , authController.postLogin);

router.post('/logout' , authController.postLogOut);

//router.post('/signup' , authController.postLogin);

router.get('/otp' , authController.getOTP);

router.post('/otp' , authController.postOTP);

router.get('/profile' , isAuth , authController.getProfile);

//router.post('/signup' , authController.postSignup);

module.exports = router;




