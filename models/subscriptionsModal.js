const mongoose = require("mongoose");

const subscriptionsSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: [true,"Already Subscribed"]
      
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionsSchema);

module.exports = Subscription;
