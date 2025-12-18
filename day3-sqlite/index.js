const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());


const db = new sqlite3.Database("./school.db");


db.run(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER,
  course TEXT,
  email TEXT UNIQUE
)`);

db.run(`
CREATE TABLE IF NOT EXISTS student_log (
  message TEXT
)`);


db.run(`
CREATE INDEX IF NOT EXISTS idx_students_course
ON students(course)
`);


db.run(`
CREATE TRIGGER IF NOT EXISTS after_student_delete
AFTER DELETE ON students
BEGIN
  INSERT INTO student_log VALUES ('Student Deleted');
END;
`);


app.use("/", require("./routes/studentRoutes")(db));


app.listen(3000, () => {
  console.log("SQLite Server running on port 3000");
});
