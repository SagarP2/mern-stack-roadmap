let io;

function setSocketIO(socketIO) {
  io = socketIO;
}

function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Took: ${duration}ms`;

    console.log(log);          // still print in terminal
    if (io) io.emit("log", log); // send log to browser
  });

  next();
}

module.exports = { logger, setSocketIO };
