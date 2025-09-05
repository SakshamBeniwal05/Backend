import { Router } from "express";
import { test, registerUser, loginUser, logoutUser } from "../controller/user.controller.js";
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

export default userRouter