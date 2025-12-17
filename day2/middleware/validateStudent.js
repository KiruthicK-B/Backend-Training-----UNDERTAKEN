const students = require("../data/students");


const validateSingleStudent = (req, res, next) => {
    const { id, name, course, email } = req.body;

    if (!id || !name || !course || !email) {
        return res.status(400).json({
            message: "id, name, course, email are required"
        });
    }

    // Duplicate ID check
    const exists = students.find(s => s.id === id);
    if (exists) {
        return res.status(409).json({
            message: `Student with id ${id} already exists`
        });
    }

    next();
};

const validateMultipleStudents = (req, res, next) => {

    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            message: "Expected array of students"
        });
    }

    let errors = [];

    req.body.forEach((student, index) => {
        const { id, name, course, email } = student;

        if (!id || !name || !course || !email) {
            errors.push({
                index,
                reason: "Missing fields"
            });
        }

        if (students.find(s => s.id === id)) {
            errors.push({
                index,
                reason: `Duplicate id ${id}`
            });
        }
    });

    if (errors.length > 0) {
        return res.status(409).json({
            message: "Invalid student data found",
            errors
        });
    }

    next();
};

module.exports = {
    validateSingleStudent,
    validateMultipleStudents
};
