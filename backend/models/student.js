const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    rollNo: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    time: { type: Date, required: true },
});

module.exports = mongoose.model("Student", studentSchema);