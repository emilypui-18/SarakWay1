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
  const [guideEnrollments, setGuideEnrollments] = useState({ 1: [101, 102] });

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

  if (!isAuthenticated) {
    return authScreen === 'Login' 
      ? <Login onLogin={handleLogin} navigateToSignUp={() => setAuthScreen('SignUp')} />
      : <SignUp navigateToLogin={() => setAuthScreen('Login')} />;
  }

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

          {/* ADMIN SIDEBAR MENU */}
          <View style={[adminStyles.sidebarOverlay, { display: adminMenuOpen ? 'flex' : 'none' }]} pointerEvents={adminMenuOpen ? 'auto' : 'none'}>
            <TouchableOpacity style={adminStyles.sidebarCloseArea} onPress={() => setAdminMenuOpen(false)} activeOpacity={1} />
            <View style={adminStyles.sidebarContent}>
              <View style={adminStyles.sidebarProfile}>
                <Image source={require('./assets/logos/SarakWay-logo.png')} style={adminStyles.sidebarLogo} resizeMode="contain" />
                <View>
                  <Text style={adminStyles.profileName}>SarakWay Admin</Text>
                  <Text style={adminStyles.profileSubtitle}>Management Portal</Text>
                </View>
              </View>
              {/* Menu items remain the same */}
              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Dashboard' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Dashboard'); setAdminMenuOpen(false);}}>
                <Feather name="grid" size={20} color={adminScreen === 'Dashboard' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Dashboard' && adminStyles.menuItemTextActive]}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[adminStyles.menuItem, adminScreen === 'Alerts' && adminStyles.menuItemActive]} onPress={() => {setAdminScreen('Alerts'); setAdminMenuOpen(false);}}>
                <Feather name="alert-triangle" size={20} color={adminScreen === 'Alerts' ? '#ffffff' : '#94a3b8'} />
                <Text style={[adminStyles.menuItemText, adminScreen === 'Alerts' && adminStyles.menuItemTextActive]}>Alerts</Text>
              </TouchableOpacity>
              {/* Add other menu items here as per your original file */}
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

          {/* GUIDE SIDEBAR MENU */}
          <View style={[guideStyles.sidebarOverlay, { display: guideMenuOpen ? 'flex' : 'none' }]} pointerEvents={guideMenuOpen ? 'auto' : 'none'}>
            <TouchableOpacity style={guideStyles.sidebarCloseArea} onPress={() => setGuideMenuOpen(false)} activeOpacity={1} />
            <View style={guideStyles.sidebarContent}>
              <View style={guideStyles.sidebarProfile}>
                <Image source={require('./assets/logos/SarakWay-logo.png')} style={guideStyles.sidebarLogo} resizeMode="contain" />
                <View>
                  <Text style={guideStyles.profileName}>SarakWay Guide</Text>
                  <Text style={guideStyles.profileSubtitle}>Training Portal</Text>
                </View>
              </View>
              {/* Guide Menu Items */}
              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Dashboard' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('Dashboard'); setGuideMenuOpen(false);}}>
                <Feather name="home" size={20} color={guideScreen === 'Dashboard' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Dashboard' && guideStyles.menuItemTextActive]}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[guideStyles.menuItem, guideScreen === 'Alerts' && guideStyles.menuItemActive]} onPress={() => {setGuideScreen('Alerts'); setGuideMenuOpen(false);}}>
                <Feather name="alert-triangle" size={20} color={guideScreen === 'Alerts' ? '#ffffff' : '#94a3b8'} />
                <Text style={[guideStyles.menuItemText, guideScreen === 'Alerts' && guideStyles.menuItemTextActive]}>Alerts</Text>
              </TouchableOpacity>
              {/* Add other menu items here */}
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

  return null;
}
