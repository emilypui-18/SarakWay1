import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

import { BASE_URL } from "../config";

export default function AdminGuideDetails({ guideId, goBack }) {
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/users/guides/${guideId}`)
      .then(res => res.json())
      .then(data => setGuide(data));
  }, [guideId]);

  if (!guide) return <Text style={{textAlign: 'center', marginTop: 50}}>Loading...</Text>;

  const overallProgress = guide.total_courses > 0 
    ? Math.round((guide.completed_courses / guide.total_courses) * 100) 
    : 0;

  return (
    <View style={adminStyles.container}>
      <TouchableOpacity onPress={goBack} style={adminStyles.backButton}>
        <Feather name="arrow-left" size={20} color="#0f172a" />
        <Text> Back</Text>
      </TouchableOpacity>

      <ScrollView style={{ padding: 20 }}>
        <Text style={adminStyles.pageTitle}>{guide.user_name}</Text>
        
        {/* Overall Progress Section */}
        <View style={adminStyles.infoCard}>
          <Text style={adminStyles.sectionTitle}>Overall Training Progress: {overallProgress}%</Text>
          <View style={adminStyles.progressBarContainer}>
            <View style={[adminStyles.progressBarFill, { width: `${overallProgress}%` }]} />
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={adminStyles.statsGrid}>
          <View style={adminStyles.statCard}><Text style={adminStyles.statTitle}>Courses</Text><Text style={adminStyles.statValue}>{guide.total_courses}</Text></View>
          <View style={adminStyles.statCard}><Text style={adminStyles.statTitle}>Completed</Text><Text style={[adminStyles.statValue, {color: '#059669'}]}>{guide.completed_courses}</Text></View>
          <View style={adminStyles.statCard}><Text style={adminStyles.statTitle}>Badges</Text><Text style={adminStyles.statValue}>{guide.certificates}</Text></View>
          <View style={adminStyles.statCard}><Text style={adminStyles.statTitle}>Failed</Text><Text style={[adminStyles.statValue, {color: '#ef4444'}]}>{guide.failed_quizzes}</Text></View>
        </View>

        {/* Specific Course Progress */}
        <Text style={adminStyles.sectionTitle}>Specific Course Progress</Text>
        {guide.courses.map((course, idx) => (
          <View key={idx} style={adminStyles.guideRow}>
            <Text style={adminStyles.guideName}>{course.course_name}</Text>
            <Text style={adminStyles.guideSub}>{course.progress_percentage}%</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
