const dotenv = require('dotenv').config()
const createStudent = require('./createStudent')
const homeRoute = require('./routes/index');
const mongoose = require('mongoose');
const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Creating port and parser
// To create a port, check port name that arduino is using, and assign that as path and set baud rate, same as arduino.
const port = new SerialPort({ path: '/dev/cu.usbmodem101', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Express
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Access, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

// Read the port data
port.on('open', onOpen);
parser.on('data', onData);

// Functions accessed on reading port data
function onOpen() {
    console.log('Connected to Arduino Serial Port!');
}

async function onData(data) {
    // Trim retrieved RFID Card UID to remove useless spaces
    data = data.trim();
    console.log('Data from arduino:', data);
    createStudent(data);
}

// Route
app.get("/", homeRoute);

// Database
const url = process.env.DB_URL;

mongoose.connect(url).then(() => {
    app.listen(3050);
}).catch((err) => {
    console.log(err);
});

