const mongoose = require("mongoose");

const playListSChema = new mongoose.Schema(
  {
    videos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", playListSChema);
module.exports = Playlist;
