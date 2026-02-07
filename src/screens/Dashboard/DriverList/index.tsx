// DriverList.tsx - With toggle for discontinue button visibility
import { getDrivers } from '@api/endpoints/driver.api';
import Icon from '@react-native-vector-icons/material-design-icons';
import { RootState } from '@store/index';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import TemporaryDashboardLayout from '../Layout/Layout';
import AddDriverModal from './components/AddDriverModal';
import DriverCard from './components/DriverCard';
import { styles } from './styles';

const DriverList = () => {
  const [driverData, setDriverData] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [discontinuingDriverId, setDiscontinuingDriverId] = useState<
    string | null
  >(null);
  const [showDiscontinueButtons, setShowDiscontinueButtons] =
    useState<boolean>(false);

  const vendorId = useSelector((state: RootState) => state?.auth?.token);

  // Fetch Drivers
  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!vendorId) return;
        isRefresh ? setRefreshing(true) : setLoading(true);
        const response = await getDrivers({ vendorid: vendorId });
        if (response?.status === '00') {
          const drivers = response?.data || [];
          setDriverData(drivers);
          setFilteredDrivers(drivers);
        }
      } catch (err) {
        console.log('Driver fetch error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [vendorId],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDrivers(driverData);
    } else {
      const filtered = driverData.filter(driver => {
        const details = driver?.DriverDetails;
        const searchLower = searchQuery.toLowerCase();
        return (
          details?.full_name?.toLowerCase().includes(searchLower) ||
          details?.Phone?.includes(searchQuery) ||
          details?.driving_license_no?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDrivers(filtered);
    }
  }, [searchQuery, driverData]);

  // Handle individual driver discontinuation
  const handleDiscontinue = (driverId: string) => {
    const driver = driverData.find(d => d.driver_id === driverId);
    const driverName = driver?.DriverDetails?.full_name || 'This driver';

    Alert.alert(
      'Discontinue Driver',
      `Are you sure you want to discontinue ${driverName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setDiscontinuingDriverId(null),
        },
        {
          text: 'Discontinue',
          style: 'destructive',
          onPress: () => confirmDiscontinue(driverId, driverName),
        },
      ],
    );
  };

  // Confirm and process discontinuation
  const confirmDiscontinue = async (driverId: string, driverName: string) => {
    try {
      setDiscontinuingDriverId(driverId);

      // const response = await discontinueDriver({
      //   driver_id: driverId,
      //   vendorid: vendorId
      // });

      // if (response?.status === '00') {
      // Update local state immediately for better UX
      //   setDriverData(prevData =>
      //     prevData.map(driver =>
      //       driver.driver_id === driverId
      //         ? { ...driver, is_discontinued: true }
      //         : driver
      //     )
      //   );

      //   setFilteredDrivers(prevData =>
      //     prevData.map(driver =>
      //       driver.driver_id === driverId
      //         ? { ...driver, is_discontinued: true }
      //         : driver
      //     )
      //   );

      //   Alert.alert('Success', `${driverName} has been discontinued.`);
      // } else {
      //   Alert.alert('Error', 'Failed to discontinue driver. Please try again.');
      // }
    } catch (error) {
      console.log('Discontinue error:', error);
      Alert.alert('Error', 'Failed to discontinue driver. Please try again.');
    } finally {
      setDiscontinuingDriverId(null);
    }
  };

  const onRefresh = () => {
    fetchData(true);
  };

  // Toggle discontinue button visibility
  const toggleDiscontinueMode = () => {
    setShowDiscontinueButtons(!showDiscontinueButtons);
  };

  return (
    <TemporaryDashboardLayout title="Driver List">
      <View style={styles.container}>
        {/* Header with Add Button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Registered Drivers</Text>
          <View style={styles.headerActions}>
            <Button
              mode="contained"
              onPress={() => setModalVisible(true)}
              style={styles.addButton}
              compact
            >
              Add Driver
            </Button>
            <Button
              mode="contained"
              onPress={toggleDiscontinueMode}
              style={[
                styles.addButton,
                styles.discontinueToggleButton,
                !showDiscontinueButtons
                  ? { backgroundColor: '#e74c3c' }
                  : { backgroundColor: '#13e91a' },
              ]}
              compact
            >
              {showDiscontinueButtons ? 'Cancel' : 'Discontinue'}
            </Button>
          </View>
        </View>

        {/* Discontinue Mode Instructions */}
        {showDiscontinueButtons && (
          <View style={styles.discontinueInstructions}>
            <Icon name="information" size={20} color="#f39c12" />
            <Text style={styles.instructionsText}>
              Click the Discontinue button on any driver card to remove them
              from active service.
            </Text>
          </View>
        )}

        {/* Search Field */}
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder={
              showDiscontinueButtons
                ? 'Search drivers to discontinue...'
                : 'Search by name, phone or license...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchQuery ? (
                <TextInput.Icon
                  icon="close"
                  onPress={() => setSearchQuery('')}
                />
              ) : null
            }
            outlineColor="#e0e0e0"
            activeOutlineColor="#3498db"
          />
        </View>

        {/* Search Results Info */}
        {searchQuery && (
          <View style={styles.searchInfo}>
            <Text style={styles.searchInfoText}>
              {filteredDrivers.length} driver
              {filteredDrivers.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading drivers...</Text>
          </View>
        ) : filteredDrivers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name={searchQuery ? 'magnify-close' : 'account-group'}
              size={64}
              color="#bdc3c7"
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No Drivers Found' : 'No Drivers'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first driver'}
            </Text>
            {!searchQuery && (
              <Button
                mode="contained"
                onPress={() => setModalVisible(true)}
                style={styles.emptyButton}
                icon="account-plus"
              >
                Add First Driver
              </Button>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredDrivers}
            keyExtractor={item => item.driver_id}
            renderItem={({ item }) => (
              <DriverCard
                item={item}
                onDiscontinue={handleDiscontinue}
                isDiscontinuing={discontinuingDriverId === item.driver_id}
                showDiscontinueButton={showDiscontinueButtons}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3498db']}
                tintColor="#3498db"
              />
            }
          />
        )}

        {/* Add Driver Modal */}
        <AddDriverModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onDriverAdded={() => fetchData()}
        />
      </View>
    </TemporaryDashboardLayout>
  );
};

export default DriverList;
