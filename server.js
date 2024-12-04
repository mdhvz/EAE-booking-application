const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Session configuration
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true for HTTPS
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON and URL-encoded payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling FormData
const upload = multer();


// MySQL Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "admission"
});

// Connect to MySQL Database
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
});

// Student login route
app.post("/log-in", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const [rows] = await db.query("SELECT email, password, name, secondary_school, student_id FROM students WHERE email = ?", [email]);
 
        if (rows.length > 0) {
            const user = rows[0];
            const storedPassword = user.password;
 
            if (password === storedPassword) {
                req.session.userId = user.student_id;  // Storing user session data
                // Redirect with student_id as a query parameter
                res.redirect(/HomePage?student_id=${user.student_id});
                console.log('isdkdkm');
            } else {
                res.send("Incorrect Password");
            }
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.error("Error querying database:", err);  // More detailed error
        res.status(500).send("An error occurred while processing your request.");
    }
});


// Staff login route
app.post('/staff-login', upload.none(), (req, res) => {
    const { Email, password } = req.body;

    // Log the request body and specific fields for debugging
    console.log("Request Body:", req.body);

    // Validate input
    if (!Email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Query to validate the user
    db.query(
        'SELECT * FROM staff WHERE LOWER(staff_email) = LOWER(?)',
        [Email],
        (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Server error" });
            }

            console.log("Query Results:", results);

            if (results.length > 0) {
                const staff = results[0];

                // Compare password
                if (password === staff.staff_password) {
                    // Store staff details in the session
                    req.session.staff = {
                        id: staff.staff_id,
                        name: staff.staff_name,
                        email: staff.staff_email,
                        course_id: staff.course_id,
                    };

                    return res.json({
                        success: true,
                        message: "Login successful",
                        staff: req.session.staff,
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid email or password." });
                }
            } else {
                return res.status(401).json({ success: false, message: "Invalid email or password." });
            }
        }
    );
});

// Route to get staff info
app.get('/get-staff-info', (req, res) => {
    if (!req.session.staff) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    // Return the staff info stored in the session
    console.log("Staff session data:", req.session.staff); // Debugging
    const staffInfo = req.session.staff;

    if (!staffInfo) {
        return res.status(404).json({ success: false, message: "Staff information not found." });
    }

    return res.json({ success: true, staffInfo });
});



// Save availability route
app.post('/set-availability', (req, res) => {
    if (!req.session.staff) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { interview_date, startTime, endTime, capacity, status, course_id } = req.body;
    const staff_id = req.session.staff.id; // Use logged-in staff's ID

    console.log("Staff ID from session:", staff_id);

    if (!interview_date || !startTime || !endTime || !capacity || !course_id || !status) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const query = `INSERT INTO interview_slot (interview_date, startTime, endTime, capacity, staff_id, status, course_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [interview_date, startTime, endTime, capacity, staff_id, status, course_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Error saving availability." });
        }
        return res.json({ success: true, message: "Availability saved successfully." });
    });
});


// Get availability data
app.get('/get-availability', (req, res) => {
    if (!req.session.staff) {
        console.log("Unauthorized access attempt.");
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const staff_id = req.session.staff.id;
    console.log("Fetching availability for staff ID:", staff_id);

    const query = 'SELECT interview_id, interview_date, startTime, endTime, capacity FROM interview_slot WHERE staff_id = ?';
    db.query(query, [staff_id], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ success: false, message: "Error fetching availability data." });
        }

        if (results.length === 0) {
            console.log("No availability slots found for staff ID:", staff_id);
            return res.json({ success: false, message: "No availability slots found." });
        }

        console.log("Availability slots found:", results);
        res.json({ success: true, results });
    });
});


app.get('/protected-route', (req, res) => {
    if (!req.session.staff) {
        return res.redirect('/login'); // Redirect to login page
    }
    res.sendFile(path.join(__dirname, 'protected.html')); // Serve the protected page
});

// Delete availability route
app.delete('/delete-availability', (req, res) => {
    const { interview_id } = req.body;

    if (!interview_id) {
        return res.status(400).json({ success: false, message: "Interview ID is required." });
    }

    db.query('DELETE FROM interview_slot WHERE interview_id = ?', [interview_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Server error while deleting the slot." });
        }

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: "Interview slot deleted successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Interview slot not found." });
        }
    });
});

// Edit availability route
app.put('/edit-availability', (req, res) => {
    const { interview_id, interview_date, startTime, endTime, capacity, status, course_id } = req.body;

    // Ensure the required fields are provided
    if (!interview_id || !interview_date || !startTime || !endTime || !capacity || !status || !course_id) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Query to update the interview slot details
    const query = `UPDATE interview_slot 
                   SET interview_date = ?, startTime = ?, endTime = ?, capacity = ?, status = ?, course_id = ?
                   WHERE interview_id = ? AND staff_id = ?`;

    // Get staff ID from session
    const staff_id = req.session.staff.id;

    db.query(query, [interview_date, startTime, endTime, capacity, status, course_id, interview_id, staff_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Error updating availability." });
        }

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: "Availability updated successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Interview slot not found or you don't have permission to edit it." });
        }
    });
});


// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session error:", err);
            return res.status(500).json({ success: false, message: "Error logging out." });
        }
        res.json({ success: true, message: "Logout successful." });
    });
});

// Fallback for other routes
app.get('/', (req, res) => {
    if (!req.session.staff) {
        return res.redirect('/login'); // Redirect if user is not logged in
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
