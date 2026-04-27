import { Router } from "express";
import teacherModel from "../models/teacher.model.js";
import validateTeacher from "../validations/Validation.js";
import validateRequest from "../middlewares/validate.middlewares.js";
import validateLocation from "../middlewares/validateLocation.middleware.js";
const teacherRouter = Router();

//add teacher to the app
teacherRouter.post("/add", validateRequest(validateTeacher), async (req, res) => {
    try {
        const newTeacher = new teacherModel(req.body);
        await newTeacher.save();
        return res.status(201).json({ message: "the teacher was added successfully", teacher: newTeacher });
    } catch (error) {
        return res.status(500).json({ message: "error in the added", error: error.message });
    }
    res.send();
});
//login
teacherRouter.post("/login", async (req, res) => {
    try {
        const { id, firstName } = req.body;
        const teacher = await teacherModel.findOne({ id: id, firstName: firstName });
        if (!teacher) {
            return res.status(401).json({ message: "error in the id or in the name" });
        }
        return res.status(200).json({ message: "login succesful", id: teacher.id });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
});
//get all teachers
teacherRouter.get("/all", async (req, res) => {
    try {
        const teachers = await teacherModel.find();
        return res.status(200).json(teachers);
    } catch (error) {
        return res.status(500).json({ message: "error getting teachers" });
    }
});
//update location of the teacher
teacherRouter.post("/update-location/:id",validateLocation, async (req, res) => {
    try {
        const teacherId = req.params.id;
        const newCoordinates = req.body.coordinates;
        const teacher = await teacherModel.findOne({ id: teacherId });
        if (!teacher) {
            return res.status(404).json({ message: " not found" });
        }
        teacher.lastLocation = {
            coordinates: req.body.coordinates,
            time: validation.now()
        };
        await teacher.save();
        return res.status(200).json({ message: "location updated successfully", teacher });
    } catch (error) {
        return res.status(500).json({ message: "error updating " });
    }
});


    

export default teacherRouter;