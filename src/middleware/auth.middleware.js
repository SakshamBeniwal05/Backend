import jwt from "jsonwebtoken"
import asyncHandler from "../utils/async.utils"
import apiError from "../utils/error.utlis"
import { User } from "../models/user.model"

export const verification = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken
    
        if (!token){
            throw new apiError(400, "Unauthorized Request")
        }
    
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_VALUE)
    
        const user = await User.findById(decoded?._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(400,"Invalid Access Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
})