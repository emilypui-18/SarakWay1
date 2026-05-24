import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide';

const BASE_URL = 'http://172.20.10.4:3000';

export default function MyProgress({ setCurrentScreen, toggleMenu, enrollments, userData }) {
  const [activeTab, setActiveTab] = useState('My Courses');
  const [progressData, setProgressData] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Use the actual logged-in user, or fallback to user_id = 2 (a guide) for testing
  const currentUserId = userData?.user_id || 2; 

  useEffect(() => {
    // Fetch 1: Real Course Progress from your NEW backend endpoint!
    fetch(`${BASE_URL}/courses/progress/${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        const published = data.filter(c => c.status === 'Published');
        setProgressData(published);
      })
      .catch(err => console.log("Progress Fetch Error:", err));

    // Fetch 2: Real Certificates from your NEW backend endpoint!
    fetch(`${BASE_URL}/courses/certificates/${currentUserId}`)
      .then(res => res.json())
      .then(data => setCertificates(data))
      .catch(err => console.log("Cert Fetch Error:", err));
  }, [currentUserId]);

  // --- DYNAMIC CALCULATIONS ---
  const inProgressCoursesList = [];
  const completedCoursesList = [];
  const totalCoursesCount = progressData.length;

  // Map through the real database progress
  progressData.forEach(course => {
    // If they just clicked 'Enroll' locally OR if they have real database progress
    const isLocallyEnrolled = enrollments && enrollments[course.course_id] !== undefined;
    const dbProgress = Number(course.progress_percentage) || 0;
    const isDbCompleted = course.is_completed === 1;

    if (isLocallyEnrolled || dbProgress > 0 || isDbCompleted) {
      let finalProgress = isDbCompleted ? 100 : dbProgress;

      const courseObj = {
        id: course.course_id,
        title: course.course_name,
        category: course.category_name || 'General',
        progress: Math.round(finalProgress),
        status: isDbCompleted ? 'Completed' : 'In Progress',
      };

      if (isDbCompleted) {
        completedCoursesList.push(courseObj);
      } else {
        inProgressCoursesList.push(courseObj);
      }
    }
  });

  const inProgressCount = inProgressCoursesList.length;
  const completedCount = completedCoursesList.length;
  const certsCount = certificates.length;

  return (
    <SafeAreaView style={guideStyles.container}>
      
      <View style={guideStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#06241b" />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={guideStyles.headerArea}>
          <Text style={guideStyles.greeting}>My Progress</Text>
          <Text style={guideStyles.subtitle}>Track your learning journey and certifications.</Text>
        </View>

        {/* --- THE FOUR STAT BOXES (Refined) --- */}
        <View style={guideStyles.statsGrid}>
          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>Total Courses</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="book-open" size={16} color="#0284c7" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{totalCoursesCount}</Text>
            <Text style={guideStyles.statSubtext}>Available to learn</Text>
          </View>

          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>In Progress</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#fef3c7' }]}>
                <Feather name="clock" size={16} color="#d97706" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{inProgressCount}</Text>
            <Text style={guideStyles.statSubtext}>Currently active</Text>
          </View>

          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>Completed</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#d1fae5' }]}>
                <Feather name="check-circle" size={16} color="#059669" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{completedCount}</Text>
            <Text style={guideStyles.statSubtext}>Fully finished</Text>
          </View>

          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>Certifications</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#f3e8ff' }]}>
                <Feather name="award" size={16} color="#9333ea" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{certsCount}</Text>
            <Text style={guideStyles.statSubtext}>Earned badges</Text>
          </View>
        </View>

        {/* --- CUSTOM TAB BAR --- */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity 
            style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: activeTab === 'My Courses' ? '#059669' : '#e2e8f0', alignItems: 'center' }}
            onPress={() => setActiveTab('My Courses')}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: activeTab === 'My Courses' ? '#059669' : '#64748b' }}>
              My Courses ({inProgressCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: activeTab === 'Certifications' ? '#059669' : '#e2e8f0', alignItems: 'center' }}
            onPress={() => setActiveTab('Certifications')}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: activeTab === 'Certifications' ? '#059669' : '#64748b' }}>
              Certifications ({certsCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- 1. MY COURSES TAB --- */}
        {activeTab === 'My Courses' && (
           <View>
             {inProgressCoursesList.length === 0 && completedCoursesList.length === 0 ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                  <Feather name="book" size={48} color="#cbd5e1" />
                  <Text style={{ marginTop: 15, fontSize: 16, color: '#64748b', fontWeight: '500' }}>No courses in progress.</Text>
                </View>
             ) : (
                [...inProgressCoursesList, ...completedCoursesList].map(course => (
                  <View key={course.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 }}>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                      <View style={[guideStyles.badge, { backgroundColor: '#d1fae5', margin: 0 }]}>
                        <Text style={guideStyles.badgeText}>{course.category}</Text>
                      </View>
                    </View>
                    
                    <Text style={guideStyles.courseTitle} numberOfLines={2}>{course.title}</Text>

                    <View style={{ marginTop: 20 }}>
                      <View style={[guideStyles.progressTextRow, { paddingHorizontal: 0, marginTop: 0 }]}>
                        <Text style={[guideStyles.progressTextLeft, course.status === 'Completed' && { color: '#059669' }]}>{course.status}</Text>
                        <Text style={guideStyles.progressTextRight}>{course.progress}%</Text>
                      </View>
                      <View style={[guideStyles.progressBarContainer, { marginHorizontal: 0, marginBottom: 0 }]}>
                        <View style={[guideStyles.progressBarFill, { width: `${course.progress}%`, backgroundColor: course.status === 'Completed' ? '#059669' : '#3b82f6' }]} />
                      </View>
                    </View>

                  </View>
                ))
             )}
           </View>
        )}

        {/* --- 2. CERTIFICATIONS TAB --- */}
        {activeTab === 'Certifications' && (
          <View>
            {certificates.length === 0 ? (
               <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                 <Feather name="award" size={48} color="#cbd5e1" />
                 <Text style={{ marginTop: 15, fontSize: 16, color: '#64748b', fontWeight: '500' }}>No certifications earned yet.</Text>
               </View>
            ) : (
               certificates.map((cert) => (
                 <View key={cert.certificate_id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, marginHorizontal: 20 }}>
                   
                   <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: cert.status === 'Approved' ? '#d1fae5' : '#fef3c7', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                     <Feather name={cert.status === 'Approved' ? "check-circle" : "clock"} size={24} color={cert.status === 'Approved' ? "#059669" : "#d97706"} />
                   </View>
                   
                   <View style={{ flex: 1 }}>
                     <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>
                       {cert.park_name ? `${cert.park_name} Guide` : 'General Guide Certification'}
                     </Text>
                     <Text style={{ fontSize: 13, color: '#64748b' }}>
                       {cert.status === 'Approved' ? `Issued ${new Date(cert.approved_at).toLocaleDateString()}` : `Requested ${new Date(cert.requested_at).toLocaleDateString()}`}
                     </Text>
                   </View>
       
                   <View style={{ backgroundColor: cert.status === 'Approved' ? '#d1fae5' : '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                     <Text style={{ color: cert.status === 'Approved' ? '#059669' : '#d97706', fontSize: 12, fontWeight: 'bold' }}>{cert.status}</Text>
                   </View>
       
                 </View>
               ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}