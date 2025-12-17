const express = require("express");
const app = express();

app.use(express.json());

let students = [];

let nextId = 1;

app.get("/students", (req, res) => {
  res.json(students);
});

app.post("/students", (req, res) => {
  const newStudent = {
    id: nextId++,
    name: req.body.name,
    department: req.body.department,
    year: req.body.year
  };

  students.push(newStudent);
  res.json(newStudent);
});

app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  student.name = req.body.name;
  student.department = req.body.department;
  student.year = req.body.year;

  res.json(student);
});


app.patch("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  Object.assign(student, req.body);
  res.json(student);
});


app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  students = students.filter(s => s.id !== id);

  res.json({ message: "Student deleted" });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
