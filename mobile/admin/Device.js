import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import adminStyles from '../styles/admin';

const { width } = Dimensions.get('window');

export default function Device({ setCurrentScreen, toggleMenu }) { 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterZone, setFilterZone] = useState('All Devices');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // We are using a reliable internet video link so your app doesn't crash!
  // When your 'uploads/recordings' folder is ready, change the uri to: require('../uploads/recordings/your_file.mp4')
  const DUMMY_VIDEO_URL = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

  const recordings = [
    { id: 1, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:07:00', zone: 'North Zone' },
    { id: 2, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:07:15', zone: 'North Zone' },
    { id: 3, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:07:30', zone: 'North Zone' },
    { id: 4, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:07:45', zone: 'South Zone' },
    { id: 5, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:08:00', zone: 'South Zone' },
    { id: 6, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:08:15', zone: 'East Zone' },
    { id: 7, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:08:30', zone: 'East Zone' },
    { id: 8, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:08:45', zone: 'West Zone' },
    { id: 9, name: 'Plant_Monitor_Cam_01', path: { uri: DUMMY_VIDEO_URL }, date: '2026-05-08 17:31:00', zone: 'West Zone' }
  ];

  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === 'All Devices' || rec.zone === filterZone;
    return matchesSearch && matchesZone;
  });

  return (
    <View style={adminStyles.container}>
      
      {/* --- HEADER --- */}
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Device Recordings</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={adminStyles.mainContent} contentContainerStyle={{ paddingBottom: 60 }}>
        
        <View style={adminStyles.pageHeader}>
          <Text style={adminStyles.pageTitle}>Camera Feeds</Text>
          <Text style={adminStyles.pageSubtitle}>Review latest AR and IoT interaction recordings.</Text>
        </View>

        {/* --- SEARCH & FILTER TOOLBAR --- */}
        <View style={[adminStyles.searchFilterRow, { flexDirection: 'row', gap: 10, marginBottom: 20, zIndex: isFilterOpen ? 1000 : 1 }]}>
          
          <View style={[adminStyles.searchContainer, { flex: 1, marginBottom: 0 }]}>
            <Feather name="search" size={18} color="#94a3b8" />
            <TextInput 
              placeholder="Search recordings..." 
              style={adminStyles.searchInput}
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={{ position: 'relative' }}>
            <TouchableOpacity 
              style={[adminStyles.formDropdownBtn, { height: 48, paddingHorizontal: 15 }]}
              onPress={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Feather name="filter" size={16} color="#64748b" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 13, color: '#475569', marginRight: 8 }}>{filterZone}</Text>
              <Feather name="chevron-down" size={16} color="#64748b" />
            </TouchableOpacity>

            {isFilterOpen && (
              <View style={[adminStyles.dropdownMenu, { top: 52, right: 0, width: 140, position: 'absolute' }]}>
                {['All Devices', 'North Zone', 'South Zone', 'East Zone', 'West Zone'].map(zone => (
                  <TouchableOpacity 
                    key={zone} 
                    style={[adminStyles.dropdownOption, filterZone === zone && { backgroundColor: '#f1f5f9' }]} 
                    onPress={() => { setFilterZone(zone); setIsFilterOpen(false); }}
                  >
                    <Text style={[adminStyles.dropdownOptionText, filterZone === zone && { color: '#059669', fontWeight: 'bold' }]}>{zone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

        </View>

        {/* --- VIDEO GRID --- */}
        {filteredRecordings.length === 0 ? (
          <View style={{alignItems: 'center', marginTop: 40}}>
            <Feather name="video-off" size={48} color="#cbd5e1" />
            <Text style={{marginTop: 15, color: '#64748b'}}>No recordings found.</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredRecordings.map((rec) => (
              <View key={rec.id} style={styles.videoCard}>
                
                {/* VIDEO PLAYER AREA */}
                <View style={styles.videoContainer}>
                  <Video
                    source={rec.path}
                    style={styles.video}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping={false}
                  />
                  {/* OVERLAY BADGE */}
                  <View style={styles.badgeOverlay}>
                    <View style={styles.redDot} />
                    <Text style={styles.badgeText}>RECORDING</Text>
                  </View>
                </View>

                {/* CARD METADATA */}
                <View style={styles.cardInfo}>
                  <Text style={styles.deviceName} numberOfLines={1}>{rec.name}</Text>
                  
                  <View style={styles.dateRow}>
                    <Feather name="clock" size={12} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={styles.dateText}>{rec.date}</Text>
                  </View>

                  <View style={styles.divider} />

                  <TouchableOpacity style={styles.detailsBtn}>
                    <Text style={styles.detailsBtnText}>View Details</Text>
                    <Feather name="arrow-right" size={14} color="#059669" />
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    zIndex: 1, // Ensure it stays below the dropdown
  },
  videoCard: {
    width: '48%', 
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  videoContainer: {
    width: '100%',
    height: 110,
    backgroundColor: '#1e293b', // Dark slate background
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardInfo: {
    padding: 12,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsBtnText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  }
});