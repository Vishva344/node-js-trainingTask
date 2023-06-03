import fs from "fs";
import { input } from "@inquirer/prompts";

const answer = await input({ message: "Enter your name" });
const path = "DataBase.json";

if (fs.existsSync(path)) {
  console.log("file exists");
} else {
  console.log("file not found!.....");
}
fs.readFile("DataBase.json", (err, data) => {
  if (err) throw err;
  let DataBase = JSON.parse(data);
  console.log(DataBase);
  console.log("read....");

  let newData = {
    id: "9",
    name: "vishwa",
    email: "vishwa@gmail.com",
    age: 45,
  };
  DataBase.push(newData);
  var newData1 = JSON.stringify(DataBase);
  fs.writeFile("DataBase.json", newData1, (err) => {
    if (err) throw err;

    console.log("New data added");
    //
  });
});
