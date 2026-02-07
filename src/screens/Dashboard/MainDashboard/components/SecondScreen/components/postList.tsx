import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Card,
  Chip,
  Searchbar,
  Text,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { useGetPostsListMutation } from '@api/hooks_api';
import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { emitDriverSelect } from '@socket/socket.emitters';
import { RootState } from '@store/index';
import {
  setDriverAndPickupLocations,
  setDriverPickupAndDestinationLocations,
  setLiveDriverLocation,
} from '@store/slices/mapSlice';

/* -------------------- CONSTANTS -------------------- */

const STATUS_OPTIONS = [
  'All',
  'Pending',
  'Progress',
  'Reached',
  'Loading',
  'Loaded',
] as const;

/* -------------------- TYPES -------------------- */

interface DriverItem {
  LoadPostID: string;
  CustomerID: string;

  PickupContactPerson: string;
  PickupCompanyName: string;
  PickupContactNumber: string;
  PickupPlotBuilding: string;
  PickupStreetArea: string;
  PickupAddress: string;

  DeliveryContactPerson: string;
  DeliveryCompanyName: string;
  DeliveryContactNumber: string;
  DeliveryPlotBuilding: string;
  DeliveryStreetArea: string;
  DeliveryAddress: string;

  VehicleType: string;
  Weight: string;
  Approximate_weight: number;
  cargo_type: string;
  BodyType: string;

  CargoContent: string;
  CargoPackageType: string;

  ExpectedAvailableTime: string;
  ScheduleDate: string | null;
  ScheduleTime: string | null;

  isVolumetric: boolean;
  DhalaLength: number | null;

  cost: number;
  master_status: 'Y' | 'N';
  verification_code: string;
  verify_flag: 'Y' | 'N';

  LoadPost_InsertDate: string;
  LoadPost_UpdateDate: string;

  PickupCity: string;
  PickupDistrict: string;
  PickupTaluka: string;
  PickupState: string;
  PickupPincode: string;
  PickupLat: number;
  PickupLng: number;

  DeliveryCity: string;
  DeliveryDistrict: string;
  DeliveryTaluka: string;
  DeliveryState: string;
  DeliveryPincode: string;
  DeliveryLat: number;
  DeliveryLng: number;

  CustomerPostID: string;
  VendorID: string | null;
  DriverID: string;

  CustomerStatus: string;
  VendorStatus: string | null;
  DriverStatus: string;
  LP_Status: string;

  VehicleID: string;
  MobileNo: string;

  Lat: number;
  Lng: number;
  Speed: number;
  Direction: string;

  City: string;
  State: string;
  LastUpdated: string;

  Driver_LPStatus: string;
  full_name: string;

  address1: string;
  address2: string;
  driving_license_address: string;
}

/* -------------------- UTILS -------------------- */

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Progress':
      return '#2196F3';
    case 'Pending':
      return '#FF9800';
    case 'Loaded':
      return '#4CAF50';
    case 'Reached':
      return '#673AB7';
    case 'Loading':
      return '#009688';
    default:
      return '#9E9E9E';
  }
};

/* -------------------- COMPONENT -------------------- */

