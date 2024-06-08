const asyncHandler = require("../utils/asyncHandler");
const Subscription = require("../models/subscriptionsModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");

exports.subscriptionsControler = asyncHandler(async (req, res) => {
  const { channel } = req.body;
  const { _id } = req.user;



  if (!channel) {
    throw new ApiError(400, "SomeThing Went Wrong");
  }

const alreadySubscribed=await Subscription.find({
  subscriber:{
    $in:_id
  }
})
if(alreadySubscribed){
  throw new ApiError(400, "You are already subscribed to this channel");
}
  const subscribed = await Subscription.create({
    subscriber:_id,
    channel,
  });
  if (!subscribed) {
    throw new ApiError("Error In Subscriptions");
  }

  res
    .status(200)
    .json(new ApiResponse(200, subscribed, "Subscribed Successfully"));
});
