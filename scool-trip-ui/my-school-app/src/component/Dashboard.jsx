import { Outlet, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.sidebar}>
        <h2>ניהול טיולים</h2>
        <ul>
          <li onClick={() => navigate("/teacher-dashboard")}>דף הבית</li>
          <li onClick={() => navigate("/map-view")}>מפת איכון בזמן אמת</li>
          <li onClick={() => navigate("/class-students")}>ניהול תלמידות</li>
        </ul>
      </nav>
            <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;