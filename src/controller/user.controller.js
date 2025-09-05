import asyncHandler from "../utils//async.utils.js"
import apiError from "../utils/error.utlis.js"
import { User } from "../models/user.model.js"
import cloudinary_Upload from "../services/cloudinary.services.js"
import apiResponse from "../utils/response.utils.js"

const getTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found for token generation");
        }

        const refresh = user.RefreshTokenGenerator();
        const access = user.AccessTokenGeneration();

        user.refreshToken = refresh;
        await user.save({ validateBeforeSave: false });
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
    //send cookie

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

    //access and referesh token

    const { accessToken, refreshToken } = await getTokens(data._id)
    console.log(data);


    //cookies options 

    const options = {
        httpOnly: true,
        secure: true
    }


    //response sent

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("accessToken", accessToken, options)
        .json(200, "Loggined Successfully")
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        { 
            $unset: {
                refreshToken: 1 
            }},
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
        .json(new ApiResponse(200, {}, "User logged Out"))
})


const test = asyncHandler((req, res) => {
    const userdata = req.body
    res.status(200).json({
        message: "hello_world",
        data: userdata
    })
})
export { test, registerUser, loginUser, logoutUser }