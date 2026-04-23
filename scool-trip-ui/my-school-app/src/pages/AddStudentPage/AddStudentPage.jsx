import { useState } from "react";
import { addstudent } from "../../api/api";
import { useNavigate } from "react-router-dom";

function AddStudent() {
    const [student, setStudent] = useState({ firstName: "", lastName: "", id: "" });
    const navigate = useNavigate();
    const teacherId = localStorage.getItem("teacher-id");
    const onChanges = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };
    const add = async () => {
        if (!teacherId) {
            console.log("not found teacher");
            return;
        }
        const studentWithLocation = {
            ...student,
            lastLocation: {
                coordinates: {
                    longitude: { degrees: "32", minutes: "0", seconds: "0" },
                    latitude: { degrees: "25", minutes: "0", seconds: "0" }
                },
                time: new Date().toISOString()
            }
        }
        try {
            await addstudent(studentWithLocation, teacherId);
            console.log("successfull");
            navigate("/teacher-dashboard");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <h2>הוספת תלמיד</h2>
            <label>שם פרטי:</label>
            <input name="firstName" placeholder="שם פרטי" onChange={onChanges} />
            <label>שם משפחה:</label>
            <input name="lastName" placeholder="שם משפחה" onChange={onChanges} />
            <label>מספר זהות:</label>
            <input name="id" placeholder="תעודת זהות" onChange={onChanges} />
            <button onClick={add}>הוספה</button>
        </div>
    );


}
export default AddStudent;