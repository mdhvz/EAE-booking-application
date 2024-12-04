document.addEventListener("DOMContentLoaded", () => {
    // Mock data for dashboard cards
    const totalApplications = 120;
    const approvedApplications = 75;
    const pendingApplications = 45;

    // Set values for dashboard cards
    document.getElementById("totalApplications").querySelector("p").textContent = totalApplications;
    document.getElementById("approvedApplications").querySelector("p").textContent = approvedApplications;
    document.getElementById("pendingApplications").querySelector("p").textContent = pendingApplications;

    // Mock data for applications table
    const applicationsData = [
        { id: "S123", name: "John Doe", program: "Computer Science", status: "Approved" },
        { id: "S124", name: "Jane Smith", program: "Business", status: "Pending" },
        { id: "S125", name: "Sam Wilson", program: "Engineering", status: "Approved" },
        { id: "S126", name: "Emily Davis", program: "Design", status: "Pending" }
    ];

    const applicationsTable = document.getElementById("applicationsTable");

    applicationsData.forEach(app => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${app.id}</td>
            <td>${app.name}</td>
            <td>${app.program}</td>
            <td>${app.status}</td>
            <td><button onclick="viewApplication('${app.id}')">View</button></td>
        `;

        applicationsTable.appendChild(row);
    });

    // Search feature for student applications
    document.getElementById("studentSearch").addEventListener("input", function () {
        const searchQuery = this.value.toLowerCase();
        const rows = applicationsTable.querySelectorAll("tr");

        rows.forEach(row => {
            const name = row.cells[1].textContent.toLowerCase();
            const id = row.cells[0].textContent.toLowerCase();
            row.style.display = (name.includes(searchQuery) || id.includes(searchQuery)) ? "" : "none";
        });
    });
});

// Function to view application details (mock function)
function viewApplication(id) {
    alert(`Viewing details for application ID: ${id}`);
}
