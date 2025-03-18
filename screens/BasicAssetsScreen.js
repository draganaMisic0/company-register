
import React, { Fragment, useState, useEffect, useCallback} from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, Modal, TextInput} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon, Avatar } from '@rneui/themed';
import { color, fonts, Image } from '@rneui/base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { getAllAssets, getLocationNameById, getAllEmployees, getAllLocations, getAllInventoryLists
  , addAsset, getAllAssetsFromView
} from '../database/db_queries'
import { Picker } from "@react-native-picker/picker";
import {launchImageLibraryAsync, launchCameraAsync } from "expo-image-picker";
import { BrowserMultiFormatReader } from "@zxing/library"; 
import jsQR from "jsqr";

export const AssetCard = ({
  
  asset_id, 
  asset_name='Unknown asset', 
  asset_description='No description', 
  asset_price='N/A', 
  current_employee_name='No assigned employee',
  current_location_name='No assigned location', 
  asset_photo_url,  
  asset_barcode, 
  asset_creation_date, 
  

} 
) => {

  const default_image= require('../assets/rb_3009.png');
  
  const imageToShow = asset_photo_url ? { uri: asset_photo_url } : default_image;

 
  return (

    <View style={styles.asset_container}>
        <View style={styles.asset_top_container}>
          <Image
          style={styles.image}
          resizeMode="stretch"
          source= {imageToShow}
        />
          <View style={styles.asset_right_container}>
             
             <Text style={styles.asset_name_text}>{asset_name}</Text>
             <Text style={styles.asset_description_text}>{asset_description}</Text>
          </View>
        </View>
        <View style={styles.asset_down_container}>
          <View style={styles.asset_left_down_container}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Icon name="person" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                 <Text style={styles.asset_employee_text}>{current_employee_name}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                 <Text style={styles.asset_location_text}>{current_location_name}</Text>
              </View>
              
          </View>
          <Text style={styles.asset_price}>{asset_price}</Text>
        </View>
        
      </View>

  );
}

