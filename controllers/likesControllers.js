const Like = require("../models/likesModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const asyncHandler = require("../utils/asyncHandler");

exports.likesControllers = asyncHandler(async (req, res) => {
  const { video } = req.params;
  const { _id } = req.user;

 

  if (!video || !_id) {
    throw new ApiError(400, "Invalid request");
  }

  // Check if the user has already liked the video
  const alreadyLiked = await Like.findOne({ video, likedBy: _id });
  if (alreadyLiked) {
    throw new ApiError(400, "Already Liked");
  }

  // Create new like entry
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
