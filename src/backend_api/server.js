const http = require("http");
const app = require("./src/app");
const { setupWebSocket } = require("./src/services/websocket");

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket
setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
