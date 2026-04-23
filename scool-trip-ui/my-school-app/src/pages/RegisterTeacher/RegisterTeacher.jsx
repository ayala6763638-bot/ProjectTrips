import { useState } from "react";
import { registerTeacher as apiregister } from "../../api/api";
import { useNavigate } from "react-router-dom";
import styles from "../RegisterTeacher/RegisterTeacher.module.css"

function RegisterTeacher() {
    const [teacher, setTeacher] = useState({ firstName: "", lastName: "", className: "", id: "" });
    const navigator = useNavigate();
    const onChanges = (e) => {
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };
    const register = async () => {
        const teacherWithLocation = {
            ...teacher,
            lastLocation: {
                coordinates: {
                    longitude: { degrees: "32", minutes: "0", seconds: "0" },
                    latitude: { degrees: "25", minutes: "0", seconds: "0" }
                },
                time: new Date().toISOString()
            }
        }
        try {
            await apiregister(teacherWithLocation);
            localStorage.setItem("teacher-id", teacher.id);
            console.log("successfull");
            navigator("/teacher-dashboard");
        } catch (error) {
            console.log(error);
            alert("Register failed");
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
                    <h2 >הרשמה</h2>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} name="firstName" placeholder="שם פרטי" onChange={onChanges} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} name="lastName" placeholder="שם משפחה" onChange={onChanges} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} name="className" placeholder="כיתת לימוד" onChange={onChanges} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input className={styles.inputField} name="id" placeholder="תעודת זהות" onChange={onChanges} />
                    </div>
                    <button className={styles.registerButton} onClick={register}>הרשמה</button>
                </div>
            </div>
        </div>
    );
}
export default RegisterTeacher;
