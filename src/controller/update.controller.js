import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.utils.js";
import apiError from "../utils/error.utlis.js";
import apiResponse from "../utils/response.utils.js";
import {cloudinary_Update} from "../services/cloudinary.services.js"

const updateAvatar = asyncHandler(async (req, res) => {
    const userData = await User.findById(req.user._id);

    const oldAvatar = req.user.avatar

    const newAvaatr = req.file
    if (!newAvaatr?.path) {
        throw new apiError(400, "Please add avatar image")
    }



    res.status(200).json(new apiResponse())
})

const updateCoverImage = asyncHandler(async (req, res) => { })

const updatePassword = asyncHandler(async (req, res) => {

    const userData = await User.findById(req.user._id);

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        throw new apiError(400, "please enter credentials")
    }

    const passwordVerification = await userData.isPasswordCorrect(currentPassword)

    if (!passwordVerification) {
        throw new apiError(400, "incorrect current password")
    }

    userData.password = newPassword
    await userData.save()

    res.status(200).json(new apiResponse(200, "Password Updated Successfully"))

})

export { updateAvatar, updateCoverImage, updatePassword }