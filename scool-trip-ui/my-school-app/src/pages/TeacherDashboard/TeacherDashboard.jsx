import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./TeacherDashboard.module.css";
import { useAppState, ACTIONS } from "../../context/AppStateProvider";
import { getmyclass } from "../../api/api";
function TeacherDashboard() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppState();
    const teacherId = localStorage.getItem("teacher-id");
    const logout = () => {
        localStorage.removeItem("teacher-id");
        dispatch({ type: ACTIONS.SET_STUDENTS, payload: [] });
        dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: null });
        navigate("/");
    };
    useEffect(() => {
        if (!teacherId) {
            return;
        }
        if(!state?.teacherLocation)
        {
            const fetchTeacherLocation = async () => {
                try {
                    const res = await getmyclass(teacherId);
                    dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: res.data.teacher });
                } catch (error) {
                    console.log("Error fetching teacher location:", error);
                }
            };
            fetchTeacherLocation();
        }
    }, [teacherId, state?.teacherLocation, dispatch]);
    useEffect(() => {
        if (state?.students?.length === 0 && teacherId) {
            const fetchStudents = async () => {
                try {
                    const res = await getmyclass(teacherId);
                    dispatch({ type: ACTIONS.SET_STUDENTS, payload: res.data.students });
                } catch (error) {
                    console.log("Error fetching students:", error);
                }
            };
            fetchStudents();
        }
    },[teacherId, state?.students?.length, dispatch]);
    return (
        <div className={styles.container}>
            <header className={styles.welcomeHeader}>
                <div className={styles.greetingText}>
                <h1>ברוכה הבאה, {state.teacherLocation?.firstName}</h1>
                </div>
                <button className={styles.logoutBtn} onClick={logout}>יציאה</button>
            </header>
            <main>
                <h2>סקירה כללית</h2>
                <div className={styles.statsRow}>
                </div>
                <div className={styles.actionsRow}>
                    <div className={styles.actionCard} onClick={() => navigate("/map-view")}>
                        <h3>מפת איכון בזמן אמת</h3>
                        <p>צפייה במיקומי תלמידות, סימון מיקום שלך, והתראות על תלמידות מרוחקות.</p>
                    </div>
                    <div className={styles.actionCard} onClick={() => navigate("/class-students")}>
                        <h3>ניהול תלמידות</h3>
                        <p>הוספה, חיפוש וסינון לפי כיתה. כל מורה רואה את התלמידות שלה.</p>
                    </div>
                   
                </div>
            </main>
        </div>
    );
}

export default TeacherDashboard;