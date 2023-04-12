const Student = require("./models/student");
const mp = require('./map');

const createStudent = async (data) => {
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

module.exports = createStudent;