const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(bodyParser.json());
 const object = [
 {
    id:1,
     name: "viva",
     age: 20
     },
     {
    id:2,
    name: "visha",
    age: 21
     },
    {
    id:3,
    name: "mahi",
    age: 22
    }
    ]
    
    // app.use(express.json());

    app.post('/', (req, res) => {
        const newObject = req.body;
        object.push(newObject)
        return res.status(200).json({status:200, Message: "This is get methods running",data:object})
    });

    app.get('/:id', (req, res) =>{
        const id= parseInt(req.params.id); 
        const obj = object.find(obj=> obj.id == id);
        if (obj) {
            return res.status(200).json({ status: 200, message: "This is get methods running", data: obj });
        }
        else {
            return res.status(404).json({ status: 404, message: "Data not found" })
        }
    });
    
app.put("/:id/:name/:age", (req, res) =>{

const id = parseInt(req.params.id);
const name=req.params.name;
const age=req.params.name;

const newObject  =  object.find(obj=> obj.id == id);

if (newObject) {
    newObject.name= name
    newObject.age= age

    return res.status(200).json({ status: 200, message: "This is get methods running", data: obj });
}
else {
    return res.status(404).json({ status: 404, message: "Data not found" })
}
});


app.delete("/:id", (req, res) =>{

        const id= parseInt(req.params.id); 
        const obj = object.find(obj=> obj.id == id);
        if (obj) {
            const index = object.indexOf(obj);
            object.splice(index, 1);
            return res.status(200).json({ status: 200, message: "This is get methods running", data: obj });
        }
        else {
            return res.status(404).json({ status: 404, message: "Data not found" })
        }
    });
app.listen(3000, () => console.log(` server start ,${port}`));
const newData = { /* your data object */ };
const message = "Here's your data!";
const response = { message, data: newData };

res.end(JSON.stringify(response));
