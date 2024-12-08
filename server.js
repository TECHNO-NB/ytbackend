const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const userRoutes = require("./routes/userRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const subscriptionsRoute = require("./routes/subscriptionsRoute");
const videoUploadRoute = require("./routes/videoUploadRoute.js");
const likeRoute = require("./routes/likesRoute.js");
const commentRoute = require("./routes/CommentsRoutes.js");

const os = require("os");
const cluster = require("cluster");

// Setup Cluster
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  env.config();

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://check-youtube.vercel.app",
        "http://192.168.0.120:4000",
        process.env.FRONTEND_URL,
      ],
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );

  // Middleware
  app.use(express.static("public"));
  app.use(cookieParser());
  app.use(express.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  // Database Connection
  require("./database/dbs");

  // Root Route
  app.get("/", (req, res) => {
    res.send("Server working fine");
  });

  // API Routes
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1", subscriptionsRoute);
  app.use("/api/v1", videoUploadRoute);
  app.use("/api/v1", likeRoute);
  app.use("/api/v1", commentRoute);

  // Start server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`⚙️ Server is running at port: ${PORT}`);
  });
}
