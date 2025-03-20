import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import colors from '../styles/colors';
import {color, Image } from '@rneui/base';
import { ButtonGroup, Icon} from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { addListAssetPair, getAllAssets, getAllAssetsDetails, getAllAssetsFromView, getAllEmployees, getAllInventoryListItemsById, getAllListAssetPairs, getAllLocations, getAssetById, getAssetsByLocationId, removeItemFromList } from '../database/db_queries';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Modal } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";

import { launchCameraAsync } from "expo-image-picker";
import { BrowserMultiFormatReader } from "@zxing/library"; 
import ModalDropdown from 'react-native-modal-dropdown';

const ItemCard = ({

  id,
  list_id, 
  asset_id,  
  image, 
  asset_name='Unknown name', 
  asset_description='No description', 
  asset_price='N/A', 
  old_employee_name='Old employee', 
  new_employee_name='New employee', 
  old_location_name='Old location', 
  new_location_name='New location',
  setLoadedInventoryItems, 
  asset_photo_url

}) => {
  //console.log('Props received in ItemCard:', { image, name, description, price });
  const default_image= require('../assets/rb_3009.png');
  const imageToShow = asset_photo_url ? { uri: asset_photo_url } : default_image;
  let db; 
  db=useSQLiteContext();
 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const loadInventoryItems= async (db) => {
      
    try {
      console.log("list id "+list_id);
      
      
      const tempInventory=await getAllInventoryListItemsById(db, list_id);
      setLoadedInventoryItems(tempInventory);
      
       
      console.log("clanovi liste");
    
     
    } catch (error) {
      console.error('Error loading inventory lists:', error);
    }
};
  const handleRemoveItem= async ()=>{

    console.log("pokusaj brisanja");
    console.log(id);
    console.log(list_id);
    console.log(asset_id);
    await removeItemFromList(db, id);
    console.log("zavrsi brisanje");
    loadInventoryItems(db);

  };
  return (
   
    <View style={styles.item_container}>
      <View style={styles.item_top_container}>
          <Image
          style={styles.image}
          resizeMode="stretch"
          source= {imageToShow}
        />
          <View style={styles.item_right_container}>
             
             <Text style={styles.item_name_text}>{asset_name}</Text>
             <Text style={styles.item_description_text}>{asset_description}</Text>
             <Text style={styles.item_price}>{asset_price}</Text>
          </View>
        </View>

        <View style={styles.item_bottom_container}>

          <ButtonGroup buttons={['Old', 'New']} selectedIndex={selectedIndex} onPress={(value) => {
                       setSelectedIndex(value);
                      }}
                      containerStyle={{ alignSelf:'center',marginBottom: 10, marginLeft: 50, marginRight:50,
                        height: 25, width: 260, borderRadius: 10, backgroundColor: colors.primary,}}
                      selectedButtonStyle={{ backgroundColor: colors.secondary }}
          />
          <View style={styles.selection_container}>
           {selectedIndex === 0 ? ( <>
           <Text>
           <View style={{flexDirection: 'column',alignItems:'flex-start', }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', paddingBottom: 5}}>
              <Icon name="person" type="ionicon" size={12} iconStyle={{ color: 'white', }} style={{marginLeft:5, paddingRight:5}} />
              <Text style={{color:'white', fontSize:14}}>{old_employee_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems:'center'}}>
              <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white',  }} style={{marginLeft:5, paddingRight:5}} />
              <Text style={{color:'white', fontSize:14}}>{old_location_name}</Text>
            </View></View> </Text></>) : (
              <><Text>
              <View style={{flexDirection: 'column',alignItems:'flex-start', }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', paddingBottom: 5}}>
                <Icon name="person" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                <Text style={{color:'white', fontSize:14}}>{new_employee_name}</Text>
                
              </View>

              <View style={{ flexDirection: 'row', alignItems:'center' }}>
                <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                <Text style={{color:'white', fontSize:14}}>{new_location_name}</Text>
              </View></View> </Text>
              </>
            )}
          </View>          
        </View>
        
        
        <Pressable style={styles.delete_button} onPress={handleRemoveItem}>
          <Icon name="trash" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight:'bold'}} />
        </Pressable>
          

        </View>
      

    
   
  )
}
const InventoryListScreen = ({route}) => {

 
  const handleLongPress = () => {
    Alert.alert('Card Selected');
  };

  let db; 
  db = useSQLiteContext();
  const [loadedInventoryItems, setLoadedInventoryItems] = useState([]);
  const [modalVisible, setModalVisible]=useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [assetMembers, setAllAssetMembers]=useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();
  const {listId, listName}= route.params;
  //const { list } = route.params;
  const [chosenAsset, setChosenAsset]=useState({name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
      oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:'', inventoryList:''
     });
  const [selectedAsset, setSelectedAsset]= useState({id:'', name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
    oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:'', inventoryList:''
   });
   const [selectedCurrentEmployee, setSelectedCurrentEmployee]= useState({id:'', name:'', email:'', avatarUrl:''});
   const [selectedCurrentLocation, setSelectedCurrentLocation]=useState({id:'', longitude:'', latitude:'', name:''});
   const [selectedOldEmployee, setSelectedOldEmployee]= useState({id:'', name:'', email:'', avatarUrl:''});
   const [selectedOldLocation, setSelectedOldLocation]=useState({id:'', longitude:'', latitude:'', name:''});

   const [selectedAssetId, setSelectedAssetId] = useState(null);

   const [updateModalVisible, setUpdateModalVisible]= useState(false);
   
     const [allEmployees, setAllEmployees] = useState([]);
     const [allLocations, setAllLocations] = useState([]);
  const loadInventoryItems= async (db) => {
      
      try {
        console.log("list id "+listId);
        const tempInventory=await getAllInventoryListItemsById(db, listId);
        setLoadedInventoryItems(tempInventory);
        
         
        console.log("clanovi liste");
        console.log(loadedInventoryItems);
       
      } catch (error) {
        console.error('Error loading inventory lists:', error);
      }
 };
  const loadAssets= async (db)=>{

    try {
          setAllAssets([]);  
          const assets = await getAllAssetsFromView(db); 
          console.log(assets);
          setAllAssets(assets);  
         
        } catch (error) {
          console.error("Greška pri dobijanju zaposlenih:", error);
        }
  }
  
  useFocusEffect(
  
      useCallback(() => {
        loadInventoryItems(db);
        console.log("ulazi u focu eefect");
       // loadAssets(db);
        //loadAssetElements();

      }, [db])
    );
  useEffect(() => {
     
        loadInventoryItems(db);
        loadAssets(db);
        if (allAssets && allAssets.length > 0 && selectedAssetId === null) {
          // Set the first asset as the default if nothing is selected
          setSelectedAssetId(allAssets[0].asset_id);
        }
       // loadAssetElements();
       console.log("Updated assetMembers:", assetMembers);

  }, [db]);
  
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
  const openCamera = async () => {
      try {
        let result = await launchCameraAsync({ allowsEditing: true, quality: 1 });
    
        if (!result.canceled) {
          const barcodeUri = result.assets[0].uri;
          const barcodeData = await extractBarcode(barcodeUri);
          console.log(barcodeData);
          
        }
      } catch (error) {
        console.error(error);
      }
    };

  
  const handleAddButton= async()=>{
    
    await addListAssetPair(db, listId, selectedAsset.asset_id);
    console.log("uspjesno dodato");
    console.log("selektovani asset");
    console.log(selectedAsset);
    const pairs=await getAllListAssetPairs(db);
    console.log("upisani parovi");
    console.log(pairs);
    setModalVisible(false);
    loadInventoryItems(db);
   
  }
  
  const onAssetChange = async (assetId) => {

    console.log("udje u metod");
    console.log(assetId);
    console.log("svi asseti");
    console.log(allAssets);
    const selected = allAssets.find(a => a.asset_id === assetId);
    
    setSelectedAsset(selected);  
    setSelectedAssetId(assetId);
    console.log("izabrani asset");
    console.log(selectedAsset);
    
    


    
  };

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
    const onCurrentEmployeeSelect = (employeeId) => {
      const selected = allEmployees.find(emp => emp.id === employeeId);
      setSelectedCurrentEmployee(selected);  
      setSelectedAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployee: selected, 
      }));
      setSelectedAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployeeId: selected.id, 
      }));
    };
    const onOldEmployeeSelect = (employeeId) => {
      const selected = allEmployees.find(emp => emp.id === employeeId);
      setSelectedOldEmployee(selected);  
      setSelectedAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployee: selected, 
      }));
      setSelectedAsset((prevAsset) => ({
        ...prevAsset,
        currentEmployeeId: selected.id, 
      }));
    };
    const onCurrentLocationSelect = (locationId) => {
      const selected = allLocations.find(l => l.id === locationId);
      setSelectedCurrentLocation(selected); 
      setChosenAsset((prevAsset) => ({
        ...prevAsset,
        currentLocation: selected, 
      }));
      setChosenAsset((prevAsset) => ({
        ...prevAsset,
        currentLocationId: selected.id, 
      }));
    };
    const onOldLocationSelect = (locationId) => {
      const selected = allLocations.find(l => l.id === locationId);
      setSelectedOldLocation(selected); 
      setChosenAsset((prevAsset) => ({
        ...prevAsset,
        currentLocation: selected, 
      }));
      setChosenAsset((prevAsset) => ({
        ...prevAsset,
        currentLocationId: selected.id, 
      }));
    };
  


  return (
    <View style={styles.container}>
    <ScrollView>
    
    {loadedInventoryItems.map((item, index) => (
  <React.Fragment key={item.id|| index}>
   
    <ItemCard {...item} setLoadedInventoryItems={setLoadedInventoryItems} />
  </React.Fragment>
))}


    </ScrollView>

    {/*Modal for adding asset*/}
  
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false); }}
        style={{marginBottom:70}}>
     
        <View style={styles.modal_content}>
          <Text style={styles.modal_title}>Choose asset to add to the list</Text>
          
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedAsset.assetId} onValueChange={onAssetChange}
                mode="dropdown" style={styles.picker}>
                  
                {allAssets.map((asset) => (
                    
              <Picker.Item key={asset.asset_id} label={asset.asset_name} value={asset.asset_id} />
          ))}
            </Picker>
          </View>


              
         
          
          <Text style={[styles.modal_title, { alignSelf: "center", fontSize: 14 }]}>OR</Text>
          <Pressable onPress={openCamera} style={styles.barcode_button}>
            <Text style={styles.barcode_button_text}>Scan barcode</Text>
          </Pressable>
        
          <Text>____________________________________</Text>

            {/* 
          
          <Text style={styles.input}>Description: {selectedAsset.asset_description}</Text>
          <Text style={styles.input}>Price: {selectedAsset.asset_price}</Text>
          
          <View style={styles.item_bottom_container}>

          <ButtonGroup buttons={['Old', 'New']} selectedIndex={selectedIndex} onPress={(value) => {
                       setSelectedIndex(value);
                      }}
                      containerStyle={{ alignSelf:'center',marginBottom: 10, marginLeft: 50, marginRight:50,  height: 25, width: 260, borderRadius: 10, backgroundColor: colors.primary,}}
                      selectedButtonStyle={{ backgroundColor: colors.secondary }}
          />
          <View style={styles.selection_container}>
           {selectedIndex === 0 ? ( <>
         
        
            
            <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.currentEmployeeId} onValueChange={onCurrentEmployeeSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allEmployees.map((employee) => (
                    
               <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
                ))}
                 </Picker>
            </View>
              
                
              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.currentLocationId} onValueChange={onCurrentLocationSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allLocations.map((location) => (
                    
               <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
                 </Picker>
              </View>
            
              


             </>) : (
              <>
              
              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.oldEmployeeId} onValueChange={onOldEmployeeSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allEmployees.map((employee) => (
                    
               <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
                ))}
                 </Picker>
              </View>

              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.oldLocationId} onValueChange={onOldLocationSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allLocations.map((location) => (
                    
               <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
                 </Picker>
              </View>
              
          

              </>
            )}
          </View>          
        </View>
         
      */}

          <View style={{flexDirection:'row'}}>
                <Pressable onPress={()=>setModalVisible(false)} style={[styles.confirm_button, {backgroundColor:colors.light_primary}]}>
                    <Text style={styles.barcode_button_text}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleAddButton} style={styles.confirm_button}>
                    <Text style={styles.barcode_button_text}>Add</Text>
                </Pressable>
                
          </View>
          



        </View>
       
    </Modal>

    {/*Modal for updating */}

    
  
    <Modal animationType="slide" transparent={true} visible={updateModalVisible} onRequestClose={() => {setUpdateModalVisible(false); }}
        style={{marginBottom:70}}>
     
        <View style={styles.modal_content}>
          <Text style={styles.modal_title}>Update asset employee and location</Text>
          
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedAssetId} onValueChange={()=>onAssetChange(selectedAssetId)}
                mode="dropdown" style={styles.picker}>
                  
                {allAssets.map((asset) => (
                    
              <Picker.Item key={asset.asset_id} label={asset.asset_name} value={asset.asset_id} />
          ))}
            </Picker>
          </View>
          
         
          
          <Text style={[styles.modal_title, { alignSelf: "center", fontSize: 14 }]}>OR</Text>
          <Pressable onPress={openCamera} style={styles.barcode_button}>
            <Text style={styles.barcode_button_text}>Scan barcode</Text>
          </Pressable>

          <Text>____________________________________</Text>


          
          <Text style={styles.input}>Description: {selectedAsset.asset_description}</Text>
          <Text style={styles.input}>Price: {selectedAsset.asset_price}</Text>
          
          <View style={styles.item_bottom_container}>

          <ButtonGroup buttons={['Old', 'New']} selectedIndex={selectedIndex} onPress={(value) => {
                       setSelectedIndex(value);
                      }}
                      containerStyle={{ alignSelf:'center',marginBottom: 10, marginLeft: 50, marginRight:50,  height: 25, width: 260, borderRadius: 10, backgroundColor: colors.primary,}}
                      selectedButtonStyle={{ backgroundColor: colors.secondary }}
          />
          <View style={styles.selection_container}>
           {selectedIndex === 0 ? ( <>
         
        
            
            <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.currentEmployeeId} onValueChange={onCurrentEmployeeSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allEmployees.map((employee) => (
                    
               <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
                ))}
                 </Picker>
            </View>
              
                
              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.currentLocationId} onValueChange={onCurrentLocationSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allLocations.map((location) => (
                    
               <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
                 </Picker>
              </View>
            
              


             </>) : (
              <>
              
              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.oldEmployeeId} onValueChange={onOldEmployeeSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allEmployees.map((employee) => (
                    
               <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
                ))}
                 </Picker>
              </View>

              <View style={styles.pickerContainer}>
              <Picker selectedValue={selectedAsset.oldLocationId} onValueChange={onOldLocationSelect}
                mode="dropdown" style={styles.picker}>
                  
                {allLocations.map((location) => (
                    
               <Picker.Item key={location.id} label={location.name} value={location.id} />
                ))}
                 </Picker>
              </View>
              
          

              </>
            )}
          </View>          
        </View>
         


          <View style={{flexDirection:'row'}}>
                <Pressable onPress={()=>setUpdateModalVisible(false)} style={[styles.confirm_button, {backgroundColor:colors.light_primary}]}>
                    <Text style={styles.barcode_button_text}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleAddButton} style={styles.confirm_button}>
                    <Text style={styles.barcode_button_text}>Add</Text>
                </Pressable>
                
          </View>
          



        </View>
       
    </Modal>
      
    <Pressable style={styles.add_button} onPress={()=> setModalVisible(true)}>
       <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
    </Pressable>
   
    </View>
  );
};


