import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide'; 

import { BASE_URL } from "../config";

export default function GuideAlerts({ setCurrentScreen, toggleMenu, alertsData = [], setAlertsData, userData }) {
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [filterSeverity, setFilterSeverity] = useState('All Severity');
  const [filterType, setFilterType] = useState('All Types');

  const severityOptions = ['All Severity', 'Low', 'Medium', 'High', 'Critical'];
  const typeOptions = ['All Types', 'Plant Damage', 'Wildlife Disturbance', 'Regulation Violation'];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // ==========================================
  // --- FETCH ALERTS FROM BACKEND ---
  // ==========================================
  useEffect(() => {
    if (userData?.user_id) {
      fetchAlerts();
    }
  }, [userData]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/alerts/user/${userData.user_id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      
      const formattedData = data.map(item => {
        const dateObj = new Date(item.timestamp);
        return {
          id: item.alert_id,
          type: item.activity_type,
          severity: item.severity,
          status: item.status || 'New',
          description: item.description,
          guide: item.is_broadcast ? 'All Guides Broadcast' : (item.guide_name || 'Assigned to you'),
          location: item.location,
          date: dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      });

      if(setAlertsData) setAlertsData(formattedData);
    } catch (error) {
      // Silently fail if network drops
    }
  };

  const getSeverityColors = (severity) => {
    switch(severity) {
      case 'Critical': return { bg: '#fee2e2', text: '#dc2626' }; 
      case 'High': return { bg: '#ffedd5', text: '#ea580c' }; 
      case 'Medium': return { bg: '#fef3c7', text: '#d97706' }; 
      default: return { bg: '#f1f5f9', text: '#64748b' }; 
    }
  };

  const openDetailsModal = (alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
    setActiveDropdown(null);
  };

  // --- Filtering Logic ---
  const filteredAlerts = alertsData.filter(alert => {
    const matchesSeverity = filterSeverity === 'All Severity' || alert.severity === filterSeverity;
    const matchesType = filterType === 'All Types' || alert.type === filterType;
    return matchesSeverity && matchesType;
  });

  return (
    <View style={guideStyles.container}>
      
      {/* --- Top Bar (Clean, matching My Devices) --- */}
      <View style={[guideStyles.header, { backgroundColor: '#fff', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView 
        style={{ flex: 1, backgroundColor: '#f8fafc' }} 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        // Closes dropdowns seamlessly the moment the user scrolls!
        onScroll={() => setActiveDropdown(null)} 
        scrollEventThrottle={16}
      >
        
        {/* --- Page Typography (Matching My Devices) --- */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#06241b', marginBottom: 6 }}>Alerts</Text>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 20 }}>
            View and respond to assigned and broadcasted alerts.
          </Text>
        </View>

        {/* --- Dropdown Filters --- */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24, zIndex: 100 }}>
          
          <View style={{ position: 'relative', flex: 1, zIndex: activeDropdown === 'severity' ? 100 : 1 }}>
            <TouchableOpacity 
              style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => setActiveDropdown(activeDropdown === 'severity' ? null : 'severity')}
            >
              <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '500' }}>{filterSeverity}</Text>
              <Feather name="chevron-down" size={16} color="#64748b" />
            </TouchableOpacity>
            
            {activeDropdown === 'severity' && (
              <View style={{ position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 6 }}>
                {severityOptions.map(option => (
                  <TouchableOpacity key={option} style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#f8fafc' }} onPress={() => { setFilterSeverity(option); setActiveDropdown(null); }}>
                    <Text style={{ color: '#0f172a', fontSize: 14 }}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{ position: 'relative', flex: 1, zIndex: activeDropdown === 'type' ? 100 : 1 }}>
            <TouchableOpacity 
              style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
            >
              <Text style={{ color: '#0f172a', fontSize: 14, fontWeight: '500' }}>{filterType}</Text>
              <Feather name="chevron-down" size={16} color="#64748b" />
            </TouchableOpacity>
            
            {activeDropdown === 'type' && (
              <View style={{ position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 6 }}>
                {typeOptions.map(option => (
                  <TouchableOpacity key={option} style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: '#f8fafc' }} onPress={() => { setFilterType(option); setActiveDropdown(null); }}>
                    <Text style={{ color: '#0f172a', fontSize: 14 }}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* --- Alerts List --- */}
        {/* Set a negative zIndex so the dropdown menus safely float over these cards */}
        <View style={{ zIndex: -1 }}>
          {filteredAlerts.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' }}>
              <Feather name="check-circle" size={40} color="#cbd5e1" />
              <Text style={{ marginTop: 12, fontSize: 15, color: '#64748b', fontWeight: '500' }}>No alerts match your filters.</Text>
            </View>
          ) : (
            filteredAlerts.map((alert) => {
              const sevColor = getSeverityColors(alert.severity);

              return (
                <View key={alert.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
                    <View style={[{ width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14, backgroundColor: sevColor.bg }]}>
                      <Feather name="shield" size={20} color={sevColor.text} />
                    </View>
                    
                    <View style={{ flex: 1, justifyContent: 'center', paddingTop: 2 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>{alert.type}</Text>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: sevColor.bg }}>
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: sevColor.text, textTransform: 'uppercase' }}>{alert.severity}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 }}>{alert.description}</Text>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="user" size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <Text style={{ fontSize: 13, color: '#64748b' }}>{alert.guide}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="map-pin" size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <Text style={{ fontSize: 13, color: '#64748b' }}>{alert.location}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#94a3b8', marginLeft: 'auto' }}>{alert.date}</Text>
                  </View>

                  <TouchableOpacity style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }} onPress={() => openDetailsModal(alert)}>
                      <Feather name="eye" size={16} color="#0f172a" style={{marginRight: 8}} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#0f172a' }}>Details</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>

      {/* --- DETAILS MODAL --- */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>Alert Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedAlert && (
              <View>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{selectedAlert.type}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: getSeverityColors(selectedAlert.severity).bg }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: getSeverityColors(selectedAlert.severity).text, textTransform: 'uppercase' }}>{selectedAlert.severity}</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Text>
                <Text style={{ fontSize: 15, color: '#0f172a', lineHeight: 24, marginBottom: 20 }}>{selectedAlert.description}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{flex: 1, paddingRight: 10}}>
                    <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Guide</Text>
                    <Text style={{ fontSize: 15, color: '#0f172a' }}>{selectedAlert.guide}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</Text>
                    <Text style={{ fontSize: 15, color: '#0f172a' }}>{selectedAlert.location}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}
