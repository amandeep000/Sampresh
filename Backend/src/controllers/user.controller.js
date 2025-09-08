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
const userSignup = asyncHandler((req, res) => {
  const { fullname, email, password } = req.body;
});
const userLogin = asyncHandler((req, res) => {});
const userLogout = asyncHandler((req, res) => {});

export { userSignup, userLogin, userLogout };
