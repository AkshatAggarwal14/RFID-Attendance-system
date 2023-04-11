import { useState } from "react";
import "./App.css";
import profilePicture from './img/no-profile-picture.svg';

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
    <div className="attendanceList">
      <header>
        <h1 className="attendanceList__title">
          <span className="attendanceList__title--top">
            Attendance
          </span>
          <span className="attendanceList__title--bottom">
            List
          </span>
          <span className="attendanceList__title--bottom-count">
            Number of present students: {students.length}
          </span>
        </h1>
      </header>

      <main className="attendanceList__students">
        {students.map((student) => {
          var formattedDate = formatDate(new Date(student.time));
          return (
            <article key={student.rollNo} className="attendanceList__student">
              <img src={profilePicture} className="attendanceList__picture" alt=""></img>
              <span className="attendanceList__details">
                {student.fullName}
                <br></br>
                {student.rollNo}
              </span>
              <span className="attendanceList__time">{formattedDate}</span>
            </article>
          )
        })}
      </main>
    </div>
  );
}

export default App;