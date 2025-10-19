import asyncHandler from "../utils//async.utils.js"
import apiError from "../utils/error.utlis.js"
import { User } from "../models/user.model.js"
import { cloudinary_Upload } from "../services/cloudinary.services.js"
import apiResponse from "../utils/response.utils.js"
import jwt from "jsonwebtoken"

const getTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found for token generation");
        }

        const refresh = user.RefreshTokenGenerator();
        const access = user.AccessTokenGenerator();

        user.refreshToken = refresh;
        await user.save({ validateBeforeSave: false })

        return { access, refresh };

    }
    catch (error) {
        throw new apiError(500, "Server error: can't generate session");
    }
};

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
    console.log(avatarFile);

    // upload avatar to cloudinary
    const avatar = await cloudinary_Upload(avatarFile.path)
    console.log(avatar);

    // check if cloudinary upload was successful
    if (!avatar || !avatar.url) {
        throw new apiError(500, "Failed to upload avatar to cloudinary")
    }

    // create user entry
    const newUser = await User.create({
        fullname,
        username,
        email,
        password,
        avatar: avatar.url,
    })

    console.log(newUser);


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

const loginUser = asyncHandler(async (req, res) => {


    // req body -> data

    const { username_email, password } = req.body

    if (!username_email || !password) {
        throw new apiError(400, "Please enter credentials")
    }


    //find the user
    let email, username, data
    if (username_email.includes("@")) {
        email = username_email
        data = await User.findOne({ email })
    }
    else {
        username = username_email
        data = await User.findOne({ username })
    }

    if (!data) {
        throw new apiError(400, "wrong username or password")
    }


    //password check
    const password_validator = await data.isPasswordCorrect(password)

    if (!password_validator) {
        throw new apiError(400, "incorrect passoword")
    }

    const { access: accessToken, refresh: refreshToken } = await getTokens(data._id)


    //cookies options

    const options = {
        httpOnly: true,
        secure: true
    }



    //response sent

    console.log({ accessToken, refreshToken });


    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ status: 200, message: "Loggined Successfully" })
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, "User logged Out"))
})

const tokenRefreshing = asyncHandler(async (req, res) => {

    // Use refresh token, not access token
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingToken) {
        throw new apiError(400, "No refresh token found, please provide refreshToken")
    }

    // Verify with refresh token secret
    const decodedIncomingToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_VALUE)

    const incomingTokenData = await User.findById(decodedIncomingToken._id)

    if (!incomingTokenData) {
        throw new apiError(400, "Invalid token")
    }

    if (incomingToken !== incomingTokenData.refreshToken) {
        throw new apiError(400, "Refresh token expired")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const { access: accessToken, refresh: refreshToken } = await getTokens(incomingTokenData._id)

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, "token provided successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const currenUserData = req.user
    res.json(new apiResponse(200, currenUserData, "current user fetched successfully"))
})

const test = asyncHandler((req, res) => {
    const userdata = req.body
    res.status(200).json({
        message: "hello_world",
        data: userdata
    })
})

const channel_details_fetch = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {
        throw new apiError(400, "no channel exist on this username")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "channel",
                localField: "_id",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "subscriber",
                localField: "_id",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channel_Subscribed_count: {
                    $size: "subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false,
                    }
                }
            }
        },
        {
            $project:{
                fullname: 1,
                username: 1,
                subscriberCount: 1,
                channel_Subscribed_count: 1,
                isSubscribed: 1,
                avatar: 1,
                
            }
        }
    ])

    if(!channel?.length){ 
        throw new apiError(400,"channel doesnt exist")
    }

    return res.status(200).json(new apiResponse(200,channel[0],"user channel fetched done"))
})



export { test, registerUser, loginUser, logoutUser, tokenRefreshing, getCurrentUser, channel_details_fetch }