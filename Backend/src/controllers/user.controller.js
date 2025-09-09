import { asyncHandler } from "../utils/asyncHandler.utils.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { ApiError } from "../utils/apiError.utils.js";

const createAccessAndRefreshToken = asyncHandler(async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exit");
  }

  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Token generation error: ", error);
    }
    throw new ApiError(500, "Failed to generate access/refresh token");
  }
});
const userSignup = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "Req body cannot be empty!");
  }

  const { fullname, email, password } = req.body;

  if ([fullname, email, password].some((field) => !field?.trim())) {
    throw new ApiError(
      400,
      "All the fields (fullname,email,password) are required."
    );
  }

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Email is already exists. Try login."));
  }

  const newUser = await User.create({
    fullname,
    email,
    password,
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to register user. Try again later.");
  }

  const createdUser = {
    id: newUser._id,
    name: newUser.fullname,
    email: newUser.email,
  };

  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    newUser._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
const userLogin = asyncHandler((req, res) => {});
const userLogout = asyncHandler((req, res) => {});

export { userSignup, userLogin, userLogout };
