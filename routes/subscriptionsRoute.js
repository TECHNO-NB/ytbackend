const express=require("express");
const router=express.Router();
const jwtVerify = require("../middlewares/authMiddleware");
const {subscriptionsController, allSubscriberController}=require("../controllers/subControllers")


router.route("/subscriptions").post(jwtVerify,subscriptionsController);
router.route("/allsubscribers/:channel").get(jwtVerify,allSubscriberController);

module.exports=router;


