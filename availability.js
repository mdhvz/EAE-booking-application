document.addEventListener("DOMContentLoaded", function () {
    // Load availability from the server when the page is loaded
    loadAvailabilityFromServer();
});

document.getElementById("availabilityForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the form values
    const interview_date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const capacity = document.getElementById("capacity").value;

    // Validate input
    if (!interview_date || !startTime || !endTime || !capacity) {
        alert("Please fill in all required fields.");
        return;
    }

    // Get staff info from the server
    try {
        const staffInfoResponse = await fetch('/get-staff-info');
        const staffInfoResult = await staffInfoResponse.json();
        console.log("Staff Info API Response:", staffInfoResult);

        if (!staffInfoResult.success) {
            alert("Failed to retrieve staff information.");
            return;
        }

        const { staff_id, course_id } = staffInfoResult.staffInfo; // Extract staff_id and course_id

        // Prepare data for saving or updating
        const data = { interview_date, startTime, endTime, capacity, staff_id, course_id, status: "available" };
        const editingId = document.getElementById("availabilityForm").dataset.editingId;

        console.log("Editing ID:", editingId);
        console.log("Data being sent:", data);

        let response;
        if (editingId) {
            // Send update request if editing
            response = await fetch('http://localhost:3000/edit-availability', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, interview_id: editingId })
            });
        } else {
            // Send new availability if adding
            response = await fetch('http://localhost:3000/set-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        }

        const result = await response.json();

        if (result.success) {
            alert(editingId ? "Availability updated successfully." : "Availability saved successfully.");

            // Normalize date and time before displaying
            const normalizedDate = normalizeDate(interview_date);
            const normalizedStartTime = normalizeTime(startTime);
            const normalizedEndTime = normalizeTime(endTime);

            // Display the updated or newly added availability slot in the table
            if (editingId) {
                loadAvailabilityFromServer(); // Reload the table after edit
            } else {
                displayAvailability(normalizedDate, normalizedStartTime, normalizedEndTime, capacity, result.interview_id);
            }

            // Reset the form
            document.getElementById("availabilityForm").reset();
            delete document.getElementById("availabilityForm").dataset.editingId; // Clear editing state
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Error saving availability:", error);
        alert("An error occurred while saving availability.");
    }
});

function displayAvailability(date, startTime, endTime, capacity, interview_id) {
    const tableBody = document.getElementById("availabilityTable");

    // Create a new row
    const row = document.createElement("tr");

    // Create and populate table cells
    const dateCell = document.createElement("td");
    dateCell.textContent = date;

    const startTimeCell = document.createElement("td");
    startTimeCell.textContent = startTime;

    const endTimeCell = document.createElement("td");
    endTimeCell.textContent = endTime;

    const capacityCell = document.createElement("td");
    capacityCell.textContent = capacity;

    // Actions column with buttons
    const actionsCell = document.createElement("td");

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async function () {
        try {
            const response = await fetch('http://localhost:3000/delete-availability', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interview_id })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Availability deleted successfully.");
                row.remove(); // Remove the row from the table
            } else {
                throw new Error(result.message || "Failed to delete availability.");
            }
        } catch (error) {
            console.error("Error deleting availability:", error);
            alert("An error occurred while deleting availability.");
        }
    });
    actionsCell.appendChild(deleteButton);

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
        // Populate the form fields with the current values
        document.getElementById("date").value = date;
        document.getElementById("start-time").value = startTime;
        document.getElementById("end-time").value = endTime;
        document.getElementById("capacity").value = capacity;

        // Update form to show edit mode
        document.getElementById("availabilityForm").dataset.editingId = interview_id;

        alert("You can now edit the selected availability in the form.");
    });
    actionsCell.appendChild(editButton);

    // Append cells to the row
    row.appendChild(dateCell);
    row.appendChild(startTimeCell);
    row.appendChild(endTimeCell);
    row.appendChild(capacityCell);
    row.appendChild(actionsCell);

    // Append the row to the table body
    tableBody.appendChild(row);
}

async function loadAvailabilityFromServer() {
    try {
        const response = await fetch('/get-availability');
        const data = await response.json();

        if (data.success) {
            const tableBody = document.getElementById("availabilityTable");
            tableBody.innerHTML = ''; // Clear previous rows

            // Populate the table with the latest data
            data.results.forEach(entry => {
                const normalizedDate = normalizeDate(entry.interview_date);
                const normalizedStartTime = normalizeTime(entry.startTime);
                const normalizedEndTime = normalizeTime(entry.endTime);
                displayAvailability(normalizedDate, normalizedStartTime, normalizedEndTime, entry.capacity, entry.interview_id);
            });
        } else {
            alert("Failed to load availability.");
        }
    } catch (error) {
        console.error("Error loading availability:", error);
        alert("An error occurred while loading availability.");
    }
}

function normalizeDate(date) {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
}

function normalizeTime(time) {
    const parsedTime = new Date(`1970-01-01T${time}Z`); // Parse as UTC time
    return parsedTime.toISOString().substr(11, 5); // Extract HH:mm
}













