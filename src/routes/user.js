const express = require('express');
const userRouter = express.Router();
const userControllers = require('../controller/user');
const {protect} = require('../middlewares/authentication')
// const { errorWrapper } = require('../common/utility');


userRouter.post('/register', userControllers.register)
userRouter.post('/login',userControllers.login)
// userRouter.route("/profile").get(protect, authControllers.getUserProfile).put(protect, authControllers.updateUserProfile);


module.exports = userRouter;