import { Router } from "express";
import { updateAvatar, updateCoverImage, updatePassword } from "../controller/update.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verification } from "../middleware/auth.middleware.js";

const updateRouter = Router();

// Expecting a single file under key "avatar"
updateRouter.route('/updateAvatar')
  .patch(verification, upload.single("avatar"), updateAvatar);

// Expecting a single file under key "coverimage"
updateRouter.route('/updateCoverImage')
  .patch(verification, upload.single("coverimage"), updateCoverImage);

// Password update doesn’t need file upload
updateRouter.route('/updatePassword')
  .patch(verification, updatePassword);

export default updateRouter;