import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useAppState } from "../../context/AppStateProvider";
import { dmsToDecimal } from "../../Utlis/CalculatingAndValidet.js";
import styles from "./MapView.module.css"; 

function SetToCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 15); 
    }, [center, map]);
    return null;
}

function MapView() {
    const { state, getClassData } = useAppState();
    const { students, teacherLocation = null, studentsInDanger = [] } = state;
    const [mapCenter, setCenter] = useState([32.0853, 34.7818]);
    const teacherId = localStorage.getItem("teacher-id");

    const CenterOnTeacher = () => {
        const lat = dmsToDecimal(teacherLocation?.lastLocation?.coordinates?.latitude);
        const lng = dmsToDecimal(teacherLocation?.lastLocation?.coordinates?.longitude);
        if (lat && lng) setCenter([lat, lng]);
    };

    const CenterOnStudent = (student) => {
        const lat = dmsToDecimal(student?.lastLocation?.coordinates?.latitude);
        const lng = dmsToDecimal(student?.lastLocation?.coordinates?.longitude);
        if (lat && lng) setCenter([lat, lng]);
    };

    useEffect(() => {
        if (teacherId && typeof getClassData === 'function') {
            getClassData(teacherId);
        }
    }, [teacherId, getClassData]);

    const teacherLat = dmsToDecimal(teacherLocation?.lastLocation?.coordinates?.latitude);
    const teacherLng = dmsToDecimal(teacherLocation?.lastLocation?.coordinates?.longitude);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.header}>לוח בקרה</h2>
                
                {teacherLat && teacherLng && (
                    <button className={styles.btn} onClick={CenterOnTeacher}>
                        מרכז מפה על המורה
                    </button>
                )}

                <h3>התראות (תלמידות בסיכון):</h3>
                {studentsInDanger?.map(s => (
                    <div key={s.id} className={styles.dangerCard}>
                        <div className={styles.dangerText}>
                            {s.firstName} {s.lastName} ({s.distance?.toFixed(1)} ק"מ)
                        </div>
                        <button onClick={() => CenterOnStudent(s)}>נווט אליה</button>
                    </div>
                ))}
            </div>
            <div className={styles.mapWrapper}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <SetToCenter center={mapCenter} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {teacherLocation && teacherLat && teacherLng && (
                        <Marker position={[teacherLat, teacherLng]}>
                            <Popup>המורה: {teacherLocation.firstName}</Popup>
                        </Marker>
                    )}
                    
                    {students?.map((student) => {
                        const lng = dmsToDecimal(student.lastLocation?.coordinates?.longitude);
                        const lat = dmsToDecimal(student.lastLocation?.coordinates?.latitude);
                        if (!lat || !lng) return null;
                        
                        const isDangerous = studentsInDanger.find(s => s.id === student.id);
                        return (
                            <Marker key={student.id} position={[lat, lng]}>
                                <Popup>
                                    {isDangerous ? "❌ בסיכון" : "✅ תקין"}
                                    <br />{student.firstName} {student.lastName}
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapView;