const dotenv = require('dotenv').config()
const mp = require('./map');
const mongoose = require('mongoose');
const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Student = require('./models/student');

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

    const createStudent = async (req, res) => {
        const createdStudent = new Student({
            rollNo: mp.get(data).rollNo,
            fullName: mp.get(data).fullName,
            time: Date.now()
        })
        // createStudent object created
        console.log('Following student object is created:', createdStudent);
        let student;
        try {
            student = await Student.find({ rollNo: createdStudent.rollNo });

            // If already present in DB this is not empty
            if (student.length) {
                console.log('This student is already marked present!\n');
                return;
            }

            createdStudent.save();
            console.log('New student added!\n');
        } catch (err) {
            console.log(err);
        }
    };

    createStudent();
}

// Route
app.get("/", async (req, res) => {
    let students;
    try {
        students = await Student.find({});
    } catch (err) {
        console.log(err);
    }

    res.status(200).json({ students: students.map((student) => student.toObject({ getters: true })) });
});

// Database
const url = process.env.DB_URL;

mongoose.connect(url).then(() => {
    app.listen(3050);
}).catch((err) => {
    console.log(err);
});

