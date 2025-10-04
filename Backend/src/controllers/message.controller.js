import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
import cloudinary from "../utils/cloudinary.util.js";
import { getReceiverSocketId, getIO } from "../lib/socket.js";

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

  if (!messages.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No messages yet — start chatting!"));
  }

  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageURL;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageURL = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageURL,
  });

  await newMessage.save();

  // realtime functionality will be happening here hehe...
  const receiverSocketId = getReceiverSocketId(receiverId);
  const io = getIO();
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, newMessage, "Message and media sent successfully")
    );
});

export { getUserForSidebar, getMessages, sendMessage };
