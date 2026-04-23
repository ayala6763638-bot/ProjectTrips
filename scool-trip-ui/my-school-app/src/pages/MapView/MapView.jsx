import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { getmyclass,getstudentindangeroues,getteacherlocation } from "../../api/api";


function SetToCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center);
        }
    }, [center, map]);
    return null;
}
//המרה בין אחוזים לעשרוני
const converttodecimaly = (dms) => {
    if (!dms)
        return null;
    const deg = parseFloat(dms.degrees) || 0;
    const min = parseFloat(dms.minutes) || 0;
    const sec = parseFloat(dms.seconds) || 0;
    return deg + (min / 60) + (sec / 3600);
};

function MapView() {
    const [Students, setStudents] = useState([]);
    const [teacherLocation, setTeacherLocation] = useState(null);
    const teacherId = localStorage.getItem("teacher-id");
    const [studentsInDanger, setStudentsInDanger] = useState([]);
    const [center, setCenter] = useState([32.0853, 34.7818]);
    useEffect(() => {
        const getStudents = async () => {
            try {
                const res = await getmyclass(teacherId);
                setStudents(res.data.students);
                setTeacherLocation(res.data.teacher);
            const studentsindangers = await getstudentindangeroues(teacherId);
            setStudentsInDanger(studentsindangers.data);
            } catch (error) {
                console.log(error);
            }
        };
        getStudents();
        const interval = setInterval(async () => {
            try {
                const responseS = await getstudentindangeroues(teacherId);
                setStudentsInDanger(response.data);
                const responseT = await getteacherlocation(teacherId);
                setTeacherLocation(responseT.data);
            } catch (error) {   
                console.log(error);
            }
        }, 60000);
        return()=> clearInterval(interval);
    }, [teacherId]);
    const lat = converttodecimaly(teacherLocation?.lastLocation?.coordinates?.latitude);
    const lng = converttodecimaly(teacherLocation?.lastLocation?.coordinates?.longitude);
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2>לוח בקרה</h2>
                {lat && <button onClick={() => setCenter([lat, lng])}>מרכז מפה על המורה</button>}
                {studentsInDanger.map(s => (
                    <div key={s.id} style={{ color: "red", margin: "5px" }}>
                        {s.firstName} {s.lastName} נמצא במרחק מסוכן ({s.distance.toFixed(1)} ק"מ)
                        <button onClick={() => {
                            const latitude1 = converttodecimaly(s.lastLocation.coordinates.latitude);
                            const longitude1 = converttodecimaly(s.lastLocation.coordinates.longitude);
                            setCenter([latitude1, longitude1]);
                        }}>נווט אליה</button>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <MapContainer center={[32.0853, 34.7818]} zoom={13} style={{ height: "100vh", width: "100%" }}>
                    <SetToCenter center={center} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {teacherLocation && (
                        <Marker position={[lat, lng]}>
                            <Popup>
                                מיקום המורה: {teacherLocation.firstName} {teacherLocation.lastName}
                            </Popup>
                        </Marker>
                    )}
                    {Students.map((Student) => {
                        if (!Student.lastLocation || !Student.lastLocation.coordinates)
                            return null;
                        const longitude = converttodecimaly(Student.lastLocation.coordinates.longitude);
                        const latitude = converttodecimaly(Student.lastLocation.coordinates.latitude);
                        const dangerousStudents= studentsInDanger.find(s => s.id === Student.id);
                        const distance = dangerousStudents ? dangerousStudents.distance : 0;
                        let isdanger = false;
                        if(dangerousStudents!==undefined && dangerousStudents!==null)
                            isdanger = true;
                        else
                            isdanger = false;
                        return (
                            <Marker key={Student.id} position={[latitude, longitude]}>
                                <Popup>
                                    {isdanger ? (
                                        <span style={{ color: "red" }}>בטווח מסוכן ❌ ({distance.toFixed(1)} ק"מ)</span>
                                    ) : (
                                        <span style={{ color: "green" }}>בטווח בטוח ⚠️ </span>
                                    )}
                                    {Student.firstName} {Student.lastName}
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