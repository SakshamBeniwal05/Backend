import { Router } from "express";
import { updateAvatar, updateCoverImage, updatePassword } from "../controller/update.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verification } from "../middleware/auth.middleware.js";

const updateRouter = Router();

// Expecting a single file under key "avatar"
updateRouter.route('/updateAvatar')
  .post(verification, upload.single("avatar"), updateAvatar);

// Expecting a single file under key "coverimage"
updateRouter.route('/updateCoverImage')
  .post(verification, upload.single("coverimage"), updateCoverImage);

// Password update doesn’t need file upload
updateRouter.route('/updatePassword')
  .post(verification, updatePassword);

export default updateRouter;