import { useState } from "react";
import { registerTeacher as apiregister } from "../../api/api";
import { useNavigate } from "react-router-dom";
import styles from "../RegisterTeacher/RegisterTeacher.module.css"
import { useAppState } from "../../context/useAppState.js";
import { ACTIONS, nameCorect } from "../../context/constants";
import { isValidId } from "../../Utlis/CalculatingAndValidet.js";

function RegisterTeacher() {

    const [teacher, setTeacher] = useState({ firstName: "", lastName: "", id: "" });
    const [className, setClassName] = useState("י");
    const [classnumber, setClassNumber] = useState("1");
    const navigator = useNavigate();
    const { dispatch } = useAppState();
    const onChanges = (e) => {
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };
    const register = async () => {
        if (!teacher.firstName || !teacher.lastName || !teacher.id || !className || !classnumber) {
            alert("נא למלא את כל השדות");
            return;
        }
        if (!nameCorect.test(teacher.firstName) || !nameCorect.test(teacher.lastName)) {
            alert("שם פרטי או שם משפחה לא תקינים, יש להשתמש רק באותיות בעברית או באנגלית");
            return;
        }
        if (!isValidId(teacher.id)) {
            alert("תעודת זהות לא תקינה");
            return;
        }
        const fullClassName = `${className}${classnumber}`;
        const teacherWithLocation = {
            ...teacher,
            className: fullClassName,
            lastLocation: {//עשיתי שיהיה כברירת מחדל לבנתיים כאילו
                coordinates: {
                    longitude: { degrees: "32", minutes: "0", seconds: "0" },
                    latitude: { degrees: "25", minutes: "0", seconds: "0" }
                },
                time: new Date().toISOString()
            }
        }
        try {
            await apiregister(teacherWithLocation);
            dispatch({ type: ACTIONS.SET_STUDENTS, payload: [] });
            localStorage.setItem("teacher-id", teacher.id);
            alert("ההרשמה בוצעה בהצלחה, כעת תוכל להתחבר עם שם המשתמש והסיסמה שלך");
            navigator("/teacher-dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "הרשמה נכשלה, אנא נסה שוב";
            alert(errorMessage);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.blueSide}>
                <h1>ברוכים הבאים למערכת ניהול טיולים</h1>
                <p>מעקב חי על מיקומי תלמידות, והתראות אוטומטיות</p>
            </div>
            <div className={styles.formSide}>
                <div className={styles.formBox}>
                    <h2>הרשמה</h2>
                    <input className={styles.inputField} name="firstName" placeholder="שם פרטי" onChange={onChanges} />
                    <input className={styles.inputField} name="lastName" placeholder="שם משפחה" onChange={onChanges} />
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <select className={styles.inputField} value={className} onChange={(e) => setClassName(e.target.value)}>
                            <option value="י">י</option>
                            <option value="י''א">י''א</option>
                            <option value="י''ב">י''ב</option>
                        </select>
                        <input
                            className={styles.inputField}
                            type="number"
                            placeholder="מספר כיתה"
                            onChange={(e) => setClassNumber(e.target.value)}
                        />
                    </div>

                    <input className={styles.inputField} name="id" placeholder="תעודת זהות" onChange={onChanges} />

                    <button className={styles.registerButton} onClick={register}>הרשמה</button>
                </div>
            </div>
        </div>
    );
}
export default RegisterTeacher;
