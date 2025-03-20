import React, {useCallback, useEffect, useState} from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, ImageBackground} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon, Input } from '@rneui/themed';
import { BackgroundImage, color, Divider, fonts, Image } from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context'
import { updateAsset, deleteAsset, getAllAssetsFromView, getAllEmployees, getAllLocations} from '../database/db_queries';
import { useSQLiteContext, SQLiteDatabase } from 'expo-sqlite';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Picker from 'react-native-picker-select';
import { Modal } from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';
import {launchImageLibraryAsync, launchCameraAsync } from "expo-image-picker";
import { BrowserMultiFormatReader } from "@zxing/library"; 
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { useTranslation } from 'react-i18next';

const AssetDetailsScreen = ({

    id, 
    route 
    

}) => {

 
    const [selectedEmployee, setSelectedEmployee]= useState({id:'', name:'', email:'', avatarUrl:''});
    const [selectedLocation, setSelectedLocation]=useState({id:'', longitude:'', latitude:'', name:''});
    
    const [allEmployees, setAllEmployees] = useState([]);
    const [allLocations, setAllLocations] = useState([]);
    const navigation = useNavigation();
    const {asset}= route.params;
    const [isEditing, setEditing]= useState(false);
    const [modalVisible, setModalVisible]=useState(false);
    const { t } = useTranslation();
   
/*  
    const [newAsset, setNewAsset]=useState({name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
        oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:''
       });
       */
       const [newAsset, setNewAsset] = useState({

        id: asset.asset_id, 
        name: asset.asset_name,
        description: asset.asset_description,
        price: asset.asset_price,
        barcode: asset.asset_barcode,
        photoUrl: asset.asset_photo_url,
        creationDate: asset.asset_creation_date, 
        
      });
    
    let db; 
    db = useSQLiteContext();

    const [info, setInfo] = useState(asset ? {
      asset_id: asset.asset_id || '',
      asset_name: asset.asset_name || '',
      asset_description: asset.asset_description || '',
      asset_barcode: asset.asset_barcode || '',
      asset_price: asset.asset_price || '',
      asset_creation_date: asset.asset_creation_date || '',
      current_employee_name: asset.current_employee_name || '',
      current_location_name: asset.current_location_name || '',
      asset_photo_url: asset.asset_photo_url || '',
      
    } : {});
    
    const default_image= require('../assets/chair.jpg');
  
    const imageToShow = asset.asset_photo_url ? { uri: asset.asset_photo_url } : default_image;
   
    //console.log("Asset ID from route:", assetId);
    
    let employees=[]; 
    let locations=[]; 
    let updatedAsset = asset;

    
    const handleSave = () => {
     // console.log("enters handle save");
     // console.log(tempInfo);
      
      console.log(updatedAsset);
      
      updateAsset(db, updatedAsset);
      setEditing(false); 
      
    };
  
    const handleCancel = () => {
      tempInfo = info;
      setEditing(false);
    };
    
    const handleDelete = async () => {
      try {
        await deleteAsset(db, asset.asset_id);
        console.log("obrisano");
        
        navigation.goBack();
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    };
    const onEmployeeSelect = async (employeeId) => {
     
      const selected = allEmployees.find(emp => emp.id === employeeId);
     
      setSelectedEmployee(selected);  
      await setNewAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployee: selected, 
      }));
      await setNewAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployeeId: selected.id, 
      }));
      console.log("postavljeni id");
      console.log(newAsset.currentEmployeeId);
    };
    const onLocationSelect = async (locationId) => {
      const selected = allLocations.find(l => l.id === locationId);
      setSelectedLocation(selected); 
      await setNewAsset((prevAsset) => ({
        ...prevAsset,
        currentLocation: selected, 
      }));
      await setNewAsset((prevAsset) => ({
        ...prevAsset,
        currentLocationId: selected.id, 
      }));
    };

    const handleEditing=  ()=>{

      console.log("handleEditing");
      //await loadAssetElements();
      setEditing(true);
    }
    useEffect(() => {
      console.log("Modal visibility changed:", modalVisible);
    }, [modalVisible]);
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
      let options = {
        saveToPhotos: true,
        mediaType: 'photo',
        height: 1024,
        width: 768
    }
    const onEditClick= async ()=>{

      console.log("asset prije editovanja");
      console.log(asset);
      console.log("pocinje editovanje");
      console.log(newAsset);
      await setNewAsset((prevAsset)=> 
       ({

       ...prevAsset, 
     
      })
      );

      await updateAsset(db, newAsset);
      
      const assets = await getAllAssetsFromView(db);
      setModalVisible(false);
      console.log("svi asseti opet");
      console.log(assets);
    
      
    }
    const loadAssetElements= async ()=>{
      
          
          try {
            employees = await getAllEmployees(db); //ok je
            setAllEmployees(employees);  
            console.log("LOADED EMPLOYEES");
            console.log(employees);
           
          } catch (error) {
            console.error("Greška pri dobijanju zaposlenih:", error);
          }
          try {
            locations = await getAllLocations(db); //ok je
            setAllLocations(locations);
            console.log("LOADED LOCATIONS: ");
            console.log(locations);  
           
            
          } catch (error) {
            console.error("Error loading locations", error);
          }
         
          
     }
    
    useEffect(() => {
     console.log("use effect");
      
       loadAssetElements();
       
      }, []);
         
      return (
        <View style={styles.container}>
            <ScrollView>
               <Image style={styles.image} source={imageToShow} />

                <Text style={styles.asset_name}>{asset.asset_name}</Text>
                <View style={styles.details_container}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', margin: 10 }}>{t('asset_details.description')}</Text>
                    <Text style={styles.details_text}>{asset.asset_description}</Text>
                    <Divider style={{ backgroundColor: colors.secondary }} />
                    <View style={styles.icon_container}>
                        <Icon name="barcode-sharp" type="ionicon" size={20} iconStyle={{ color: 'white' }} />
                        <Text style={styles.value_container}>{asset.asset_barcode}</Text>
                    </View>
                    <Divider style={{ backgroundColor: colors.secondary }} />
                    <View style={styles.icon_container}>
                        <Icon name="calendar" type="ionicon" size={20} iconStyle={{ color: 'white' }} />
                        <Text style={styles.value_container}>{asset.asset_creation_date}</Text>
                    </View>
                    <Divider style={{ backgroundColor: colors.secondary }} />
                    <View style={styles.icon_container}>
                        <Icon name="cash" type="ionicon" size={20} iconStyle={{ color: 'white' }} />
                        <Text style={styles.value_container}>{asset.asset_price}</Text>
                    </View>
                    <Divider style={{ backgroundColor: colors.secondary }} />
                    <View style={styles.icon_container}>
                        <Icon name="person" type="ionicon" size={20} iconStyle={{ color: 'white' }} />
                        <Text style={styles.value_container}>{asset.current_employee_name}</Text>
                    </View>
                    <Divider style={{ backgroundColor: colors.secondary }} />
                    <View style={styles.icon_container}>
                        <Icon name="location" type="ionicon" size={20} iconStyle={{ color: 'white' }} />
                        <Text style={styles.value_container}>{asset.current_location_name}</Text>
                    </View>
                </View>
                <Pressable style={styles.edit_button} onPress={() => {console.log("click");setModalVisible(true)}}>
                <Icon name="create" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight: 'bold' }} />
                </Pressable>
                <Pressable style={styles.delete_button} onPress={handleDelete}>
                   <Icon name="trash" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight: 'bold' }} />
                </Pressable>
            </ScrollView>

            {/* Editing Modal */}
            <Modal animationType="slide" transparent={true}  visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                
                    <View style={styles.modal_content}>
                        <Text style={styles.modal_title}>{t('asset_details.edit')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Asset name..."
                            placeholderTextColor="white"
                            defaultValue={asset.asset_name}
                            onChangeText={(text) => setNewAsset((prev) => ({ ...prev, name: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Asset description..."
                            placeholderTextColor="white"
                            defaultValue={asset.asset_description}
                            onChangeText={(text) => setNewAsset((prev) => ({ ...prev, description: text }))}
                        />
                         
                        <TextInput
                            style={styles.input}
                            placeholder="Asset price..."
                            placeholderTextColor="white"
                            defaultValue={asset.asset_price ? String(asset.asset_price) : ""}
                            onChangeText={(text) => {
                                if (/^\d*\.?\d*$/.test(text)) {
                                    setNewAsset((prev) => ({ ...prev, price: text }));
                                }
                            }}
                        />
                        <View style={styles.barcode_container}>
                            <TextInput
                                style={[styles.input, { width: '100%', alignSelf: 'flex-start' }]}
                                placeholder="Asset barcode..."
                                placeholderTextColor="white"
                                defaultValue={asset.asset_barcode? String(asset.asset_barcode): ""}
                                onChangeText={(text) => setNewAsset((prev) => ({ ...prev, barcode: text }))}
                            />
                             <Pressable style={styles.add_barcode_button} onPress={openCamera}>
                                <Icon name="add" type="ionicon" size={18} iconStyle={{ color: 'black', fontWeight: 'bold' }} />
                            </Pressable>
                           
                        </View>
                        <ModalDropdown 
                            options={allEmployees.map(e => e.name)} style={styles.input}
                            defaultValue={asset.current_employee_name}
                            onSelect={(index) => 
                            { 
                              
                              onEmployeeSelect(allEmployees[index].id)
                            }}
                            textStyle={{ fontSize: 14, color: 'white' }}
                            dropdownTextStyle={{ fontSize: 14, color: 'black' }}
                          />

                        <ModalDropdown 
                            options={allLocations.map(e => e.name)} style={styles.input}
                            defaultValue={asset.current_location_name}
                            onSelect={(index) => onLocationSelect(allLocations[index].id)}
                            textStyle={{ fontSize: 14, color: 'white', alignSelf:'center', justifyContent:'center' }}
                            dropdownTextStyle={{ fontSize: 14, color: 'black'}}
                          />

                        <Image source={newAsset.photoUrl ? { uri: newAsset.photoUrl } : imageToShow} style={{ height: 100, width: 240, borderRadius: 10, margin: 10, alignSelf: 'flex-start' }} />
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center' }}>

                            <Pressable onPress={() => setModalVisible(false)}
                             styles={[styles.create_button, {backgroundColor:colors.light_primary}]}>
                                <Text style={styles.create_button_text}>{t('asset_details.cancel')}</Text>
                            </Pressable>
                            <Pressable style={styles.create_button} onPress={onEditClick}>
                                <Text style={styles.create_button_text}>{t('asset_details.edit')}</Text>
                            </Pressable>
                            <Pressable style={styles.add_photo_button} onPress={openGallery}>
                                <Icon name="add" type="ionicon" size={18} iconStyle={{ color: 'black', fontWeight: 'bold' }} />
                            </Pressable>
                        </View>
                    </View>
                    
            </Modal>

           
        </View>
    );
};

const styles = StyleSheet.create({

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
  barcode_container:{
    flexDirection: 'row', 
    alignSelf: 'flex-start'


  },
 add_barcode_button:{
    
    position: 'absolute',
    bottom: 10, 
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
 input: {
     width: '100%',
     height: 40,
     borderColor: 'gray',
     borderWidth: 1,
     borderRadius: 5,
     paddingHorizontal: 10,
     marginBottom: 10,
     color: 'white',
     justifyContent:'center'
     
     
   },
    
   create_button:{
 
     borderRadius: 10, 
     backgroundColor: colors.secondary,
     width: 80, 
     height: 35, 
     alignContent: 'flex-end',
     justifyContent: 'center', 
     marginTop: 10,
     marginLeft: 20
    
 
   }, 
   create_button_text: {
 
     color: 'white', 
     alignSelf: 'center', 
     fontSize: 16, 
    
     
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
    alignSelf:'center',
    marginBottom: 70
  },
  modal_title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
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
    container:{
        flex:1,
        backgroundColor: colors.primary,
    },
    image: {

        flexDirection: 'column',
        width: '100%',
        height: 160,
        justifyContent: 'flex-end'
    
    },
    asset_name:{
        
        color: colors.secondary, 
        fontSize: 24, 
        paddingBottom: 10, 
        paddingLeft: 10, 
        fontWeight:'bold',
        marginTop: 10
       
    },
    edit_button:{
    
        position: 'absolute',
        top: 165, 
        right: 60,  
        backgroundColor: colors.secondary, 
        borderRadius: 20, 
        padding: 10,
        height: 40, 
        width: 40, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 5, 
        paddingHorizontal: 5,

  },
  delete_button:{

        position: 'absolute',
        top: 165, 
        right: 10,  
        backgroundColor: colors.secondary, 
        borderRadius: 20, 
        padding: 10,
        height: 40, 
        width: 40, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 5, 
        paddingHorizontal: 5,


  },
  back_button:{

        position: 'absolute',
        top: 15, 
        left:3,  
        color: colors.secondary,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20, 
        padding: 10,
        height: 35, 
        width: 35, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 5, 
        paddingHorizontal: 5,
  },
  details_container:{

        flexDirection: 'column', 
        borderWidth: 1, 
        borderColor: colors.light_primary, 
        height: 'auto', 
        margin: 10, 
        borderRadius: 10, 
  }, 
  details_text:{
        color:'white', 
        fontSize:14, 
        margin: 10,
        marginTop: 0, 
        flexWrap:'wrap'


  }, 
 icon_container: {

        flexDirection: 'row',      
        
        alignItems: 'center',      
        padding: 10, 

  },
  icon_container_editing: {

        flexDirection: 'row',      
        
        alignItems: 'center',      
        paddingHorizontal: 10,
        maxHeight: 65,
       

  },
  value_container:{

    justifyContent:'flex-end', 
    color: 'white', 
    fontSize: 16, 
    paddingRight: 20,
    textAlign: 'right',
    width: '100%',
    height: 20,
    
  }, 
  input_container:{
    justifyContent:'flex-end', 
    color: 'white', 
    fontSize: 16, 
    paddingRight: 20,
    textAlign: 'right',
    width: '100%',
    height: 20,
  }
 

});
export default AssetDetailsScreen;