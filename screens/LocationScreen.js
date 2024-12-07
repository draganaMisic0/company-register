import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import MapView, { Marker } from 'react-native-maps';
import { use } from 'react';
import { getAllLocations } from '../database/db_queries';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

const Location = ({

}) => {

  let db; 
  db=db = useSQLiteContext();
  const navigation = useNavigation();
  const [locations, setLocations]=useState([]);

  const loadLocations = async (db)=>{

    try{
      setLocations(await getAllLocations(db));
    }
    catch(error){
      console.log(error);
    }
  } 
  useEffect(() => {
    loadLocations(db);

  }, [db]);

  const onMarkerPress=()=>{

    navigation.navigate('Assets at Location' );
  }
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
        {locations.map((location)=>(
          <Marker key={location.id} coordinate={{latitude: location.latitude, longitude: location.longitude}}
                  title={location.name} onPress={onMarkerPress}/>
        ))}
       
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