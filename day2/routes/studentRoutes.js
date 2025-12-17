const express = require("express");
const router = express.Router();
const students = require("../data/students");//accessing studets array
const {
    validateSingleStudent,validateMultipleStudents
} = require("../middleware/validateStudent");//parent directory relative to current file
router.post("/",(req,res, next)=>{
    if(Array.isArray(req.body)){
        return validateMultipleStudents(req,res, ()=>{
            students.push(...req.body);
            res.json({
                message: "Multiple students added",
                count : req.body.length
            });
        });
    }
    return validateSingleStudent(req,res,() =>{
        students.push(req.body);
        res.json({
            message:"Single student added",
            data : req.body
        });
    });

});

router.get("/",(req,res)=>{
    res.json(students);
});
//using router built-in func to get
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if(!student){
        return res.status(404).json({message:"student not found"});
    }
    res.json(student);
});

router.put("/update-course/all",(req,res)=>{
    const {course} = req.body;
    if(!course){
        return res.status(400).json({//bad request
            message:"course is required"
        });
    }
    students.forEach(student =>{
        student.course = course;
    });

    res.json({
        message:"All students course updated",
        updatedCourse : course,
        totalStudents: students.length
    });
});
router.put("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if(index === -1){
        return res.status(400).json({message:"Student not found"});
    }
    students[index] = {...students[index],...req.body};
    res.json({
        message:"Student updated",
        data: students[index]
    });
});

router.delete("/delete/all",(req,res)=>{
    const total = students.length;
    students.length = 0;
    res.json({
        message:"All students deleted",
        deletedCount: total
    });
});

router.delete("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if(index === -1){
        return res.status(404).json({message : "Students not found"});
    }
    const deletedStudent = students.splice(index,1);
    res.json({
        message : "Student deleted",
        data : deletedStudent[0]
    });
});

module.exports = router;