const BasicAssetsScreen = () => {

  let db;
  db = useSQLiteContext();
  const navigation = useNavigation();
  const [loadedAssets, setLoadedAssets]= useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [asset, setAsset]= useState(false);
  const [newAsset, setNewAsset]=useState({name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
    oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:''
   });
  const [selectedEmployee, setSelectedEmployee]= useState({id:'', name:'', email:'', avatarUrl:''});
  const [selectedLocation, setSelectedLocation]=useState({id:'', longitude:'', latitude:'', name:''});
  const [selectedInventoryList, setSelectedInventoryList]=useState({id:'', name:''});
  const [allEmployees, setAllEmployees] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allInventoryLists, setAllInventoryLists] =useState([]);
  const [photoOptionsVisible, setPhotoOptionsVisible]=useState(false);
  const onPress = (assetId) => {
    //console.log("Card clicked!", assetId);
    navigation.navigate('Asset Details' , {assetId: assetId} );
    // You could navigate to a detail screen here, for example
  };
  const loadAssets = async (db) => {
  try {
    const assets = await getAllAssetsFromView(db);
    console.log(assets);
    //console.log(assets.length);
    //console.log(assets);
   /* const updatedAssets = await Promise.all(assets.map(async (asset) => {
      const locationName = await getLocationNameById(db, asset.current_location_id);
      return { ...asset, current_location_name: locationName };
    }));*/
    
    setLoadedAssets(assets);
  } catch (error) {
    console.error('Error loading assets:', error);
  }
};
  const handleAddAsset=()=>{


  }
  const loadAssetElements= async ()=>{

    
    try {
      const employees = await getAllEmployees(db); 
      setAllEmployees(employees);  
     
    } catch (error) {
      console.error("Greška pri dobijanju zaposlenih:", error);
    }
    try {
      const locations = await getAllLocations(db); 
      setAllLocations(locations);  
      
    } catch (error) {
      console.error("Error loading locations", error);
    }
   
    
  }
  const onEmployeeSelect = (employeeId) => {
    const selected = allEmployees.find(emp => emp.id === employeeId);
    setSelectedEmployee(selected);  
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      currentEmployee: selected, 
    }));
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      currentEmployeeId: selected.id, 
    }));
  };
  const onLocationSelect = (locationId) => {
    const selected = allLocations.find(l => l.id === locationId);
    setSelectedLocation(selected); 
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      currentLocation: selected, 
    }));
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      currentLocationId: selected.id, 
    }));
  };
  const onInventoryListSelect = (listId) => {
    const selected = allInventoryLists.find(list => list.id === listId);
    setSelectedInventoryList(selected);  
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      inventoryList: selectedInventoryList,  
    }));
    setNewAsset((prevAsset) => ({
      ...prevAsset,
      inventoryListId: selected.id,  
    }));
  };
  let options = {
    saveToPhotos: true,
    mediaType: 'photo',
    height: 1024,
    width: 768
}
  const openGallery = async () => {
      const result = await launchImageLibraryAsync(options);
      const resultUri = result.assets[0].uri;
      console.log("RESULT URI");
      console.log(resultUri);
      setNewAsset((prevPhoto) => ({ ...prevPhoto, photoUrl: resultUri }));
      
  }
 
  const openCamera = async () => {
    try {
      let result = await launchCameraAsync({ allowsEditing: true, quality: 1 });
  
      if (!result.canceled) {
        const resultPhotoUri = result.assets[0].uri;
        const barcodeData = await extractBarcode(resultPhotoUri);
  
        setNewAsset((prevAsset) => ({
          ...prevAsset,
          barcode: barcodeData || "No barcode detected",
        }));
        setPhotoOptionsVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const extractBarcode = async (imageUri) => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeFromImageUrl(imageUri);
      return result?.text || null;  // Extracted barcode number
    } catch (error) {
      console.error("Barcode extraction failed:", error);
      return null;
    }
  };
  
  const createAsset= async()=>{

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); 
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;
    if(newAsset.photoUrl==null){
      setNewAsset((prevPhoto) => ({ ...prevPhoto, photoUrl: '../assets/rb_3009.png' }));
    }
    const assetToCreate = {
      ...newAsset, 
     
      creationDate: formattedDate,
      oldEmployee: newAsset.currentEmployee,
      oldLocation: newAsset.currentLocation,
    };
    console.log(assetToCreate);
    try {
      await addAsset(db, assetToCreate);
      await loadAssets(db);
      setModalVisible(false);
    } catch (error) {
      console.error("Error creating asset:", error);
    }


  }

  const importBarcode=()=>{

    setPhotoOptionsVisible(true);
  }
  useFocusEffect(

    useCallback(() => {
      loadAssets(db);
      loadAssetElements();
    }, [db])
  );


  useEffect(() => {
 console.log("use effect");
   loadAssets(db);
   loadAssetElements();
   
  }, [db]);
  return (

      <View style={styles.container}>
        <ScrollView style={styles.scroll_view}>
    
        {
          loadedAssets.map((asset, index) => (
        <Pressable
          onPress={() => navigation.navigate('Asset Details', { asset })}
           key={asset.id || index}


          >
          <AssetCard {...asset} />
        </Pressable>

      ))
        }
          
        </ScrollView>   
        <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}}
           onPress={()=>{
            setNewAsset({name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
            oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:''
            });
            setModalVisible(true);
            }}/>
        </Pressable>
        



        {/*Adding asset modal*/}
        <Modal animationType="slide" transparent={true} visible={modalVisible} 
                  onRequestClose={() => {setModalVisible(false); } } >
            
            
          <View style={styles.modal_container}>
              <View style={styles.modal_content}>
                <Text style={styles.modal_title}>Create a new asset</Text>
                
                {/* 
                <Avatar activeOpacity={0.2} avatarStyle={{}} containerStyle={{ backgroundColor: colors.primary, margin: 10}}
                        icon={{}} iconStyle={{}} imageProps={{}} onLongPress={() => alert("onLongPress")}
                        onPress={{}} overlayContainerStyle={{}} placeholderStyle={{}}
                        rounded size='large' titleStyle={{color: colors.secondary}}/> */}
                
                <TextInput style={styles.input} placeholder="Asset name..." placeholderTextColor={'white'} 
                          value={newAsset.name} onChangeText={(text) =>
                                              setNewAsset((prevAsset) => ({ ...prevAsset, name: text }))
                }/>
                <TextInput style={styles.input} placeholder="Asset description..." placeholderTextColor={'white'} 
                          value={newAsset.description} keyboardType="decimal-pad" onChangeText={(text) =>
                                              setNewAsset((prevDesc) => ({ ...prevDesc, description: text }))
                }/>
                <TextInput style={styles.input} placeholder="Asset price..." placeholderTextColor={'white'} 
                          value={newAsset.price} onChangeText={(text) =>{
                            if (/^\d*\.?\d*$/.test(text)){
                                              setNewAsset((prevPrice) => ({ ...prevPrice, price: text }))}
                          }}/>
                <View style={styles.barcode_container}>
                <TextInput style={[styles.input, style={width: '100%', alignSelf:'flex-start'}]}
                           placeholder="Asset barcode..." placeholderTextColor={'white'} 
                          value={newAsset.barcode} keyboardType="decimal-pad" onChangeText={(text) =>
                                              setNewAsset((prevBarcode) => ({ ...prevBarcode, barcode: text }))
                }/>
                <Pressable style={styles.add_barcode_button}>
                      <Icon name="add" type="ionicon" size={18} iconStyle={{ color: 'black', fontWeight:'bold'}}
                       onPress={openCamera}/>
                </Pressable>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={newAsset.currentEmployeeId || ""} onValueChange={onEmployeeSelect}
                    mode="dropdown" style={styles.picker}>
                  
                    {allEmployees.map((employee) => (
                    
                    <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
                       ))}
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={newAsset.currentLocationId || ""} onValueChange={onLocationSelect}
                    mode="dropdown" style={styles.picker}>
                  
                    {allLocations.map((location) => (
                    
                    <Picker.Item key={location.id} label={location.name} value={location.id} />
                       ))}
                  </Picker>
                </View>
                {/* 
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={newAsset.inventoryListId || ""} onValueChange={onInventoryListSelect}
                    mode="dropdown" style={[styles.picker, { fontSize: 12 }]}>
                  
                    {allInventoryLists.map((list) => (
                    
                    <Picker.Item key={list.id} label={list.name} value={list.id} />
                       ))}
                  </Picker>
                </View>
                */}
                <Image source={newAsset.photoUrl ? { uri: newAsset.photoUrl } : require("../assets/images (1).png")}
                                style={{height:100, width:240, borderRadius:10, margin:10, alignSelf:'flex-start'}}></Image>
                <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                  <Pressable style={{marginRight: 15,}}>
                      <Text onPress={()=> setModalVisible(false)}
                      style={styles.create_button_text}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.create_button}
                     onPress={createAsset} >
                    <Text style={styles.create_button_text}>Create</Text>
                   </Pressable>
                   <Pressable style={styles.add_photo_button}>
                      <Icon name="add" type="ionicon" size={18} iconStyle={{ color: 'black', fontWeight:'bold'}}
                       onPress={openGallery}/>
                   </Pressable>
                </View>

              </View>
          </View>
        </Modal>

        
        
      
      </View>
        
         
  );
};


