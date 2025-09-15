const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---------- Logger Middleware ----------
function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Took: ${duration}ms`;

    console.log(log);      // print in terminal
    io.emit("log", log);   // send log to browser
  });

  next();
}

// ---------- Use Middleware ----------
app.use(logger);

// ---------- Example Routes ----------
app.get("/", (req, res) => {
  res.send("👋 Welcome to the API");
});

app.get("/products", (req, res) => {
  res.send("📦 List of products");
});

// ---------- Serve Logs Page ----------
app.use(express.static("public"));

// ---------- Socket.IO ----------
io.on("connection", () => {
  console.log("🔌 Client connected");
});

// ---------- Start Server ----------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
