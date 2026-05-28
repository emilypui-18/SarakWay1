import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'; 
import YoutubeIframe from 'react-native-youtube-iframe'; // <-- The new YouTube Player!
import guideStyles from '../styles/guide';

import { BASE_URL } from "../config";

export default function Courses({ setCurrentScreen, toggleMenu, enrollments, setEnrollments, activeCourse, setActiveCourse, userData }) {
  const [coursesList, setCoursesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [questions, setQuestions] = useState({});

  const [activeLesson, setActiveLesson] = useState(null); 
  const [activeQuiz, setActiveQuiz] = useState(null);     
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); 

  const currentUserId = userData?.user_id || 2;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeCourse) {
      fetchCourseDetails(activeCourse.course_id);
      fetchCompletedLessons();
    }
  }, [activeCourse]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses/progress/${currentUserId}`);
      const data = await res.json();
      const published = data.filter(c => c.status === 'Published');
      setCoursesList(published);
      
      if (activeCourse) {
        const updatedActive = published.find(c => c.course_id === activeCourse.course_id);
        if (updatedActive) setActiveCourse(updatedActive);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompletedLessons = async () => {
    try {
      const res = await fetch(`${BASE_URL}/courses/lessons/completed/${currentUserId}`);
      const data = await res.json();
      setCompletedLessons(data.map(item => item.lesson_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const modRes = await fetch(`${BASE_URL}/modules/${courseId}`);
      const fetchedModules = await modRes.json();
      setModules(fetchedModules);

      const initialExpansions = {};
      fetchedModules.forEach((m) => {
        initialExpansions[m.module_id] = false; 
      });
      setExpandedModules(initialExpansions);

      fetchedModules.forEach(async (module) => {
        const lesRes = await fetch(`${BASE_URL}/lessons/${module.module_id}`);
        const lesData = await lesRes.json();
        setLessons(prev => ({ ...prev, [module.module_id]: lesData }));

        const quizRes = await fetch(`${BASE_URL}/quizzes/${module.module_id}`);
        const quizData = await quizRes.json();
        setQuizzes(prev => ({ ...prev, [module.module_id]: quizData }));

        quizData.forEach(async (quiz) => {
          const qRes = await fetch(`${BASE_URL}/quizQuestions/${quiz.quiz_id}`);
          const qData = await qRes.json();
          setQuestions(prev => ({ ...prev, [quiz.quiz_id]: qData }));
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = coursesList.filter(course => {
    return course.course_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleEnroll = () => {
    setEnrollments({ ...enrollments, [activeCourse.course_id]: [] });
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;

    try {
      const res = await fetch(`${BASE_URL}/courses/lessons/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          lesson_id: activeLesson.lesson_id
        })
      });

      if (res.ok) {
        setCompletedLessons(prev => [...prev, activeLesson.lesson_id]);
        fetchCourses(); 
      }
    } catch (err) {
      console.error("Error saving lesson:", err);
    }

    setActiveLesson(null);
  };

  const handleSelectAnswer = (questionId, optionKey) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: optionKey });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmitQuiz = async () => {
    const quizQuestions = questions[activeQuiz.quiz_id] || [];
    let correctCount = 0;

    quizQuestions.forEach((q) => {
      if (quizAnswers[q.question_id] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quizQuestions.length) * 100);
    const passed = score >= activeQuiz.passing_score;

    try {
      const res = await fetch(`${BASE_URL}/quizAttempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, 
          quiz_id: activeQuiz.quiz_id,
          score: score,
          passed: passed ? 1 : 0
        })
      });

      const data = await res.json();

      Alert.alert(
        passed ? "Quiz Passed! 🎉" : "Quiz Failed",
        `Score: ${score}% | ${passed ? "PASSED" : "FAILED"}\n\nCourse Progress: ${Math.round(data.progress_percentage || 0)}%`,
        [{ text: "OK" }]
      );

      if (data.is_completed === 1) {
        if (activeCourse.park_id) {
          try {
            const certRes = await fetch(`${BASE_URL}/courses/check-certificate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: currentUserId, park_id: activeCourse.park_id })
            });
            const certData = await certRes.json();
            
            if (certData.certificateRequested) {
              Alert.alert("Course Completed! 🏆", "You successfully finished! A certificate request has been sent to the Admin for approval.");
            } else {
              Alert.alert("Course Completed! 🏆", "You have successfully completed this course!");
            }
          } catch (e) {
            Alert.alert("Course Completed! 🏆", "You have successfully completed this course!");
          }
        } else {
          Alert.alert("Course Completed! 🏆", "You have successfully completed this course!");
        }
      }

      fetchCourses();
    } catch (err) {
      Alert.alert("Error", "Could not save your quiz attempt to the database.");
    }

    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
  };

  const getVideoSource = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Helper function to pull the unique Video ID out of messy YouTube links
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // =================================================================================
  // RENDER: DETAILED COURSE VIEW
  // =================================================================================
  if (activeCourse) {
    const isLocallyEnrolled = enrollments && enrollments[activeCourse.course_id] !== undefined;
    const dbProgress = Number(activeCourse.progress_percentage) || 0;
    const isDbCompleted = activeCourse.is_completed === 1;
    
    const isEnrolled = isLocallyEnrolled || dbProgress > 0 || isDbCompleted;
    const progressPercent = isDbCompleted ? 100 : Math.round(dbProgress);

    return (
      <View style={guideStyles.courseDetailContainer}>
        
        <TouchableOpacity 
          style={guideStyles.floatingBackBtn} 
          onPress={() => {setActiveCourse(null); setModules([]);}}
        >
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <View style={guideStyles.detailBannerAlt}>
             <View style={guideStyles.badgeGreen}>
                <Text style={guideStyles.badgeText}>{activeCourse.category_name || 'General'}</Text>
             </View>
             <Text style={guideStyles.detailTitle}>{activeCourse.course_name}</Text>
          </View>

          <Text style={guideStyles.detailDesc}>{activeCourse.description || "No description provided."}</Text>

          <View style={guideStyles.detailMetaRow}>
            <View style={guideStyles.metaItem}>
              <Feather name="clock" size={14} color="#64748b" />
              <Text style={guideStyles.metaText}>{activeCourse.total_duration || 0} mins</Text>
            </View>
            <View style={guideStyles.metaItem}>
              <Feather name="book-open" size={14} color="#64748b" />
              <Text style={guideStyles.metaText}>{modules.length} Modules</Text>
            </View>
          </View>

          {!isEnrolled ? (
            <TouchableOpacity style={guideStyles.enrollBtn} onPress={handleEnroll}>
              <Text style={guideStyles.enrollBtnText}>Enroll in Course</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
              <View style={guideStyles.progressTextRow}>
                <Text style={[guideStyles.progressTextLeft, isDbCompleted && guideStyles.progressTextComplete]}>
                  {isDbCompleted ? 'Completed' : 'In Progress'}
                </Text>
                <Text style={guideStyles.progressTextRight}>{progressPercent}%</Text>
              </View>
              <View style={guideStyles.progressBarContainer}>
                <View style={[guideStyles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: isDbCompleted ? '#059669' : '#3b82f6' }]} />
              </View>
            </View>
          )}

          <Text style={guideStyles.modulesHeader}>Course Syllabus</Text>
          
          {modules.length === 0 && <Text style={guideStyles.emptyStateText}>Loading modules...</Text>}

          {modules.map((module, index) => {
            const isCompleted = isDbCompleted; 
            const moduleLessons = lessons[module.module_id] || [];
            const moduleQuizzes = quizzes[module.module_id] || [];
            const isExpanded = expandedModules[module.module_id];
            const allLessonsDone = moduleLessons.every(l => completedLessons.includes(l.lesson_id));
            
            return (
              <View key={module.module_id} style={[guideStyles.moduleCardAccordion, isCompleted && guideStyles.moduleCardCompleted]}>
                
                <TouchableOpacity 
                  style={[guideStyles.accordionHeader, isExpanded && guideStyles.accordionHeaderExpanded]}
                  onPress={() => toggleModule(module.module_id)}
                >
                  <View style={guideStyles.moduleIconAccordion}>
                    <Feather name={isCompleted ? "check-circle" : "target"} size={18} color={isCompleted ? "#059669" : "#94a3b8"} />
                  </View>
                  <Text style={guideStyles.accordionTitle}>Module {index + 1}: {module.module_title}</Text>
                  <Feather name={isExpanded ? "minus" : "plus"} size={20} color="#0f172a" />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={guideStyles.accordionContent}>
                    {module.module_description ? <Text style={guideStyles.accordionDesc}>{module.module_description}</Text> : null}
                    
                    {moduleLessons.map((l, i) => {
                      const isLessonDone = completedLessons.includes(l.lesson_id);
                      return (
                        <TouchableOpacity 
                            key={l.lesson_id} 
                            style={[guideStyles.lessonRow, isLessonDone && guideStyles.lessonRowDone, !isEnrolled && guideStyles.lessonRowLocked]}
                            onPress={() => isEnrolled ? setActiveLesson(l) : Alert.alert("Not Enrolled", "Please enroll in the course to view lessons.")}
                          >
                            <Feather name={isLessonDone ? "check-circle" : "play-circle"} size={18} color={isLessonDone ? "#059669" : "#3b82f6"} style={{marginRight: 10}} />
                            <View style={guideStyles.lessonTextCol}>
                              <Text style={guideStyles.lessonTitle}>{l.lesson_title}</Text>
                              <Text style={guideStyles.lessonDuration}>{l.duration} mins</Text>
                            </View>
                            <View style={guideStyles.lessonActionBadge}>
                              <Text style={guideStyles.lessonActionText}>{isLessonDone ? 'Review' : 'Start Lesson'}</Text>
                            </View>
                        </TouchableOpacity>
                      )
                    })}

                    {isEnrolled && moduleQuizzes.length > 0 && (
                      <View style={guideStyles.quizSectionContainer}>
                        <Text style={guideStyles.quizSectionTitle}>Quizzes</Text>
                        
                        {moduleQuizzes.map(quiz => (
                          <View key={quiz.quiz_id} style={guideStyles.quizCardBox}>
                            <Text style={guideStyles.quizCardTitle}>{quiz.quiz_title}</Text>
                            <Text style={guideStyles.quizCardScore}>Passing Score: {quiz.passing_score}%</Text>
                            
                            <TouchableOpacity 
                              style={[guideStyles.quizBtn, allLessonsDone ? guideStyles.quizBtnEnabled : guideStyles.quizBtnDisabled]} 
                              disabled={!allLessonsDone}
                              onPress={() => {
                                  setActiveQuiz(quiz);
                                  setCurrentQuestionIndex(0);
                                  setQuizAnswers({});
                              }}
                            >
                              <Text style={[guideStyles.quizBtnText, allLessonsDone ? guideStyles.quizBtnTextEnabled : guideStyles.quizBtnTextDisabled]}>
                                {allLessonsDone ? 'Start Quiz' : 'Complete all lessons first'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <Modal visible={!!activeLesson} transparent={true} animationType="slide">
          <View style={guideStyles.modalBackdrop}>
             <View style={guideStyles.modalContainer}>
               
               <View style={guideStyles.modalHeaderRow}>
                 <Text style={guideStyles.modalTitleText}>{activeLesson?.lesson_title}</Text>
                 <TouchableOpacity onPress={() => setActiveLesson(null)} style={guideStyles.modalCloseBtn}>
                   <Feather name="x" size={20} color="#64748b" />
                 </TouchableOpacity>
               </View>

               <ScrollView showsVerticalScrollIndicator={false}>
                 
                 {/* 🚀 NEW YOUTUBE COMPONENT IMPLEMENTATION 🚀 */}
                 {activeLesson?.video_url ? (
                   <View style={guideStyles.videoContainer}>
                     {activeLesson.video_url.includes('youtube.com') || activeLesson.video_url.includes('youtu.be') ? (
                       <YoutubeIframe
                         height={220} // Automatically fills the video container box we styled!
                         play={false}
                         videoId={extractYouTubeId(activeLesson.video_url)}
                       />
                     ) : (
                       <Video
                          source={{ uri: getVideoSource(activeLesson.video_url) }}
                          useNativeControls
                          resizeMode={ResizeMode.CONTAIN}
                          style={guideStyles.videoPlayer}
                        />
                     )}
                   </View>
                 ) : null}

                 <Text style={guideStyles.lessonContentText}>
                   {activeLesson?.lesson_content || "No reading material provided for this lesson."}
                 </Text>
               </ScrollView>

               <TouchableOpacity style={guideStyles.enrollBtnBottom} onPress={handleCompleteLesson}>
                 <Text style={guideStyles.enrollBtnText}>Mark as Completed & Close</Text>
               </TouchableOpacity>

             </View>
          </View>
        </Modal>

        {activeQuiz && (
          <Modal visible={!!activeQuiz} transparent={true} animationType="fade">
            <View style={guideStyles.quizModalOverlay}>
              <View style={guideStyles.quizModalContent}>
                
                <View style={guideStyles.quizHeaderRow}>
                  <Text style={guideStyles.quizTitle} numberOfLines={1}>{activeQuiz.quiz_title}</Text>
                  <TouchableOpacity onPress={() => setActiveQuiz(null)}>
                    <Feather name="x" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {(() => {
                  const quizQuestions = questions[activeQuiz.quiz_id] || [];
                  
                  if (quizQuestions.length === 0) {
                    return <Text style={guideStyles.emptyStateText}>No questions found for this quiz.</Text>;
                  }

                  const currentQ = quizQuestions[currentQuestionIndex];
                  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

                  return (
                    <>
                      <View style={guideStyles.quizMetaRow}>
                        <Text style={guideStyles.quizMetaText}>Question {currentQuestionIndex + 1} of {quizQuestions.length}</Text>
                      </View>

                      <Text style={[guideStyles.quizQuestionText, guideStyles.textWrap]}>{currentQ.question_text}</Text>

                      {['A', 'B', 'C', 'D'].map((optKey) => {
                        const optionText = currentQ[`option_${optKey.toLowerCase()}`];
                        if (!optionText) return null;

                        const isSelected = quizAnswers[currentQ.question_id] === optKey;

                        return (
                          <TouchableOpacity 
                            key={optKey} 
                            style={[guideStyles.quizOption, isSelected && guideStyles.quizOptionSelected]}
                            onPress={() => handleSelectAnswer(currentQ.question_id, optKey)}
                            activeOpacity={0.7}
                          >
                            <View style={[guideStyles.quizRadioOuter, isSelected && guideStyles.quizRadioOuterSelected]}>
                              {isSelected && <View style={guideStyles.quizRadioInner} />}
                            </View>
                            <Text style={guideStyles.quizOptionText}>{optKey}. {optionText}</Text>
                          </TouchableOpacity>
                        );
                      })}

                      <View style={guideStyles.quizFooter}>
                        {isLastQuestion ? (
                          <TouchableOpacity 
                            style={guideStyles.quizNextBtn} 
                            onPress={handleSubmitQuiz}
                          >
                            <Text style={guideStyles.quizNextBtnText}>Submit Quiz</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity 
                             style={[guideStyles.quizNextBtn, guideStyles.quizNextBtnDark]} 
                             onPress={handleNextQuestion}
                             disabled={!quizAnswers[currentQ.question_id]} 
                          >
                            <Text style={guideStyles.quizNextBtnText}>Next Question</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  );
                })()}
              </View>
            </View>
          </Modal>
        )}

      </View>
    );
  }

  // =================================================================================
  // RENDER: MAIN LIST VIEW
  // =================================================================================
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
          <Text style={guideStyles.greeting}>Training Courses</Text>
          <Text style={guideStyles.subtitle}>Browse and enroll in courses to enhance your park guiding skills.</Text>
        </View>

        <View style={guideStyles.searchFilterRow}>
          <View style={guideStyles.searchContainer}>
            <Feather name="search" size={18} color="#94a3b8" />
            <TextInput 
              placeholder="Search courses..." 
              style={guideStyles.searchInput}
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {coursesList.length === 0 ? (
          <View style={guideStyles.emptyStateIconContainer}>
            <Feather name="book-open" size={48} color="#cbd5e1" />
            <Text style={guideStyles.emptyStateText}>No published courses available yet.</Text>
          </View>
        ) : (
          <View style={guideStyles.coursesListContainer}>
            {filteredCourses.map((course) => {
              const isLocallyEnrolled = enrollments && enrollments[course.course_id] !== undefined;
              const dbProgress = Number(course.progress_percentage) || 0;
              const isDbCompleted = course.is_completed === 1;
              
              const isEnrolled = isLocallyEnrolled || dbProgress > 0 || isDbCompleted;
              const progressPercent = isDbCompleted ? 100 : Math.round(dbProgress);

              return (
                <TouchableOpacity key={course.course_id} style={guideStyles.fullWidthCard} activeOpacity={0.9} onPress={() => setActiveCourse(course)}>
                  
                  <View style={guideStyles.imagePlaceholder}>
                    <View style={guideStyles.badge}>
                      <Text style={guideStyles.badgeText}>{course.category_name || 'General'}</Text>
                    </View>
                  </View>

                  <View style={guideStyles.cardContent}>
                    <Text style={guideStyles.courseTitle} numberOfLines={2}>{course.course_name}</Text>
                    <Text style={guideStyles.courseDesc} numberOfLines={2}>{course.description}</Text>

                    <View style={guideStyles.cardFooter}>
                      <View style={guideStyles.metaGroup}>
                        <View style={guideStyles.metaItem}>
                          <Feather name="clock" size={12} color="#64748b" />
                          <Text style={guideStyles.metaText}>{course.total_duration || 0} mins</Text>
                        </View>
                      </View>
                      {course.is_mandatory === 1 && (
                        <View style={guideStyles.levelBadge}>
                          <Text style={guideStyles.levelText}>Mandatory</Text>
                        </View>
                      )}
                    </View>

                    {!isEnrolled ? (
                      <View style={guideStyles.viewCourseBtn}>
                        <Text style={guideStyles.viewCourseText}>View Course</Text>
                        <Feather name="chevron-right" size={16} color="#059669" />
                      </View>
                    ) : (
                      <View style={{ marginTop: 15 }}>
                        <View style={guideStyles.progressTextRow}>
                          <Text style={[guideStyles.progressTextLeft, isDbCompleted && guideStyles.progressTextComplete]}>
                            {isDbCompleted ? 'Completed' : 'In Progress'}
                          </Text>
                          <Text style={guideStyles.progressTextRight}>{progressPercent}%</Text>
                        </View>
                        <View style={guideStyles.progressBarContainer}>
                          <View style={[guideStyles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: isDbCompleted ? '#059669' : '#3b82f6' }]} />
                        </View>
                      </View>
                    )}

                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}
