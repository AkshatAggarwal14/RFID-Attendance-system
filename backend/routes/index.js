const Student = require('../models/student');

const homeRoute = async (req, res) => {
    let students;
    try {
        students = await Student.find({});
    } catch (err) {
        console.log(err);
    }

    res.status(200).json({ students: students.map((student) => student.toObject({ getters: true })) });
}

module.exports = homeRoute;