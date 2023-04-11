const mp = new Map();

function studentData(rollNo, fullName) {
    this.rollNo = rollNo;
    this.fullName = fullName;
}

mp.set("23 6F F9 14", new studentData("20BCS017", "Akshat Aggarwal"));
mp.set("94 85 16 89", new studentData("20BCS018", "Prathmesh Chhabra"));

module.exports = mp;