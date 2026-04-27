import { useState } from "react";
import { addstudent } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAppState, ACTIONS } from "../../context/AppStateProvider";
import "./AddStudentPage.module.css"; 

function AddStudent() {
  const [student, setStudent] = useState({ firstName: "", lastName: "", id: "" });
  const navigate = useNavigate();
  const teacherId = localStorage.getItem("teacher-id");
  const { dispatch } = useAppState();

  const onChanges = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const add = async () => {
    if (!teacherId) {
      console.log("לא נמצא מורה");
      return;
    }
    const studentWithLocation = {
      ...student,
      lastLocation: {
        coordinates: {
          longitude: { degrees: "32", minutes: "0", seconds: "0" },
          latitude: { degrees: "25", minutes: "0", seconds: "0" },
        },
        time: new Date().toISOString(),
      },
    };
    try {
      const res = await addstudent(studentWithLocation, teacherId);
      dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: res.data.student });
      console.log("הוספה בוצעה בהצלחה");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-student-container">
      <div className="add-student-card">
        <h2>הוספת תלמיד חדש</h2>
        <div className="form-group">
          <label>שם פרטי:</label>
          <input name="firstName" placeholder="הקלד שם פרטי" onChange={onChanges} />
        </div>

        <div className="form-group">
          <label>שם משפחה:</label>
          <input name="lastName" placeholder="הקלד שם משפחה" onChange={onChanges} />
        </div>

        <div className="form-group">
          <label>מספר זהות:</label>
          <input name="id" placeholder="הקלד תעודת זהות" onChange={onChanges} />
        </div>

        <button className="add-button" onClick={add}>הוספת התלמיד</button>
      </div>
    </div>
  );
}

export default AddStudent;