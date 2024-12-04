// Mock function to simulate fetching student data from the database
function getStudentData() {
    // Example student data
    return [
        { name: "John Doe", employeeNumber: "E12345" },
        { name: "Jane Smith", employeeNumber: "E12346" },
        { name: "Alice Johnson", employeeNumber: "E12347" },
        { name: "Bob Brown", employeeNumber: "E12348" }
    ];
}

// Function to populate the attendance table
function populateTable() {
    const students = getStudentData();
    const tableBody = document.querySelector("#attendanceTable tbody");

    students.forEach(student => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;
        row.appendChild(nameCell);

        const empNumCell = document.createElement("td");
        empNumCell.textContent = student.employeeNumber;
        row.appendChild(empNumCell);

        const attendedCell = document.createElement("td");
        const attendedCheckbox = document.createElement("input");
        attendedCheckbox.type = "checkbox";
        attendedCell.appendChild(attendedCheckbox);
        row.appendChild(attendedCell);

        tableBody.appendChild(row);
    });
}

// Function to collect attendance data when the "Submit" button is clicked
function submitAttendance() {
    const tableRows = document.querySelectorAll("#attendanceTable tbody tr");
    const attendanceData = [];

    tableRows.forEach(row => {
        const name = row.cells[0].textContent;
        const employeeNumber = row.cells[1].textContent;
        const attended = row.cells[2].querySelector("input").checked;

        attendanceData.push({
            name,
            employeeNumber,
            attended
        });
    });

    // Log attendance data to console (this would typically be sent to the server)
    console.log(attendanceData);
    alert("Attendance submitted!");
}

// Function to handle logout (e.g., clear session and redirect)
function handleLogout() {
    // Clear session storage or any user data
    // Example:
    // sessionStorage.clear();
    
    // Redirect to login page (or home page)
    window.location.href = "login.html"; // Change the URL as necessary
}

// Set up the page when it loads
document.addEventListener("DOMContentLoaded", function() {
    populateTable();
    document.querySelector("#submitButton").addEventListener("click", submitAttendance);
    document.querySelector("#logoutButton").addEventListener("click", handleLogout);
});

