import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide'; 
import { BASE_URL } from "../config";

export default function GuideAlerts({ setCurrentScreen, toggleMenu, initialAlerts = [], userData }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('All Severity');
  const [filterType, setFilterType] = useState('All Types');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const severityOptions = ['All Severity', 'Low', 'Medium', 'High', 'Critical'];
  const typeOptions = ['All Types', 'Plant Damage', 'Wildlife Disturbance', 'Regulation Violation'];

  // --- FETCH ALERTS ---
  const fetchAlerts = async () => {
    if (!userData?.user_id) return;
    setLoading(true);
    try {
      // Ensure the URL matches your backend route exactly
      const response = await fetch(`${BASE_URL}/alerts/user/${userData.user_id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Inside fetchAlerts in mobile/guide/alerts.js
      const formattedData = data.map(item => {
        const dateObj = new Date(item.triggered_at); // Matches your SQL 'triggered_at'
        return {
          id: item.id,                            // Matches your SQL 'id'
          type: item.sensor_type,                 // Matches your SQL 'sensor_type'
          severity: 'Medium',                     // Note: Your table doesn't have a severity column, 
                                                  // you may need to add one or derive it
          status: item.status || 'New',           // Matches your SQL 'status'
          description: item.alert_message,        // Matches your SQL 'alert_message'
          guide: 'System/Sensor',                 // Since iot_alerts lacks a 'guide' column
          location: 'Unknown Location',           // Since iot_alerts lacks a 'location' column
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      setAlerts(formattedData);
    } catch (error) {
      console.log("ALERT FETCH ERROR:", error.message);
      // Fallback: keep existing alerts if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [userData]);

  const getSeverityColors = (severity) => {
    switch(severity) {
      case 'Critical': return { bg: '#fee2e2', text: '#dc2626' }; 
      case 'High': return { bg: '#ffedd5', text: '#ea580c' }; 
      case 'Medium': return { bg: '#fef3c7', text: '#d97706' }; 
      default: return { bg: '#f1f5f9', text: '#64748b' }; 
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'All Severity' || alert.severity === filterSeverity;
    const matchesType = filterType === 'All Types' || alert.type === filterType;
    return matchesSeverity && matchesType;
  });

  return (
    <View style={guideStyles.container}>
      <View style={[guideStyles.header, { backgroundColor: '#fff', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#06241b', marginBottom: 20 }}>Alerts</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" />
        ) : (
          filteredAlerts.map((alert) => (
            <View key={alert.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={{ fontWeight: 'bold' }}>{alert.type}</Text>
              <Text>{alert.description}</Text>
              <TouchableOpacity onPress={() => { setSelectedAlert(alert); setModalVisible(true); }}>
                <Text style={{ color: 'blue', marginTop: 10 }}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal remains the same as your original code */}
    </View>
  );
}
