const express = require("express");
const router = express.Router();
const jwtVerify =require("../middlewares/authMiddleware");
const { uploadVideos,getAllVideos,getVideoById, videoViews, userVideos } = require("../controllers/videoControllers");

const upload = require("../middlewares/multerMid");

router.route("/videoupload").post(
  jwtVerify,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    }
  ]),
  uploadVideos
);

router.route("/getallvideos").get(getAllVideos);
router.route("/getvideobyid/:videoId").post( jwtVerify,getVideoById);
router.route("/getuservideos").get(jwtVerify,userVideos);
router.route("/videoviews/:videoId").post(jwtVerify,videoViews)

module.exports = router;
