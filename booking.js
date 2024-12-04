// Function to filter bookings by search input and date
function filterBookings() {
    const searchInput = document.getElementById("searchBooking").value.toLowerCase();
    const dateFilter = document.getElementById("dateFilter").value;
    const table = document.getElementById("bookingsTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const studentID = cells[0]?.textContent || '';
        const name = cells[1]?.textContent || '';
        const date = cells[3]?.textContent || '';
        
        let showRow = true;

        // Filter by search input
        if (searchInput && !(studentID.toLowerCase().includes(searchInput) || name.toLowerCase().includes(searchInput))) {
            showRow = false;
        }

        // Filter by date
        if (dateFilter && date !== dateFilter) {
            showRow = false;
        }

        rows[i].style.display = showRow ? "" : "none";
    }
}
