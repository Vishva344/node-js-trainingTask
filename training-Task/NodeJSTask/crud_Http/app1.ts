import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
const server = http.createServer();
const port = 3000;
const filePath = './db.json';

interface User {
  name: string;
  email: string;
  age: number;
}

// Check if the database file exists, create it if it doesn't
function checkDatabaseFile(): void {
  try {
    fs.accessSync(filePath);
  } catch (err) {
    console.log('Database file does not exist, creating new file...!!!!!!');
    fs.writeFileSync(filePath, '[]');
  }
}

// Retrieve data from the database
function getData(res: http.ServerResponse): void {
  const data: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Show data for a specific user
function showData(reqUrl: url.UrlWithParsedQuery, res: http.ServerResponse): void {
  const data: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const email = reqUrl.query.email as string;
  const userData = data.find((item) => item.email === email);
  if (userData) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User data not found');
  }
}

// Add new data to the database
function addData(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newData = JSON.parse(body) as User;
    data.push(newData);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Data added successfully');
  });
}

// Update data in the database
function updateData(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newData = JSON.parse(body) as User;
    const index = data.findIndex((item) => item.email === newData.email);
    if (index !== -1) {
      data[index] = newData;
      fs.writeFileSync(filePath, JSON.stringify(data));
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Data updated successfully');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Data not found');
    }
  });
}

// Remove data from the database
function deleteData(reqUrl: url.UrlWithParsedQuery, res: http.ServerResponse): void {
  const email = reqUrl.query.email as string;
  const data: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const index = data.findIndex((item) => item.email === email);
  if (index !== -1) {
    data.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Data removed successfully');
  } else {
    res.writeHead(404,{ 'Content-Type': 'text/plain' });
    res.end('Invalid request');
  }
};

server.listen(3000, () => {
console.log(`Server started on port ${port}`);
});

