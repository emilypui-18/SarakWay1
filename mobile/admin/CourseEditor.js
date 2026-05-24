import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import adminStyles from '../styles/admin';

const BASE_URL = 'http://172.20.10.4:3000';

export default function CourseEditor({ course, goBack }) {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState({});

  // --- ACCORDION STATE ---
  const [expandedModules, setExpandedModules] = useState({});

  // --- COURSE SETTINGS STATE ---
  const [courseForm, setCourseForm] = useState({
    course_name: course.course_name || '',
    description: course.description || '',
    category_id: course.category_id || '',
    park_id: course.park_id || '',
    image_url: course.image_url || '',
    status: course.status || 'Draft',
    is_mandatory: course.is_mandatory === 1,
  });

  // --- DROPDOWN STATES ---
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isParkOpen, setIsParkOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // --- MODAL STATES ---
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  
  // --- FORM STATES ---
  const [moduleForm, setModuleForm] = useState({ title: '', desc: '' });
  const [editModuleForm, setEditModuleForm] = useState({ id: null, title: '', desc: '' });
  
  const [lessonForm, setLessonForm] = useState({ moduleId: null, title: '', content: '', videoUrl: '', duration: '15' });
  const [editLessonForm, setEditLessonForm] = useState({ id: null, title: '', content: '', videoUrl: '', duration: '15' });
  
  const [quizForm, setQuizForm] = useState({ moduleId: null, title: '', passingScore: '70' });
  const [editQuizForm, setEditQuizForm] = useState({ id: null, title: '', passingScore: '70' });
  
  const [questionForm, setQuestionForm] = useState({ quizId: null, text: '', optA: '', optB: '', optC: '', optD: '', correct: 'A' });
  const [editQuestionForm, setEditQuestionForm] = useState({ id: null, text: '', optA: '', optB: '', optC: '', optD: '', correct: 'A' });

  useEffect(() => {
    fetchAllCourseData();
  }, []);

  const fetchAllCourseData = async () => {
    try {
      const modRes = await fetch(`${BASE_URL}/modules/${course.course_id}`);
      if (!modRes.ok) return;
      const fetchedModules = await modRes.json();
      setModules(fetchedModules);

      // Set all modules to collapsed by default
      const initialExpansions = {};
      fetchedModules.forEach((m) => {
        initialExpansions[m.module_id] = false; 
      });
      setExpandedModules(initialExpansions);

      let allLessons = [];
      let allQuizzes = [];
      for (let mod of fetchedModules) {
        const [lesRes, quizRes] = await Promise.all([
          fetch(`${BASE_URL}/lessons/${mod.module_id}`).catch(() => null),
          fetch(`${BASE_URL}/quizzes/${mod.module_id}`).catch(() => null)
        ]);
        if (lesRes && lesRes.ok) allLessons = [...allLessons, ...(await lesRes.json())];
        if (quizRes && quizRes.ok) {
          const qData = await quizRes.json();
          allQuizzes = [...allQuizzes, ...qData];
          
          for (let quiz of qData) {
            const questionRes = await fetch(`${BASE_URL}/quizQuestions/${quiz.quiz_id}`).catch(() => null);
            if (questionRes && questionRes.ok) {
              const qs = await questionRes.json();
              setQuestions(prev => ({ ...prev, [quiz.quiz_id]: qs }));
            }
          }
        }
      }
      setLessons(allLessons);
      setQuizzes(allQuizzes);
    } catch (error) {
      console.log("Failed to load course details:", error);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // ==========================================
  // --- COURSE SETTING ACTIONS ---
  // ==========================================
  const handleUpdateCourse = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses/${course.course_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_name: courseForm.course_name,
          description: courseForm.description || null,
          category_id: courseForm.category_id || null,
          park_id: courseForm.park_id || null,
          image_url: courseForm.image_url || null,
          status: courseForm.status,
          is_mandatory: courseForm.is_mandatory
        })
      });
      if (res.ok) {
        Alert.alert("Success", "Course settings updated.");
      } else {
        Alert.alert("Error", "Failed to update course.");
      }
    } catch (e) {
      Alert.alert("Error", "Network error.");
    }
  };

  const handleDeleteCourse = () => {
    Alert.alert("Delete Course", "Are you sure you want to permanently delete this course? All modules, lessons, and quizzes will be lost.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await fetch(`${BASE_URL}/courses/${course.course_id}`, { method: 'DELETE' });
          goBack(); 
      }}
    ]);
  };

  const adjustDuration = (amount, isEdit) => {
    if (isEdit) {
      let current = parseInt(editLessonForm.duration) || 0;
      setEditLessonForm({...editLessonForm, duration: Math.max(0, current + amount).toString()});
    } else {
      let current = parseInt(lessonForm.duration) || 0;
      setLessonForm({...lessonForm, duration: Math.max(0, current + amount).toString()});
    }
  };

  // ==========================================
  // --- MODULE, LESSON, QUIZ ACTIONS ---
  // ==========================================
  const handleCreateModule = async () => {
    if (!moduleForm.title) return Alert.alert("Error", "Module title required.");
    try {
      await fetch(`${BASE_URL}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: course.course_id, module_title: moduleForm.title, module_description: moduleForm.desc, order_index: modules.length + 1 })
      });
      setModuleForm({ title: '', desc: '' });
      setShowModuleModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not create module."); }
  };

  const handleEditModule = async () => {
    if (!editModuleForm.title) return Alert.alert("Error", "Module title required.");
    try {
      await fetch(`${BASE_URL}/modules/${editModuleForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_title: editModuleForm.title, module_description: editModuleForm.desc })
      });
      setShowEditModuleModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not update module."); }
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.title) return Alert.alert("Error", "Lesson title required.");
    try {
      await fetch(`${BASE_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: lessonForm.moduleId, lesson_title: lessonForm.title, lesson_content: lessonForm.content, duration: lessonForm.duration || 15, video_url: lessonForm.videoUrl })
      });
      setLessonForm({ moduleId: null, title: '', content: '', videoUrl: '', duration: '15' });
      setShowLessonModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not create lesson."); }
  };

  const handleEditLesson = async () => {
    if (!editLessonForm.title) return Alert.alert("Error", "Lesson title required.");
    try {
      await fetch(`${BASE_URL}/lessons/${editLessonForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_title: editLessonForm.title, lesson_content: editLessonForm.content, duration: editLessonForm.duration || 15, video_url: editLessonForm.videoUrl })
      });
      setShowEditLessonModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not update lesson."); }
  };

  const handleCreateQuiz = async () => {
    if (!quizForm.title) return Alert.alert("Error", "Quiz title required.");
    try {
      await fetch(`${BASE_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: quizForm.moduleId, quiz_title: quizForm.title, passing_score: quizForm.passingScore || 70 })
      });
      setQuizForm({ moduleId: null, title: '', passingScore: '70' });
      setShowQuizModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not create quiz."); }
  };

  const handleEditQuiz = async () => {
    if (!editQuizForm.title) return Alert.alert("Error", "Quiz title required.");
    try {
      await fetch(`${BASE_URL}/quizzes/${editQuizForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz_title: editQuizForm.title, passing_score: editQuizForm.passingScore || 70 })
      });
      setShowEditQuizModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not update quiz."); }
  };

  const handleCreateQuestion = async () => {
    if (!questionForm.text || !questionForm.optA || !questionForm.optB) return Alert.alert("Error", "Question text and Options A & B are required.");
    try {
      await fetch(`${BASE_URL}/quizQuestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: questionForm.quizId, question_text: questionForm.text,
          option_a: questionForm.optA, option_b: questionForm.optB, option_c: questionForm.optC, option_d: questionForm.optD,
          correct_answer: questionForm.correct.toUpperCase()
        })
      });
      setQuestionForm({ quizId: null, text: '', optA: '', optB: '', optC: '', optD: '', correct: 'A' });
      setShowQuestionModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not save question."); }
  };

  const handleEditQuestion = async () => {
    if (!editQuestionForm.text || !editQuestionForm.optA || !editQuestionForm.optB) return Alert.alert("Error", "Question text and Options A & B are required.");
    try {
      await fetch(`${BASE_URL}/quizQuestions/${editQuestionForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: editQuestionForm.text,
          option_a: editQuestionForm.optA, option_b: editQuestionForm.optB, option_c: editQuestionForm.optC, option_d: editQuestionForm.optD,
          correct_answer: editQuestionForm.correct.toUpperCase()
        })
      });
      setShowEditQuestionModal(false);
      fetchAllCourseData();
    } catch (e) { Alert.alert("Error", "Could not update question."); }
  };

  const confirmDelete = (type, id, url) => {
    Alert.alert(`Delete ${type}`, `Are you sure you want to delete this ${type.toLowerCase()}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await fetch(`${BASE_URL}/${url}/${id}`, { method: 'DELETE' });
          fetchAllCourseData();
      }}
    ]);
  };

  const getCatName = (id) => {
    const cats = {'1': 'Conservation', '2': 'Biodiversity', '3': 'Eco-tourism', '4': 'Legislation', '5': 'Safety'};
    return cats[String(id)] || 'General Course';
  };
  const getParkName = (id) => {
    const parks = {'1': 'Bako National Park', '2': 'Gunung Mulu National Park', '3': 'Kubah National Park', '4': 'Niah National Park'};
    return parks[String(id)] || 'All Parks';
  };

  return (
    <View style={adminStyles.container}>
      <View style={adminStyles.header}>
        <TouchableOpacity onPress={goBack} style={adminStyles.menuButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={adminStyles.headerTitle}>Course Editor</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={adminStyles.mainContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* ========================================== */}
        {/* --- INLINE COURSE SETTINGS --- */}
        {/* ========================================== */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 }}>
          <Text style={[adminStyles.sectionTitle, {marginBottom: 15}]}>Course Settings</Text>

          <View style={adminStyles.inputGroup}>
            <Text style={adminStyles.inputLabel}>Course Name</Text>
            <TextInput style={adminStyles.modalInput} value={courseForm.course_name} onChangeText={(t) => setCourseForm({...courseForm, course_name: t})} />
          </View>

          <View style={adminStyles.inputGroup}>
            <Text style={adminStyles.inputLabel}>Description</Text>
            <TextInput style={[adminStyles.modalInput, adminStyles.textAreaCompact]} value={courseForm.description} onChangeText={(t) => setCourseForm({...courseForm, description: t})} multiline />
          </View>

          <View style={[adminStyles.rowInputs, {zIndex: 3000, elevation: 3000}]}>
            <View style={[adminStyles.inputGroup, adminStyles.halfInput]}>
              <Text style={adminStyles.inputLabel}>Category</Text>
              <View style={{position: 'relative'}}>
                <TouchableOpacity style={adminStyles.formDropdownBtn} onPress={() => {setIsCatOpen(!isCatOpen); setIsParkOpen(false); setIsStatusOpen(false);}}>
                  <Text style={{color: '#0f172a'}} numberOfLines={1}>{getCatName(courseForm.category_id)}</Text>
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
                  <Text style={{color: '#0f172a'}} numberOfLines={1}>{getParkName(courseForm.park_id)}</Text>
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

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, zIndex: 1, elevation: 1 }}>
            <TouchableOpacity style={[adminStyles.submitBtn, {flex: 1, marginRight: 10}]} onPress={handleUpdateCourse}>
              <Text style={adminStyles.submitBtnText}>Save Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[adminStyles.cancelBtn, {borderColor: '#ef4444'}]} onPress={handleDeleteCourse}>
              <Text style={[adminStyles.cancelBtnText, {color: '#ef4444'}]}>Delete Course</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================== */}
        {/* --- MODULES SECTION (WITH ACCORDION) --- */}
        {/* ========================================== */}
        <View style={adminStyles.sectionHeader}>
          <Text style={adminStyles.sectionTitle}>Course Syllabus</Text>
          <TouchableOpacity style={[adminStyles.primaryButton, adminStyles.addModuleBtn]} onPress={() => setShowModuleModal(true)}>
            <Feather name="plus" size={16} color="#fff" />
            <Text style={[adminStyles.primaryButtonText, {fontSize: 14}]}>Add Module</Text>
          </TouchableOpacity>
        </View>

        {modules.length === 0 ? (
          <Text style={adminStyles.editorEmptyStateText}>No modules created yet. Start by adding one!</Text>
        ) : (
          modules.map((mod, index) => {
            const moduleLessons = lessons.filter(l => l.module_id === mod.module_id);
            const moduleQuizzes = quizzes.filter(q => q.module_id === mod.module_id);
            const isExpanded = expandedModules[mod.module_id];

            return (
              <View key={mod.module_id} style={adminStyles.moduleCard}>
                
                {/* --- MODULE HEADER (CLICKABLE ACCORDION) --- */}
                <View style={[adminStyles.moduleHeader, { borderBottomWidth: isExpanded ? 1 : 0, borderBottomColor: '#e2e8f0', paddingBottom: isExpanded ? 15 : 0, marginBottom: isExpanded ? 15 : 0 }]}>
                  <TouchableOpacity style={{ flex: 1, paddingRight: 15, flexDirection: 'row', alignItems: 'center' }} onPress={() => toggleModule(mod.module_id)}>
                    <Feather name={isExpanded ? "chevron-down" : "chevron-right"} size={20} color="#64748b" style={{marginRight: 10}} />
                    <View style={{ flex: 1 }}>
                      <Text style={[adminStyles.moduleTitle, {marginBottom: 0}]}>Module {mod.order_index || index + 1}: {mod.module_title}</Text>
                      {/* Only show the description if the module is expanded to keep it super clean */}
                      {isExpanded && mod.module_description ? <Text style={[adminStyles.moduleDesc, {marginTop: 6}]}>{mod.module_description}</Text> : null}
                    </View>
                  </TouchableOpacity>
                  
                  <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { setEditModuleForm({ id: mod.module_id, title: mod.module_title, desc: mod.module_description }); setShowEditModuleModal(true); }}>
                      <Feather name="edit-2" size={18} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete("Module", mod.module_id, "modules")}>
                      <Feather name="trash-2" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* --- EXPANDABLE CONTENT: LESSONS & QUIZZES --- */}
                {isExpanded && (
                  <View>
                    {moduleLessons.length > 0 && <Text style={adminStyles.sectionSubHeader}>Lessons</Text>}
                    {moduleLessons.map((lesson, lIndex) => (
                      <View key={lesson.lesson_id} style={[adminStyles.lessonItem, { flexDirection: 'column', alignItems: 'stretch' }]}>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                            <Feather name="file-text" size={16} color="#059669" style={{marginRight: 10}} />
                            <View style={{ flex: 1 }}>
                              <Text style={adminStyles.lessonTitle}>{lIndex + 1}. {lesson.lesson_title}</Text>
                              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lesson.duration} mins</Text>
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity onPress={() => { setEditLessonForm({ id: lesson.lesson_id, title: lesson.lesson_title, content: lesson.lesson_content || '', videoUrl: lesson.video_url || '', duration: String(lesson.duration) }); setShowEditLessonModal(true); }}>
                              <Feather name="edit-2" size={16} color="#64748b" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete("Lesson", lesson.lesson_id, "lessons")}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                          {lesson.lesson_content ? (
                            <Text style={{ fontSize: 13, color: '#475569', lineHeight: 20 }}>{lesson.lesson_content}</Text>
                          ) : (
                            <Text style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>No reading content provided.</Text>
                          )}
                          {lesson.video_url ? (
                            <Text style={{ fontSize: 13, color: '#dc2626', marginTop: 8 }}><Feather name="youtube" size={12}/> {lesson.video_url}</Text>
                          ) : null}
                        </View>

                      </View>
                    ))}

                    {moduleQuizzes.length > 0 && <Text style={[adminStyles.sectionSubHeader, {marginTop: 15}]}>Quizzes</Text>}
                    {moduleQuizzes.map((quiz) => {
                      const quizQuestions = questions[quiz.quiz_id] || [];
                      return (
                        <View key={quiz.quiz_id} style={adminStyles.quizContainer}>
                          
                          <View style={adminStyles.quizHeaderBox}>
                            <Feather name="help-circle" size={16} color="#d97706" style={{marginRight: 8}} />
                            <View style={{ flex: 1, paddingRight: 10 }}>
                              <Text style={adminStyles.quizTitle}>{quiz.quiz_title}</Text>
                              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Passing Score: {quiz.passing_score}% • {quizQuestions.length} Questions</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                              <TouchableOpacity onPress={() => { setEditQuizForm({ id: quiz.quiz_id, title: quiz.quiz_title, passingScore: String(quiz.passing_score) }); setShowEditQuizModal(true); }}>
                                <Feather name="edit-2" size={16} color="#64748b" />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => confirmDelete("Quiz", quiz.quiz_id, "quizzes")}>
                                <Feather name="trash-2" size={16} color="#ef4444" />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {quizQuestions.map((q, qIndex) => (
                            <View key={q.question_id} style={[adminStyles.questionItem, { flexDirection: 'column' }]}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View style={{ flex: 1, paddingRight: 15 }}>
                                  <Text style={adminStyles.questionText}>{qIndex + 1}. {q.question_text}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                  <TouchableOpacity onPress={() => { setEditQuestionForm({ id: q.question_id, text: q.question_text, optA: q.option_a, optB: q.option_b, optC: q.option_c || '', optD: q.option_d || '', correct: q.correct_answer }); setShowEditQuestionModal(true); }}>
                                    <Feather name="edit-2" size={16} color="#64748b" />
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => confirmDelete("Question", q.question_id, "quizQuestions")}>
                                    <Feather name="trash-2" size={16} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>

                              <View style={{ marginTop: 8, paddingLeft: 5, gap: 6 }}>
                                {['A', 'B', 'C', 'D'].map(opt => {
                                  const optText = q[`option_${opt.toLowerCase()}`];
                                  if (!optText) return null;
                                  const isCorrect = q.correct_answer === opt;
                                  return (
                                    <View key={opt} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                      <Text style={{ fontSize: 13, color: isCorrect ? '#059669' : '#64748b', fontWeight: isCorrect ? 'bold' : 'normal' }}>
                                        {opt}. {optText}
                                      </Text>
                                      {isCorrect && <Feather name="check-circle" size={14} color="#059669" style={{marginLeft: 6}} />}
                                    </View>
                                  )
                                })}
                              </View>
                            </View>
                          ))}

                          <TouchableOpacity onPress={() => { setQuestionForm({ ...questionForm, quizId: quiz.quiz_id }); setShowQuestionModal(true); }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 5 }}>
                            <Feather name="plus-circle" size={14} color="#d97706" style={{marginRight: 6}} />
                            <Text style={{ fontSize: 13, color: '#d97706', fontWeight: 'bold' }}>Add Question</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                    <View style={adminStyles.moduleActions}>
                      <TouchableOpacity style={adminStyles.ghostBtn} onPress={() => { setLessonForm({...lessonForm, moduleId: mod.module_id}); setShowLessonModal(true); }}>
                        <Feather name="plus" size={14} color="#059669" />
                        <Text style={adminStyles.ghostBtnText}>Add Lesson</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[adminStyles.ghostBtn, {backgroundColor: '#fffbeb'}]} onPress={() => { setQuizForm({...quizForm, moduleId: mod.module_id}); setShowQuizModal(true); }}>
                        <Feather name="plus" size={14} color="#d97706" />
                        <Text style={[adminStyles.ghostBtnText, {color: '#d97706'}]}>Add Quiz</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                )}

              </View>
            );
          })
        )}
        <View style={adminStyles.bottomSpacer} />
      </ScrollView>


      {/* ========================================================================= */}
      {/* MODALS */}
      <Modal visible={showModuleModal || showEditModuleModal} transparent={true} animationType="fade">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'center' }}>
            <View style={[adminStyles.modalFormContent, adminStyles.modalContentFixed, { height: 'auto' }]}>
              <View style={adminStyles.modalHeader}>
                <Text style={adminStyles.modalTitle}>{showEditModuleModal ? "Edit Module" : "New Module"}</Text>
                <TouchableOpacity onPress={() => {setShowModuleModal(false); setShowEditModuleModal(false)}}><Feather name="x" size={24} color="#64748b" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 10 }}>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Title</Text>
                  <TextInput style={adminStyles.modalInput} value={showEditModuleModal ? editModuleForm.title : moduleForm.title} onChangeText={(t) => showEditModuleModal ? setEditModuleForm({...editModuleForm, title: t}) : setModuleForm({...moduleForm, title: t})} />
                </View>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Description</Text>
                  <TextInput style={[adminStyles.modalInput, adminStyles.textAreaCompact]} value={showEditModuleModal ? editModuleForm.desc : moduleForm.desc} onChangeText={(t) => showEditModuleModal ? setEditModuleForm({...editModuleForm, desc: t}) : setModuleForm({...moduleForm, desc: t})} multiline />
                </View>
                <View style={[adminStyles.formActionRow, {marginTop: 10}]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => {setShowModuleModal(false); setShowEditModuleModal(false)}}><Text style={adminStyles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={adminStyles.submitBtn} onPress={showEditModuleModal ? handleEditModule : handleCreateModule}><Text style={adminStyles.submitBtnText}>Save Module</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal visible={showLessonModal || showEditLessonModal} transparent={true} animationType="fade">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'center' }}>
            <View style={[adminStyles.modalFormContent, adminStyles.modalContentFixed, { height: 'auto' }]}>
              <View style={adminStyles.modalHeader}>
                <Text style={adminStyles.modalTitle}>{showEditLessonModal ? "Edit Lesson" : "New Lesson"}</Text>
                <TouchableOpacity onPress={() => { setShowLessonModal(false); setShowEditLessonModal(false); }}><Feather name="x" size={24} color="#64748b" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 10 }}>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Lesson Title</Text>
                  <TextInput style={adminStyles.modalInput} value={showEditLessonModal ? editLessonForm.title : lessonForm.title} onChangeText={(t) => showEditLessonModal ? setEditLessonForm({...editLessonForm, title: t}) : setLessonForm({...lessonForm, title: t})} />
                </View>
                
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Duration (mins)</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' }}>
                    <TouchableOpacity style={{ padding: 12 }} onPress={() => adjustDuration(-5, showEditLessonModal)}>
                      <Feather name="minus" size={20} color="#64748b" />
                    </TouchableOpacity>
                    <TextInput 
                      style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#0f172a' }} 
                      value={String(showEditLessonModal ? editLessonForm.duration : lessonForm.duration)} 
                      onChangeText={(t) => showEditLessonModal ? setEditLessonForm({...editLessonForm, duration: t}) : setLessonForm({...lessonForm, duration: t})} 
                      keyboardType="numeric" 
                    />
                    <TouchableOpacity style={{ padding: 12 }} onPress={() => adjustDuration(5, showEditLessonModal)}>
                      <Feather name="plus" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Content / Reading Material</Text>
                  <TextInput style={[adminStyles.modalInput, adminStyles.textAreaCompact]} value={showEditLessonModal ? editLessonForm.content : lessonForm.content} onChangeText={(t) => showEditLessonModal ? setEditLessonForm({...editLessonForm, content: t}) : setLessonForm({...lessonForm, content: t})} multiline />
                </View>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>YouTube URL</Text>
                  <TextInput style={adminStyles.modalInput} value={showEditLessonModal ? editLessonForm.videoUrl : lessonForm.videoUrl} onChangeText={(t) => showEditLessonModal ? setEditLessonForm({...editLessonForm, videoUrl: t}) : setLessonForm({...lessonForm, videoUrl: t})} placeholder="https://youtube.com/..." />
                </View>

                <View style={[adminStyles.formActionRow, {marginTop: 10}]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => { setShowLessonModal(false); setShowEditLessonModal(false); }}><Text style={adminStyles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={adminStyles.submitBtn} onPress={showEditLessonModal ? handleEditLesson : handleCreateLesson}><Text style={adminStyles.submitBtnText}>{showEditLessonModal ? "Update Lesson" : "Save Lesson"}</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal visible={showQuizModal || showEditQuizModal} transparent={true} animationType="fade">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'center' }}>
            <View style={[adminStyles.modalFormContent, adminStyles.modalContentFixed, { height: 'auto' }]}>
              <View style={adminStyles.modalHeader}>
                <Text style={adminStyles.modalTitle}>{showEditQuizModal ? "Edit Quiz" : "New Quiz"}</Text>
                <TouchableOpacity onPress={() => { setShowQuizModal(false); setShowEditQuizModal(false); }}><Feather name="x" size={24} color="#64748b" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 10 }}>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Quiz Title</Text>
                  <TextInput style={adminStyles.modalInput} value={showEditQuizModal ? editQuizForm.title : quizForm.title} onChangeText={(t) => showEditQuizModal ? setEditQuizForm({...editQuizForm, title: t}) : setQuizForm({...quizForm, title: t})} />
                </View>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Passing Score (%)</Text>
                  <TextInput style={adminStyles.modalInput} value={String(showEditQuizModal ? editQuizForm.passingScore : quizForm.passingScore)} onChangeText={(t) => showEditQuizModal ? setEditQuizForm({...editQuizForm, passingScore: t}) : setQuizForm({...quizForm, passingScore: t})} keyboardType="numeric" />
                </View>
                <View style={[adminStyles.formActionRow, {marginTop: 10}]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => { setShowQuizModal(false); setShowEditQuizModal(false); }}><Text style={adminStyles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={[adminStyles.submitBtn, { backgroundColor: '#d97706' }]} onPress={showEditQuizModal ? handleEditQuiz : handleCreateQuiz}><Text style={adminStyles.submitBtnText}>{showEditQuizModal ? "Update Quiz" : "Save Quiz"}</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal visible={showQuestionModal || showEditQuestionModal} transparent={true} animationType="slide">
        <View style={adminStyles.modalFormOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', justifyContent: 'center' }}>
            <View style={[adminStyles.modalFormContent, adminStyles.modalContentFixed, { height: 'auto' }]}>
              <View style={adminStyles.modalHeader}>
                <Text style={adminStyles.modalTitle}>{showEditQuestionModal ? "Edit Question" : "Add Question"}</Text>
                <TouchableOpacity onPress={() => { setShowQuestionModal(false); setShowEditQuestionModal(false); }}><Feather name="x" size={24} color="#64748b" /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 10 }}>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Question Text</Text>
                  <TextInput style={[adminStyles.modalInput, adminStyles.textAreaCompact]} value={showEditQuestionModal ? editQuestionForm.text : questionForm.text} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, text: t}) : setQuestionForm({...questionForm, text: t})} multiline />
                </View>
                <View style={adminStyles.rowInputs}>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}><TextInput style={adminStyles.modalInput} placeholder="Option A" value={showEditQuestionModal ? editQuestionForm.optA : questionForm.optA} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, optA: t}) : setQuestionForm({...questionForm, optA: t})} /></View>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}><TextInput style={adminStyles.modalInput} placeholder="Option B" value={showEditQuestionModal ? editQuestionForm.optB : questionForm.optB} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, optB: t}) : setQuestionForm({...questionForm, optB: t})} /></View>
                </View>
                <View style={adminStyles.rowInputs}>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}><TextInput style={adminStyles.modalInput} placeholder="Option C" value={showEditQuestionModal ? editQuestionForm.optC : questionForm.optC} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, optC: t}) : setQuestionForm({...questionForm, optC: t})} /></View>
                  <View style={[adminStyles.inputGroup, adminStyles.halfInput]}><TextInput style={adminStyles.modalInput} placeholder="Option D" value={showEditQuestionModal ? editQuestionForm.optD : questionForm.optD} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, optD: t}) : setQuestionForm({...questionForm, optD: t})} /></View>
                </View>
                <View style={adminStyles.inputGroup}>
                  <Text style={adminStyles.inputLabel}>Correct Answer (A/B/C/D)</Text>
                  <TextInput style={adminStyles.modalInput} value={showEditQuestionModal ? editQuestionForm.correct : questionForm.correct} onChangeText={(t) => showEditQuestionModal ? setEditQuestionForm({...editQuestionForm, correct: t}) : setQuestionForm({...questionForm, correct: t})} maxLength={1} autoCapitalize="characters" />
                </View>
                <View style={[adminStyles.formActionRow, {marginTop: 10}]}>
                  <TouchableOpacity style={adminStyles.cancelBtn} onPress={() => { setShowQuestionModal(false); setShowEditQuestionModal(false); }}><Text style={adminStyles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={[adminStyles.submitBtn, { backgroundColor: '#d97706' }]} onPress={showEditQuestionModal ? handleEditQuestion : handleCreateQuestion}><Text style={adminStyles.submitBtnText}>{showEditQuestionModal ? "Update" : "Save"}</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </View>
  );
}