import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, 
  TextInput, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, 
  Keyboard, Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import guideStyles from '../styles/guide';

import { BASE_URL } from "../config";

export default function Profile({ setCurrentScreen, toggleMenu, userData }) {
  
  // FIX: Added the fallback ID
  const currentUserId = userData?.user_id || 2;

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', newPassword: '' });

  // FIX: Fetch fresh profile data instantly on load!
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/profile/${currentUserId}`);
      const data = await response.json();
      
      setProfileData({
        name: data.user_name || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const handleOpenEdit = () => {
    setEditForm({ ...profileData, newPassword: '' });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          newPassword: editForm.newPassword 
        })
      });

      if (response.ok) {
        setProfileData({ 
          name: editForm.name, 
          email: editForm.email, 
          phone: editForm.phone
        });
        setIsEditModalVisible(false);
      } else {
        alert("Failed to save profile to database.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Could not connect to backend.");
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

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={guideStyles.headerArea}>
          <Text style={guideStyles.greeting}>My Profile</Text>
          <Text style={guideStyles.subtitle}>Manage your personal information and account settings.</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          
          <View style={guideStyles.infoCard}>
            <Text style={[guideStyles.sectionTitle, {marginBottom: 10}]}>Account Details</Text>

            <View style={guideStyles.infoRow}>
              <Text style={guideStyles.infoLabel}>Name</Text>
              <Text style={guideStyles.infoValue}>{profileData.name || 'Loading...'}</Text>
            </View>

            <View style={guideStyles.infoRow}>
              <Text style={guideStyles.infoLabel}>Email Address</Text>
              <Text style={guideStyles.infoValue}>{profileData.email || 'Not set'}</Text>
            </View>

            <View style={guideStyles.infoRow}>
              <Text style={guideStyles.infoLabel}>Phone Number</Text>
              <Text style={guideStyles.infoValue}>{profileData.phone || 'Not set'}</Text>
            </View>

            <View style={[guideStyles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={guideStyles.infoLabel}>Password</Text>
              <Text style={guideStyles.infoValue}>••••••••</Text>
            </View>
          </View>

          <TouchableOpacity style={guideStyles.primaryButton} onPress={handleOpenEdit}>
            <Feather name="edit-2" size={18} color="#fff" />
            <Text style={guideStyles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* --- EDIT PROFILE MODAL --- */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={guideStyles.modalFormOverlay}>
            
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <View style={guideStyles.modalFormContent}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={[guideStyles.modalFormTitle, { marginBottom: 0 }]}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                    <Feather name="x" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  
                  <View style={guideStyles.formGroup}>
                    <Text style={guideStyles.formLabel}>Name</Text>
                    <TextInput 
                      style={guideStyles.formInput}
                      value={editForm.name}
                      onChangeText={(text) => setEditForm({...editForm, name: text})}
                    />
                  </View>

                  <View style={guideStyles.formGroup}>
                    <Text style={guideStyles.formLabel}>Email Address</Text>
                    <TextInput 
                      style={guideStyles.formInput}
                      value={editForm.email}
                      onChangeText={(text) => setEditForm({...editForm, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={guideStyles.formGroup}>
                    <Text style={guideStyles.formLabel}>Phone Number</Text>
                    <TextInput 
                      style={guideStyles.formInput}
                      value={editForm.phone}
                      onChangeText={(text) => setEditForm({...editForm, phone: text})}
                      keyboardType="phone-pad"
                      placeholder="e.g. +60 12-345 6789"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={guideStyles.formGroup}>
                    <Text style={guideStyles.formLabel}>New Password</Text>
                    <TextInput 
                      style={guideStyles.formInput}
                      value={editForm.newPassword}
                      onChangeText={(text) => setEditForm({...editForm, newPassword: text})}
                      placeholder="Leave blank to keep current"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={guideStyles.formActionRow}>
                    <TouchableOpacity style={guideStyles.cancelBtn} onPress={() => setIsEditModalVisible(false)}>
                      <Text style={guideStyles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={guideStyles.submitBtn} onPress={handleSaveProfile}>
                      <Text style={guideStyles.submitBtnText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>

                </ScrollView>
              </View>
            </KeyboardAvoidingView>

          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}
