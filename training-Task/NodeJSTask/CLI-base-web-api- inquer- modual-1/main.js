import fs from "fs";
import inquirer from "inquirer";
const Database = "db.json";

function readDatabase() {
  try {
    const data = fs.readFileSync(Database);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeDatabase(data) {
  fs.writeFileSync(Database, JSON.stringify(data));
}

async function main() {
  // Check if a database file exists if not then do all operation in file yes or No
  if (!fs.existsSync(Database)) {
    fs.writeFileSync(Database, "[]");
  }
  let database = readDatabase();
  const { operation } = await inquirer.prompt([
    {
      type: "list",
      name: "operation",
      message: "What operation do you want to perform?",
      choices: ["Retrieve data", "Add data", "Update data", "Remove data"],
    },
  ]);

  //Retrieve data from the database
  if (operation === "Retrieve data") {
    console.log(database);
    //Add new data to the database
  } else if (operation === "Add data") {
    const { name, email, age } = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter name:" },
      { type: "input", name: "email", message: "Enter email:", validate: (input) => /^\S+@\S+\.\S+$/.test(input) },
      { type: "input", name: "age", message: "Enter age:" },
    ]);
    const newData = { name, email, age: parseInt(age) };
    const emailExists = database.some(data => data.email === email);
    if (emailExists) {
      console.log("Data with email " + email + " already exists");
      return;
    }
    database.push(newData);
    console.log("Data added:", newData);
    // Update database with new data
  }else if (operation === "Update data") {
    const { email, name, age } = await inquirer.prompt([
      { type: "input", name: "email", message: "Enter email of data to update:" },
      { type: "input", name: "name", message: "Enter name:" },
      { type: "input", name: "age", message: "Enter age:" },
    ]);
    const index = database.findIndex(data => data.email === email);
    if (index === -1) {
      console.log("Data with email " + email + " does not exist");
      return;
    }
    const newData = { name, email, age: parseInt(age) };
    database[index] = newData;
    console.log("Data updated:", newData);
    //Remove data from the database
  } else if (operation === "Remove data") {
    const { email } = await inquirer.prompt([
      { type: "input", name: "email", message: "Enter email of data to remove:" },
    ]);
    const index = database.findIndex(data => data.email === email);
    if (index === -1) {
      console.log("Data with email " + email + " does not exist");
      return;
    }
    const removedData = database.splice(index, 1)[0];
    console.log("Data removed:", removedData);
  }

  writeDatabase(database);
}

main();
