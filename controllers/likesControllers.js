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
  const alreadyliked = await Like.findById({ likedBy: _id });
  if (alreadyliked) {
    throw new ApiError(400, "ALready Liked");
  }
  const newlikedAdd = await Like.create({
    video,
    likedBy: _id,
  });
  if (!newlikedAdd) {
    throw new ApiError(400, "Failed to like");
  }
  res
    .status(201)
    .json(new ApiResponse(201, newlikedAdd, "Video Liked Successfully"));
});
