import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAcessToken,
  registerUser,
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
