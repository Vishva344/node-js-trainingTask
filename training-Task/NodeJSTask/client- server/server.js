import net from "net";

const server = net.createServer();

const clients = new Map();

server.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    try {
      const { clientId, message } = JSON.parse(data);
      console.log(` ${clientId}: ${message}`);

      if (!clients.has(clientId)) {
        clients.set(clientId, socket);
        const connectedMsg = `${clientId} is connected`;
        console.log(`Server: ${connectedMsg}`);
        socket.write(connectedMsg);
      } else {
        const clientSocket = clients.get(clientId);
        clientSocket.write(`${clientId}: ${message}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error(`Error: ${error.message}`);
  });
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});

server.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});
