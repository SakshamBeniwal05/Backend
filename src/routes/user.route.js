import { Router } from "express";
import { test } from "../controller/user.controller.js";
const userRouter = Router()

userRouter.route('/test').post(test)

export default userRouter