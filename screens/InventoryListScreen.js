import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import colors from '../styles/colors';
import {color, Image } from '@rneui/base';
import { ButtonGroup, Icon} from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { getAllAssets, getAllAssetsDetails, getAllInventoryListItemsById, getAssetById } from '../database/db_queries';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";

const ItemCard = ({

  image, 
  name='Unknown name', 
  description='No description', 
  price='N/A', 
  old_employee_name='Old employee', 
  new_employee_name='New employee', 
  old_location_name='Old location', 
  new_location_name='New location',

}) => {

  const default_image= require('../assets/rb_3009.png');
  
  const imageToShow = image ? { uri: image } : default_image;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
   
    <View style={styles.item_container}>
      <View style={styles.item_top_container}>
          <Image
          style={styles.image}
          resizeMode="stretch"
          source= {imageToShow}
        />
          <View style={styles.item_right_container}>
             
             <Text style={styles.item_name_text}>{name}</Text>
             <Text style={styles.item_description_text}>{description}</Text>
             <Text style={styles.item_price}>{price}</Text>
          </View>
        </View>

        <View style={styles.item_bottom_container}>

          <ButtonGroup buttons={['Old', 'New']} selectedIndex={selectedIndex} onPress={(value) => {
                       setSelectedIndex(value);
                      }}
                      containerStyle={{ alignSelf:'center',marginBottom: 10, marginLeft: 50, marginRight:50,  height: 25, width: 260, borderRadius: 10, backgroundColor: colors.primary,}}
                      selectedButtonStyle={{ backgroundColor: colors.secondary }}
          />
          <View style={styles.selection_container}>
           {selectedIndex === 0 ? ( <>
           <Text>
           <View style={{flexDirection: 'column',alignItems:'flex-start', }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', paddingBottom: 5}}>
              <Icon name="person" type="ionicon" size={12} iconStyle={{ color: 'white', }} style={{marginLeft:5, paddingRight:5}} />
              <Text style={styles.asset_employee_text}>{old_employee_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems:'center'}}>
              <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white',  }} style={{marginLeft:5, paddingRight:5}} />
              <Text style={styles.asset_location_text}>{old_location_name}</Text>
            </View></View> </Text></>) : (
              <><Text>
              <View style={{flexDirection: 'column',alignItems:'flex-start', }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', paddingBottom: 5}}>
                <Icon name="person" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
              
                <Text style={styles.asset_employee_text}>{new_employee_name}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems:'center' }}>
                <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                <Text style={styles.asset_location_text}>{new_location_name}</Text>
              </View></View> </Text>
              </>
            )}
          </View>          
        </View>
        
        <Pressable style={styles.edit_button}>
          <Icon name="create" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight:'bold'}} />
        </Pressable>
        <Pressable style={styles.delete_button}>
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
  const navigation = useNavigation();
  const {listId, listName}= route.params;
  //const { list } = route.params;
  const [newAsset, setNewAsset]=useState({name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
      oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:'', inventoryList:''
     });
  const [selectedAsset, setSelectedAsset]= useState({id:'', name:'', description:'', price:'', photoUrl:'', currentEmployee:'', 
    oldEmployee:'', currentLocation:'', oldLocation:'', creationDate:'', inventoryList:''
   });
  const loadInventoryItems= async (db) => {
      
      try {
        console.log("list id "+listId);
        setLoadedInventoryItems(await getAllInventoryListItemsById(db, listId));
      } catch (error) {
        console.error('Error loading inventory lists:', error);
      }
    };
  const loadAssets= async (db)=>{

    try {
          const assets = await getAllAssets(db); 
          console.log(assets);
          setAllAssets(assets);  
         
        } catch (error) {
          console.error("Greška pri dobijanju zaposlenih:", error);
        }
  }
 
  useEffect(() => {
       // console.log("loading inventory lists");
       console.log("Route params:", route.params);
       console.log("Full route object:", route);
        loadInventoryItems(db);
        loadAssets(db);

  }, []);

  const handleBarcodeScan=()=>{


  }
  const handleAddButton= async()=>{
    
    
  }
  
  const onAssetChange = (assetId) => {
    const selected = allAssets.find(a => a.id === assetId);
    console.log(allAssets);
    setSelectedAsset(selected);  
    console.log("izabrani asset");
    console.log(selectedAsset);
  };
  


  return (
    <View style={styles.container}>
    <ScrollView>
      
    {
        loadedInventoryItems.map((item) => (
           
           <ItemCard key={item.id} {...item} />
         
                
          ))
    }
        
    </ScrollView>

    {/*Modal for adding asset*/}
  
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false); }}>
     
        <View style={styles.modal_content}>
          <Text style={styles.modal_title}>Create a new asset</Text>
          
          <View style={styles.pickerContainer}>
            <Picker selectedValue={newAsset.name || ""} onValueChange={onAssetChange}
                mode="dropdown" style={styles.picker}>
                  
                {allAssets.map((asset) => (
                    
              <Picker.Item key={asset.id} label={asset.name} value={asset.id} />
          ))}
            </Picker>
          </View>
          
          <Text style={[styles.modal_title, { alignSelf: "center", fontSize: 14 }]}>OR</Text>
          <Pressable onPress={handleBarcodeScan} style={styles.barcode_button}>
            <Text style={styles.barcode_button_text}>Scan barcode</Text>
          </Pressable>
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
      
    <Pressable style={styles.add_button} onPress={()=> setModalVisible(true)}>
       <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
    </Pressable>
    </View>
  );
};


const styles = StyleSheet.create({
  barcode_button_text: {

    color: 'white', 
    alignSelf: 'center', 
    fontSize: 16, 
   
    
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
    
    minHeight: 240, 
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
     
     height: 50,
     justifyContent: 'flex-start'
   
  
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

    fontSize: 18, 
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