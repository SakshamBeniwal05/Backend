import asyncHandler from "../utils//async.utils.js"
import apiError from "../utils/error.utlis.js"
import { User } from "../models/user.model.js"
import cloudinary_Upload from "../services/cloudinary.services.js"
import apiResponse from "../utils/response.utils.js"
import { configDotenv } from "dotenv"

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body

    // validation - not empty
    if ([username, email, fullname, password].some(field => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    // check if user already exists
    if (await User.findOne({ username })) {
        throw new apiError(400, "Username already exists")
    }
    if (await User.findOne({ email })) {
        throw new apiError(400, "Account already exists with this email")
    }

    // check for avatar
    const avatarFile = req.files?.avatar?.[0]
    if (!avatarFile?.path) {
        throw new apiError(400, "Please add avatar image")
    }

    // upload avatar to cloudinary
    const avatar = await cloudinary_Upload(avatarFile.path)

    // create user entry
    const newUser = await User.create({
        fullname,
        username,
        email,
        password,
        avatar: avatar.url,
    })

    // fetch user without password & token
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new apiResponse(201, createdUser, "User registered successfully")
    )
})

const test = asyncHandler((req, res) => {

    const userdata = req.body
    res.status(200).json({
        message: "hello_world",
        data: userdata
    })
})
export { test, registerUser }    