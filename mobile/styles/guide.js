import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const guideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbf9' 
  },
  
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: '#fbfbf9'
  },
  menuButton: {
    padding: 5
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#06241b', 
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20
  },

  // --- Stats Grid ---
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500'
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06241b'
  },
  statSubtext: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4
  },

  // --- Explore Courses Section ---
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06241b'
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  browseText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginRight: 4
  },
  
  // --- Horizontal Course Cards ---
  courseList: {
    paddingLeft: 20,
    paddingBottom: 40
  },
  courseCard: {
    width: width * 0.75, 
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden'
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: '#cbd5e1',
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#06241b'
  },
  cardContent: {
    padding: 16
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#06241b',
    marginBottom: 8,
    lineHeight: 22
  },
  courseDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 16
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 12,
    color: '#64748b'
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },

  // --- Guide Sidebar Styles (Dark Green Theme) ---
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 1000
  },
  sidebarCloseArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  sidebarContent: {
    width: width * 0.75,
    backgroundColor: '#06241b', 
    height: '100%',
    position: 'absolute',
    left: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5
  },
  sidebarProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#134e4a' 
  },
  sidebarLogo: {
    width: 44,
    height: 44,
    marginRight: 12,
    borderRadius: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc' 
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5
  },
  menuItemActive: {
    backgroundColor: '#047857' 
  },
  menuItemText: {
    fontSize: 16,
    color: '#94a3b8', 
    marginLeft: 15,
    fontWeight: '500'
  },
  menuItemTextActive: {
    color: '#ffffff', 
    fontWeight: '600'
  },
  sidebarSpacer: {
    flex: 1
  },
  signOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#134e4a', 
    marginBottom: 20
  },
  signOutText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 15,
  },

  // --- Courses Page: Search (Filter Removed) ---
  searchFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
    backgroundColor: '#fbfbf9',
    zIndex: 1
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#06241b',
    height: '100%'
  },

  // --- Courses Page: List Cards ---
  coursesListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1, 
    elevation: 1
  },
  fullWidthCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden'
  },
  viewCourseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  viewCourseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginRight: 4
  },
  emptyStateText: {
    color: '#64748b', 
    textAlign: 'center', 
    marginTop: 20
  },
  emptyStateIconContainer: {
    alignItems: 'center', 
    marginTop: 40
  },

  // --- Courses Page: Detail View ---
  courseDetailContainer: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  floatingBackBtn: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 100, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 10, 
    borderRadius: 30, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5 
  },
  detailBannerAlt: {
    height: 200,
    backgroundColor: '#134e4a',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  badgeGreen: { 
    backgroundColor: '#d1fae5', 
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    lineHeight: 32
  },
  detailDesc: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20
  },
  enrollBtn: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 30
  },
  enrollBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  enrollBtnBottom: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 20, 
    marginBottom: 0
  },
  modulesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06241b',
    paddingHorizontal: 20,
    marginBottom: 15
  },

  // --- Accordion Modules ---
  moduleCardAccordion: { 
    flexDirection: 'column', 
    backgroundColor: '#ffffff', 
    marginHorizontal: 20, 
    marginBottom: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    padding: 0, 
    overflow: 'hidden' 
  },
  moduleCardCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#a7f3d0'
  },
  accordionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  accordionHeaderExpanded: { 
    backgroundColor: '#f1f5f9' 
  },
  moduleIconAccordion: { 
    margin: 0, 
    marginRight: 15,
    marginTop: 2
  },
  accordionTitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#0f172a', 
    flex: 1, 
    marginBottom: 0 
  },
  accordionContent: { 
    padding: 20, 
    paddingTop: 0 
  },
  accordionDesc: { 
    fontSize: 13, 
    color: '#64748b', 
    lineHeight: 18,
    marginTop: 10 
  },
  
  // --- Lessons & Quizzes UI ---
  lessonRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    padding: 15, 
    backgroundColor: '#f8fafc', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  lessonRowDone: { 
    backgroundColor: '#ecfdf5', 
    borderColor: '#a7f3d0' 
  },
  lessonRowLocked: { 
    opacity: 0.6 
  },
  lessonTextCol: { 
    flex: 1 
  },
  lessonTitle: { 
    color: '#334155', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  lessonDuration: { 
    color: '#64748b', 
    fontSize: 12, 
    marginTop: 2 
  },
  lessonActionBadge: { 
    backgroundColor: '#ffffff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  lessonActionText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  quizSectionContainer: { 
    marginTop: 25, 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0', 
    paddingTop: 15 
  },
  quizSectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    marginBottom: 10 
  },
  quizCardBox: { 
    backgroundColor: '#f8fafc', 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  quizCardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#334155' 
  },
  quizCardScore: { 
    fontSize: 12, 
    color: '#64748b', 
    marginBottom: 10 
  },
  quizBtnEnabled: { backgroundColor: '#134e4a' },
  quizBtnDisabled: { backgroundColor: '#fca5a5' },
  quizBtnTextEnabled: { color: '#ffffff' },
  quizBtnTextDisabled: { color: '#991b1b' },
  quizBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  quizBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },

  // --- Video & Modal Viewer ---
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    maxHeight: '90%', 
    padding: 20, 
    paddingBottom: 40 
  },
  modalHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitleText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    flex: 1 
  },
  modalCloseBtn: { 
    padding: 5, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 20 
  },
  videoContainer: { 
    height: 220, 
    backgroundColor: '#000', 
    borderRadius: 12, 
    marginBottom: 20, 
    overflow: 'hidden' 
  },
  videoPlayer: { 
    width: '100%', 
    height: '100%' 
  },
  lessonContentText: { 
    fontSize: 16, 
    color: '#334155', 
    lineHeight: 26 
  },
  
  // --- Progress Bar ---
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 8
  },
  progressTextLeft: {
    fontSize: 13,
    color: '#64748b'
  },
  progressTextRight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#06241b'
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginHorizontal: 0,
    marginBottom: 0,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#047857',
    borderRadius: 4
  },
  progressTextComplete: {
    color: '#059669'
  },

  // --- Quiz Engine Modal Styles ---
  quizModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20
  },
  quizModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%'
  },
  quizHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#06241b',
    flex: 1
  },
  quizMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  quizMetaText: {
    fontSize: 13,
    color: '#64748b'
  },
  quizQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 20,
    lineHeight: 24
  },
  textWrap: {
    flexShrink: 1, 
    flexWrap: 'wrap'
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 12
  },
  quizOptionSelected: {
    borderColor: '#047857',
    backgroundColor: '#ecfdf5'
  },
  quizRadioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  quizRadioOuterSelected: {
    borderColor: '#047857'
  },
  quizRadioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#047857'
  },
  quizOptionText: {
    fontSize: 15,
    color: '#0f172a',
    flex: 1, 
    flexWrap: 'wrap'
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  quizNextBtn: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%'
  },
  quizNextBtnDark: {
    backgroundColor: '#0f172a'
  },
  quizNextBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  },

  // --- My Progress Page Styles ---
  progressToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 4
  },
  progressToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  progressToggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  progressToggleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
  },
  progressToggleTextActive: {
    color: '#06241b',
    fontWeight: 'bold'
  },
  progressEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  progressEmptyText: {
    marginTop: 15,
    fontSize: 15,
    color: '#64748b'
  },
  progressStatBox: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  progressStatNum: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06241b',
    marginBottom: 4
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#64748b'
  },

  // --- My Progress: Enrolled Course List ---
  progressListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  progressListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  progressListTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#06241b',
    flex: 1,
    marginRight: 10,
    lineHeight: 20
  },
  progressListBadge: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  progressListBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },
  progressListSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 15
  },
  progressListStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  progressListStatText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500'
  },
  progressListPercent: {
    fontSize: 12,
    color: '#06241b',
    fontWeight: 'bold'
  },

  // --- Certifications & Completed States ---
  certCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  certIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  certInfoContainer: {
    flex: 1
  },
  certTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4
  },
  certDate: {
    fontSize: 12,
    color: '#64748b'
  },
  validBadge: {
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  validBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  completedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6
  },
  completedDateText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4
  },

  // --- My Devices Page ---
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  registerBtn: {
    backgroundColor: '#047857',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  registerBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6
  },
  deviceEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  deviceCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  deviceIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  deviceInfo: {
    flex: 1
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  deviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 8
  },
  deviceActiveBadge: {
    backgroundColor: '#047857',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  deviceActiveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  deviceMetaText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2
  },
  deviceDeleteBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // --- Modal Form Styles ---
  modalFormOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalFormContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  modalFormTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06241b',
    marginBottom: 20
  },
  formGroup: {
    marginBottom: 16
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a'
  },
  formDropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff'
  },
  formDropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    paddingVertical: 4
  },
  formDropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  formDropdownOptionText: {
    fontSize: 14,
    color: '#0f172a'
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a'
  },
  submitBtn: {
    backgroundColor: '#047857',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff'
  },

  // --- Notifications Page ---
  notificationEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  notificationEmptyText: {
    marginTop: 15,
    fontSize: 15,
    color: '#64748b'
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  notificationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  notificationTextContent: {
    flex: 1
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 10
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8'
  },
  notificationMessage: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20
  },

  // --- Profile Page Styles ---
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  profileNameLg: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#06241b',
    marginBottom: 4
  },
  profileRole: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b'
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500'
  },
  primaryButton: {
    backgroundColor: '#047857',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8
  },

  // ==========================================
  // --- ALERTS PAGE STYLES (Copied from Admin view) ---
  // ==========================================
  
  // Filtering & Dropdowns
  pageHeaderTwoColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  pageHeaderLeft: {
    flex: 1,
    marginRight: 10
  },
  pageHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  filterBar: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 20, 
    zIndex: 10 
  },
  searchContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    height: 44, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14, 
    color: '#0f172a' 
  },
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    height: 44, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  filterBtnText: { 
    fontSize: 14, 
    color: '#0f172a', 
    fontWeight: '500' 
  },
  dropdownMenu: { 
    position: 'absolute', 
    top: 50, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 5, 
    zIndex: 1000, 
    width: 130 
  },
  dropdownOption: { 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  dropdownOptionText: { 
    fontSize: 14, 
    color: '#334155' 
  },
  
  // --- Alert Cards ---
  listContainer: { 
    paddingBottom: 20 
  },
  alertCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  alertCardTop: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  alertIconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  alertTitleRow: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'center', 
    gap: 8, 
    paddingTop: 4 
  },
  alertType: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  badgeStatic: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    backgroundColor: '#f1f5f9', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  badgeTextStatic: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#475569' 
  },
  alertDesc: { 
    fontSize: 14, 
    color: '#475569', 
    lineHeight: 20, 
    marginBottom: 16 
  },
  alertMetaRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9', 
    marginBottom: 12 
  },
  metaItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  metaText: { 
    fontSize: 13, 
    color: '#64748b' 
  },
  alertActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center' 
  },
  detailsBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  detailsBtnText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#0f172a' 
  },
  
  // --- MODAL STYLES ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    padding: 20 
  },
  detailsModalExpanded: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 20, 
    paddingVertical: 24, 
    width: '100%' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  },
  detailsLabel: { 
    fontSize: 13, 
    color: '#64748b', 
    marginBottom: 4 
  },
  detailsText: { 
    fontSize: 15, 
    color: '#0f172a', 
    fontWeight: '500', 
    lineHeight: 22 
  },
  detailsRowSpaced: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16 
  },
  detailsRowLast: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16, 
    marginBottom: 8 
  },
  detailsCol: { 
    flex: 1, 
    paddingRight: 10 
  }
});

export default guideStyles;