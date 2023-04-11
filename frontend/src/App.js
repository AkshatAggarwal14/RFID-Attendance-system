import { useState } from "react";
import "./App.css";

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime;
}

function App() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:3050/');
    const data = await response.json()
    console.log(data);
    if (!response) {
      console.log(response.message);
    }

    setStudents(data.students.sort((a, b) => {
      return a.rollNo.localeCompare(b.rollNo);
    }));
  }
  setTimeout(() => {
    fetchStudents();
  }, 2000);

  return (
    <div>
      <h1>List of present students</h1>
      <h2>Number of present students: {students.length}</h2>
      <br></br>
      <br></br>
      {students.map((student) => {
        var dt = new Date(student.time);
        return (<div key={student.rollNo}>
          <h3>{student.rollNo + `       --       ` + student.fullName + `       --       ` + formatDate(dt)}</h3>
          <br></br>
        </div>
        )
      })}
    </div>
  );
}

export default App;
