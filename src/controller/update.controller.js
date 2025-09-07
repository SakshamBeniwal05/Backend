import { User } from "../models/user.model.js";
import asyncHandler from "../utils/async.utils.js";
import apiError from "../utils/error.utlis.js";
import apiResponse from "../utils/response.utils.js";
import { cloudinary_Update } from "../services/cloudinary.services.js";

const updateAvatar = asyncHandler(async (req, res) => {
    // Fetch user data from DB using auth middleware
    const userData = await User.findById(req.user._id);

    // Old avatar Cloudinary file URL
    const oldAvatar = userData.avatar;

    // New avatar file from user input (multer saves locally first)
    const newAvatar = req.file;

    // Ensure file is provided
    if (!newAvatar?.path) {
        throw new apiError(400, "Please add avatar image");
    }

    // If an old avatar exists, overwrite it, otherwise upload as new
    let response;
    if (oldAvatar) {
        response = await cloudinary_Update(oldAvatar, newAvatar.path);
    } else {
        response = await cloudinary_Upload(newAvatar.path);
    }

    // Save new Cloudinary URL into DB
    userData.avatar = response.secure_url;
    await userData.save();

    res.status(200).json(new apiResponse(200, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    // Fetch user data from DB using auth middleware
    const userData = await User.findById(req.user._id);

    // Old cover image Cloudinary file URL
    const oldCoverImage = userData.coverimage;

    // New cover image file from user input
    const newCoverImage = req.file; 

    // Ensure file is provided
    if (!newCoverImage?.path) {
        throw new apiError(400, "Please add cover image");
    }

    // If an old cover image exists, overwrite it, otherwise upload as new
    let response;
    if (oldCoverImage) {
        response = await cloudinary_Update(oldCoverImage, newCoverImage.path);
    } else {
        response = await cloudinary_Upload(newCoverImage.path);
    }

    // Save new Cloudinary URL into DB
    userData.coverimage = response.secure_url;
    await userData.save();

    res.status(200).json(new apiResponse(200, "Cover image updated successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
    // Fetch user data from DB
    const userData = await User.findById(req.user._id);

    const { currentPassword, newPassword } = req.body;

    // Ensure both passwords are provided
    if (!currentPassword || !newPassword) {
        throw new apiError(400, "Please enter credentials");
    }

    // Verify current password
    const passwordVerification = await userData.isPasswordCorrect(currentPassword);
    if (!passwordVerification) {
        throw new apiError(400, "Incorrect current password");
    }

    // Update password and save (pre-save hook will hash it)
    userData.password = newPassword;
    await userData.save();

    res.status(200).json(new apiResponse(200, "Password updated successfully"));
});

export { updateAvatar, updateCoverImage, updatePassword };  