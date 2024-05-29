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

  // Load environment variables
  env.config();

  // CORS configuration
  const allowedOrigins = [
    "https://check-youtube.vercel.app",
    "http://localhost:5173",
    "http://192.168.0.120:4000",
    process.env.FRONTEND_URL
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  }));

  // Middleware
  app.use(express.static("public"));
  app.use(express.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(cookieParser());

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

  // Start server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`⚙️ Server is running at port: ${PORT}`);
  });
}
