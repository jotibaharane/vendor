import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  searchInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
  },
  searchInfoText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#7f8c8d',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  listContent: {
    padding: 16,
  },

  discontinueActions: {
    flexDirection: 'row',
    gap: 8,
  },

  discontinueButton: {
    borderColor: '#e74c3c',
  },

  cancelButton: {
    borderColor: '#95a5a6',
  },

  confirmDiscontinueButton: {
    backgroundColor: '#e74c3c',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  discontinueToggleButton: {
    // borderColor: '#e74c3c',
  },

  discontinueToggleButtonActive: {
    // backgroundColor: '#e74c3c',
  },

  discontinueInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4,
  },

  instructionsText: {
    marginLeft: 8,
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
});
