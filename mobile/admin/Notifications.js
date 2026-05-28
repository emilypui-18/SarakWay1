import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

import { BASE_URL } from "../config";
const API_URL = `${BASE_URL}/notifications`;
const USERS_API_URL = `${BASE_URL}/users/guides`;

export default function Notifications({ setCurrentScreen, toggleMenu }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState('Announcement');
  const [formTarget, setFormTarget] = useState('All Guides');
  
  // Dropdown States
  const [guideList, setGuideList] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchGuides();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.log("Failed to fetch notifications");
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      const data = await response.json();
      setGuideList(data);
    } catch (error) {
      console.log("Failed to fetch guides");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (error) {
      console.log("Failed to delete");
    }
  };

  const handleSendNotification = async () => {
    if (!formTitle || !formMessage) {
      alert("Please fill in Title and Message.");
      return;
    }
    if (formTarget === 'Specific Guide' && !selectedGuide) {
      alert("Please select a Guide from the dropdown.");
      return;
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          message: formMessage,
          type: formType,
          is_broadcast: formTarget === 'All Guides' ? 1 : 0,
          assigned_to: formTarget === 'Specific Guide' ? selectedGuide.user_id : null
        })
      });

      fetchNotifications();
      
      // Reset Form
      setFormTitle('');
      setFormMessage('');
      setFormType('Announcement');
      setFormTarget('All Guides');
      setSelectedGuide(null);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not send notification.");
    }
  };

  const filteredNotis = notifications.filter(noti => 
    noti.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    noti.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={adminStyles.container}>
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={adminStyles.mainContent}>
        <View style={adminStyles.pageHeader}>
          <Text style={adminStyles.pageTitle}>Notifications</Text>
          <Text style={adminStyles.pageSubtitle}>Send announcements and reminders to park guides</Text>
        </View>

        <TouchableOpacity style={adminStyles.primaryButton} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={adminStyles.primaryButtonText}>New Notification</Text>
        </TouchableOpacity>

        <View style={[adminStyles.searchContainer, {marginBottom: 20}]}>
          <Feather name="search" size={20} color="#94a3b8" style={adminStyles.searchIcon} />
          <TextInput
            style={adminStyles.searchInput}
            placeholder="Search notifications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {filteredNotis.length === 0 ? (
          <View style={adminStyles.notificationEmptyState}>
             <Feather name="bell" size={48} color="#cbd5e1" />
             <Text style={adminStyles.notificationEmptyText}>No notifications sent yet.</Text>
          </View>
        ) : (
          filteredNotis.map(noti => {
            const displayDate = new Date(noti.created_at).toLocaleDateString();
            return (
              <View key={noti.id} style={adminStyles.notificationCard}>
                <View style={adminStyles.notiHeader}>
                  <View style={adminStyles.notiTitleRow}>
                    <View style={adminStyles.iconContainer}>
                      <Feather name="bell" size={20} color="#059669" />
                    </View>
                    <View>
                      <Text style={adminStyles.notiTitle}>{noti.title}</Text>
                      <View style={adminStyles.notiBadgeRow}>
                        <View style={adminStyles.notiBadge}>
                          <Text style={adminStyles.notiBadgeText}>{noti.type}</Text>
                        </View>
                        <View style={[adminStyles.notiBadge, {backgroundColor: '#e0e7ff', borderColor: '#c7d2fe'}]}>
                          <Text style={[adminStyles.notiBadgeText, {color: '#4f46e5'}]}>Sent</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity onPress={() => deleteNotification(noti.id)} style={{padding: 5}}>
                    <Feather name="trash-2" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
                
                <Text style={adminStyles.notiMessage}>{noti.message}</Text>

                <View style={adminStyles.notiFooter}>
                  <Text style={adminStyles.notiMetaText}>To: {noti.is_broadcast ? 'All Guides' : noti.guide_name}</Text>
                  <Text style={adminStyles.notiMetaText}>{displayDate}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{height: 40}} />
      </ScrollView>

      {/* --- NEW NOTIFICATION MODAL --- */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={adminStyles.modalOverlay}>
          <View style={[adminStyles.modalContent, { height: 600 }]}>
            
            <View style={adminStyles.modalHeader}>
              <Text style={adminStyles.modalTitle}>Send Notification</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setIsTypeOpen(false); setIsTargetOpen(false); setIsGuideOpen(false); }}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              
              <View style={adminStyles.inputGroup}>
                <Text style={adminStyles.inputLabel}>Title</Text>
                <TextInput style={adminStyles.modalInput} placeholder="Notification title" value={formTitle} onChangeText={setFormTitle} />
              </View>

              <View style={adminStyles.inputGroup}>
                <Text style={adminStyles.inputLabel}>Message</Text>
                <TextInput style={[adminStyles.modalInput, adminStyles.textAreaInput]} placeholder="Write your message..." value={formMessage} onChangeText={setFormMessage} multiline={true} />
              </View>

              <View style={[adminStyles.rowInputs, { zIndex: 100 }]}>
                {/* Type Dropdown */}
                <View style={[adminStyles.inputGroup, adminStyles.halfInput]}>
                  <Text style={adminStyles.inputLabel}>Type</Text>
                  <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => { setIsTypeOpen(!isTypeOpen); setIsTargetOpen(false); setIsGuideOpen(false); }}>
                    <Text style={{color: '#0f172a'}}>{formType}</Text>
                    <Feather name="chevron-down" size={16} color="#64748b" />
                  </TouchableOpacity>
                  {isTypeOpen && (
                    <View style={[adminStyles.formDropdownMenu, {position: 'absolute', top: 65, left: 0, right: 0}]}>
                      {['Announcement', 'Reminder', 'Alert', 'Update'].map(opt => (
                        <TouchableOpacity key={opt} style={adminStyles.dropdownOption} onPress={() => { setFormType(opt); setIsTypeOpen(false); }}>
                          <Text style={[adminStyles.dropdownOptionText, formType === opt && {color: '#d97706', fontWeight: 'bold'}]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Target Dropdown */}
                <View style={[adminStyles.inputGroup, adminStyles.halfInput]}>
                  <Text style={adminStyles.inputLabel}>Target</Text>
                  <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => { setIsTargetOpen(!isTargetOpen); setIsTypeOpen(false); setIsGuideOpen(false); }}>
                    <Text style={{color: '#0f172a'}}>{formTarget}</Text>
                    <Feather name="chevron-down" size={16} color="#64748b" />
                  </TouchableOpacity>
                  {isTargetOpen && (
                    <View style={[adminStyles.formDropdownMenu, {position: 'absolute', top: 65, left: 0, right: 0}]}>
                      {['All Guides', 'Specific Guide'].map(opt => (
                        <TouchableOpacity key={opt} style={adminStyles.dropdownOption} onPress={() => { setFormTarget(opt); setIsTargetOpen(false); }}>
                          <Text style={[adminStyles.dropdownOptionText, formTarget === opt && {color: '#d97706', fontWeight: 'bold'}]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Guide Dropdown */}
              {formTarget === 'Specific Guide' && (
                <View style={[adminStyles.inputGroup, {zIndex: 90}]}>
                  <Text style={adminStyles.inputLabel}>Assign to Guide</Text>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => { setIsGuideOpen(!isGuideOpen); setIsTypeOpen(false); setIsTargetOpen(false); }}>
                      <Text style={{ color: selectedGuide ? '#0f172a' : '#94a3b8' }}>
                        {selectedGuide ? selectedGuide.user_name : 'Select a Park Guide'}
                      </Text>
                      <Feather name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                    
                    {isGuideOpen && (
                      <View style={[adminStyles.formDropdownMenu, { maxHeight: 150 }]}>
                        <ScrollView nestedScrollEnabled={true}>
                          {guideList.length === 0 ? (
                            <View style={adminStyles.dropdownOption}><Text style={adminStyles.dropdownOptionText}>Loading...</Text></View>
                          ) : (
                            guideList.map(guide => (
                              <TouchableOpacity key={guide.user_id} style={adminStyles.dropdownOption} onPress={() => { setSelectedGuide(guide); setIsGuideOpen(false); }}>
                                <Text style={adminStyles.dropdownOptionText}>{guide.user_name}</Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
              )}

              <TouchableOpacity style={[adminStyles.primaryButton, {marginTop: 15}]} onPress={handleSendNotification}>
                <Feather name="send" size={18} color="#fff" style={{marginRight: 8}} />
                <Text style={adminStyles.primaryButtonText}>Send Notification</Text>
              </TouchableOpacity>
            </ScrollView>

          </View>
        </View>
      </Modal>
    </View>
  );
}
