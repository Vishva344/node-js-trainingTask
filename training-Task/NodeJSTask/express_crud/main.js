const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 9001;

app.use(bodyParser.json());

// Check file exists
const dbFile = './db.json';
let dbData = [];

if (fs.existsSync(dbFile)) {
  dbData = JSON.parse(fs.readFileSync(dbFile));
} else {
  fs.writeFileSync(dbFile, JSON.stringify(dbData));
}

// Retrieve all data 
app.get('/data', (req, res) => {
    if (dbData.length === 0) {
      return res.status(404).send('No data found.');
    }
    res.status(200).json(dbData);
  });
  
// Get specific user
app.get('/data/:index', (req, res) => {
    const { index } = req.params;
  
    if (index < 0 || index >= dbData.length) {
      return res.status(404).send('Index out of range.');
    }
  
    res.status(200).json(dbData[index]);
  });
  

// Add new data 
app.post('/data', (req, res) => {
  const newData = req.body;

  if (!newData.name || !newData.email || !newData.age) {
    return res.status(400).send('Name, email, and age are required.');
  }

  dbData.push(newData);
  fs.writeFileSync(dbFile, JSON.stringify(dbData));

  res.status(200).json(dbData);
});

// Update data 
app.put('/data/:index', (req, res) => {
  const { index } = req.params;
  const updatedData = req.body;

  if (!updatedData.name || !updatedData.email || !updatedData.age) {
    return res.status(400).send('Name, email, and age are required.');
  }

  if (index < 0 || index >= dbData.length) {
    return res.status(404).send('Index out of range.');
  }

  dbData[index] = updatedData;
  fs.writeFileSync(dbFile, JSON.stringify(dbData));

  res.status(200).json(dbData);
});

// Remove data 
app.delete('/data/:index', (req, res) => {
  const { index } = req.params;

  if (index < 0 || index >= dbData.length) {
    return res.status(404).send('Index out of range.');
  }

  dbData.splice(index, 1);
  fs.writeFileSync(dbFile, JSON.stringify(dbData));

  res.status(200).json(dbData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
