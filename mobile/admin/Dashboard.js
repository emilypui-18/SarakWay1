import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

import { BASE_URL } from "../config";

export default function Dashboard({ setCurrentScreen, toggleMenu }) {
  const [coursesList, setCoursesList] = useState([]);
  const [summary, setSummary] = useState({});
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    // 1. Fetch Training Overview (Stats & Performance Table)
    fetch(`${BASE_URL}/courses/admin/training-overview`)
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || {});
        setPerformance(data.performance || []);
      })
      .catch(err => console.log("Dashboard Overview Fetch Error:", err));

    // 2. Fetch all courses for the "Recent Courses" list at the bottom
    fetch(`${BASE_URL}/courses`)
      .then(res => res.json())
      .then(data => setCoursesList(data))
      .catch(err => console.log("Dashboard Courses Fetch Error:", err));
  }, []);

  // Grab the 3 most recent courses from the database for the bottom section
  const recentCourses = coursesList.slice(0, 3);

  return (
    <View style={adminStyles.container}>
      
      {/* --- HEADER --- */}
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Dashboard</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={adminStyles.mainContent} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={adminStyles.pageHeader}>
          <Text style={adminStyles.pageTitle}>Training Overview</Text>
          <Text style={adminStyles.pageSubtitle}>Monitor training performance across all park guides</Text>
        </View>

        {/* --- STATS GRID (Mapped from DB Summary) --- */}
        <View style={adminStyles.statsGrid}>
          <View style={adminStyles.statCard}>
            <Feather name="book-open" size={24} color="#059669" />
            <Text style={adminStyles.statValue}>{summary.total_courses || 0}</Text>
            <Text style={adminStyles.statLabel}>Total Courses</Text>
          </View>
          <View style={adminStyles.statCard}>
            <Feather name="users" size={24} color="#3b82f6" />
            <Text style={adminStyles.statValue}>{summary.total_guides || 0}</Text>
            <Text style={adminStyles.statLabel}>Total Guides</Text>
          </View>
          <View style={adminStyles.statCard}>
            <Feather name="check-circle" size={24} color="#d97706" />
            <Text style={adminStyles.statValue}>{summary.completed_courses || 0}</Text>
            <Text style={adminStyles.statLabel}>Completed Courses</Text>
          </View>
          <View style={adminStyles.statCard}>
            <Feather name="clock" size={24} color="#9333ea" />
            <Text style={adminStyles.statValue}>{summary.pending_certificates || 0}</Text>
            <Text style={adminStyles.statLabel}>Pending Certs</Text>
          </View>
        </View>

        {/* --- TRAINING PERFORMANCE TABLE --- */}
        <View style={adminStyles.sectionContainer}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>Course Performance</Text>
          </View>
          
          {performance.length === 0 ? (
            <Text style={{color: '#64748b', textAlign: 'center', padding: 20}}>No performance data available.</Text>
          ) : (
            performance.map((item, index) => (
              <View key={item.course_id || index} style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 15 }}>
                
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#0f172a', marginBottom: 10 }}>
                  {item.course_name}
                </Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Enrolled: <Text style={{fontWeight: 'bold', color:'#0f172a'}}>{item.enrolled_guides}</Text>
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Completed: <Text style={{fontWeight: 'bold', color:'#059669'}}>{item.completed_guides}</Text>
                  </Text>
                </View>

                {/* Average Progress Bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, marginRight: 12, overflow: 'hidden' }}>
                    <View style={{ width: `${item.average_progress || 0}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3b82f6', width: 35, textAlign: 'right' }}>
                    {item.average_progress || 0}%
                  </Text>
                </View>

              </View>
            ))
          )}
        </View>

        {/* --- RECENT COURSES (Kept exactly as requested) --- */}
        <View style={adminStyles.sectionContainer}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>Recent Courses</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('Courses')}>
              <Text style={adminStyles.viewAllText}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {recentCourses.length === 0 ? (
            <Text style={{color: '#64748b', textAlign: 'center', padding: 20}}>No courses found.</Text>
          ) : (
            recentCourses.map(course => (
              <View key={course.course_id} style={adminStyles.listItem}>
                <View style={adminStyles.listIconBg}>
                  <Feather name="play-circle" size={18} color="#059669" />
                </View>
                <View style={adminStyles.listTextContainer}>
                  <Text style={adminStyles.listTitle}>{course.course_name}</Text>
                  <Text style={adminStyles.listSubtitle}>{course.category_name || 'General'} • {course.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}
