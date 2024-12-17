const mongoose = require("mongoose");
const Video = require("../models/videoModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const asyncHandler = require("../utils/asyncHandler");
const Comment = require("../models/comments");

exports.getAllComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const videosComments = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "users",
            },
          },
       
        ],
      },
    },
    {
      $addFields: {
        commentsCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        _id: 1,
        commentsCount: 1,
        comments: 1,
        username:1,
      },
    },
  ]);

  if (!videosComments || videosComments.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videosComments[0],
        "Video comments fetched successfully"
      )
    );
});

exports.commentsControllers = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user; // Assuming `req.user` is populated via middleware
  const { content } = req.body;

  // Input validation
  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Please enter a valid comment");
  }

  if (!videoId || !_id) {
    throw new ApiError(400, "Video ID and user ID are required");
  }

  try {
    // Create the comment
    const savedComment = await Comment.create({
      owner: _id,
      content: content.trim(),
      video: videoId,
    });

    if (!savedComment) {
      throw new ApiError(500, "Failed to save comment");
    }

    // Return success response
    return res
      .status(201)
      .json(new ApiResponse(201, savedComment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "An unexpected error occurred while saving the comment"
    );
  }
});
