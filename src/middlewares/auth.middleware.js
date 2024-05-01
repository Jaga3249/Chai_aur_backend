import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandle } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const jwtVerify = asyncHandle(async (req, res, next) => {
  try {
    const token =
      req.cookies?.acessToken ||
      req.header("Authorization").replace("Bearer", "");

    // console.log("token", token);
    if (!token) {
      throw new ApiError(401, "UnAuthorized user");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decodedToken", decodedToken);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    // console.log("user", user);
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid acess token");
  }
});
