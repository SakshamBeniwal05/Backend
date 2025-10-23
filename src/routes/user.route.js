import { Router } from "express";
import { test, registerUser, loginUser, logoutUser, tokenRefreshing, getCurrentUser, channel_details_fetch, get_history } from "../controller/user.controller.js";
import upload from '../middleware/multer.middleware.js'
import { verification } from "../middleware/auth.middleware.js";

const userRouter = Router()
userRouter.route('/test').post(test)
userRouter.route('/register').post(upload.fields([{
    name: "avatar",
    maxCount: 1
}, {
    name: "cover",
    maxCount: 1
}]), registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verification, logoutUser)
userRouter.route('/refreshTokens').post(tokenRefreshing)
userRouter.route('/CurrentUser').get(verification, getCurrentUser)
userRouter.route('/fetchChannel/:username').get(verification,channel_details_fetch)
userRouter.route('/watchHistory').get(verification,get_history)

export default userRouter