import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import AdminAlerts from "./pages/admin/AdminAlerts";
import GuideAlerts from "./pages/guide/GuideAlerts";
import AdminCourses from "./pages/admin/courses/AdminCourses";
import CourseEditor from "./pages/admin/courses/CourseEditor";
import GuideCourses from "./pages/guide/GuideCourses";
import GuideCourseView from "./pages/guide/GuideCourseView";
import GuideProgress from "./pages/guide/GuideProgress";
import AdminBadges from "./pages/admin/AdminBadges";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminGuideDetails from "./pages/admin/AdminGuideDetails";
import AdminTrainingOverview from "./pages/admin/AdminTrainingOverview";
import AdminNotifications from "./pages/admin/AdminNotifications";
import GuideNotifications from "./pages/guide/GuideNotifications";
import AdminProfile from "./pages/admin/AdminProfile";
import GuideProfile from "./pages/guide/GuideProfile";
import AdminDevice from "./pages/admin/AdminDevice";
import Welcome from "./pages/welcome";
import GuideDashboard from "./pages/guide/GuideDashboard";

import "./App.css";

function App() {
  const location = useLocation();
  const hideSidebar = ["/", "/register", "/login"].includes(location.pathname);
  const isWelcomePage = location.pathname === "/";
  const isAuthPage = ["/register", "/login"].includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content */}
      <div
        className={`main-content ${hideSidebar ? "full" : ""} ${
          isWelcomePage ? "welcome-shell" : ""
        } ${
          isAuthPage ? "auth-shell" : ""
        }`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin routes */}
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<CourseEditor />}
/>
          <Route path="/admin/users" element={<AdminGuides />} />
          <Route path="/admin/users/:id" element={<AdminGuideDetails />} />
          <Route path="/admin/trainingoverview" element={<AdminTrainingOverview />} />
          <Route path="/admin/alerts" element={<AdminAlerts />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/device" element={<AdminDevice />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          {/* Guide routes */}
          <Route path="/guide/courses"  element={<GuideCourses />} />
          <Route path="/guide/courses/:id" element={<GuideCourseView />} />
          <Route path="/guide/progress" element={<GuideProgress />} />
          <Route path="/guide/alerts" element={<GuideAlerts />} />
          <Route path="/guide/notifications" element={<GuideNotifications />} />
          <Route path="/guide/profile" element={<GuideProfile />} />
                  <Route
          path="/guide/dashboard"
          element={<GuideDashboard />}
        />

          {/* Default */}
          <Route path="/" element={<Welcome />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
