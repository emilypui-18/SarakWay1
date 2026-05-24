import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

const BASE_URL = 'http://172.20.10.4:3000';

export default function Certifications({ setCurrentScreen, toggleMenu, userData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [certificates, setCertificates] = useState([]);

  // Fetch live certificates from the database
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses/admin/certificates`);
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    }
  };

  // --- APPROVE / REJECT LOGIC ---
  const handleUpdateStatus = (id, newStatus) => {
    Alert.alert(
      `Confirm ${newStatus}`,
      `Are you sure you want to ${newStatus.toLowerCase()} this certificate request?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: newStatus, 
          style: newStatus === 'Rejected' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const res = await fetch(`${BASE_URL}/courses/admin/certificates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: newStatus,
                  approved_by: userData?.user_id || 1 
                })
              });
              
              if (res.ok) {
                fetchCertificates(); // Refresh the list instantly
              } else {
                const errData = await res.json();
                Alert.alert("Error", errData.message || "Failed to update certificate status.");
              }
            } catch (err) {
              Alert.alert("Error", "Network error while updating status.");
            }
          }
        }
      ]
    );
  };

  const filteredCerts = certificates.filter(cert => 
    cert.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={adminStyles.container}>
      
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Certifications</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={adminStyles.mainContent} showsVerticalScrollIndicator={false}>
        
        <View style={adminStyles.pageHeader}>
          <Text style={adminStyles.pageTitle}>Certifications</Text>
          <Text style={adminStyles.pageSubtitle}>Manage and approve park guide credentials</Text>
        </View>

        <View style={[adminStyles.searchContainer, {marginBottom: 20}]}>
          <Feather name="search" size={20} color="#94a3b8" style={adminStyles.searchIcon} />
          <TextInput
            style={adminStyles.searchInput}
            placeholder="Search by guide name or course..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {filteredCerts.length === 0 ? (
          <View style={adminStyles.emptyStateContainer}>
            <Feather name="award" size={48} color="#cbd5e1" />
            <Text style={adminStyles.emptyStateText}>No certification requests found.</Text>
          </View>
        ) : (
          filteredCerts.map(cert => {
            // Determine dynamic badge colors based on status
            let statusBg = '#fef3c7'; // Pending (Yellow)
            let statusText = '#d97706';
            
            if (cert.status === 'Approved') {
              statusBg = '#d1fae5'; // Green
              statusText = '#059669';
            } else if (cert.status === 'Rejected') {
              statusBg = '#fee2e2'; // Red
              statusText = '#ef4444';
            }

            return (
              <View key={cert.certificate_id} style={adminStyles.certCard}>
                
                <View style={adminStyles.certHeader}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={adminStyles.certName}>{cert.user_name}</Text>
                    <Text style={adminStyles.certEmail}>{cert.email}</Text>
                  </View>
                  <View style={{ backgroundColor: statusBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ color: statusText, fontSize: 12, fontWeight: 'bold' }}>{cert.status}</Text>
                  </View>
                </View>

                <Text style={adminStyles.certCourse}>{cert.course_name || 'General Course'}</Text>

                <View style={adminStyles.certDetailsGrid}>
                  <View style={adminStyles.certDetailCol}>
                    <Text style={adminStyles.certDetailLabel}>Score</Text>
                    <Text style={adminStyles.certDetailValue}>{cert.score ? `${cert.score}%` : 'N/A'}</Text>
                  </View>
                  <View style={adminStyles.certDetailCol}>
                    <Text style={adminStyles.certDetailLabel}>Requested</Text>
                    <Text style={adminStyles.certDetailValue}>{new Date(cert.requested_at).toLocaleDateString()}</Text>
                  </View>
                  <View style={adminStyles.certDetailCol}>
                    <Text style={adminStyles.certDetailLabel}>Approved</Text>
                    <Text style={adminStyles.certDetailValue}>{cert.approved_at ? new Date(cert.approved_at).toLocaleDateString() : '-'}</Text>
                  </View>
                </View>

                {/* Only show action buttons if the status is currently Pending */}
                {cert.status === 'Pending' && (
                  <View style={[adminStyles.certActionRow, { justifyContent: 'flex-end', gap: 10 }]}>
                    <TouchableOpacity 
                      style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, backgroundColor: '#fee2e2' }}
                      onPress={() => handleUpdateStatus(cert.certificate_id, 'Rejected')}
                    >
                      <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, backgroundColor: '#059669' }}
                      onPress={() => handleUpdateStatus(cert.certificate_id, 'Approved')}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}

              </View>
            );
          })
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>

    </View>
  );
}