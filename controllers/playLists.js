const Playlist = require("../models/playlistsModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const asyncHandler = require("../utils/asyncHandler");


// Create playlist
exports.createPlaylist = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  if (!videoId || !_id) {
    throw new ApiError(400, "VideoId is required");
  }
  const createCollections = await Playlist.create({
    videos: videoId,
    owner: _id,
  });

  if (!createCollections) {
    throw new ApiError(400, "Playlist not created");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Playlist created", createCollections));
});


// Get all playlist
exports.getALlPlayLists = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw new ApiError(400, "User Id is required");
  }

  const findPlaylist = await Playlist.find({ owner: _id }).populate({
    path: "videos owner",
    select: "title thumbnail videoFile duration views username fullName",
  });

  if (!findPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }
  res.status(200).json(new ApiResponse(200, "Playlist found", findPlaylist));
});
