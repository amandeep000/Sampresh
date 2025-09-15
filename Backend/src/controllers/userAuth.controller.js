import { asyncHandler } from "../utils/asyncHandler.utils.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import cloudinary from "../utils/cloudinary.util.js";

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
      .json(new ApiResponse(400, "Email already exists. Try login."));
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
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "Invalid credentials, Try signUp");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials,Try again");
  }

  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  const loginUser = await User.findById(user._id)
    .select("-refreshToken -password")
    .lean();
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, loginUser, "User Verified successfully"));
});
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(200, {}, "User logged Out successfully!");
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar) {
      throw new ApiError(400, "Avatar is required");
    }

    const uploadResponse = await cloudinary.uploader.upload(avatar);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("error in updating user profile", error);
    res
      .status(500)
      .json(
        500,
        "Internal server error encountered while updating user profile"
      );
  }
});

const checkAuth = asyncHandler((req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    throw new ApiError(500, "Internal server Error");
  }
});

export { userSignup, userLogin, userLogout, updateProfile, checkAuth };
