import asyncHandler from "../utils//async.utils.js"
import apiError from "../utils/error.utlis.js"
import { User } from "../models/user.model.js"
import cloudinary_Upload from "../services/cloudinary.services.js"
import apiResponse from "../utils/response.utils.js"
import { configDotenv } from "dotenv"

// const registerUser = asyncHandler(async (req, res) => {

//     // get user details from frontend

//     const { username, email, fullname, password } = req.body


//     // validation - not empty

//     if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
//         throw new apiError(400, "All fields are required")
//     }


//     // check if user already exists: username, email

//     if (await User.findOne({ username })) {
//         throw new apiError(400, "username already exist")
//     }
//     if (await User.findOne({ email })) {
//         throw new apiError(400, "account already exist from this email")
//     }

//     // check for images, check for avatar

//     const avatarLocalStoarage = req.files?.avatar[0]
//     console.log(avatarLocalStoarage);
//     if (!avatarLocalStoarage.path) {
//         throw apiError(400, "please add avatarImage")
//     }


//     // upload them to cloudinary, avatar

//     const avatar = await cloudinary_Upload(avatarLocalStoarage.path)


//     // create user object - create entry in db
//     const UserDataEntry = User.create({
//         fullname,
//         username,
//         email,
//         password,
//         avatar: avatar.url,
//     })


//     // remove password and refresh token field from response

//     const createdUser = User.findById(UserDataEntry._id).select("-password, -refreshToken")


//     // check for user creation

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }


//     // return res

//     return res.status(201).json(
//         new apiResponse(200, createdUser, "User registered Successfully")
//     )
// })


const test = asyncHandler((req, res) => {

    const userdata = req.body
    res.status(200).json({
        message: "hello_world",
        data: userdata
    })
})
export { test, registerUser }    