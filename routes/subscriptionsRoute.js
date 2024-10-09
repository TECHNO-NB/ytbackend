const express=require("express");
const router=express.Router();
const jwtVerify = require("../middlewares/authMiddleware");
const {subscriptionsController}=require("../controllers/subControllers")


router.route("/subscriptions").post(jwtVerify,subscriptionsController);

module.exports=router;