const PostListModal: React.FC = () => {
  const vendorId = useSelector((state: RootState) => state.auth?.token);
  const dispatch = useDispatch();
  const {
    idleModalVisible,
    setIdleModalVisible,
    selectedTab,
    handleTabChange,
  } = useDashboard();

  const [getPosts, { data, isLoading }] = useGetPostsListMutation();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>('All');

  /* -------------------- FETCH -------------------- */

  const fetchData = useCallback(() => {
    if (!vendorId) return;

    getPosts({
      VendorID: vendorId,
      LPStatus: selectedStatus === 'All' ? undefined : selectedStatus,
      pageNumber: 1,
      pageSize: 20,
      Search: search,
      DriverID: '',
    });
  }, [vendorId, selectedStatus, search, getPosts]);

  useEffect(() => {
    if (idleModalVisible) {
      fetchData();
    }
  }, [idleModalVisible, selectedStatus, search]);

  /* -------------------- HANDLERS -------------------- */

  const handleDriverPress = (item: DriverItem) => {
    if (item?.Driver_LPStatus === 'Pending') {
      handleTabChange('idle');
      dispatch(
        setLiveDriverLocation({
          latitude: item.Lat || 0,
          longitude: item.Lng || 0,
          rotation: 0,
        }),
      );
    } else if (item?.Driver_LPStatus === 'Progress') {
      handleTabChange('process');
      dispatch(
        setDriverAndPickupLocations({
          driver: {
            latitude: item?.Lat,
            longitude: item?.Lng,
            rotation: 0,
          },
          pickup: {
            latitude: item?.PickupLat,
            longitude: item?.PickupLng,
            rotation: 0,
          },
        }),
      );
    } else {
      handleTabChange('active');
      dispatch(
        setDriverPickupAndDestinationLocations({
          driver: {
            latitude: item?.Lat,
            longitude: item?.Lng,
            rotation: 0,
          },
          destination: {
            latitude: item?.DeliveryLat,
            longitude: item?.DeliveryLng,
            rotation: 0,
          },
          pickup: {
            latitude: item?.PickupLat,
            longitude: item?.PickupLng,
            rotation: 0,
          },
        }),
      );
    }

    emitDriverSelect({
      DriverID: item.DriverID,
      VendorID: item.VendorID || '',
      LPStatus: item.Driver_LPStatus || '',
      lat: item.Lat,
      lng: item.Lng,
    });

    setIdleModalVisible(false);
  };

  /* -------------------- RENDER -------------------- */

  const renderDriver = ({ item }: { item: DriverItem }) => (
    <TouchableOpacity onPress={() => handleDriverPress(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.name}>{item.full_name || 'Unknown'}</Text>
            <Chip
              style={[{ backgroundColor: getStatusColor(item.LP_Status) }]}
              textStyle={{ color: '#fff' }}
            >
              {item.LP_Status}
            </Chip>
          </View>

          <Text style={styles.sub}>
            🆔 {item.DriverID} • 🚛 {item.VehicleID || '--'}
          </Text>
          <Text style={styles.sub}>
            📍 {item.Lat?.toFixed(4)}, {item.Lng?.toFixed(4)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  /* -------------------- JSX -------------------- */

  return (
    <Modal visible={idleModalVisible} animationType="slide">
      <Appbar.Header>
        <Appbar.BackAction onPress={() => setIdleModalVisible(false)} />
        <Appbar.Content title="Drivers" />
      </Appbar.Header>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search driver / vehicle"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <View style={styles.body}>
          {/* LEFT STATUS MENU */}
          <View style={styles.leftMenu}>
            {STATUS_OPTIONS.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusBtn,
                  selectedStatus === status && styles.statusActive,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.statusText,
                    selectedStatus === status && styles.statusTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* RIGHT LIST */}
          <View style={styles.rightList}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={data?.data ?? []}
                renderItem={renderDriver}
                keyExtractor={item => item.DriverID}
                ListEmptyComponent={
                  <Text style={styles.empty}>No drivers found</Text>
                }
                refreshing={isLoading}
                onRefresh={fetchData}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PostListModal;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  search: { margin: 12 },

  body: { flex: 1, flexDirection: 'row' },

  /* LEFT */
  leftMenu: {
    width: 110,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#eee',
  },

  statusBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  statusActive: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2874F0',
  },

  statusText: { color: '#555' },
  statusTextActive: { color: '#2874F0', fontWeight: 'bold' },

  /* RIGHT */
  rightList: {
    flex: 1,
    padding: 12,
  },

  card: {
    marginBottom: 10,
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: { fontSize: 16, fontWeight: 'bold' },
  sub: { color: '#555', marginTop: 4 },

  chip: { height: 24 },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
});
