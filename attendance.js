// Example student data
const studentData = [
    { studentId: "S1001", studentName: "John Doe", course: "Computer Science", date: "2024-12-04" },
    { studentId: "S1002", studentName: "Jane Smith", course: "Information Systems", date: "2024-12-04" },
    { studentId: "S1003", studentName: "Emily Davis", course: "Data Science", date: "2024-12-04" },
  ];
  
  // Function to load table data
  function loadAttendanceTable() {
    const tableBody = document.getElementById("attendanceTable");
    tableBody.innerHTML = ""; // Clear table before adding new data
  
    studentData.forEach((student, index) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.studentName}</td>
        <td>${student.course}</td>
        <td>${student.date}</td>
        <td>
          <button class="attend" onclick="markAttendance(${index})">Mark Present</button>
        </td>
        <td>
          <button class="details" onclick="viewDetails('${student.studentId}')">View</button>
        </td>
      `;
  
      tableBody.appendChild(row);
    });
  }
  
  // Mark attendance handler
  function markAttendance(index) {
    alert(`Attendance marked for ${studentData[index].studentName}`);
    const button = document.querySelectorAll(".attend")[index];
    button.textContent = "Present";
    button.disabled = true;
    button.style.backgroundColor = "#6c757d"; // Disabled color
  }
  
  // View details handler
  function viewDetails(studentId) {
    const student = studentData.find(s => s.studentId === studentId);
    alert(`Details for ${student.studentName}:\nCourse: ${student.course}\nDate: ${student.date}`);
  }
  
  // Load the table on page load
  document.addEventListener("DOMContentLoaded", loadAttendanceTable);
  