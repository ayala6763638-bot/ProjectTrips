import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard.jsx";
import RegisterTeacher from "./pages/RegisterTeacher/RegisterTeacher.jsx";
import AddStudent from "./pages/AddStudentPage/AddStudentPage.jsx";
import ClassStudents from "./pages/ClassStudents/ClassStudents.jsx";
import MapView from "./pages/MapView/MapView.jsx";
import 'leaflet/dist/leaflet.css';
import Dashboard from "./component/Dashboard.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/register-teacher" element={<RegisterTeacher />}></Route>
          <Route element={<Dashboard />}>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/class-students" element={<ClassStudents />} />
            <Route path="/map-view" element={<MapView />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
