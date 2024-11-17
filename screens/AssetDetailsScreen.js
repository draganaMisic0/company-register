import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, ImageBackground} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon } from '@rneui/themed';
import { BackgroundImage, color, Divider, fonts, Image } from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context'

const AssetDetailsScreen = ({

    image, 
    name='Unknown name',
    description='No description ewufn iefew fiewfoi iewhfiew ifei fefh iefheiof fehifheiof fheif oif wfwifh ewfeifhef eifh eoifhewif  iehfifh iefhewiof hifhw feifhei fifhewf eoi ', 
    barcode='12345678', 
    price='N/A', 
    creationDate='01.01.2000.', 
    assignedEmployee='No assigned employee', 
    location='Unknown location', 
    navigation

}) => {

    const default_image= require('../assets/desk.jpg');
  
    const imageToShow = image ? { uri: image } : default_image;

    return (
        
        <SafeAreaView style={styles.container}>
          
           <ImageBackground style={styles.image} resizeMode="stretch" source= {imageToShow}>
                <Text style={styles.asset_name}>Work desk</Text>
           </ImageBackground>
           
           <View style={styles.details_container}>
              <Text style={{color:'white', fontSize:16, fontWeight:'bold', margin: 10}}>Description</Text>
              <Text style={styles.details_text}>{description}</Text>
              <Divider style={{ backgroundColor: colors.secondary}} />
              <View style={styles.icon_container}>
                <Icon  name="barcode-sharp" type="ionicon" size={20} iconStyle={{color:'white'} }></Icon>
                <Text style={styles.value_container}>{barcode}</Text>
              </View>
              <Divider style={{ backgroundColor: colors.secondary}} />
              <View style={styles.icon_container}>
                <Icon name="calendar" type="ionicon" size={20} iconStyle={{color:'white'} }></Icon>
                <Text style={styles.value_container}>{creationDate}</Text>
              </View>
              <Divider style={{ backgroundColor: colors.secondary}} />
              <View style={styles.icon_container}>
                <Icon name="cash" type="ionicon" size={20} iconStyle={{color:'white'} }></Icon>
                <Text style={styles.value_container}>{price}</Text>
              </View>
              <Divider style={{ backgroundColor: colors.secondary}} />
              <View style={styles.icon_container}>
                <Icon name="person" type="ionicon" size={20} iconStyle={{color:'white'} }></Icon>
                <Text style={styles.value_container}>{assignedEmployee}</Text>
              </View>
              <Divider style={{ backgroundColor: colors.secondary}} />
              <View style={styles.icon_container}>
                <Icon name="location" type="ionicon" size={20} iconStyle={{color:'white'} }></Icon>
                <Text style={styles.value_container}>{location}</Text>
              </View>
              
              
              
           </View>
           
           <Pressable style={styles.edit_button}>
              <Icon name="create" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight:'bold'}} />
           </Pressable>
           <Pressable style={styles.delete_button}>
              <Icon name="trash" type="ionicon" size={20} iconStyle={{ color: 'black', fontWeight:'bold' }} />
           </Pressable>
           <Pressable style={styles.back_button} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" type="ionicon" size={20} iconStyle={{ color: colors.secondary, fontWeight:'bold' }} />
           </Pressable>
         
            
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

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
        
        color:'white', 
        fontSize: 24, 
        paddingBottom: 10, 
        paddingLeft: 10, 
       
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
        top: 30, 
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


  }, 
 icon_container: {

        flexDirection: 'row',      
        
        alignItems: 'center',      
        padding: 10, 

  },
  value_container:{

    justifyContent:'flex-end', 
    color: 'white', 
    fontSize: 16, 
    paddingRight: 20,
    textAlign: 'right',
    width: '100%'
    
  }
 

})
export default AssetDetailsScreen;