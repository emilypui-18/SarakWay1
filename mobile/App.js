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
  // const [currentUser, setCurrentUser] = useState(null); 

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
  
  // Shared mock data states
  const [guideEnrollments, setGuideEnrollments] = useState({
    1: [101, 102] 
  });

  const [alertsData, setAlertsData] = useState([]);

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

  // ==========================================
  // RENDER: AUTHENTICATION FLOW
  // ==========================================
  if (!isAuthenticated) {
    if (authScreen === 'Login') {
      return <Login onLogin={handleLogin} navigateToSignUp={() => setAuthScreen('SignUp')} />;
    }
    if (authScreen === 'SignUp') {
      return <SignUp navigateToLogin={() => setAuthScreen('Login')} />;
    }
  }

  // ==========================================
  // RENDER: ADMIN PORTAL
  // ==========================================
  if (userRole === 'admin') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          
          <View style={{ flex: 1, zIndex: 1 }}>
            {adminScreen === 'Dashboard' && <AdminDashboard setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} alertsData={alertsData} />}
            {adminScreen === 'Courses' && <AdminCourses goBack={() => setAdminScreen('Dashboard')} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'ParkGuides' && <AdminParkGuides setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Certifications' && <AdminCertifications setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} userData={currentUser} />}
            {adminScreen === 'Alerts' && <AdminAlerts setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} initialAlerts={alertsData} />}
            {adminScreen === 'Devices' && <AdminDevices setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Notifications' && <AdminNotifications setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} />}
            {adminScreen === 'Profile' && <AdminProfile setCurrentScreen={setAdminScreen} toggleMenu={() => setAdminMenuOpen(!adminMenuOpen)} userData={currentUser} setUserData={setCurrentUser} />}
          </View>

          {/* ADMIN SIDEBAR MENU */}
          <View style={[adminStyles.sidebarOverlay, { display: adminMenuOpen ? 'flex' : 'none' }]} pointerEvents={adminMenuOpen ? 'auto' : 'none'}>
            <TouchableOpacity style={adminStyles.sidebarCloseArea} onPress={() => setAdminMenuOpen(false)} activeOpacity={1} />
            <View style={adminStyles.sidebarContent}>
              
              <View style={adminStyles.sidebarProfile}>
                {/* FIXED LOGO PATH */}
                <Image source={require('./assets/logos/SarakWay-logo.png')} style={adminStyles.sidebarLogo} resizeMode="contain" />
                <View>
                  <Text style={adminStyles.profileName}>SarakWay Admin</Text>
                  <Text style={adminStyles.profileSubtitle}>Management Portal</Text>
                </View>
              </View>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Dashboard' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Dashboard'); setAdminMenuOpen(false);}}>
                <Feather name="grid" size={20} color={adminScreen === 'Dashboard' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Dashboard' && adminStyles.menuItemTextActive]}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Courses' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Courses'); setAdminMenuOpen(false);}}>
                <Feather name="book-open" size={20} color={adminScreen === 'Courses' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Courses' && adminStyles.menuItemTextActive]}>Training Courses</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'ParkGuides' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('ParkGuides'); setAdminMenuOpen(false);}}>
                <Feather name="users" size={20} color={adminScreen === 'ParkGuides' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'ParkGuides' && adminStyles.menuItemTextActive]}>Park Guides</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Certifications' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Certifications'); setAdminMenuOpen(false);}}>
                <Feather name="award" size={20} color={adminScreen === 'Certifications' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Certifications' && adminStyles.menuItemTextActive]}>Certifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Alerts' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Alerts'); setAdminMenuOpen(false);}}>
                <Feather name="alert-triangle" size={20} color={adminScreen === 'Alerts' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Alerts' && adminStyles.menuItemTextActive]}>Alerts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Devices' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Devices'); setAdminMenuOpen(false);}}>
                <Feather name="video" size={20} color={adminScreen === 'Devices' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Devices' && adminStyles.menuItemTextActive]}>Device Recordings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Notifications' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Notifications'); setAdminMenuOpen(false);}}>
                <Feather name="bell" size={20} color={adminScreen === 'Notifications' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Notifications' && adminStyles.menuItemTextActive]}>Notifications</Text>
              </TouchableOpacity>

              <View style={adminStyles.sidebarSpacer} />
              
              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Profile' && adminStyles.menuItemActive, { marginBottom: 15 }]} onPress={() => {setAdminScreen('Profile'); setAdminMenuOpen(false);}}>
                <Feather name="user" size={20} color={adminScreen === 'Profile' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Profile' && adminStyles.menuItemTextActive]}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[adminStyles.signOutItem, { marginBottom: 30 }]} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#f87171" />
                <Text style={adminStyles.signOutText}>Sign Out</Text>
              </TouchableOpacity>

            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ==========================================
  // RENDER: GUIDE PORTAL
  // ==========================================
  if (userRole === 'guide') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfbf9' }}>
          
          <View style={{ flex: 1, zIndex: 1 }}>
            {guideScreen === 'Dashboard' && <GuideDashboard setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} setActiveCourse={setActiveGuideCourse} alertsData={alertsData} userData={currentUser} />}
            {guideScreen === 'Courses' && <GuideCourses setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} setEnrollments={setGuideEnrollments} activeCourse={activeGuideCourse} setActiveCourse={setActiveGuideCourse} userData={currentUser} />}
            {guideScreen === 'MyProgress' && <GuideMyProgress setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} enrollments={guideEnrollments} userData={currentUser} />}
            {guideScreen === 'Alerts' && <GuideAlerts setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} initialAlerts={alertsData} />}
            {guideScreen === 'Notifications' && <GuideNotifications setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} />}
            {guideScreen === 'AR' && <GuideAR setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} />}
            {guideScreen === 'Profile' && <GuideProfile setCurrentScreen={setGuideScreen} toggleMenu={() => setGuideMenuOpen(!guideMenuOpen)} userData={currentUser} setUserData={setCurrentUser} />}
          </View>

          {/* GUIDE SIDEBAR MENU */}
          <View style={[guideStyles.sidebarOverlay, { display: guideMenuOpen ? 'flex' : 'none' }]} pointerEvents={guideMenuOpen ? 'auto' : 'none'}>
            <TouchableOpacity style={guideStyles.sidebarCloseArea} onPress={() => setGuideMenuOpen(false)} activeOpacity={1} />
            <View style={guideStyles.sidebarContent}>
              
              <View style={guideStyles.sidebarProfile}>
                {/* FIXED LOGO PATH */}
                <Image source={require('./assets/logos/SarakWay-logo.png')} style={guideStyles.sidebarLogo} resizeMode="contain" />
                <View>
                  <Text style={guideStyles.profileName}>SarakWay Guide</Text>
                  <Text style={guideStyles.profileSubtitle}>Training Portal</Text>
                </View>
              </View>

              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Dashboard' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('Dashboard'); setGuideMenuOpen(false);}}>
                <Feather name="home" size={20} color={guideScreen === 'Dashboard' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Dashboard' && guideStyles.menuItemTextActive]}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Courses' && guideStyles.menuItemActive]} onPress={() => {setActiveGuideCourse(null); setGuideScreen('Courses'); setGuideMenuOpen(false);}}>
                <Feather name="book-open" size={20} color={guideScreen === 'Courses' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Courses' && guideStyles.menuItemTextActive]}>Training Courses</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'MyProgress' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('MyProgress'); setGuideMenuOpen(false);}}>
                <Feather name="trending-up" size={20} color={guideScreen === 'MyProgress' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'MyProgress' && guideStyles.menuItemTextActive]}>My Progress</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Alerts' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('Alerts'); setGuideMenuOpen(false);}}>
                <Feather name="alert-triangle" size={20} color={guideScreen === 'Alerts' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Alerts' && guideStyles.menuItemTextActive]}>Alerts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'AR' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('AR'); setGuideMenuOpen(false);}}>
                <Feather name="camera" size={20} color={guideScreen === 'AR' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'AR' && guideStyles.menuItemTextActive]}>AR Scanner</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Notifications' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('Notifications'); setGuideMenuOpen(false);}}>
                <Feather name="bell" size={20} color={guideScreen === 'Notifications' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Notifications' && guideStyles.menuItemTextActive]}>Notifications</Text>
              </TouchableOpacity>

              <View style={guideStyles.sidebarSpacer} />
              
              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Profile' && guideStyles.menuItemActive, { marginBottom: 15 }]} onPress={() => {setGuideScreen('Profile'); setGuideMenuOpen(false);}}>
                <Feather name="user" size={20} color={guideScreen === 'Profile' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Profile' && guideStyles.menuItemTextActive]}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[guideStyles.signOutItem, { marginBottom: 30 }]} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#f87171" />
                <Text style={guideStyles.signOutText}>Sign Out</Text>
              </TouchableOpacity>

            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Feather name="alert-triangle" size={48} color="#f87171" />
        <Text style={{ marginTop: 20, fontSize: 16, color: '#333' }}>Error: Could not identify user role.</Text>
        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20, padding: 15, backgroundColor: '#0f172a', borderRadius: 8 }}>
           <Text style={{ color: '#fff', fontWeight: 'bold' }}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}
