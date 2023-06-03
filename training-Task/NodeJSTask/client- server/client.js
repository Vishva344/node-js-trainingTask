import net from "net";
import inquirer from "inquirer";

const client = new net.Socket();

async function startChat() {
  let clientId, message;
  try {
    const answer = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter your name: ",
    });
    clientId = answer.name;

    const response = await sendMessage(clientId, "connected");
    console.log(`Server: ${response}`);

    while (true) {
      const answer = await inquirer.prompt({
        type: "input",
        name: "msg",
        message: "Enter your message: ",
      });
      message = answer.msg;

      const response = await sendMessage(clientId, message);
      console.log(`Server: ${response}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    client.destroy();
  }

  async function sendMessage(clientId, message) {
    const data = { clientId, message };
    const jsonData = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      client.write(jsonData + "\n", (err) => {
        if (err) {
          reject(err);
        } else {
          client.once("data", (data) => {
            try {
              const response = data.toString().trim();
              resolve(response);
            } catch (error) {
              reject(error);
            }
          });
        }
      });
    });
  }
}

client.connect(8080, "localhost", () => {
  console.log("Connected to server");
  startChat();
});

client.on("error", (error) => {
  console.error(`Error: ${error.message}`);
  client.destroy();
});
