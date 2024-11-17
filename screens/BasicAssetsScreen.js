
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable} from 'react-native';
import colors from '../styles/colors';
import { Card, Button, Icon } from '@rneui/themed';
import { color, fonts, Image } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

const AssetCard = ({
  
  name='Unknown asset', 
  description='No description', 
  employee='No assigned employee', 
  location='Unknown location', 
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
                 <Text style={styles.asset_employee_text}>{employee}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Icon name="location" type="ionicon" size={12} iconStyle={{ color: 'white' }} style={{marginLeft:5, paddingRight:5}} />
                 <Text style={styles.asset_location_text}>{location}</Text>
              </View>
              
          </View>
          <Text style={styles.asset_price}>{price}</Text>
        </View>
        
      </View>

  );
}

const BasicAssetsScreen = () => {

  const navigation = useNavigation();
  const onPress = () => {
    console.log("Card clicked!");
    navigation.navigate('Asset Details' );
    // You could navigate to a detail screen here, for example
  }; 
  return (

      <View style={styles.container}>
        <ScrollView style={styles.scroll_view}>
          <Pressable onPress={onPress} >
            <AssetCard></AssetCard>
            <AssetCard></AssetCard>
            <AssetCard></AssetCard>
            <AssetCard></AssetCard>
          </Pressable>
        </ScrollView>   
        <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
        </Pressable>
        <Pressable style={styles.filter_button}>
          <Icon name="filter" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold' }} />
        </Pressable>
      
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
  }


});


export default BasicAssetsScreen;
