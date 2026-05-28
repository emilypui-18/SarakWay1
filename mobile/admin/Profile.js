import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';
import { BASE_URL } from "../config";

const SARAKWAY_LOGO = require('../assets/logos/SarakWay-logo.png');

export default function Profile({ setCurrentScreen, toggleMenu, userData }) {
  
  // --- Profile State ---
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '', // FIXED: Now it actually reads from the database!
  });

  // --- Modal State ---
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData, newPassword: '' });

  const handleOpenEdit = () => {
    setEditForm({ ...profileData, newPassword: '' });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}:3000/users/${userData.user_id}`, {
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
    <SafeAreaView style={adminStyles.container}>
      
      <View style={[adminStyles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity onPress={toggleMenu} style={{ padding: 5, width: 40 }}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', flex: 1 }}>
          SarakWay Admin
        </Text>
        
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={[adminStyles.headerArea, { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }]}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 }}>Admin Profile</Text>
          <Text style={{ fontSize: 14, color: '#64748b' }}>Manage your account settings and preferences</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          
          <View style={[adminStyles.profileHeaderCard, { alignItems: 'center' }]}>
            <Image 
              source={SARAKWAY_LOGO} 
              defaultSource={SARAKWAY_LOGO}
              style={{ width: 80, height: 80, marginBottom: 15 }} 
              resizeMode="contain"
              fadeDuration={0} 
            />
            <Text style={adminStyles.profileNameLg}>{profileData.name}</Text>
            <Text style={adminStyles.profileRole}>System Administrator</Text>
          </View>

          <View style={adminStyles.infoCard}>
            <Text style={[adminStyles.sectionTitle, { marginBottom: 15, fontSize: 16, fontWeight: 'bold' }]}>Account Information</Text>

            <View style={adminStyles.infoRow}>
              <Text style={adminStyles.infoLabel}>Name</Text>
              <Text style={adminStyles.infoValue}>{profileData.name}</Text>
            </View>

            <View style={adminStyles.infoRow}>
              <Text style={adminStyles.infoLabel}>Email Address</Text>
              <Text style={adminStyles.infoValue}>{profileData.email}</Text>
            </View>

            <View style={adminStyles.infoRow}>
              <Text style={adminStyles.infoLabel}>Phone Number</Text>
              <Text style={adminStyles.infoValue}>{profileData.phone || 'Not set'}</Text>
            </View>

            <View style={[adminStyles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={adminStyles.infoLabel}>Password</Text>
              <Text style={adminStyles.infoValue}>••••••••</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={{
              backgroundColor: '#047857',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
              borderRadius: 8,
              marginBottom: 30
            }} 
            onPress={handleOpenEdit}
          >
            <Feather name="edit-2" size={18} color="#fff" />
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginLeft: 8 }}>Edit Profile</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* --- EDIT PROFILE MODAL --- */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={adminStyles.modalFormOverlay}>
            
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <View style={adminStyles.modalFormContent}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={[adminStyles.modalFormTitle, { marginBottom: 0 }]}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                    <Feather name="x" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  
                  <View style={adminStyles.formGroup}>
                    <Text style={adminStyles.formLabel}>Name</Text>
                    <TextInput 
                      style={adminStyles.formInput}
                      value={editForm.name}
                      onChangeText={(text) => setEditForm({...editForm, name: text})}
                    />
                  </View>

                  <View style={adminStyles.formGroup}>
                    <Text style={adminStyles.formLabel}>Email Address</Text>
                    <TextInput 
                      style={adminStyles.formInput}
                      value={editForm.email}
                      onChangeText={(text) => setEditForm({...editForm, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={adminStyles.formGroup}>
                    <Text style={adminStyles.formLabel}>Phone Number</Text>
                    <TextInput 
                      style={adminStyles.formInput}
                      value={editForm.phone}
                      onChangeText={(text) => setEditForm({...editForm, phone: text})}
                      keyboardType="phone-pad"
                      placeholder="e.g. +60 12-345 6789"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={adminStyles.formGroup}>
                    <Text style={adminStyles.formLabel}>New Password</Text>
                    <TextInput 
                      style={adminStyles.formInput}
                      value={editForm.newPassword}
                      onChangeText={(text) => setEditForm({...editForm, newPassword: text})}
                      placeholder="Leave blank to keep current"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={adminStyles.formActionRow}>
                    <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => setIsEditModalVisible(false)}>
                      <Text style={adminStyles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={adminStyles.submitBtn} onPress={handleSaveProfile}>
                      <Text style={adminStyles.submitBtnText}>Save Changes</Text>
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
