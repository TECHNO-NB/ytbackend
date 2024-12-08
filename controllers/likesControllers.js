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

  const alreadyLiked = await Like.findOne({ video, likedBy: _id });
  if (alreadyLiked) {
    throw new ApiError(400, "Already Liked");
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

exports.unLikeControllers=asyncHandler(async(req,res)=>{
  const {video} = req.params;
  const {_id} = req.user;
  if (!video || !_id) {
    throw new ApiError(400, "Invalid request");
    }
    const alreadyLiked = await Like.findOne({ video, likedBy: _id });
    if (!alreadyLiked) {
      throw new ApiError(400, "You haven't liked this video yet");
      }
      const deletedLike = await Like.deleteOne({ video, likedBy: _id });
      if(!deletedLike){
        throw new ApiError(500,"Error on unlike")
      }
      res
      .status(200)
      .json(new ApiResponse(200,deletedLike,"Unlike successfully"))
})
