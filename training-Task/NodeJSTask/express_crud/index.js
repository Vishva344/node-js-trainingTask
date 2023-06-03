const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const dbPath = './db.json';

// Check if the database file exists, 
fs.access(dbPath, (err) => {
  if (err) {
    console.log('Database file does not exist, creating new file...');
    fs.writeFileSync(dbPath, '[]');
  }
});


app.use(bodyParser.json());

// Retrieve all data from the database
app.get('/get', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: 'Error retrieving data from database' });
  }
});
// Retrieve a single user's data from the database
app.get('/show', (req, res) => {
  const email = req.query.email;
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const userData = data.find((item) => item.email === email);
  if (userData) {
    res.status(200).json(userData);
  } else {
    res.status(404).send('User data not found');
  }
});

// Add new data 
app.post('/add', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const newData = req.body;
  data.push(newData);
  fs.writeFileSync(dbPath, JSON.stringify(data));
  res.status(200).json(newData);
});

// Update data 
app.put('/update', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const newData = req.body;
  const index = data.findIndex((item) => item.email === newData.email);
  if (index !== -1) {
    data[index] = newData;
    fs.writeFileSync(dbPath, JSON.stringify(data));
    res.status(200).json(newData);
  } else {
    res.status(404).send('Data not found');
  }
});

// Remove data
app.delete('/delete', (req, res) => {
  const email = req.query.email;
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const index = data.findIndex((item) => item.email === email);
  if (index !== -1) {
    data.splice(index, 1);
    fs.writeFileSync(dbPath, JSON.stringify(data));
    res.status(200).send('Data removed successfully');
  } else {
    res.status(404).send('Data not found');
  }
});

// Invalid request
app.use((req, res) => {
  res.status(404).send('Invalid request');
});

// Start the server using Nodemon
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
