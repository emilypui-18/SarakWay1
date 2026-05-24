import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const adminStyles = StyleSheet.create({

  // ## Dashboard Page Styles
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  menuButton: {
    padding: 5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  mainContent: {
    flex: 1,
    padding: 20
  },
  pageHeader: {
    marginBottom: 20
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 10
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 5
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  viewAllText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc'
  },
  listIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  listTextContainer: {
    flex: 1
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2
  },
  listSubtitle: {
    fontSize: 12,
    color: '#64748b'
  },

  // ## Sidebar Styles
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
    backgroundColor: '#0f172a', 
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
    borderBottomColor: '#334155' 
  },
  sidebarLogo: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#fff' 
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc' 
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  
  /* --- MENU STYLES --- */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5
  },
  menuItemActive: {
    backgroundColor: '#059669' 
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
    borderTopColor: '#334155', 
    marginBottom: 20
  },
  signOutText: {
    fontSize: 16,
    color: '#f87171', 
    marginLeft: 15,
    fontWeight: '600'
  },

  /* --- UNIVERSAL INPUT STYLES --- */
  filterBar: {
    flexDirection: 'row',
    gap: 10
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
    height: 48,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0f172a',
    height: '100%'
  },
  searchIcon: {
    marginRight: 5
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignSelf: 'center' 
  },
  dropdownText: {
    fontSize: 13,
    color: '#475569',
    marginRight: 8
  },

  // ## Alerts Page Styles
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 8,
    gap: 8
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 4
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaIcon: {
    marginRight: 6
  },
  metaText: {
    fontSize: 13,
    color: '#64748b'
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  statusDropdownText: {
    fontSize: 13,
    color: '#475569',
    marginRight: 8
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc'
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a'
  },
  detailsLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 16
  },
  detailsText: {
    fontSize: 15,
    color: '#0f172a',
    lineHeight: 22
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  detailsCol: {
    flex: 1,
    paddingRight: 10
  },

  // ## Park Guides Page Styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed'
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500'
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  guideStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  guideStatItem: {
    alignItems: 'center'
  },
  guideStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  guideStatLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4
  },

  // ## Certifications Page & Modal Styles
  primaryButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8
  },
  certCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  certHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  certName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  certEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8
  },
  certCourse: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 15
  },
  certDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15
  },
  certDetailCol: {
    alignItems: 'center'
  },
  certDetailLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4
  },
  certDetailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  certActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15
  },
  statusDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  statusText: {
    fontSize: 14,
    color: '#0f172a',
    marginRight: 8
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1000,
    width: 120
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#0f172a'
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 6
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  inputGroup: {
    marginBottom: 15
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc'
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfInput: {
    width: '48%'
  },

  // ## Notifications Page Styles
  notificationEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 80
  },
  notificationEmptyText: {
    marginTop: 15,
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center'
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  notiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8
  },
  notiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  notiBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  notiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  notiBadgeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500'
  },
  notiMessage: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12
  },
  notiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12
  },
  notiMetaText: {
    fontSize: 13,
    color: '#64748b'
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  formDropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  formDropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  // ## Profile Page Styles
  profileHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  profileAvatarLg: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 15
  },
  profileNameLg: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5
  },
  profileRole: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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

  // --- Profile Edit Modal Styles ---
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
    color: '#0f172a',
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
    borderColor: '#e2e8f0', 
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc' 
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
    backgroundColor: '#059669', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff'
  },

  // =========================================================
  // --- Alerts Page Specific Utilities ---
  // =========================================================
  alertsPageHeaderRow: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  createAlertBtn: {
    marginBottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  createAlertBtnText: {
    fontSize: 14
  },
  statsScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15
  },
  statCardHorizontal: {
    width: 140,
    marginBottom: 0
  },
  alertsListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  metaTextRight: {
    marginLeft: 'auto'
  },
  actionDropdownMenu: {
    top: 40,
    bottom: 'auto',
    right: 0,
    left: 'auto',
    width: 130,
    paddingVertical: 4
  },
  formGroupZ100: { zIndex: 100, elevation: 100 },
  formGroupZ90: { zIndex: 90, elevation: 90 },
  formGroupZ1: { zIndex: 1 },
  
  formDropdownMenuCreate: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10
  },
  
  textAreaInputLarge: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 1
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500'
  },
  detailsModalExpanded: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: '100%'
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
  badgeStatic: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  badgeTextStatic: {
    color: '#475569'
  },

  // --- Dual Button Row Utilities ---
  dualButtonRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  flex1Btn: {
    flex: 1,
    marginBottom: 20
  },
  toggleBtnBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1
  },
  toggleBtnInactive: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0'
  },
  toggleBtnActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a'
  },
  toggleBtnTextBase: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8
  },
  toggleBtnTextInactive: {
    color: '#475569'
  },
  toggleBtnTextActive: {
    color: '#fff'
  },

  // =========================================================
  // ## Course Editor Styles
  // =========================================================
  courseBanner: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  bannerDesc: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12
  },
  badgeRow: {
    flexDirection: 'row'
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 15,
    marginBottom: 15
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  moduleDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 20
  },
  sectionSubHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 5
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  lessonTitle: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600'
  },
  quizContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },
  quizHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 10
  },
  quizTitle: {
    fontSize: 15,
    color: '#b45309',
    fontWeight: 'bold'
  },
  questionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 3,
    borderLeftColor: '#d97706'
  },
  questionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 4
  },
  questionAnswer: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600'
  },
  moduleActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0'
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6
  },
  ghostBtnText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6
  },
  editorEmptyStateText: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic'
  },
  addModuleBtn: {
    marginBottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  bottomSpacer: {
    height: 60
  },

  // =========================================================
  // ## Courses Page Styles
  // =========================================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0f172a'
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden'
  },
  courseCardContent: {
    padding: 16
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: '#334155',
    position: 'relative'
  },
  badge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute', 
    top: 12,
    left: 12,
    zIndex: 2
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#06241b'
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
    borderColor: '#e2e8f0',
    backgroundColor: '#fee2e2'
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444'
  },
  headerSpacer: {
    width: 24
  },
  coursesEmptyState: {
    marginTop: 20
  },
  courseStatusContainer: {
    alignItems: 'flex-end'
  },
  courseStatusTextBase: {
    fontWeight: 'bold',
    fontSize: 12
  },
  statusPublished: {
    color: '#059669'
  },
  statusDraft: {
    color: '#d97706'
  },
  mandatoryBadgeText: {
    color: '#dc2626',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold'
  },
  bottomSpacer40: {
    height: 40
  },
  
  // FIX: Allowing forms to automatically shrink-wrap their content!
  modalContentFixed: {
    maxHeight: '90%'
  },
  textAreaCompact: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: 10
  },
  checkboxRowSpaced: {
    marginTop: 5,
    marginBottom: 10
  },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  th: { fontSize: 12, fontWeight: 'bold', color: '#64748b', flex: 1 },
  guideRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  guideName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  guideSub: { fontSize: 12, color: '#64748b' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f1f5f9' },
  riskText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  goodText: { color: '#059669', fontSize: 12, fontWeight: 'bold' },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 20 },
});

export default adminStyles;