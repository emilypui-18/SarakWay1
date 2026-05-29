import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide'; 
import { BASE_URL } from "../config";

export default function GuideAlerts({ setCurrentScreen, toggleMenu, userData }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Assuming your backend route is now set up to return all iot_alerts
      const response = await fetch(`${BASE_URL}/api/alerts/all`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Mapping the iot_alerts table schema
      const formattedData = data.map(item => {
        const dateObj = new Date(item.triggered_at);
        return {
          id: item.id,
          type: item.sensor_type,
          severity: 'Medium', // Derived as requested
          status: item.status,
          description: item.alert_message,
          date: dateObj.toLocaleDateString(),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      setAlerts(formattedData);
    } catch (error) {
      console.log("ALERT FETCH ERROR:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []); // Run once on mount

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
    </View>
  );
}
