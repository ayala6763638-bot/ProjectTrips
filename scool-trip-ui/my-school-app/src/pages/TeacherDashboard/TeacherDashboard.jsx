import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { addteacherLocation } from "../../api/api";

function TeacherDashboard() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("teacher-id");
        navigate("/");
    };
    useEffect(() => {
        
    });
    return (
        <div className="dashboard-container">
            <p>ברוכה הבאה, מורה!</p>
            <div>
                <button onClick={() => navigate("/add-student")}>הוספת תלמיד</button>
                <button onClick={() => navigate("/class-students")}>צפייה בתלמידים לפי כיתה</button>
                <button onClick={() => navigate("/map-view")}>צפייה במפת טיול </button>  
            </div>
            <div className="logout-button">
                <button onClick={logout}>התנתקות</button>
            </div>
        </div>
    );
}

export default TeacherDashboard;