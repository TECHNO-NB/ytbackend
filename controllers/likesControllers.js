const Like = require("../models/likesModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

exports.likesControllers = asyncHandler(async (req, res) => {
  const { video } = req.params;
  const { _id } = req.user;

  if (!video || !_id) {
    throw new ApiError(400, "Invalid request");
  }

  const alreadyLiked = await Like.findOne({ video, likedBy: _id });
  if (alreadyLiked) {
    const deletedLike = await Like.deleteOne({ video, likedBy: _id });
    if (!deletedLike) {
      throw new ApiError(500, "Error on unlike");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, deletedLike, "Unlike successfully"));
  }

  const newLike = await Like.create({
    video,
    likedBy: _id,
  });

  if (!newLike) {
    throw new ApiError(400, "Failed to like the video");
  }

  res
    .status(201)
    .json(new ApiResponse(201, newLike, "Video Liked Successfully"));
});

exports.unLikeControllers = asyncHandler(async (req, res) => {
  const { video } = req.params;
  const { _id } = req.user;
  if (!video || !_id) {
    throw new ApiError(400, "Invalid request");
  }
  const alreadyLiked = await Like.findOne({ video, likedBy: _id });
  if (!alreadyLiked) {
    throw new ApiError(400, "You haven't liked this video yet");
  }
  const deletedLike = await Like.deleteOne({ video, likedBy: _id });
  if (!deletedLike) {
    throw new ApiError(500, "Error on unlike");
  }
  res
    .status(200)
    .json(new ApiResponse(200, deletedLike, "Unlike successfully"));
});

exports.getAllLikesVideos = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(401, "user not login in");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $lookup: {
        foreignField: "_id",
        localField: "video",
        from: "videos",
        as: "videoDetails",
      },
    },
    {
      $lookup: {
        foreignField: "_id",
        localField: "likedBy",
        from: "users",
        as: "userDetails",
      },
    },

    {
      $project: {
        videoDetails: 1,
        owner: "$userDetails.fullName",
      },
    },
  ]);

  if (likedVideos.length <= 0 || !likedVideos) {
    throw new ApiError(404, "No liked videos");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos get successfully"));
});
