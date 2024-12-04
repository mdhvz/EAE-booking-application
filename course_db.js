var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "admission"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO course (course_id, course_name, description, capacity) VALUES ?";
  var values = [
    ['T56', 'Common Engineering Programme', 'NIL', 380],
    ['T50', 'Diploma in Aerospace Electronics', 'NIL', 75],
    ['T51', 'Diploma in Aerospace Engineering', 'Benefit from the best opportunities and embark on a career in the expanding aerospace industry. Learn more about our Diploma in Aerospace Engineering...', 125],
    ['T29', 'Diploma in Architectural Technology & Building Services', 'Create a sustainable living environment for all! Learn about Temasek Polytechnic\'s Diploma in Architectural Technology & Building Services now.', 75],
    ['T04', 'Diploma in Aviation Management', 'Learn the ins and outs of how to manage a world-class airport and more. Take flight in your career with Temasek Polytechnic\'s Diploma in Aviation Management...', 95],
    ['T38', 'Diploma in Biomedical Engineering', 'Create the next generation of smart medical devices for the healthcare sector. Discover Temasek Polytechnic\'s Diploma in Biomedical Engineering now!', 100],
    ['T43', 'Diploma in Business Process & Systems Engineering', 'Train in both business and engineering concepts to add value to organisations. Join Temasek Polytechnic\'s Diploma in Business Process & Systems Engineering...', 95],
    ['T13', 'Diploma in Computer Engineering', 'NIL', 100],
    ['T65', 'Diploma in Electronics', 'NIL', 50],
    ['T28', 'Diploma in Integrated Facility Management', 'NIL', 60]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
});
