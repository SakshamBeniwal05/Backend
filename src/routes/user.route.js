import { Router } from "express";
import { test, registerUser } from "../controller/user.controller.js";
import upload from '../middleware/multer.middleware.js'

const userRouter = Router()
userRouter.route('/test').post(test)
userRouter.route('/register').post(upload.fields([{
    name: "avatar",
    maxCount: 1
}, {
    name: "cover",
    maxCount: 1
}]), registerUser)

export default userRouter 