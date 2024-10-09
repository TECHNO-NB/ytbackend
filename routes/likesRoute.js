const express = require("express");
const { likesControllers } = require("../controllers/likesControllers");
const jwtVerify = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/likedvideo/:video").post( jwtVerify,likesControllers);

module.exports=router;