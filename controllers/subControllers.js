const asyncHandler = require("../utils/asyncHandler");
const Subscription = require("../models/subscriptionsModal");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResonse");
const mongoose = require("mongoose");
const User = require("../models/userModel");

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

  res
    .status(200)
    .json(new ApiResponse(200, subscribed, "Subscribed successfully"));
});

exports.allSubscriberController = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { channel } = req.params;

  console.log("hit");
  if (!_id || !channel) {
    throw new ApiError(400, "Something went wrong. Channel is required.");
  }

  const allSubscriber = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $addFields: {
        totalSubscriber: {
          $size: "$subscribers",
        },
      },
    },
    {
      $unwind: "$subscribers",
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribers.subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        subscribers: 1,
        "subscriberDetails.email": 1,
        "subscriberDetails._id": 1,
        "subscriberDetails.avatar": 1,
        "subscriberDetails.username": 1,
        totalSubscriber: 1,
      },
    },
  ]);

  console.log(allSubscriber);


  if (!allSubscriber) {
    throw new ApiError(404, "No subscribers found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, allSubscriber, "all subscriber get successfully")
    );
});
