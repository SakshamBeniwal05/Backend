import jwt from "jsonwebtoken"
import asyncHandler from "../utils/async.utils.js"
import apiError from "../utils/error.utlis.js"
import { User } from "../models/user.model.js"

export const verification = asyncHandler(async(req,res,next)=>{
    try {
        let token = req.cookies?.accessToken;
        console.log("Access Token:", token); // Debug log

        if (!token || typeof token !== "string" || token.trim() === "") {
            throw new apiError(400, "Unauthorized Request: No token provided");
        }

        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_VALUE);

        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(400,"Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token");
    }
})