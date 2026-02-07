// DriverCard.tsx - With conditional discontinue button visibility
import Icon from '@react-native-vector-icons/material-design-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface DriverCardProps {
  item: any;
  onDiscontinue: (driverId: string) => void;
  isDiscontinuing?: boolean;
  showDiscontinueButton?: boolean;
}

const DriverCard = ({
  item,
  onDiscontinue,
  isDiscontinuing,
  showDiscontinueButton = false,
}: DriverCardProps) => {
  const details = item?.DriverDetails;
  const isDiscontinued = item?.is_discontinued || false;

  return (
    <View style={[styles.card, isDiscontinued && styles.discontinuedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.driverInfo}>
          <Icon
            name="account-circle"
            size={24}
            color={isDiscontinued ? '#95a5a6' : '#3498db'}
          />
          <View style={styles.nameContainer}>
            <Text
              style={[styles.name, isDiscontinued && styles.discontinuedText]}
              numberOfLines={1}
            >
              {details?.full_name || 'N/A'}
            </Text>
            <Text
              style={[styles.phone, isDiscontinued && styles.discontinuedText]}
            >
              {details?.Phone || 'No phone'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            isDiscontinued ? styles.discontinuedBadge : styles.activeBadge,
          ]}
        >
          <Icon
            name={isDiscontinued ? 'close-circle' : 'check-circle'}
            size={16}
            color={isDiscontinued ? '#e74c3c' : '#27ae60'}
          />
          <Text
            style={[
              styles.statusText,
              isDiscontinued
                ? styles.discontinuedStatusText
                : styles.activeStatusText,
            ]}
          >
            {isDiscontinued ? 'Discontinued' : 'Active'}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon
            name="card-account-details"
            size={16}
            color={isDiscontinued ? '#bdc3c7' : '#7f8c8d'}
          />
          <Text
            style={[
              styles.detailText,
              isDiscontinued && styles.discontinuedText,
            ]}
          >
            {details?.driving_license_no || 'No license'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon
            name="calendar"
            size={16}
            color={isDiscontinued ? '#bdc3c7' : '#7f8c8d'}
          />
          <Text
            style={[
              styles.detailText,
              isDiscontinued && styles.discontinuedText,
            ]}
          >
            Expires:{' '}
            {details?.expiry_date ? details.expiry_date.split('T')[0] : 'N/A'}
          </Text>
        </View>
      </View>

      {showDiscontinueButton && !isDiscontinued && (
        <TouchableOpacity
          style={styles.discontinueButton}
          onPress={() => onDiscontinue(item.driver_id)}
          disabled={isDiscontinuing}
        >
          <Icon name="close-circle" size={16} color="#e74c3c" />
          <Text style={styles.discontinueButtonText}>
            {isDiscontinuing ? 'Discontinuing...' : 'Discontinue'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discontinuedCard: {
    backgroundColor: '#f9f9f9',
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  phone: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  discontinuedText: {
    color: '#95a5a6',
    textDecorationLine: 'line-through',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#e8f6ef',
  },
  discontinuedBadge: {
    backgroundColor: '#fdedec',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  activeStatusText: {
    color: '#27ae60',
  },
  discontinuedStatusText: {
    color: '#e74c3c',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
    flex: 1,
  },
  discontinueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#fdedec',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5b7b1',
  },
  discontinueButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default DriverCard;