const styles = StyleSheet.create({
  textContainer: {
    width: '100%',
    height: 40,
    backgroundColor: 'gray', // Optional: for visualization
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left', 
    alignSelf: 'flex-start', 
    marginTop: 10,
    marginLeft: 10, 
  },
  barcode_button_text: {

    color: 'white', 
    alignSelf: 'center', 
    fontSize: 14, 
   
    
  }, 
  barcode_button:{
  
      borderRadius: 10, 
      backgroundColor: colors.secondary,
      width: '70%', 
      height: 35, 
      alignContent: 'flex-end',
      justifyContent: 'center', 
     

  
  },
  confirm_button:{
  
      borderRadius: 10, 
      backgroundColor: colors.secondary,
      width: '30%', 
      height: 35, 
      alignContent: 'flex-end',
      justifyContent: 'center', 
      marginTop:20,
      marginLeft: 5 , 
      alignSelf: 'flex-end'

  
  },
  modal_container: {
      flex: 1,
      justifyContent: 'center',
      height: 300, 
      alignItems: 'center',
     // backgroundColor: 'rgba(151, 32, 32, 0.5)', // dim background
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
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Change color here
  },
  item_top_container:{

    flexDirection: 'row',
    
    width:'100%'
  
  },
  image: {

    width: 100,
    height: 110,
    marginRight: 0, 
    borderBottomRightRadius: 15, 
    
  },
  item_right_container:{

    
    color: 'white', 
    paddingLeft: 10, 
    justifyContent: 'space-between', 
    
  },
  item_description_text:{

    color: 'white',
    paddingTop:1, 
    flexWrap: 'wrap',
    overflow: 'hidden',
    color: 'white',
    flex: 1, 


  },
  item_container: {

    flexDirection:'column', 
    
    minHeight: 250, 
    backgroundColor: colors.light_primary,
    borderRadius: 10, 
    maxHeight:280,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'grey',
    overflow: 'hidden',
    marginLeft: 10, 
    marginRight: 10, 
    marginTop: 20, 

  },
  item_bottom_container: {

    flexDirection:'column', 
    alignItems: 'flex-start',
    minHeight: 100, 
    backgroundColor: colors.light_primary,
   
    alignItems: 'flex-start',
    overflow: 'hidden',
  
    borderColor: 'grey',
    overflow: 'hidden',
    
    justifyContent: 'top',
    width: 270, 
    marginLeft: 10, 
    marginRight: 10, 
  
    paddingVertical: 0,       
    paddingHorizontal: 5,
    justifyContent: 'flex-start',
    marginTop: 20, 
    
    
    
  },
   asset_location_text:{

    color: 'white',
    paddingLeft: 4, 
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
   
  }, 
  asset_employee_text:{

    color:'white',
    paddingLeft: 4, 
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
   

    justifyContent: 'center',
  }, 
  selection_container: {

    flexDirection: 'column', 
    
     height: 120,
     justifyContent: 'flex-start',
     width: "100%",
     paddingTop: 20
   
  
  }, 
  item_price:{

    marginLeft: 'auto', 
    paddingRight: 10,
    fontSize: 24, 
    color: 'white', 
    marginBottom: 2, 
    position: 'absolute', 
    bottom: 3,
    right: 10, 
    justifyContent: 'flex-end',
    marginEnd: 5, 
    marginRight:2, 
   
    alignSelf: 'flex-end', 
    paddingLeft: 50, 
    alignContent: 'flex-end'
  }, 
  item_name_text: {

    fontSize: 20, 
    flexWrap: 'wrap',
    color: 'white',
    flexWrap: 'wrap',
    fontWeight:'bold'

  },
  item_description_text:{

    color: 'white',
    paddingTop:1, 
    flexWrap: 'wrap',
    overflow: 'hidden',
    color: 'white',
    flex: 1, 


  }, 
  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
    
    
 
  },
  options_container: {

    flexDirection: 'row', 
    justifyContent:'flex-end',
    marginRight: 5, 
    marginBottom: 10,
    backgroundColor: 'red'

    
  },
  buttons:{
    
    backgroundColor: colors.secondary

  },
  add_button:{
    
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
  update_button:{
    
    position: 'absolute',
    bottom: 20, 
    right: 80,  
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
  edit_button :{

    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 10,
    height: 30, 
    width: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,
    bottom: 10, 
    right: 50

  },
  delete_button:{

    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 10,
    height: 30, 
    width: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,
    right: 10,
    bottom: 10, 
    

  }


});

export default InventoryListScreen;