const express = require("express");
const jwtVerify = require("../middlewares/authMiddleware");
const { createPlaylist, getALlPlayLists } = require("../controllers/playLists");
const router = express.Router();

router.route("/create-playlist/:videoId").post(jwtVerify, createPlaylist);
router.route("/get-playlist").get(jwtVerify, getALlPlayLists);

module.exports = router;
