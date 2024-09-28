const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/videoModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const uploadOnCloudinary = require("../utils/cloudnary");
const videoModel = require("../models/videoModel");

exports.uploadVideos = asyncHandler(async (req, res) => {
  const { title, description, owner } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title And Descriptions Is Required");
  }

  const videoFilePath = req.files?.video[0]?.path;

  const thumbnailFilePath = req.files?.thumbnail[0]?.path;
  if (!videoFilePath || !thumbnailFilePath) {
    throw new ApiError(400, "File Not Founds");
  }
  const videoUrl = await uploadOnCloudinary(videoFilePath);
  const thumbnailUrl = await uploadOnCloudinary(thumbnailFilePath);

  if (!videoUrl || !thumbnailUrl) {
    throw new ApiError(400, "Cloudnary File Not Founds");
  }

  if (!videoUrl.url || !thumbnailUrl.url) {
    throw new ApiError(400, "Error In Cloudnary");
  }

  console.log(videoUrl.url)
  console.log(thumbnailUrl.url)
  const uploadVideo = await videoModel.create({
    videoFile: videoUrl?.url,
    thumbnail: thumbnailUrl?.url,
    title: title,
    description: description,
    duration: videoUrl?.duration,
    owner: owner,
  });
  if (!uploadVideo) {
    throw new ApiError(400, "Error In upload Video");
  }
  res
    .status(200)
    .json(new ApiResponse(200, uploadVideo, "Video Upload Successfully"));
});

exports.getAllVideos = asyncHandler(async (req, res) => {
  const allVideos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("owner", "fullName avatar username")
    .select("-videoFile");

  if (!allVideos) {
    throw new ApiError(400, "Somethings Went Wrong");
  }
  res
    .status(200)
    .json(new ApiResponse(200, allVideos, "Successfully fetch all videos"));
});

exports.getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const getOneVideo = await Video.findById({ _id: videoId }).populate(
    "owner",
    "fullName avatar username"
  );

  if (!getOneVideo) {
    throw new ApiError(400, "Somethings Went Wrong");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, getOneVideo, "Successfully fetch all One Video")
    );
});

exports.userVideos = asyncHandler(async (req, res) => {
  const getUserVideos = await Video.find({
    owner: req.user._id,
  });
  res.json(getUserVideos);
});

exports.videoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId Not Found");
  }
  const getVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: {
        views: 1,
      },
    },
    { new: true }
  );
  if (!getVideo) {
    throw new ApiError(400, "Error In Views Increased");
  }

  res.status(201).json(new ApiResponse(200, "Views Increased Successfully"));
});
