const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const filePath = './db.json';

  
  fs.access(filePath,  (err) => {
    if (err) {
      console.log('Database file does not exist, creating new file...!!!!!!');
      fs.writeFileSync(filePath, '[]');
    }

    // Retrieve data from the database
    if (reqUrl.pathname === '/get') {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
    else if (reqUrl.pathname === '/show') {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const email = reqUrl.query.email;
      const userData = data.find((item) => item.email === email);
      if (userData) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userData));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
      }

        res.end('User data not found');
      }
  

    // Add new data to the database
    else if (reqUrl.pathname === '/add') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newData = JSON.parse(body);
        data.push(newData);
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
      
        // res.end('Data added successfully');
        res.end(JSON.stringify(newData));

      });
    }

    // Update data in the database
    else if (reqUrl.pathname === '/update') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newData = JSON.parse(body);
        const index = data.findIndex((item) => item.email === newData.email);
        if (index !== -1) {
          data[index] = newData;
          fs.writeFileSync(filePath, JSON.stringify(data));
          // res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newData));
          
          // res.end('Data updated successfully');
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          
          
          res.end('Data not found');
          // res.end(JSON.stringify(newData));

        }
      });
    }

    // Remove data from the database
    else if (reqUrl.pathname === '/delete') {
      const email = reqUrl.query.email;
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const index = data.findIndex((item) => item.email === email);
      if (index !== -1) {
        data.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Data removed successfully');
        //  res.end(JSON.stringify(newData));

      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Data not found');
      }
    }

    // Invalid request
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Invalid request');
    }
  });
 });

server.listen(3000, () => {
  console.log(`Server started on port ${port}`);
});
