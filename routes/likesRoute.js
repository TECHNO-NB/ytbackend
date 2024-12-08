const express = require("express");
const { likesControllers, unLikeControllers } = require("../controllers/likesControllers");
const jwtVerify = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/likedvideo/:video").post( jwtVerify,likesControllers);
router.route("/unlikedvideo/:video").delete( jwtVerify,unLikeControllers);

module.exports=router;