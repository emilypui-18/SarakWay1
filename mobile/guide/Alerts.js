import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide'; 
import { BASE_URL } from "../config";

export default function GuideAlerts({ toggleMenu, userData }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // 1. Double check the route: Ensure your backend uses app.use("/api/alerts", iotRoutes);
      const response = await fetch(`${BASE_URL}/api/alerts/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 2. Map data securely
      const formattedData = data.map(item => ({
        id: item.id,
        type: item.sensor_type,
        status: item.status || 'New',
        description: item.alert_message || 'No message',
        date: item.triggered_at ? new Date(item.triggered_at).toLocaleDateString() : 'N/A',
        time: item.triggered_at ? new Date(item.triggered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
      }));
      
      setAlerts(formattedData);
    } catch (error) {
      console.error("ALERT FETCH ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchAlerts();
  
    // Set up an interval to fetch every 5 seconds
    const interval = setInterval(() => {
      fetchAlerts();
    }, 5000); 
  
    // Cleanup: Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={guideStyles.container}>
      <View style={[guideStyles.header, { backgroundColor: '#fff', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#06241b', marginBottom: 20 }}>IoT Alerts</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" />
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>{alert.type}</Text>
              <Text style={{ marginVertical: 5 }}>{alert.description}</Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>{alert.date} {alert.time} • Status: {alert.status}</Text>
              <TouchableOpacity onPress={() => { setSelectedAlert(alert); setModalVisible(true); }}>
                <Text style={{ color: '#2563eb', marginTop: 10, fontWeight: '600' }}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
            <Text>{selectedAlert?.type}</Text>
            <Text>{selectedAlert?.description}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
