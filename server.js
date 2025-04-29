const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

dotenv.config();

// mongodb connection
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// node.js API routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// ✅ Python services proxy routes
app.use(
  "/send-alert",
  createProxyMiddleware({
    target: "http://localhost:8001",
    pathRewrite: { "^send-alert": "" },
    changeOrigin: true,
  })
);
app.use(
  "/generate-pdf",
  createProxyMiddleware({
    target: "http://localhost:8002",
    pathRewrite: { "^/generate-pdf": "" },
    changeOrigin: true,
  })
);
app.use(
  "/chat",
  createProxyMiddleware({
    target: "http://localhost:8003",
    pathRewrite: { "^/chat": "" },
    changeOrigin: true,
  })
);

// serve React frontend (production build)
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgBlue.white
  );
});
