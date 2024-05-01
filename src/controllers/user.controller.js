import { asyncHandle } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "user is not found");
    }

    const refreshToken = user.generateRefreshToken();

    const acessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateModifiedOnly: false });

    return { refreshToken, acessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went Wrong while generating acess and refresh token"
    );
  }
};

export const registerUser = asyncHandle(async (req, res) => {
  //get user details from frontend
  //validation-not empty
  //check if user is already exist or not-username,email
  //check for avatar,check for coverImg
  // uploadcloudinary for avatar
  //create user object
  //removed password and refreshToken from response
  //check user creation
  //return response

  const { username, email, password, fullname } = req.body;

  if (
    ![username, email, password, fullname].every(
      (field) => field && field.trim() !== ""
    )
  ) {
    throw new ApiError(400, "All fields are reqired");
  }

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existUser) {
    throw new ApiError(
      409,
      "user with this email or username is already exist"
    );
  }

  let coverImageLocalPath, avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  } else if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await User.create({
    username: username && username.toLowerCase(),
    email,
    password,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went Wrong while registering user");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "user register sucessfully"));
});

export const loginUser = asyncHandle(async (req, res) => {
  //req.body-data
  //username or email
  //find the user
  //check the password
  //acess token and refresh token
  //send cookies
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user doesn't exist");
  }

  const isCorrectPasswordvalid = await user.isCorrectPassword(password);

  if (!isCorrectPasswordvalid) {
    throw new ApiError(401, "invalid user credential");
  }

  const { refreshToken, acessToken } = await generateAcessAndRefreshTokens(
    user._id
  );

  // console.log(refreshToken, acessToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("acessToken", acessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          acessToken,
        },
        "user loggedin sucessfully"
      )
    );
});

export const logoutUser = asyncHandle(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("acessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "user logout sucessfully"));
});
export const refreshAcessToken = asyncHandle(async (req, res) => {
  const IncomingRefreshToken =
    req?.cookies.refreshToken || req.body.refreshToken;
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
      throw new ApiError(401, "Invalid refresh Token");
    }
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }
    if (IncomingRefreshToken != user.refreshToken) {
      throw new ApiError(401, "refresh token is expiry or used");
    }
    const { refreshToken, acessToken } = await generateAcessAndRefreshTokens(
      user._id
    );

    const option = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("acessToken", acessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            acessToken,
            refreshToken,
          },
          "Acess token refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});
