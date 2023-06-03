import net from "net";
import inquirer from "inquirer";

const client = new net.Socket();

inquirer
  .prompt({
    type: "input",
    name: "name",
    message: "Enter your name: ",
  })
  .then((answer) => {
    const clientId = answer.name;
    inquirer
      .prompt({
        type: "input",
        name: "msg",
        message: "Enter your message: ",
      })
      .then((answer) => {
        const message = answer.msg;
        const data = { clientId, message };
        const jsonData = JSON.stringify(data);
        client.connect(8080, "localhost", () => {
          console.log("Connected to server");
          client.write(jsonData + "\n");
        });
      });
  });

client.on("data", (data) => {
  try {
    const { clientId, message } = JSON.parse(data.toString().trim());
    console.log(`${clientId}: ${message}`);
  } catch (error) {
    console.error(`Error parsing JSON data: ${error.message}`);
  }
});




