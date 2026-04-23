import teacherModel from "../models/teacher.model.js";


const isTeacher= async (req,res,next)=>{
    try{
        const idteacher = req.headers['teacher-id'];
    if(!idteacher){
        return res.status(401).json({message: "miising teacher id"});   
    }
    const teacher = await teacherModel.findOne({id:idteacher});
    if(!teacher){
        return res.status(403).json({message: "only for teachers"});   
    }
    next();
    }catch(error){
        console.error("error in isTeacher middleware:", error);
        return res.status(500).json({message: "server error"});
    }
};
 export default isTeacher;