import React, {Fragment, useEffect, useState} from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, ImageBackground} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon, Input } from '@rneui/themed';
import { BackgroundImage, color, Divider, fonts, Image } from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context'
import { AssetCard } from './BasicAssetsScreen';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllAssets, getAssetsByLocationId } from '../database/db_queries';
import { useNavigation } from '@react-navigation/native';

const AssetsAtLocationScreen =()=>{

    let db;
    db = useSQLiteContext();
    const navigation = useNavigation();
    const [loadedAssets, setLoadedAssets]=useState([]);
    const loadAssets = async (db) => {
        try {
          const assets = await getAssetsByLocationId(db, 1);
         /* const updatedAssets = await Promise.all(assets.map(async (asset) => {
            const locationName = await getLocationNameBayId(db, asset.current_location_id);
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
    const onPress = () => {
        console.log("Card clicked!");
        navigation.navigate('Asset Details' );
        // You could navigate to a detail screen here, for example
      };
    return (
        <View style={styles.container}>
        <ScrollView style={styles.scroll_view}>
        <Text style={{fontSize:20, color: 'white', marginLeft:10, marginTop: 15}}>Assets at this location</Text>
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
        </View>
    )


}

const styles = StyleSheet.create({

    scroll_view: {
      flex: 1,
      backgroundColor: colors.primary,
      
      
   
    },
    container:{
    flex: 1, 
  },


});

export default AssetsAtLocationScreen;