import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  registerUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

export const router = Router();

// routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/reset-password").post(changeCurrentPassword);
router.route("/update-account").post(jwtVerify, updateAccountDetail);
router.route("/current-user").post(jwtVerify, getCurrentUser);
router
  .route("/avatar-update")
  .post(jwtVerify, upload.single("avatar"), updateUserAvatar);
router
  .route("/coverimage-update")
  .post(jwtVerify, upload.single("coverImage"), updateUserCoverImage);
