const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const userRoutes = require("./routes/userRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const subscriptionsRoute = require("./routes/subscriptionsRoute");
const videoUploadRoute = require("./routes/videoUploadRoute.js");
const path = require("path");
const os = require("os");
const cluster = require("cluster");

// setup Cluster
// Number Of CPUS
const numCPUS = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUS; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  // dot env file
  env.config();

  // Main App Middlewares
  app.use(
    cors({
      origin: ["*","https://check-youtube.vercel.app/", "http://localhost:5173","https://check-youtube.vercel.app", "http://192.168.0.120:4000",process.env.FRONTEND_URL],
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );

  app.use(express.static("public"));
  app.use(express.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(cookieParser());

  // databaseConnection
  require("./database/dbs");

  app.get("/",(req,res)=>{
res.send("server working fine")
  })
  // User Api Route
  app.use("/api/v1/users", userRoutes);

  // Subscriptions Api Route
  app.use("/api/v1", subscriptionsRoute);

  // videoUplode APi route
  app.use("/api/v1", videoUploadRoute);

  app.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
  });
}
