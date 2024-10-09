const asyncHandler = require("../utils/asyncHandler");
const Subscription = require("../models/subscriptionsModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");

exports.subscriptionsController = asyncHandler(async (req, res) => {
  const { channel } = req.body;
  const { _id } = req.user;

  if (!channel) {
    throw new ApiError(400, "Something went wrong. Channel is required.");
  }

  const alreadySubscribed = await Subscription.findOne({
    subscriber: _id,
    channel: channel,
  });

  if (alreadySubscribed) {
    throw new ApiError(400, "You are already subscribed to this channel");
  }

  
  const subscribed = await Subscription.create({
    subscriber: _id,
    channel,
  });

  if (!subscribed) {
    throw new ApiError(500, "Error in subscription creation");
  }

  res.status(200).json(new ApiResponse(200, subscribed, "Subscribed successfully"));
});
