import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// --- AUTHENTICATION IMPORTS ---
import Login from './auth/Login';
import SignUp from './auth/SignUp';

// --- ADMIN IMPORTS ---
import AdminDashboard from './admin/Dashboard';
import AdminCourses from './admin/Courses';
import AdminParkGuides from './admin/ParkGuides';
import AdminCertifications from './admin/Certifications';
import AdminAlerts from './admin/Alerts';
import AdminNotifications from './admin/Notifications';
import AdminProfile from './admin/Profile';
import AdminDevices from './admin/Device'; 
import adminStyles from './styles/admin';

// --- GUIDE IMPORTS ---
import GuideDashboard from './guide/Dashboard';
import GuideCourses from './guide/Courses';
import GuideMyProgress from './guide/MyProgress'; 
import GuideNotifications from './guide/Notifications';
import GuideProfile from './guide/Profile';
import GuideAlerts from './guide/Alerts';
import GuideAR from './guide/AR'; 
import guideStyles from './styles/guide';

export default function App() {
  // --- CORE AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authScreen, setAuthScreen] = useState('Login'); 
  const [userRole, setUserRole] = useState('guide'); 
  const [currentUser, setCurrentUser] = useState({ 
    user_id: 1, 
    name: 'Test Guide', 
    role: 'guide' 
  });

  // --- ADMIN STATE ---
  const [adminScreen, setAdminScreen] = useState('Dashboard');
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // --- GUIDE STATE ---
  const [guideScreen, setGuideScreen] = useState('Dashboard');
  const [guideMenuOpen, setGuideMenuOpen] = useState(false);
  const [activeGuideCourse, setActiveGuideCourse] = useState(null);
  
  const [guideEnrollments, setGuideEnrollments] = useState({
    1: [101, 102] 
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserRole(user.role); 
    setIsAuthenticated(true);
    setAdminScreen('Dashboard');
    setGuideScreen('Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    setAuthScreen('Login');
    setAdminMenuOpen(false);
    setGuideMenuOpen(false);
  };

  // --- RENDER: AUTHENTICATION FLOW ---
  if (!isAuthenticated) {
    return authScreen === 'Login' 
      ? <Login onLogin={handleLogin} navigateToSignUp={() => setAuthScreen('SignUp')} />
      : <SignUp navigateToLogin={() => setAuthScreen('Login')} />;
  }

  // --- RENDER: ADMIN PORTAL ---
  if (userRole === 'admin') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <View style={{ flex: 1, zIndex: 1 }}>
            {adminScreen === 'Dashboard' && <AdminDashboard setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Courses' && <AdminCourses goBack={() => setAdminScreen('Dashboard')} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'ParkGuides' && <AdminParkGuides setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Certifications' && <AdminCertifications setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} userData={currentUser} />}
            {adminScreen === 'Alerts' && <AdminAlerts setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Devices' && <AdminDevices setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Notifications' && <AdminNotifications setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Profile' && <AdminProfile setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} userData={currentUser} setUserData={setCurrentUser} />}
          </View>
          {/* Admin Sidebar truncated for brevity - ensure your existing logic is here */}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // --- RENDER: GUIDE PORTAL ---
  if (userRole === 'guide') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfbf9' }}>
          <View style={{ flex: 1, zIndex: 1 }}>
            {guideScreen === 'Dashboard' && <GuideDashboard setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} setActiveCourse={setActiveGuideCourse} userData={currentUser} />}
            {guideScreen === 'Courses' && <GuideCourses setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} setEnrollments={setGuideEnrollments} activeCourse={activeGuideCourse} setActiveCourse={setActiveGuideCourse} userData={currentUser} />}
            {guideScreen === 'MyProgress' && <GuideMyProgress setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} userData={currentUser} />}
            {guideScreen === 'Alerts' && <GuideAlerts setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} userData={currentUser} />}
            {guideScreen === 'Notifications' && <GuideNotifications setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} />}
            {guideScreen === 'AR' && <GuideAR setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} />}
            {guideScreen === 'Profile' && <GuideProfile setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} userData={currentUser} setUserData={setCurrentUser} />}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return null; // Fallback
}
