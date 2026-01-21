// components/MapTab.tsx
import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Truck from '@assets/map/Truck';
import Parcel from '@assets/map/parcel';

import { ENV } from '@config/env';
import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { RootState } from '@store/index';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';

type Coord = { latitude: number; longitude: number };

const isValid = (c?: Coord | null) =>
  !!c && typeof c.latitude === 'number' && typeof c.longitude === 'number';

const MapTab: FC = () => {
  const mapRef = useRef<MapView>(null);
  const { selectedTab } = useDashboard();

  const {
    liveDriverLocation,
    pickupLocation,
    destinationLocation,
    customerLocations,
  } = useSelector((state: RootState) => state.map);

  /** 🎯 Follow driver when trip started */
  useEffect(() => {
    if (
      (selectedTab === 'process' || selectedTab === 'active') &&
      isValid(liveDriverLocation)
    ) {
      mapRef.current?.animateCamera(
        {
          center: liveDriverLocation!,
          zoom: 17,
          heading: liveDriverLocation?.rotation || 0,
          pitch: 45,
        },
        { duration: 700 },
      );
    }
  }, [
    liveDriverLocation?.latitude,
    liveDriverLocation?.longitude,
    selectedTab,
  ]);

  /** 🧭 Route Renderer (ONLY ONE ROUTE) */
  const renderRoute = () => {
    if (!isValid(liveDriverLocation)) return null;

    if (selectedTab === 'process' && isValid(pickupLocation)) {
      return (
        <MapViewDirections
          origin={liveDriverLocation!}
          destination={pickupLocation!}
          apikey={ENV.MAP_API_KEY}
          strokeWidth={5}
          strokeColor="#FF9500"
          mode="DRIVING"
        />
      );
    }

    if (selectedTab === 'active' && isValid(destinationLocation)) {
      return (
        <MapViewDirections
          origin={liveDriverLocation!}
          destination={destinationLocation!}
          apikey={ENV.MAP_API_KEY}
          strokeWidth={6}
          strokeColor="#007AFF"
          mode="DRIVING"
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={INDIA_REGION}
        customMapStyle={MAP_STYLE}
        rotateEnabled
        pitchEnabled
        zoomControlEnabled
        maxZoomLevel={18}
      >
        {/* 🚚 DRIVER */}
        {isValid(liveDriverLocation) && (
          <Marker
            coordinate={liveDriverLocation!}
            rotation={liveDriverLocation?.rotation || 0}
            flat
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Truck width={50} height={50} />
          </Marker>
        )}

        {/* 📦 NEARBY LOADS (IDLE) */}
        {selectedTab === 'idle' &&
          customerLocations?.map(
            (c, i) =>
              isValid(c) && (
                <Marker key={`load-${i}`} coordinate={c}>
                  <Parcel width={30} height={30} />
                </Marker>
              ),
          )}

        {/* 📍 PICKUP */}
        {selectedTab !== 'idle' && isValid(pickupLocation) && (
          <Marker coordinate={pickupLocation!}>
            <OriginMarker size={36} />
          </Marker>
        )}

        {/* 🎯 DROP */}
        {selectedTab === 'active' && isValid(destinationLocation) && (
          <Marker coordinate={destinationLocation!}>
            <DropMarker size={36} />
          </Marker>
        )}

        {/* 🧭 ROUTE */}
        {renderRoute()}
      </MapView>
    </View>
  );
};

export default MapTab;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
