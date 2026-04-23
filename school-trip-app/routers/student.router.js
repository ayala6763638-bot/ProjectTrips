import { Router } from "express";
import studentModel from "../models/student.model.js";
import studentValidation from "../validations/studentValidation.js";
import validateRequest from "../middlewares/validate.middlewares.js";
import isTeacher from "../middlewares/authorizeTeacher.middleware.js";
import teacherModel from "../models/teacher.model.js";
import distinationlocation from "../calculateDistance/calculateDistance.js";

const studentRouter = Router();

//add student to the app  
studentRouter.post("/add", isTeacher, validateRequest(studentValidation), async (req, res) => {
    try {
        const teacherId = req.headers['teacher-id'];
        const teacher = await teacherModel.findOne({ id: teacherId });
        if (!teacher) {
            return res.status(404).json({ message: "teacher not found" });
        }
        const newstudentforclass = {
            ...req.body,
            className: teacher.className
        };
        const newstudent = new studentModel(newstudentforclass);
        await newstudent.save();
        return res.status(201).json({ message: "the student was added successfully", student: newstudent });
    } catch (error) {
        console.error("Server Error Details:", error);
        return res.status(500).json({ message: "error in the added", error: error.message });
    }
    res.send();
});

//get students from classnamesesw teacher
studentRouter.get("/class/:className", isTeacher, async (req, res) => {
    try {
        const className = req.params.className;
        const students = await studentModel.find({ className: className });
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ message: "error getting students" });
    }
});
//get students of the teachers classes
studentRouter.get("/my-class", isTeacher, async (req, res) => {
    try {
        const teacherId = req.headers['teacher-id'];
        const teacher = await teacherModel.findOne({ id: teacherId });
        if (!teacher) {
            return res.status(404).json({ message: "teacher not found" });
        }
        const students = await studentModel.find({ className: teacher.className });
        return res.status(200).json(
            {
                students: students,
                teacher: teacher
            }
        );
    } catch (error) {
        return res.status(500).json({ message: "error getting students" });
    }
});
//update location of the student
studentRouter.post("/add-location/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const neaCoordinates = req.body.coordinates;
        const student = await studentModel.findOne({ id: studentId });
        if (!student) {
            return res.status(404).json({ message: "student not found" });
        }
        student.lastLocation = {
            coordinates: neaCoordinates,
            time: Date.now()
        };
        await student.save();
        return res.status(200).json({ message: "location updated successfully", student });
    } catch (error) {
        return res.status(500).json({ message: "error updating location", error: error.message });
    }
});
//get all students
studentRouter.get("/all", isTeacher, async (req, res) => {
    try {
        const students = await studentModel.find();
        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({ message: "error getting students" });
    }
});
//get the student in dangers place
studentRouter.get("/in-danger", isTeacher, async (req, res) => {
   
        const { teacherId } = req.query;
        try 
        {
            const teacher = await teacherModel.findOne({ id: teacherId });
            if (!teacher) {
                return res.status(404).json({ message: "teacher not found" });
            }
            const students = await studentModel.find({ className: teacher.className });
            const studentsInDanger = students.filter(student => {
                const distance = distinationlocation(
                    student.lastLocation.coordinates.latitude.degrees,
                    student.lastLocation.coordinates.longitude.degrees,
                    teacher.lastLocation.coordinates.latitude.degrees,
                    teacher.lastLocation.coordinates.longitude.degrees
                );
                return distance > 3; 
            })
            .map(s=>{
                const distance = distinationlocation(
                    s.lastLocation.coordinates.latitude.degrees,
                    s.lastLocation.coordinates.longitude.degrees,
                    teacher.lastLocation.coordinates.latitude.degrees,
                    teacher.lastLocation.coordinates.longitude.degrees
                );
                return {...s.toObject(), distance: distance};  
            });
            res.status(200).json(studentsInDanger);
        } catch (error) {
            return res.status(500).json({ message: "error getting students in danger", error: error.message });
        }
});


export default studentRouter;


