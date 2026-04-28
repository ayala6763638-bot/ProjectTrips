import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getmyclass } from "../../api/api";
import { useAppState } from "../../context/useAppState.js";
import styles from "./ClassStudents.module.css";
import { ACTIONS } from "../../context/constants";

function ClassStudents() {
    const { state, dispatch, getClassData } = useAppState();
    const { students } = state ?? {};
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const teacherId = localStorage.getItem("teacher-id");

    useEffect(() => {
        if (!teacherId) return;
        if (typeof getClassData === 'function') {
            getClassData(teacherId);
            return;
        }
        const getStudents = async () => {
            try {
                const res = await getmyclass(teacherId);
                dispatch({ type: ACTIONS.SET_STUDENTS, payload: res.data.students });
            } catch (error) {
                console.log(error);
            }
        };
        getStudents();
    }, [teacherId, dispatch, getClassData]);
    const filteredStudents = students?.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.includes(searchTerm)
    );

    return (
        <div className={styles.container}>
            <h2>התלמידים בכיתה שלי</h2>
            <div className={styles.controls}>
                <input
                    className={styles.searchBox}
                    type="text"
                    placeholder="חיפוש לפי שם או תעודת זהות..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className={styles.addButton}
                    onClick={() => navigate("/add-student")}
                >
                    הוספת תלמידה
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.studentTable}>
                    <thead>
                        <tr>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>מספר זהות</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {filteredStudents && filteredStudents.length > 0 ? (filteredStudents.map((s) => (
                            <tr key={s.id}>
                                <td>{s.firstName}</td>
                                <td>{s.lastName}</td>
                                <td>{s.id}</td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={styles.noStudentsCell}>
                                    <div className={styles.emptyState}>
                                        <p>נראה שאין עדיין תלמידות ברשימה.</p>
                                        <p>ייתכן שהטיול טרם התחיל או שטרם נוספו תלמידות למערכת.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClassStudents;