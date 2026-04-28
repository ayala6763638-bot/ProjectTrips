import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginTeacher } from "../../api/api";
import styles from "./loginPage.module.css";
import { useAppState } from "../../context/useAppState.js";
import { ACTIONS } from "../../context/constants";

function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ firstName: "", id: "" });
    const {dispatch}=useAppState();
    const onChanges = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    const login = async () => {
        if (!credentials.firstName || !credentials.id) {
            alert("נא למלא את כל השדות");
            return;
        }
        if(!ACTIONS.nameCorect.test(credentials.firstName))
        {
            alert("שם פרטי לא תקין, יש להשתמש רק באותיות בעברית או באנגלית");
            return;
        }
        try {
            const res = await loginTeacher({ firstName: credentials.firstName, id: credentials.id });
            dispatch({ type: ACTIONS.SET_STUDENTS, payload: [] });
            dispatch({ type: ACTIONS.SET_STUDENTS_IN_DANGER, payload: [] });
            dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: null });
            localStorage.setItem("teacher-id", res.data.id)
            navigate("/teacher-dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "אינך רשום במערכת, אנא נסה שוב או צור חשבון חדש";
            alert(errorMessage);
        }
    }
    return (
        <>
            <div className={styles.loginContainer}>
                <div className={styles.blueSide}>
                    <h1>ברוכים הבאים למערכת ניהול טיול שנתי</h1>
                    <p>מעקב חי על מיקומי תלמידות,והתראות אוטמטיות</p>
                </div>
                <div className={styles.formSide}>
                    <div className={styles.formBox}>
                        <h2>הכנסי לחשבונך , משתמשת חדשה? הירשמי כעת!</h2>
                        <input className={styles.inputField} name="firstName" type="text" onChange={onChanges} value={credentials.firstName} placeholder="שם פרטי"></input>
                        <input className={styles.inputField} name="id" type="text" onChange={onChanges} value={credentials.id} placeholder="ת''ז"></input>
                        <button className={styles.loginButton} onClick={login}>login</button>
                        <div>
                            <button className={styles.registerButton} onClick={() => navigate("/register-teacher")}>הרשמה</button>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}
export default LoginPage;