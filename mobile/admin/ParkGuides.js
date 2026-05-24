import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';
import AdminGuideDetails from './AdminGuideDetails'; // We will create this next

const BASE_URL = 'http://172.20.10.4:3000';

export default function ParkGuides({ setCurrentScreen, toggleMenu }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/guides`);
      const data = await res.json();
      setGuides(data);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    }
  };

  const getRiskStatus = (guide) => {
    // Logic: If failed quizzes > 2, highlight as risk
    return (guide.failed_quizzes > 2) ? 'risk' : 'good';
  };

  const filteredGuides = guides.filter(guide =>
    guide.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedGuide) {
    return <AdminGuideDetails guideId={selectedGuide.user_id} goBack={() => setSelectedGuide(null)} />;
  }

  return (
    <View style={adminStyles.container}>
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Park Guides Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={adminStyles.mainContent}>
        <View style={adminStyles.searchContainer}>
          <Feather name="search" size={18} color="#94a3b8" />
          <TextInput 
            placeholder="Search guides..." 
            style={adminStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* --- TABLE HEADER --- */}
        <View style={adminStyles.tableHeader}>
          <Text style={adminStyles.th}>Guide</Text>
          <Text style={adminStyles.th}>Status</Text>
        </View>

        {filteredGuides.map((guide) => (
          <TouchableOpacity key={guide.user_id} style={adminStyles.guideRow} onPress={() => setSelectedGuide(guide)}>
            <View style={{ flex: 1 }}>
              <Text style={adminStyles.guideName}>{guide.user_name}</Text>
              <Text style={adminStyles.guideSub}>{guide.email}</Text>
            </View>
            
            <View style={adminStyles.statusBadge}>
              <Text style={getRiskStatus(guide) === 'risk' ? adminStyles.riskText : adminStyles.goodText}>
                {getRiskStatus(guide) === 'risk' ? '⚠ Needs Attention' : '✅ On Track'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}