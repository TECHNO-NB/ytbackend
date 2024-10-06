const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("sucessfully connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
})();
