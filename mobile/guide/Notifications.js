import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide';

export default function Notifications({ setCurrentScreen, toggleMenu, userData }) {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // FIX: Added the fallback ID so it always knows who to fetch for!
  const currentUserId = userData?.user_id || 2;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://172.20.10.4:3000/notifications/user/${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.log("Error loading notifications:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Alert': return 'alert-circle';
      case 'Reminder': return 'clock';
      case 'Update': return 'refresh-cw';
      default: return 'info';
    }
  };

  return (
    <SafeAreaView style={guideStyles.container}>
      <View style={guideStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={guideStyles.menuButton}>
          <Feather name="menu" size={24} color="#06241b" />
        </TouchableOpacity>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        <View style={guideStyles.headerArea}>
          <Text style={guideStyles.greeting}>Notifications</Text>
          <Text style={guideStyles.subtitle}>Stay updated with announcements from the admin team.</Text>
        </View>

        {notifications.length === 0 ? (
          <View style={guideStyles.notificationEmptyState}>
            <Feather name="bell" size={48} color="#cbd5e1" />
            <Text style={guideStyles.notificationEmptyText}>No notifications yet.</Text>
          </View>
        ) : (
          <View style={{ paddingBottom: 40 }}>
            {notifications.map((note) => {
              const displayDate = new Date(note.created_at).toLocaleDateString();
              const displayTime = new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <View key={note.id} style={guideStyles.notificationCard}>
                  <View style={guideStyles.notificationIconWrapper}>
                    <Feather name={getIconForType(note.type)} size={20} color="#059669" />
                  </View>
                  
                  <View style={guideStyles.notificationTextContent}>
                    <View style={guideStyles.notificationTitleRow}>
                      <Text style={guideStyles.notificationTitle}>{note.title}</Text>
                      <Text style={guideStyles.notificationTime}>{displayDate}</Text>
                    </View>
                    <Text style={[guideStyles.notificationTime, {marginBottom: 6}]}>{note.type} • {displayTime}</Text>
                    <Text style={guideStyles.notificationMessage}>{note.message}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}