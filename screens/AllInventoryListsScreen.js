import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import colors from '../styles/colors';
import {Image } from '@rneui/base';
import { ButtonGroup, Icon} from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const InventoryListCard = ({

    name="Inventory List Name"
}) => {
    return (

        <View style={styles.list_container}>
            <Text style={styles.list_name}>{name}</Text>
        </View>
    );
}

const AllInventoryListsScreen = () => {

    const navigation = useNavigation();

    const onPress = () => {
    console.log("Card clicked!");
    navigation.navigate('Inventory List' );
    // You could navigate to a detail screen here, for example
    };


    return (
        
        <View style={styles.container}>
            <ScrollView>
                <Pressable onPress={onPress} >
                    <InventoryListCard/>
                
                
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>
                <InventoryListCard/>

                <InventoryListCard/>

                <InventoryListCard/><InventoryListCard/>
                </Pressable>

            </ScrollView>
            <Pressable style={styles.add_button}>
                <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Change color here
  },
  list_name: {

    fontSize: 18, 
    color: 'white', 
    paddingLeft: 20
  }, 
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
  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
    
    
 
  },
});


export default AllInventoryListsScreen;