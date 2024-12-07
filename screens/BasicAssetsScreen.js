
import React, { Fragment, useState, useEffect} from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, Modal, TextInput} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon, Avatar } from '@rneui/themed';
import { color, fonts, Image } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { getAllAssets, getLocationNameById} from '../database/db_queries'

export const AssetCard = ({
  
  name='Unknown asset', 
  description='No description', 
  current_employee_name='No assigned employee', 
  current_employee_id,
  current_location_name='Unknown location', 
  current_location_id, 
  price='N/A', 
  image
} 
) => {

  const default_image= require('../assets/rb_3009.png');
  
  const imageToShow = image ? { uri: image } : default_image;
  
 
  return (

    <View style={styles.asset_container}>
        <View style={styles.asset_top_container}>
          <Image
          style={styles.image}
          resizeMode="stretch"
          source= {imageToShow}
        />
          <View style={styles.asset_right_container}>
             
             <Text style={styles.asset_name_text}>{name}</Text>
             <Text style={styles.asset_description_text}>{description}</Text>
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
          <Text style={styles.asset_price}>{price}</Text>
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
  const onPress = () => {
    console.log("Card clicked!");
    navigation.navigate('Asset Details' );
    // You could navigate to a detail screen here, for example
  };
  const loadAssets = async (db) => {
  try {
    const assets = await getAllAssets(db);
   /* const updatedAssets = await Promise.all(assets.map(async (asset) => {
      const locationName = await getLocationNameById(db, asset.current_location_id);
      return { ...asset, current_location_name: locationName };
    }));*/
    
    setLoadedAssets(assets);
  } catch (error) {
    console.error('Error loading assets:', error);
  }
};


  useEffect(() => {

   loadAssets(db);
   
  }, [db]);
  return (

      <View style={styles.container}>
        <ScrollView style={styles.scroll_view}>
    
        {
            loadedAssets.map((asset)=>(
              <Pressable onPress={onPress} >
              <Fragment key={asset.id}>
                  <AssetCard {...asset}  />
              </Fragment>
              </Pressable>
            ))
        }
          
        </ScrollView>   
        <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} onPress={{}}/>
        </Pressable>
        <Pressable style={styles.filter_button}>
          <Icon name="filter" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold' }} />
        </Pressable>



        {/*Adding asset modal*/}
        <Modal animationType="slide" transparent={true} visible={modalVisible}
                  onRequestClose={() => {setModalVisible(false); } } >
            
            
          <View style={styles.modal_container}>
              <View style={styles.modal_content}>
                <Text style={styles.modal_title}>Create a new asset</Text>
                <Avatar activeOpacity={0.2} avatarStyle={{}} containerStyle={{ backgroundColor: colors.primary, margin: 10}}
                        icon={{}} iconStyle={{}} imageProps={{}} onLongPress={() => alert("onLongPress")}
                        onPress={{}} overlayContainerStyle={{}} placeholderStyle={{}}
                        rounded size='large' titleStyle={{color: colors.secondary}}/>
                
                <TextInput style={styles.input} placeholder="Employee name..." placeholderTextColor={'white'} 
                          value={asset.name} onChangeText={(text) =>
                                              setAsset((prevEmployee) => ({ ...prevEmployee, name: text }))
                }/>
                <TextInput style={styles.input} placeholder="Employee email..." placeholderTextColor={'white'} 
                          value={asset.email} onChangeText={(text) =>
                                              setAsset((prevEmployee) => ({ ...prevEmployee, email: text }))
                }/>
                <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                  <Pressable style={{marginRight: 15,}}>
                      <Text onPress={()=> setModalVisible(false)}
                      style={styles.create_button_text}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.create_button}
                     onPress={{}} >
                    <Text style={styles.create_button_text}>Create</Text>
                   </Pressable>
                </View>

              </View>
          </View>
        </Modal>
    

      
      </View>
        
         
  );
};


const styles = StyleSheet.create({

  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
    
    
 
  },
  add_button:{
    
    position: 'absolute',
    bottom: 80, 
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

