// let data = [
//   {
//     employee_id: 1,
//     employee_name: "mahi",
//   },
//   {
//     employee_id: 2,
//     employee_name: "Bharvi",
//   },
//   {
//     employee_id: 3,
//     employee_name: "vishva",
//   },
// ];
// for (let object of data) {
//   if (object.employee_id === 2) {
//     object.employee_name = "dhyey";
//   }
// }
// console.log("Updated Data: ");
// console.log(data);
import { log } from "console";
import fs from "fs";

const path = "DataBase.json";

fs.readFile("DataBase.json", (err, data) => {
  if (err) throw err;
  let DataBase = JSON.parse(data);
  console.log(DataBase);
  console.log("read....");
  function updateData() {
    for (let object of DataBase) {
      if (object.id == 9) {
        object.name = "dhyey";
      }
      console.log(object.id);
      console.log(object.name);
    }
  }
  updateData();
  fs.writeFile("DataBase.json", data, (err) => {
    if (err) throw err;

    console.log("update!!..");
  });
});
