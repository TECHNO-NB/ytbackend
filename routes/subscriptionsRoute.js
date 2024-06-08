const express=require("express");
const router=express.Router();
const { subscriptionsControler } = require("../controllers/subControllers");
const jwtVerify = require("../middlewares/authMiddleware");


router.route("/subscriptions").post(jwtVerify,subscriptionsControler);

module.exports=router;