const styles = StyleSheet.create({

  modal_photo_container: {
    flex: 1,
    justifyContent: 'center',
     
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // dim background
  },
  modal_photo_content: {
      width: '90%',
      backgroundColor: colors.light_primary,
      padding: 20,
      borderRadius: 10,
      alignItems: 'right',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      color:'white', 
      
  },
  modal_photo_title:{
    fontSize: 18,
    marginBottom: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start'
  },
  barcode_container:{
    flexDirection: 'row', 
    alignSelf: 'flex-start'


  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
    width: "100%", 
    fontSize: 10, 
    justifyContent: 'center'
  },
  picker: {
    width: "100%",
    height: 40,
    color: "white",
    fontSize: 12
  },
  selectedItemText: {
    
    fontSize: 16, 
    color: 'white', 
  },
  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
    
    
 
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
  add_photo_button:{
    
    position: 'absolute',
    bottom: 120, 
    right: 10,  
    backgroundColor: colors.secondary, 
    borderRadius: 20, 
    padding: 10,
    height: 30, 
    width: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,

  },
  add_barcode_button:{
    
    position: 'absolute',
    bottom: 11, 
    right: 0,  
    backgroundColor: colors.secondary, 
    borderRadius: 10, 
    padding: 10,
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,

  },
  filter_button:{

    position: 'absolute',
    bottom: 20, 
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
 
  container:{
    flex: 1, 
  },
  image: {

    width: 100,
    height: 110,
    marginRight: 0, 
    borderBottomRightRadius: 15, 
    
  },
  asset_container: {

    flexDirection:'column', 
    alignItems: 'flex-start',
    minHeight: 180, 
    backgroundColor: colors.light_primary,
    borderRadius: 10, 
     
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'grey',
    overflow: 'hidden',
    marginLeft: 10, 
    marginRight: 10, 
    marginTop: 20, 

  },
  asset_top_container:{

    flexDirection: 'row',
    
    
   
  }, 
  asset_name_text: {

    fontSize: 18, 
    flexWrap: 'wrap',
    color: 'white',
    flexWrap: 'wrap',
    fontWeight:'bold'

  },
  
  asset_right_container:{

    
    color: 'white', 
    paddingLeft: 10, 
    justifyContent: 'space-between', 
    
  },
  asset_description_text:{

    color: 'white',
    paddingTop:1, 
    flexWrap: 'wrap',
    overflow: 'hidden',
    color: 'white',
    flex: 1, 


  }, 
  asset_location_text:{

    color: 'white',
    paddingLeft: 4, 
  }, 
  asset_employee_text:{

    color:'white',
    paddingLeft: 4, 
  }, 
  asset_down_container: {

    marginBottom: 0, 
    marginLeft: 2, 
    paddingTop: 5, 
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 3, 

   
  },
  asset_left_down_container:{
      
    paddingRight: 50, 
    width: '70%',
    marginTop: 20
  }, 
  asset_price:{

    marginLeft: 'auto', 
    paddingRight: 10,
    fontSize: 24, 
    color: 'white', 
    marginBottom: 2, 
    position: 'absolute', 
    bottom: 3,
    right: 0, 
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
    
  },
  modal_title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start'
  },
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
   
  create_button:{

    borderRadius: 10, 
    backgroundColor: colors.secondary,
    width: 80, 
    height: 35, 
    alignContent: 'flex-end',
    justifyContent: 'center', 
    marginTop: 10
   

  }, 
  create_button_text: {

    color: 'white', 
    alignSelf: 'center', 
    fontSize: 16, 
   
    
  }, 


});


export default BasicAssetsScreen;

