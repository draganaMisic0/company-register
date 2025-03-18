import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import colors from '../styles/colors';
import MapView, { Marker } from 'react-native-maps';
import { use } from 'react';
import { addLocation, getAllLocations } from '../database/db_queries';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { Modal } from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';

const Location = ({

}) => {

  let db; 
  db=db = useSQLiteContext();
  const navigation = useNavigation();
  const [locations, setLocations]=useState([]);
  const [modalVisible, setModalVisible]=useState(false);
  const [newLocationName, setNewLocationName]=useState(''); 
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

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
  const onSubmitButtonPress= async ()=>{

    const newLocation= {name: newLocationName, longitude:selectedCoordinates.longitude, latitude:selectedCoordinates.latitude};
    try {
          await addLocation(db, newLocation);
          await loadLocations(db);
          setModalVisible(false);
          setSelectedCoordinates(null);
          setNewLocationName('');
        } catch (error) {
          console.error("Error creating asset:", error);
        }
  }
  const onMarkerPress=(location)=>{

   console.log(location);
    navigation.navigate('Assets at Location', {location} );
  }
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate; 
    setSelectedCoordinates({ latitude, longitude }); 
    console.log('Clicked coordinates:', { latitude, longitude });
  };

  useFocusEffect(
  
      useCallback(() => {
        loadLocations(db);
      }, [db])
    );


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
        onPress={handleMapPress}

      >
        {locations.map((location)=>(
          
          <Marker key={location.id} coordinate={{latitude: location.latitude, longitude: location.longitude}}
                  title={location.name} onPress={()=> onMarkerPress(location)}/>
        ))}

        {/* Show a marker at the clicked location */}
      {selectedCoordinates && (
          <Marker
            coordinate={selectedCoordinates}
            title="Selected Location"
            pinColor="red" 
          />
        )}
       
      </MapView>

      <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}}
           onPress={()=>{
           if(selectedCoordinates!=null){
            setModalVisible(true);
            setNewLocationName("");
           }
           }}/>
      </Pressable>
      

      


      {/*Add location modal*/}

      <Modal animationType="slide" transparent={true} visible={modalVisible}
                        onRequestClose={() => {setModalVisible(false); } } >
                  
                  
                 
                    <View style={styles.modal_content}>
                      <Text style={styles.modal_title}>Create a new inventory list</Text>
                      <TextInput style={styles.input} placeholder="Location name..." placeholderTextColor={'white'} 
                                value={newLocationName} onChangeText={setNewLocationName}/>
                      <View style={{flexDirection: 'row', justifyContent:'flex-end'}}>
                      <Pressable style={styles.cancel_button}
                          onPress={()=> setModalVisible(false)} >
                        <Text style={styles.submit_button_text}>Cancel </Text>
                      </Pressable>
                      <Pressable style={styles.submit_button}
                       onPress={onSubmitButtonPress} >
                        <Text style={styles.submit_button_text}>Submit </Text>
                      </Pressable>
                      </View>
                    </View>
                 
        </Modal>
    </View>
  );
};


const styles = StyleSheet.create({

  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white', 
    
  },
  submit_button:{
  
      borderRadius: 10, 
      backgroundColor: colors.secondary,
      width: 100, 
      height: 35, 
      alignContent: 'flex-end',
      justifyContent: 'center', 
      marginTop: 10
     
  
    }, 
    cancel_button:{
  
      borderRadius: 10, 
      backgroundColor: colors.light_primary,
      width: 100, 
      height: 35, 
      alignContent: 'flex-end',
      justifyContent: 'center', 
      marginTop: 10
     
  
    }, 
    submit_button_text: {
  
      color: 'white', 
      alignSelf: 'center', 
      fontSize: 16, 
     
      
    }, 
  modal_container: {
      flex: 1,
      justifyContent: 'center',
       
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // dim background
    },
    modal_content: {
      width: '90%',
      backgroundColor: colors.light_primary,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      color:'white', 
      alignSelf:'center'
      
    },
    modal_title: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: 'white',
      alignSelf: 'flex-start'
    },
  add_button:{
      
      position: 'absolute',
      bottom: 40, 
      right: 20,  
      backgroundColor: colors.secondary, 
      borderRadius: 20, 
      padding: 10,
      height: 50, 
      width: 50, 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingVertical: 5, 
      paddingHorizontal: 5,
  
    },
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
  create_button:{
  
      borderRadius: 10, 
      backgroundColor: colors.secondary,
      width: 80, 
      height: 35, 
      alignContent: 'flex-end',
      justifyContent: 'center', 
      marginTop: 10
     
  
    }, 
});
export default Location;