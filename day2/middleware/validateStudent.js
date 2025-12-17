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

















// NORMAL VALIDATION
// const validateStudent = (req, res, next) => {
//     const { id, name, course, email } = req.body;

//     if (!id || !name || !course || !email) {
//         return res.status(400).json({
//             message: "id, name, course, email are required"
//         });
//     }

//     next();
// };

// module.exports = validateStudent;


//ADVANCED VALIDATION
// Validate SINGLE student

// Validate SINGLE student
// const validateSingleStudent = (req, res, next) => {
//     const { id, name, course, email } = req.body;

//     if (!id || !name || !course || !email) {
//         return res.status(400).json({
//             message: "id, name, course, email are required"
//         });
//     }

//     // 🔴 Duplicate ID check
//     const exists = students.find(s => s.id === id);
//     if (exists) {
//         return res.status(409).json({
//             message: `Student with id ${id} already exists`
//         });
//     }

//     next();
// };

// // Validate MULTIPLE students
// const validateMultipleStudents = (req, res, next) => {
//     if (!Array.isArray(req.body)) {
//         return res.status(400).json({
//             message: "Expected array of students"
//         });
//     }

//     let duplicateIds = [];

//     req.body.forEach(student => {
//         const { id, name, course, email } = student;

//         if (!id || !name || !course || !email) {
//             duplicateIds.push("missing-fields");
//         }

//         if (students.find(s => s.id === id)) {
//             duplicateIds.push(id);
//         }
//     });

//     if (duplicateIds.length > 0) {
//         return res.status(409).json({
//             message: "Duplicate or invalid student data found",
//             details: duplicateIds
//         });
//     }

//     next();
// };

// module.exports = {
//     validateSingleStudent,
//     validateMultipleStudents
// };
