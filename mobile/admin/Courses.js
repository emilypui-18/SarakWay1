import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';
import CourseEditor from './CourseEditor'; 

import { BASE_URL } from "../config";

export default function Courses({ setCurrentScreen, toggleMenu, userData }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // --- FILTERS & SEARCH ---
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isFilterCatOpen, setIsFilterCatOpen] = useState(false);
  const [isFilterStatOpen, setIsFilterStatOpen] = useState(false);
  
  // --- CREATE FORM STATE ---
  const [courseForm, setCourseForm] = useState({
    course_name: '', description: '', category_id: '', park_id: '', image_url: '', status: 'Draft', is_mandatory: false
  });

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isParkOpen, setIsParkOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseForm.course_name) return Alert.alert("Error", "Course Name is required");
    try {
      const res = await fetch(`${BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_name: courseForm.course_name,
          description: courseForm.description || null,
          category_id: courseForm.category_id || null,
          park_id: courseForm.park_id || null,
          image_url: courseForm.image_url || null,
          status: courseForm.status,
          is_mandatory: courseForm.is_mandatory ? 1 : 0
        })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setCourseForm({ course_name: '', description: '', category_id: '', park_id: '', image_url: '', status: 'Draft', is_mandatory: false });
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.course_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCatName = (id) => {
    const cats = {'1': 'Conservation', '2': 'Biodiversity', '3': 'Eco-tourism', '4': 'Legislation', '5': 'Safety'};
    return cats[String(id)] || 'General Course';
  };
  
  const getParkName = (id) => {
    const parks = {'1': 'Bako National Park', '2': 'Gunung Mulu National Park', '3': 'Kubah National Park', '4': 'Niah National Park'};
    return parks[String(id)] || 'All Parks';
  };

  if (selectedCourse) {
    return <CourseEditor course={selectedCourse} goBack={() => { setSelectedCourse(null); fetchCourses(); }} />;
  }

  return (
    <SafeAreaView style={adminStyles.container}>
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={toggleMenu} style={adminStyles.menuButton}>
          <Feather name="menu" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Course Management</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={adminStyles.mainContent} keyboardShouldPersistTaps="handled">
        
        {/* --- TOP ACTIONS: SEARCH & ADD --- */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, zIndex: 1 }}>
          <View style={[adminStyles.searchContainer, { flex: 1 }]}>
            <Feather name="search" size={18} color="#94a3b8" />
            <TextInput 
              placeholder="Search courses..." 
              style={adminStyles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[adminStyles.primaryButton, { marginLeft: 10, marginBottom: 0, height: 48, justifyContent: 'center' }]} onPress={() => setShowCreateModal(true)}>
            <Feather name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* --- FILTERS --- */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20, zIndex: 100 }}>
          
          <View style={{ flex: 1, position: 'relative' }}>
            <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsFilterCatOpen(!isFilterCatOpen); setIsFilterStatOpen(false);}}>
              <Text style={{color: '#0f172a', fontSize: 13}} numberOfLines={1}>{categoryFilter === 'All' ? 'All Categories' : categoryFilter}</Text>
              <Feather name="chevron-down" size={16} color="#64748b" />
            </TouchableOpacity>
            {isFilterCatOpen && (
              <View style={adminStyles.formDropdownMenuCreate}>
                <ScrollView nestedScrollEnabled={true} style={{maxHeight: 150}}>
                  {['All', 'Conservation', 'Biodiversity', 'Eco-tourism', 'Legislation', 'Safety'].map(cat => (
                    <TouchableOpacity key={cat} style={adminStyles.dropdownOption} onPress={() => {setCategoryFilter(cat); setIsFilterCatOpen(false);}}>
                      <Text style={adminStyles.dropdownOptionText}>{cat === 'All' ? 'All Categories' : cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{ flex: 1, position: 'relative' }}>
            <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsFilterStatOpen(!isFilterStatOpen); setIsFilterCatOpen(false);}}>
              <Text style={{color: '#0f172a', fontSize: 13}} numberOfLines={1}>{statusFilter === 'All' ? 'All Status' : statusFilter}</Text>
              <Feather name="chevron-down" size={16} color="#64748b" />
            </TouchableOpacity>
            {isFilterStatOpen && (
              <View style={adminStyles.formDropdownMenuCreate}>
                {['All', 'Draft', 'Published', 'Archived'].map(stat => (
                  <TouchableOpacity key={stat} style={adminStyles.dropdownOption} onPress={() => {setStatusFilter(stat); setIsFilterStatOpen(false);}}>
                    <Text style={adminStyles.dropdownOptionText}>{stat === 'All' ? 'All Status' : stat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* --- COURSE LIST --- */}
        <View style={{ zIndex: 1 }}>
          {filteredCourses.map((course) => (
            <TouchableOpacity key={course.course_id} style={adminStyles.courseCard} activeOpacity={0.9} onPress={() => setSelectedCourse(course)}>
              
              <View style={adminStyles.imagePlaceholder}>
                {course.image_url ? (
                  <Image 
                    source={{ uri: course.image_url }} 
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} 
                    resizeMode="cover" 
                  />
                ) : null}
                <View style={adminStyles.badge}>
                  <Text style={adminStyles.badgeText}>{course.category_name || 'General'}</Text>
                </View>
              </View>

              <View style={adminStyles.courseCardContent}>
                <Text style={adminStyles.courseTitle} numberOfLines={2}>{course.course_name}</Text>
                <Text style={adminStyles.courseDesc} numberOfLines={2}>{course.description || "No description provided."}</Text>

                <View style={adminStyles.cardFooter}>
                  <View style={adminStyles.metaGroup}>
                    <View style={adminStyles.metaItem}>
                      <Feather name="clock" size={12} color="#64748b" />
                      <Text style={adminStyles.metaText}>{course.total_duration || 0} mins</Text>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {course.is_mandatory === 1 && (
                      <View style={adminStyles.levelBadge}>
                        <Text style={adminStyles.levelText}>Mandatory</Text>
                      </View>
                    )}
                    <View style={[adminStyles.levelBadge, { backgroundColor: course.status === 'Published' ? '#d1fae5' : '#f1f5f9', borderColor: course.status === 'Published' ? '#a7f3d0' : '#e2e8f0' }]}>
                      <Text style={[adminStyles.levelText, { color: course.status === 'Published' ? '#059669' : '#64748b' }]}>{course.status}</Text>
                    </View>
                  </View>
                </View>
              </View>

            </TouchableOpacity>
          ))}
        </View>

        <View style={adminStyles.bottomSpacer} />
      </ScrollView>

      {/* --- CREATE COURSE MODAL --- */}
      <Modal visible={showCreateModal} transparent={true} animationType="fade">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <View style={[adminStyles.modalFormContent, adminStyles.modalContentFixed, { height: 'auto' }]}>
              
              <View style={adminStyles.modalHeader}>
                <Text style={adminStyles.modalTitle}>New Course</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Course Name</Text>
                  <TextInput style={adminStyles.modalInput} value={courseForm.course_name} onChangeText={(t) => setCourseForm({...courseForm, course_name: t})} />
                </View>
                
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Description</Text>
                  <TextInput style={[adminStyles.modalInput, adminStyles.textAreaCompact]} value={courseForm.description} onChangeText={(t) => setCourseForm({...courseForm, description: t})} multiline />
                </View>

                {/* Dropdowns Row */}
                <View style={[adminStyles.rowInputs, {zIndex: 3000, elevation: 3000}]}>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}>
                    <Text style={adminStyles.inputLabel}>Category</Text>
                    <View style={{position: 'relative'}}>
                      <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsCatOpen(!isCatOpen); setIsParkOpen(false); setIsStatusOpen(false);}}>
                        <Text style={{color: '#0f172a', fontSize: 13}} numberOfLines={1}>{getCatName(courseForm.category_id)}</Text>
                        <Feather name="chevron-down" size={16} color="#64748b" />
                      </TouchableOpacity>
                      {isCatOpen && (
                        <View style={adminStyles.formDropdownMenuCreate}>
                          <ScrollView nestedScrollEnabled={true} style={{maxHeight: 120}}>
                            {[ {id: '', name: 'General Course'}, {id: '1', name: 'Conservation'}, {id: '2', name: 'Biodiversity'}, {id: '3', name: 'Eco-tourism'}, {id: '4', name: 'Legislation'}, {id: '5', name: 'Safety'} ].map(cat => (
                              <TouchableOpacity key={cat.name} style={adminStyles.dropdownOption} onPress={() => {setCourseForm({...courseForm, category_id: cat.id}); setIsCatOpen(false);}}>
                                <Text style={adminStyles.dropdownOptionText}>{cat.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}>
                    <Text style={adminStyles.inputLabel}>Park</Text>
                    <View style={{position: 'relative'}}>
                      <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsParkOpen(!isParkOpen); setIsCatOpen(false); setIsStatusOpen(false);}}>
                        <Text style={{color: '#0f172a', fontSize: 13}} numberOfLines={1}>{getParkName(courseForm.park_id)}</Text>
                        <Feather name="chevron-down" size={16} color="#64748b" />
                      </TouchableOpacity>
                      {isParkOpen && (
                        <View style={adminStyles.formDropdownMenuCreate}>
                          <ScrollView nestedScrollEnabled={true} style={{maxHeight: 120}}>
                            {[ {id: '', name: 'All Parks'}, {id: '1', name: 'Bako National Park'}, {id: '2', name: 'Gunung Mulu National Park'}, {id: '3', name: 'Kubah National Park'}, {id: '4', name: 'Niah National Park'} ].map(park => (
                              <TouchableOpacity key={park.name} style={adminStyles.dropdownOption} onPress={() => {setCourseForm({...courseForm, park_id: park.id}); setIsParkOpen(false);}}>
                                <Text style={adminStyles.dropdownOptionText}>{park.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Status & Mandatory Row */}
                <View style={[adminStyles.rowInputs, {alignItems: 'center', zIndex: 2000, elevation: 2000, marginBottom: 5}]}>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput, {marginBottom: 0}]}>
                    <Text style={adminStyles.inputLabel}>Status</Text>
                    <View style={{position: 'relative'}}>
                      <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsStatusOpen(!isStatusOpen); setIsCatOpen(false); setIsParkOpen(false);}}>
                        <Text style={{color: '#0f172a'}}>{courseForm.status}</Text>
                        <Feather name="chevron-down" size={16} color="#64748b" />
                      </TouchableOpacity>
                      {isStatusOpen && (
                        <View style={adminStyles.formDropdownMenuCreate}>
                          {['Draft', 'Published', 'Archived'].map(stat => (
                            <TouchableOpacity key={stat} style={adminStyles.dropdownOption} onPress={() => {setCourseForm({...courseForm, status: stat}); setIsStatusOpen(false);}}>
                              <Text style={adminStyles.dropdownOptionText}>{stat}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[adminStyles.checkboxRow, adminStyles.halfInput, {marginTop: 25}]} 
                    onPress={() => setCourseForm({...courseForm, is_mandatory: !courseForm.is_mandatory})}
                  >
                    <Feather name={courseForm.is_mandatory ? "check-square" : "square"} size={20} color={courseForm.is_mandatory ? "#059669" : "#94a3b8"} />
                    <Text style={adminStyles.checkboxText}>Mandatory</Text>
                  </TouchableOpacity>
                </View>

                <View style={[adminStyles.inputGroup, {zIndex: 1, elevation: 1, marginTop: 10}]}>
                  <Text style={adminStyles.inputLabel}>Image URL</Text>
                  <TextInput style={adminStyles.modalInput} value={courseForm.image_url} onChangeText={(t) => setCourseForm({...courseForm, image_url: t})} placeholder="https://..." />
                </View>

                <View style={[adminStyles.formActionRow, {zIndex: 1, elevation: 1}]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => setShowCreateModal(false)}>
                    <Text style={adminStyles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={adminStyles.submitBtn} onPress={handleCreateCourse}>
                    <Text style={adminStyles.submitBtnText}>Create Course</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
