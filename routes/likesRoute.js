const express = require("express");
const {
  likesControllers,
  unLikeControllers,
  getAllLikesVideos,
} = require("../controllers/likesControllers");
const jwtVerify = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/likedvideo/:video").post(jwtVerify, likesControllers);
router.route("/unlikedvideo/:video").delete(jwtVerify, unLikeControllers);
router.route("/getlikedvideos").post(jwtVerify, getAllLikesVideos);

module.exports = router;
