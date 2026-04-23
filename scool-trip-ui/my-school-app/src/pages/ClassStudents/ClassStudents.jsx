import { useEffect, useState } from "react";
import { getmyclass } from "../../api/api";

function ClassStudents() {
    const [students, setStudents] = useState([]);
    const teacherId = localStorage.getItem("teacher-id");
    useEffect(() => {
        const getStudents  =   async () => {
            try {
                const res = await getmyclass(teacherId);
                setStudents(res.data.students);
            } catch (error) {
                console.log(error);
            }
        };
        getStudents();
    }, [teacherId]);
    
    return (
        <div>
            <h2>התלמידים בכיתה שלי</h2>
            <ul>
                {students?.map((s) => (
                    <li key={s.id}>{s.firstName} {s.lastName}-{s.id}</li>
                ))}
            </ul>
        </div>
    );
}

export default ClassStudents;
