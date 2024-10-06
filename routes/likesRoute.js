const express = require("express");
const { likesControllers } = require("../controllers/likesControllers");
const router = express.Router();

router.route("/likedvideo").post(likesControllers);

module.exports=router;