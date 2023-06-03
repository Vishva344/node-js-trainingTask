"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var server = http.createServer();
var port = 3000;
var filePath = './db.json';
// Check if the database file exists, create it if it doesn't
function checkDatabaseFile() {
    try {
        fs.accessSync(filePath);
    }
    catch (err) {
        console.log('Database file does not exist, creating new file...!!!!!!');
        fs.writeFileSync(filePath, '[]');
    }
}
// Retrieve data from the database
function getData(res) {
    var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
// Show data for a specific user
function showData(reqUrl, res) {
    var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    var email = reqUrl.query.email;
    var userData = data.find(function (item) { return item.email === email; });
    if (userData) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userData));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User data not found');
    }
}
// Add new data to the database
function addData(req, res) {
    var body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', function () {
        var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        var newData = JSON.parse(body);
        data.push(newData);
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Data added successfully');
    });
}
// Update data in the database
function updateData(req, res) {
    var body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', function () {
        var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        var newData = JSON.parse(body);
        var index = data.findIndex(function (item) { return item.email === newData.email; });
        if (index !== -1) {
            data[index] = newData;
            fs.writeFileSync(filePath, JSON.stringify(data));
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Data updated successfully');
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Data not found');
        }
    });
}
// Remove data from the database
function deleteData(reqUrl, res) {
    var email = reqUrl.query.email;
    var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    var index = data.findIndex(function (item) { return item.email === email; });
    if (index !== -1) {
        data.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(data));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Data removed successfully');
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Invalid request');
    }
}
;
server.listen(3000, function () {
    console.log("Server started on port ".concat(port));
});
