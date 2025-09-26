const WebSocket = require("ws");

let wss;
let clients = {}; // { session_id: [connections] }

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const urlParts = req.url.split("/");
    const sessionId = urlParts[urlParts.length - 1];
    if (!clients[sessionId]) clients[sessionId] = [];
    clients[sessionId].push(ws);

    ws.on("close", () => {
      clients[sessionId] = clients[sessionId].filter(c => c !== ws);
    });
  });
}

function broadcastToClients(sessionId, message) {
  if (clients[sessionId]) {
    clients[sessionId].forEach(ws => ws.send(JSON.stringify(message)));
  }
}

module.exports = { setupWebSocket, broadcastToClients };
