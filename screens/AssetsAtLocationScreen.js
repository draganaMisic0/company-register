import React, {Fragment, useEffect, useState} from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, ImageBackground} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon, Input } from '@rneui/themed';
import { BackgroundImage, color, Divider, fonts, Image } from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context'
import { AssetCard } from './BasicAssetsScreen';
import { useSQLiteContext } from 'expo-sqlite';
import { deleteLocation, getAllAssets, getAssetsByLocationId, loadLocations } from '../database/db_queries';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native-paper';

const AssetsAtLocationScreen =({route})=>{

    let db;
    db = useSQLiteContext();
    const navigation = useNavigation();
    const { location }=route.params;
    const [loadedAssets, setLoadedAssets]=useState([]);
    const { updateLocation } = route.params;
    const [modalVisible, setModalVisible]= useState(false);
    const [deleteModalVisible, setDeleteModalVisible]=useState(false);
   
    const loadAssets = async (db) => {
        try {

          
          const assets = await getAssetsByLocationId(db, location.id);
          console.log("vraceni asseti");
          console.log(assets);
         /* const updatedAssets = await Promise.all(assets.map(async (asset) => {
            const locationName = await getLocationNameBayId(db, asset.current_location_id);
            return { ...asset, current_location_name: locationName };
          }));*/
          
          setLoadedAssets(assets);
          
        } catch (error) {
          console.error('Error loading assets:', error);
        }
      };
    const handleDelete = async () => {
          try {
            await deleteLocation(db, location.id);
            console.log("obrisano");
            

            navigation.goBack();
          } catch (error) {
            console.error("Error deleting location:", error);
          }
        };
      
    useEffect(() => {
      
     // updateLocation(location); 
      loadAssets(db);
         
    }, [db]);
    const onPress = () => {
        //console.log("Card clicked!");
        navigation.navigate('Asset Details' );
        // You could navigate to a detail screen here, for example
      };

      const onCancelPress =( )=>{

        setDeleteModalVisible(false);
      }
    return (
        <View style={styles.container}>
        <ScrollView style={styles.scroll_view}>
        <Text style={{fontSize:20, color: 'white', marginLeft:10, marginTop: 15}}>{location.name}</Text>
        {
            loadedAssets.map((asset)=>(
              
              <Pressable onPress={onPress} >
              <Fragment key={asset.id}>
                 
                  <AssetCard {...asset}/>
                  <Text>{asset.name}</Text>
              </Fragment>
              </Pressable>
            ))
        }
        </ScrollView> 
        {/*Modal for location delete*/}
              <Modal animationType="slide" transparent={true} visible={deleteModalVisible}
                            onRequestClose={() => {setDeleteModalVisible(false); } } >
                   
                      <View style={styles.modal_content}>
                      
                        <Text style={styles.modal_title}>Delete Location</Text>
                        
                        <Text style={{fontSize: 14, color:'white', alignSelf:'flex-start', marginBottom: 20}}>Are you sure you want to delete this location?</Text>
                      <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                      <Pressable style={{marginRight: 15}} onPress={onCancelPress}>
                          <Text style={styles.submit_button_text}>Cancel</Text>
                      </Pressable>
                      <Pressable style={{backgroundColor: colors.secondary, width: 80, height: 30, borderRadius: 10, justifyContent:'center'}}
                                  onPress={handleDelete} >
                          <Text style={styles.submit_button_text}>Delete</Text>
                      </Pressable>
                      </View>
                      </View>
                   
                  </Modal>

        

        
        <Pressable style={styles.delete_button}>
            <Icon name="trash" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}}
              onPress={()=>setDeleteModalVisible(true)}/>
        </Pressable>


        </View>
    )


}

const styles = StyleSheet.create({

  list_container: {
  
      flexDirection:'column', 
      alignItems: 'flex-start',
      minHeight: 50, 
      backgroundColor: colors.light_primary,
      borderRadius: 10, 
       
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: 'grey',
      overflow: 'hidden',
      marginLeft: 10, 
      marginRight: 10, 
      marginTop: 15, 
      justifyContent: 'center', 
      alignContent: 'center'
  
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
    regular_button: {
  
      color: 'white', 
      fontSize: 14, 
      alignSelf:'center'
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
    scroll_view: {
      flex: 1,
      backgroundColor: colors.primary,
      
      
   
    },
    container:{
    flex: 1, 
  },

  delete_button:{
        
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

});

export default AssetsAtLocationScreen;