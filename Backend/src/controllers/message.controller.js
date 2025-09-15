import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";

const getUserForSidebar = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    throw new ApiError(401, "Unauthorized User");
  }
  const loggedInUserId = req.user._id;
  if (!mongoose.isValidObjectId(loggedInUserId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, filteredUsers, "Fetched users successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;

  if (!userToChatId || !mongoose.isValidObjectId(userToChatId)) {
    throw new ApiError(400, "Either id is not provided or it is invalid");
  }
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).select("-__v");

  if (messages.length === 0) {
    throw new ApiError(
      404,
      "No messages found between you and the other user. Start a new conversation!"
    );
  }

  res.status(200).json(messages);
});

export { getUserForSidebar, getMessages };
