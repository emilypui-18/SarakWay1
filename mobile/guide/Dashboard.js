import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide';

import { BASE_URL } from "../config";

export default function Dashboard({ setCurrentScreen, toggleMenu, enrollments, setActiveCourse, alertsData = [], userData }) {
  const [coursesList, setCoursesList] = useState([]);

  // Use the actual logged-in user, or fallback to user_id = 2 (a guide)
  const currentUserId = userData?.user_id || 2; 

  useEffect(() => {
    // Fetch Real Course Progress from the database
    fetch(`${BASE_URL}/courses/progress/${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        // Guides should ONLY see published courses!
        const publishedCourses = data.filter(c => c.status === 'Published');
        setCoursesList(publishedCourses);
      })
      .catch(err => console.log("Dashboard Course Fetch Error:", err));
  }, [currentUserId]);

  // --- DYNAMIC MATH FROM DATABASE ---
  const totalCoursesCount = coursesList.length;
  let completedCoursesCount = 0;
  const activeCourses = [];

  coursesList.forEach(course => {
    const isLocallyEnrolled = enrollments && enrollments[course.course_id] !== undefined;
    const dbProgress = Number(course.progress_percentage) || 0;
    const isDbCompleted = course.is_completed === 1;

    if (isLocallyEnrolled || dbProgress > 0 || isDbCompleted) {
      let finalProgress = isDbCompleted ? 100 : dbProgress;

      if (isDbCompleted) {
        completedCoursesCount++;
      } else {
        activeCourses.push({ ...course, finalProgress }); // Add to Continue Learning list
      }
    }
  });

  const featuredCourses = coursesList.slice(0, 5); // Show latest 5 courses to browse

  const renderCourseCard = (course) => {
    const isLocallyEnrolled = enrollments && enrollments[course.course_id] !== undefined;
    const dbProgress = Number(course.progress_percentage) || 0;
    const isDbCompleted = course.is_completed === 1;
    
    const isEnrolled = isLocallyEnrolled || dbProgress > 0 || isDbCompleted;
    const progressPercent = isDbCompleted ? 100 : dbProgress;

    return (
      <TouchableOpacity 
        key={course.course_id} 
        style={guideStyles.courseCard} 
        activeOpacity={0.9}
        onPress={() => {
          setActiveCourse(course);
          setCurrentScreen('Courses');
        }}
      >
        <View style={[guideStyles.imagePlaceholder, { backgroundColor: '#334155' }]}>
          <View style={[guideStyles.badge, { backgroundColor: '#d1fae5' }]}>
            <Text style={guideStyles.badgeText}>{course.category_name || 'General'}</Text>
          </View>
        </View>

        <View style={guideStyles.cardContent}>
          <Text style={guideStyles.courseTitle} numberOfLines={2}>{course.course_name}</Text>

          <View style={[guideStyles.cardFooter, { borderTopWidth: 0, paddingTop: 0, marginTop: 10 }]}>
            <View style={guideStyles.metaGroup}>
              <View style={guideStyles.metaItem}>
                <Feather name="clock" size={12} color="#64748b" />
                <Text style={guideStyles.metaText}>{course.total_duration || 0} mins</Text>
              </View>
            </View>
          </View>

          {!isEnrolled ? (
             <View style={[guideStyles.levelBadge, { alignSelf: 'flex-start', marginTop: 15 }]}>
               <Text style={guideStyles.levelText}>Start Course</Text>
             </View>
          ) : (
            <View style={{ marginTop: 15 }}>
              <View style={[guideStyles.progressTextRow, { paddingHorizontal: 0, marginTop: 0 }]}>
                <Text style={[guideStyles.progressTextLeft, isDbCompleted && {color: '#059669'}]}>
                  {isDbCompleted ? 'Completed' : 'In Progress'}
                </Text>
                <Text style={guideStyles.progressTextRight}>{progressPercent}%</Text>
              </View>
              <View style={[guideStyles.progressBarContainer, { marginHorizontal: 0, marginBottom: 0 }]}>
                <View style={[guideStyles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: isDbCompleted ? '#059669' : '#3b82f6' }]} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={guideStyles.container}>
      <View style={guideStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#06241b" />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={guideStyles.headerArea}>
          <Text style={guideStyles.greeting}>Welcome back, {userData?.user_name || 'Guide'}</Text>
          <Text style={guideStyles.subtitle}>Continue your training journey across Sarawak's national parks.</Text>
        </View>

        {/* --- REFINED STATS GRID (2 BOXES) --- */}
        <View style={guideStyles.statsGrid}>
          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>Total Courses</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#d1fae5' }]}>
                <Feather name="book-open" size={16} color="#059669" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{totalCoursesCount}</Text>
            <Text style={guideStyles.statSubtext}>{completedCoursesCount} completed</Text>
          </View>

          <View style={guideStyles.statCard}>
            <View style={guideStyles.statTopRow}>
              <Text style={guideStyles.statTitle}>Completed Courses</Text>
              <View style={[guideStyles.iconWrapper, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="check-circle" size={16} color="#0284c7" />
              </View>
            </View>
            <Text style={guideStyles.statValue}>{completedCoursesCount}</Text>
            <Text style={guideStyles.statSubtext}>Fully finished</Text>
          </View>
        </View>

        {activeCourses.length > 0 && (
          <>
            <View style={guideStyles.sectionHeader}>
              <Text style={guideStyles.sectionTitle}>Continue Learning</Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={guideStyles.courseList}>
              {activeCourses.map(renderCourseCard)}
            </ScrollView>
          </>
        )}

        <View style={guideStyles.sectionHeader}>
          <Text style={guideStyles.sectionTitle}>Explore Courses</Text>
          <TouchableOpacity style={guideStyles.browseBtn} onPress={() => setCurrentScreen('Courses')}>
            <Text style={guideStyles.browseText}>Browse all</Text>
            <Feather name="arrow-right" size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        {coursesList.length === 0 ? (
           <Text style={{textAlign: 'center', color: '#64748b', paddingVertical: 20}}>No courses available yet.</Text>
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={guideStyles.courseList}>
            {featuredCourses.map(renderCourseCard)}
          </ScrollView>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}
