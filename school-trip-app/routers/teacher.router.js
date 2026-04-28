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
        if(!id || !firstName)
        {
            return res.status(400).json({ message: "נא למלא את השדות המתאימים" });
        }
        const nameCoorect=/^[a-zA-Z\u0590-\u05FF\s]+$/;
        if(!nameCoorect.test(firstName))
        {
            return res.status(400).json({ message: "שם פרטי לא תקין, יש להשתמש רק באותיות בעברית או באנגלית" });
        }
        const teacher = await teacherModel.findOne({ id: id, firstName: firstName });
        if (!teacher) {
            return res.status(401).json({ message: "שם או ת''ז לא תקינים" });
        }
        return res.status(200).json({ message: "התחברת בהצלחה", id: teacher.id });
    } catch (error) {
        return res.status(500).json({ message: "שגיאת שרת" });
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
            time: req.body._validated.time
        };
        await teacher.save();
        return res.status(200).json({ message: "location updated successfully", teacher });
    } catch (error) {
        return res.status(500).json({ message: "error updating " });
    }
});


    

export default teacherRouter;