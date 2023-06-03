import net from "net";

const sockets = [];

const server = net.createServer((socket) => {
  sockets.push(socket);

  socket.on("data", (data) => {
    try {
      const { clientId, message } = JSON.parse(data.toString());
      console.log(`${clientId}: ${message}`);
      sockets.forEach((s) => {
        if (s !== socket) {
          s.write(`${clientId}: ${message}\n`);
        }
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      socket.destroy();
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    sockets.splice(sockets.indexOf(socket), 1);
  });


  });


server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
