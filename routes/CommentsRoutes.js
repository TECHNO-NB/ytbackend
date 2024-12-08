const express = require("express");
const { getAllComments, commentsControllers } = require("../controllers/commentsControllers");
const jwtVerify = require("../middlewares/authMiddleware");


const router = express.Router();

router.route("/get-all-comments/:videoId").get(getAllComments);
router.route("/comments/:videoId").post(jwtVerify,commentsControllers);

module.exports=router;
