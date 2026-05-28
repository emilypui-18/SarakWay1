import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

import { BASE_URL } from "../config";

// --- API CONFIGURATION ---
const API_URL = `${BASE_URL}/alerts`; 
const USERS_API_URL = `${BASE_URL}/users/guides`; // Endpoint to get guides

export default function Alerts({ setCurrentScreen, toggleMenu, alertsData = [], setAlertsData }) {
  
  // --- UI States ---
  const [showDismissed, setShowDismissed] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // --- Data Filtering ---
  const activeAlertsList = alertsData.filter(a => a.status !== 'Dismissed');
  const dismissedAlertsList = alertsData.filter(a => a.status === 'Dismissed');
  const displayedAlerts = showDismissed ? dismissedAlertsList : activeAlertsList;

  // --- Dynamic Stats ---
  const totalAlerts = activeAlertsList.length;
  const newAlerts = activeAlertsList.filter(a => a.status === 'New').length;
  const reviewingAlerts = activeAlertsList.filter(a => a.status === 'Reviewing').length;
  const resolvedAlerts = activeAlertsList.filter(a => a.status === 'Resolved').length;

  // --- Create Alert Form State ---
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [formType, setFormType] = useState('Select Type');
  const [formSeverity, setFormSeverity] = useState('Select Severity');
  const [formLocation, setFormLocation] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  
  // ---> NEW: States for Guide Dropdown <---
  const [guideList, setGuideList] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null); 

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isSevOpen, setIsSevOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // ==========================================
  // --- BACKEND INTEGRATION LOGIC ---
  // ==========================================

  useEffect(() => {
    fetchAlerts();
    fetchGuides(); // Fetch the guides when the component loads
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      
      const data = await response.json();
      const formattedData = data.map(item => {
        const dateObj = new Date(item.timestamp);
        return {
          id: item.alert_id,
          type: item.activity_type,
          severity: item.severity,
          status: item.status || 'New',
          description: item.description,
          guide: item.is_broadcast ? 'All Guides Broadcast' : (item.guide_name || item.assigned_to || 'Unassigned'),
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

  // ---> NEW: Fetch all park guides from the database <---
  const fetchGuides = async () => {
    try {
      const response = await fetch(USERS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setGuideList(data);
      }
    } catch (error) {
      console.error("Failed to fetch guides:", error);
    }
  };

  const handleCreateAlert = async () => {
    if (formType === 'Select Type' || formSeverity === 'Select Severity' || !formLocation || !formDesc) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Updated Validation: Check if a guide object is selected
    if (!sendToAll && !selectedGuide) {
      alert("Please select a Guide from the list, or check 'Send to All Guides'.");
      return;
    }

    try {
      const payload = {
        type: formType,
        severity: formSeverity,
        description: formDesc,
        location: formLocation,
        // Pass the actual user_id from the selected guide object to the backend
        assigned_to: sendToAll ? null : selectedGuide.user_id,
        is_broadcast: sendToAll ? 1 : 0
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Database rejected the save.');

      fetchAlerts();
      
      // Reset the form completely
      setFormType('Select Type');
      setFormSeverity('Select Severity');
      setFormLocation('');
      setFormDesc('');
      setSelectedGuide(null); 
      setSendToAll(false);
      setCreateModalVisible(false);
      
      setShowDismissed(false); 

    } catch (error) {
      Alert.alert(
        "Could Not Save Alert", 
        "Ensure your phone is connected to the same Wi-Fi network as your computer."
      );
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      if (setAlertsData) {
        setAlertsData(alertsData.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
      setOpenDropdownId(null);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update');

    } catch (error) {
      fetchAlerts(); 
    }
  };

  const showDetails = (alert) => {
    setSelectedAlert(alert);
    setDetailsModalVisible(true);
  };

  const getSeverityColors = (severity) => {
    switch(severity) {
      case 'Critical': return { bg: '#fee2e2', text: '#dc2626' }; 
      case 'High': return { bg: '#ffedd5', text: '#ea580c' }; 
      case 'Medium': return { bg: '#fef3c7', text: '#d97706' }; 
      default: return { bg: '#f1f5f9', text: '#64748b' }; 
    }
  };

  const getStatusColors = (status) => {
    switch(status) {
      case 'New': return { bg: '#e0e7ff', text: '#4f46e5', border: '#c7d2fe' }; 
      case 'Reviewing': return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' }; 
      case 'Resolved': return { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' }; 
      default: return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }; 
    }
  };

  return (
    <View style={adminStyles.container}>
      
      {/* --- HEADER --- */}
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Alerts</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* --- PAGE TITLES --- */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, marginBottom: 15 }}>
          <Text style={adminStyles.pageTitle}>Alert Monitoring</Text>
          <Text style={adminStyles.pageSubtitle}>Real-time safety monitoring</Text>
        </View>

        {/* --- DUAL BUTTON ROW --- */}
        <View style={adminStyles.dualButtonRow}>
          
          <TouchableOpacity 
            style={[adminStyles.primaryButton, adminStyles.flex1Btn]}
            onPress={() => setCreateModalVisible(true)}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={[adminStyles.primaryButtonText, {fontSize: 14}]}>Create Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              adminStyles.toggleBtnBase, 
              showDismissed ? adminStyles.toggleBtnActive : adminStyles.toggleBtnInactive
            ]}
            onPress={() => setShowDismissed(!showDismissed)}
          >
            <Feather name={showDismissed ? "eye-off" : "eye"} size={16} color={showDismissed ? "#fff" : "#475569"} />
            <Text style={[
              adminStyles.toggleBtnTextBase,
              showDismissed ? adminStyles.toggleBtnTextActive : adminStyles.toggleBtnTextInactive
            ]}>
              {showDismissed ? 'Hide Dismissed' : 'Show Dismissed'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* --- DYNAMIC STATS ROW --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={adminStyles.statsScrollView}>
          
          <View style={[adminStyles.statCard, adminStyles.statCardHorizontal]}>
            <Text style={adminStyles.statLabel}>Total Alerts</Text>
            <Text style={adminStyles.statValue}>{totalAlerts}</Text>
          </View>

          <View style={[adminStyles.statCard, adminStyles.statCardHorizontal]}>
            <Text style={adminStyles.statLabel}>New</Text>
            <Text style={[adminStyles.statValue, { color: '#4f46e5' }]}>{newAlerts}</Text>
          </View>

          <View style={[adminStyles.statCard, adminStyles.statCardHorizontal]}>
            <Text style={adminStyles.statLabel}>Reviewing</Text>
            <Text style={[adminStyles.statValue, { color: '#d97706' }]}>{reviewingAlerts}</Text>
          </View>

          <View style={[adminStyles.statCard, adminStyles.statCardHorizontal]}>
            <Text style={adminStyles.statLabel}>Resolved</Text>
            <Text style={[adminStyles.statValue, { color: '#059669' }]}>{resolvedAlerts}</Text>
          </View>

        </ScrollView>

        {/* --- ALERTS LIST --- */}
        <View style={adminStyles.alertsListContainer}>
          
          {displayedAlerts.length === 0 ? (
            <View style={adminStyles.emptyStateContainer}>
              <Feather name={showDismissed ? "inbox" : "check-circle"} size={48} color="#cbd5e1" />
              <Text style={adminStyles.emptyStateText}>
                {showDismissed ? "No dismissed alerts." : "No active alerts at the moment. All clear!"}
              </Text>
            </View>
          ) : (
            displayedAlerts.map((alert, index) => {
              const sevColor = getSeverityColors(alert.severity);
              const statColor = getStatusColors(alert.status);
              
              let currentCardZIndex = openDropdownId === alert.id ? 9999 : 100 - index;
              let currentCardElevation = openDropdownId === alert.id ? 10 : 2;

              return (
                <View key={alert.id} style={[adminStyles.alertCard, { zIndex: currentCardZIndex, elevation: currentCardElevation }]}>
                  <View style={adminStyles.cardTop}>
                    <View style={[adminStyles.iconContainer, { backgroundColor: sevColor.bg }]}>
                      <Feather name="shield" size={20} color={sevColor.text} />
                    </View>
                    
                    <View style={adminStyles.titleRow}>
                      <Text style={adminStyles.alertType}>{alert.type}</Text>
                      <View style={[adminStyles.badge, { backgroundColor: sevColor.bg }]}>
                        <Text style={[adminStyles.badgeText, { color: sevColor.text }]}>{alert.severity}</Text>
                      </View>
                      <View style={[adminStyles.badge, { backgroundColor: statColor.bg, borderColor: statColor.border, borderWidth: 1 }]}>
                        <Text style={[adminStyles.badgeText, { color: statColor.text }]}>{alert.status}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={adminStyles.descriptionText}>{alert.description}</Text>

                  <View style={adminStyles.metaRow}>
                    <View style={adminStyles.metaItem}>
                      <Feather name="user" size={14} color="#64748b" style={adminStyles.metaIcon} />
                      <Text style={adminStyles.metaText}>{alert.guide}</Text>
                    </View>
                    <View style={adminStyles.metaItem}>
                      <Feather name="map-pin" size={14} color="#64748b" style={adminStyles.metaIcon} />
                      <Text style={adminStyles.metaText}>{alert.location}</Text>
                    </View>
                    <Text style={[adminStyles.metaText, adminStyles.metaTextRight]}>{alert.date} • {alert.time}</Text>
                  </View>

                  <View style={[adminStyles.actionRow, { zIndex: 999 }]}>
                    <View style={{ position: 'relative' }}>
                      <TouchableOpacity 
                        style={adminStyles.statusDropdown}
                        onPress={() => setOpenDropdownId(openDropdownId === alert.id ? null : alert.id)}
                      >
                         <Text style={adminStyles.statusDropdownText}>{alert.status}</Text>
                         <Feather name="chevron-down" size={16} color="#64748b" />
                      </TouchableOpacity>

                      {openDropdownId === alert.id && (
                        <View style={[adminStyles.dropdownMenu, adminStyles.actionDropdownMenu]}>
                          {['New', 'Reviewing', 'Resolved', 'Dismissed'].map(status => (
                            <TouchableOpacity 
                              key={status} 
                              style={[adminStyles.dropdownOption, alert.status === status && { backgroundColor: '#f1f5f9' }]} 
                              onPress={() => changeStatus(alert.id, status)}
                            >
                              <Text style={[adminStyles.dropdownOptionText, alert.status === status && { fontWeight: 'bold' }]}>{status}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <TouchableOpacity style={adminStyles.detailsButton} onPress={() => showDetails(alert)}>
                      <Feather name="eye" size={16} color="#0f172a" style={{marginRight: 6}} />
                      <Text style={adminStyles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ========================================================= */}
      {/* CREATE ALERT MODAL                     */}
      {/* ========================================================= */}
      <Modal visible={createModalVisible} transparent={true} animationType="fade">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'center' }}>
            <View style={adminStyles.modalFormContent}>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={[adminStyles.modalFormTitle, { marginBottom: 0 }]}>Create Alert</Text>
                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                
                {/* TYPE DROPDOWN */}
                <View style={[adminStyles.formGroup, { zIndex: 100 }]}>
                  <Text style={adminStyles.formLabel}>Type *</Text>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity 
                      style={[adminStyles.formDropdownBtn, isTypeOpen && { borderColor: '#059669' }]} 
                      onPress={() => { setIsTypeOpen(!isTypeOpen); setIsSevOpen(false); setIsGuideOpen(false); }}
                    >
                      <Text style={{ color: formType === 'Select Type' ? '#94a3b8' : '#0f172a' }}>{formType}</Text>
                      <Feather name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                    {isTypeOpen && (
                      <View style={[adminStyles.formDropdownMenu, { maxHeight: 180 }]}>
                        {['Plant Damage', 'Wildlife Disturbance', 'Regulation Violation', 'Other'].map((option) => (
                          <TouchableOpacity key={option} style={adminStyles.dropdownOption} onPress={() => { setFormType(option); setIsTypeOpen(false); }}>
                            <Text style={adminStyles.dropdownOptionText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* SEVERITY DROPDOWN */}
                <View style={[adminStyles.formGroup, { zIndex: 90 }]}>
                  <Text style={adminStyles.formLabel}>Severity *</Text>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity 
                      style={[adminStyles.formDropdownBtn, isSevOpen && { borderColor: '#059669' }]} 
                      onPress={() => { setIsSevOpen(!isSevOpen); setIsTypeOpen(false); setIsGuideOpen(false); }}
                    >
                      <Text style={{ color: formSeverity === 'Select Severity' ? '#94a3b8' : '#0f172a' }}>{formSeverity}</Text>
                      <Feather name="chevron-down" size={16} color="#64748b" />
                    </TouchableOpacity>
                    {isSevOpen && (
                      <View style={[adminStyles.formDropdownMenu, { maxHeight: 180 }]}>
                        {['Low', 'Medium', 'High', 'Critical'].map((option) => (
                          <TouchableOpacity key={option} style={adminStyles.dropdownOption} onPress={() => { setFormSeverity(option); setIsSevOpen(false); }}>
                            <Text style={adminStyles.dropdownOptionText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* LOCATION */}
                <View style={[adminStyles.formGroup, { zIndex: 1 }]}>
                  <Text style={adminStyles.formLabel}>Location *</Text>
                  <TextInput 
                    style={adminStyles.formInput}
                    placeholder="e.g. Bako National Park"
                    placeholderTextColor="#94a3b8"
                    value={formLocation}
                    onChangeText={setFormLocation}
                  />
                </View>

                {/* DESCRIPTION */}
                <View style={[adminStyles.formGroup, { zIndex: 1 }]}>
                  <Text style={adminStyles.formLabel}>Description *</Text>
                  <TextInput 
                    style={adminStyles.textAreaInputLarge}
                    placeholder="Describe the incident..."
                    placeholderTextColor="#94a3b8"
                    multiline={true}
                    value={formDesc}
                    onChangeText={setFormDesc}
                  />
                </View>

                {/* SEND TO ALL CHECKBOX */}
                <TouchableOpacity 
                  style={adminStyles.checkboxRow} 
                  onPress={() => { setSendToAll(!sendToAll); setSelectedGuide(null); setIsGuideOpen(false); }}
                >
                  <Feather name={sendToAll ? "check-square" : "square"} size={20} color={sendToAll ? "#059669" : "#94a3b8"} />
                  <Text style={adminStyles.checkboxText}>Send to All Guides</Text>
                </TouchableOpacity>

                {/* ---> NEW: ASSIGN TO SPECIFIC GUIDE DROPDOWN <--- */}
                {!sendToAll && (
                  <View style={[adminStyles.formGroup, { zIndex: 80 }]}>
                    <Text style={adminStyles.formLabel}>Assign to Guide *</Text>
                    <View style={{ position: 'relative' }}>
                      <TouchableOpacity 
                        style={[adminStyles.formDropdownBtn, isGuideOpen && { borderColor: '#059669' }]} 
                        onPress={() => { setIsGuideOpen(!isGuideOpen); setIsTypeOpen(false); setIsSevOpen(false); }}
                      >
                        <Text style={{ color: selectedGuide ? '#0f172a' : '#94a3b8' }}>
                          {selectedGuide ? selectedGuide.user_name : 'Select a Park Guide'}
                        </Text>
                        <Feather name="chevron-down" size={16} color="#64748b" />
                      </TouchableOpacity>
                      
                      {isGuideOpen && (
                        <View style={[adminStyles.formDropdownMenu, { maxHeight: 150 }]}>
                          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                            {guideList.length === 0 ? (
                              <View style={adminStyles.dropdownOption}>
                                <Text style={adminStyles.dropdownOptionText}>Loading guides...</Text>
                              </View>
                            ) : (
                              guideList.map((guide) => (
                                <TouchableOpacity 
                                  key={guide.user_id} 
                                  style={adminStyles.dropdownOption} 
                                  onPress={() => { setSelectedGuide(guide); setIsGuideOpen(false); }}
                                >
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

                <View style={[adminStyles.formActionRow, { zIndex: 1 }]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => setCreateModalVisible(false)}>
                    <Text style={adminStyles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={adminStyles.submitBtn} onPress={handleCreateAlert}>
                    <Text style={adminStyles.submitBtnText}>Create Alert</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* DETAILS MODAL */}
      {/* ========================================================= */}
      <Modal visible={detailsModalVisible} transparent={true} animationType="fade">
        <View style={adminStyles.modalOverlay}>
          <View style={[adminStyles.modalContent, { width: '100%', paddingVertical: 24 }]}>
            
            <View style={adminStyles.modalHeader}>
              <Text style={adminStyles.modalTitle}>Alert Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Feather name="x" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedAlert && (
              <View>
                
                <View style={[adminStyles.notiBadgeRow, { marginBottom: 20 }]}>
                  <View style={[adminStyles.badge, adminStyles.badgeStatic]}>
                    <Text style={[adminStyles.badgeText, adminStyles.badgeTextStatic]}>{selectedAlert.type}</Text>
                  </View>
                  <View style={[adminStyles.badge, { backgroundColor: getSeverityColors(selectedAlert.severity).bg }]}>
                    <Text style={[adminStyles.badgeText, { color: getSeverityColors(selectedAlert.severity).text }]}>{selectedAlert.severity}</Text>
                  </View>
                  <View style={[adminStyles.badge, { backgroundColor: getStatusColors(selectedAlert.status).bg, borderColor: getStatusColors(selectedAlert.status).border, borderWidth: 1 }]}>
                    <Text style={[adminStyles.badgeText, { color: getStatusColors(selectedAlert.status).text }]}>{selectedAlert.status}</Text>
                  </View>
                </View>

                <Text style={adminStyles.detailsLabel}>Description</Text>
                <Text style={adminStyles.detailsText}>{selectedAlert.description}</Text>

                <View style={adminStyles.detailsRowSpaced}>
                  <View style={adminStyles.detailsCol}>
                    <Text style={adminStyles.detailsLabel}>Guide</Text>
                    <Text style={adminStyles.detailsText}>{selectedAlert.guide}</Text>
                  </View>
                  <View style={adminStyles.detailsCol}>
                    <Text style={adminStyles.detailsLabel}>Location</Text>
                    <Text style={adminStyles.detailsText}>{selectedAlert.location}</Text>
                  </View>
                </View>

                <View style={adminStyles.detailsRowLast}>
                  <View style={adminStyles.detailsCol}>
                    <Text style={adminStyles.detailsLabel}>Timestamp</Text>
                    <Text style={adminStyles.detailsText}>{selectedAlert.date} at {selectedAlert.time}</Text>
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
