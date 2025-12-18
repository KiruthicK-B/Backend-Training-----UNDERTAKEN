const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// CREATE – Add student
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json({ message: "Student added", data: student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ – Get all students
router.get("/", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// READ – Get student by ID
router.get("/:id", async (req, res) => {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
});

// UPDATE – Update student by ID
router.put("/:id", async (req, res) => {
    const student = await Student.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true }
    );
    res.json({ message: "Student updated", data: student });
});



router.get("/report/course-count", async (req, res) => {
    const result = await Student.aggregate([
        { $group: { _id: "$course", total: { $sum: 1 } } }
    ]);
    res.json(result);
});

// DELETE – Delete student by ID
router.delete("/:id", async (req, res) => {
    await Student.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Student deleted" });
});

module.exports = router;
