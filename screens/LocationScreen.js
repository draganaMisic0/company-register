import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import MapView, { Marker } from 'react-native-maps';

const Location = () => {

  return (
    <View style={styles.container}>
        <MapView
        style={styles.map}
        initialRegion={{
          latitude: 0, 
          longitude: 0, 
          latitudeDelta: 180, 
          longitudeDelta: 360, 
        }}

      >
        <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} title="San Francisco" />
      </MapView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Change color here
  },
  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
    
    
 
  },
  map: {
    flex: 1,
  },
});
export default Location;