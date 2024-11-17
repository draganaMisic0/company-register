import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable} from 'react-native';
import colors from '../styles/colors';
import { Avatar, Divider, Icon} from '@rneui/themed';


const EmployeeCard = ({

  name="Unknown employee",
  email="Unknown email", 
  avatar

}) => {

  const default_avatar= require('../assets/default_avatar.png');
  const avatarToShow = avatar ? { uri: avatar } : default_avatar;

  return (

    <View  style={styles.employee_card}>
    
      <Avatar  size={64} rounded source={default_avatar}/>
      <View style={styles.text_container}>

        <Text  style={{color: 'white', fontSize: 18, paddingBottom: 3  }}>{name}</Text>
        <Text style={{color: 'white', fontSize: 14}}>{email}</Text>
        

      </View>
      
      
    </View>

  )
}


const EmployeeScreen = () => {

  return (
    <View style={styles.container}>
       <ScrollView style={styles.scroll_view}>
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
          <Divider inset={true}  style={{ backgroundColor: 'grey'}} />
          <EmployeeCard></EmployeeCard>
       </ScrollView>
       <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
       </Pressable>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary
  },
  scroll_view: {
    flex: 1,
    backgroundColor: colors.primary,
  }, 
  avatar: {
    margin: 50, 
  }, 
  employee_card: {

    flexDirection: 'row', 
    alignItems: 'center',
    padding: 5, 
    

  }, 
  text_container: {

    flexDirection: 'column', 
    paddingLeft: 10, 

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



export default EmployeeScreen;