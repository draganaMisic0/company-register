import React, { useEffect, useState, Fragment } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable,  Modal, TextInput} from 'react-native';
import colors from '../styles/colors';
import { Avatar, Divider, Icon, BottomSheet, ListItem} from '@rneui/themed';
import { getAllEmployees, deleteEmployee, updateEmployee, addEmployee} from '../database/db_queries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import UserAvatar from 'react-native-user-avatar';



const EmployeeCard = ({
  id,
  name = "Unknown employee",
  email = "Unknown email",
  avatar_url, 
  setLoadedEmployees, 
  
}) => {

 
  const [iconsVisible, setIconsVisible] = useState(false);
 // const [isPressed, setIsPressed] = useState(false); 
  const [updateModalVisible, setUpdateModalVisible]= useState(false);
  const [employee, setEmployee] = useState({ name: '', email: '', avatarUrl: '' });
  
  let db;
  db = useSQLiteContext();

  const onLongPress = () => {
    setIconsVisible(true);
    //setIsPressed(true);
    console.log('Icons Visible:', iconsVisible);
  };
  const onPress = () => {
    if (iconsVisible) {
      setIconsVisible(false);
     // setIsPressed(false);
    }
  };
  const loadEmployeesFromDatabase = async (db) => {
    try {
      setLoadedEmployees(await getAllEmployees(db));
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };
  const onEditPress = () => {
   
    employee.id=id;
    employee.name=name;
    employee.email=email;
    employee.avatarUrl=avatar_url;
   // setEmployee({ id: id, name: name, email: email, avatarUrl: avatar_url });
    
    setUpdateModalVisible(true);
  };
  const onUpdatePress=()=>{
    
    console.log("kad klikne update "+employee.name);
    console.log("kad klikne update "+employee.email);
    if(id!=employee.id ||name!=employee.name || email!=employee.email || avatar_url!=employee.avatarUrl){
      updateEmployee(db, employee);
      loadEmployeesFromDatabase(db);
    }
    
    setUpdateModalVisible(false);
    setIconsVisible(false);
    //setIsPressed(false);
  }
  const onDeletePress = () =>{

    console.log(id);
    deleteEmployee(db, id);
    loadEmployeesFromDatabase(db);

  }
  
  return (

    /*One employee card*/
    <Pressable onLongPress={onLongPress} onPress={onPress} >
      <View style={styles.employee_card}>
      {/*<View style={[styles.employee_card, isPressed && styles.employee_card_pressed]}>*/}
      <Avatar activeOpacity={0.2} avatarStyle={{}} containerStyle={{ backgroundColor: colors.primary}}
                        icon={{}} iconStyle={{}} imageProps={{}} onLongPress={() => alert("onLongPress")}
                        onPress={() => alert("onPress")} overlayContainerStyle={{}} placeholderStyle={{}}
                        rounded size='large' titleStyle={{color: colors.secondary}}/>
        <View style={styles.text_container}>
          <Text style={{ color: 'white', fontSize: 18, paddingBottom: 3 }}>
            {name}
          </Text>
          <Text style={{ color: 'white', fontSize: 14 }}>{email}</Text>
        </View>

        {iconsVisible && (
          <>
            <Pressable style={styles.edit_button}>
              <Icon name="create" type="ionicon" size={22} iconStyle={{ color: 'black', fontWeight: 'bold' }} onPress={onEditPress}/>
            </Pressable>
            <Pressable style={styles.delete_button}>
              <Icon name="trash" type="ionicon" size={22} iconStyle={{ color: 'black', fontWeight: 'bold' }}
                   onPress={onDeletePress}/>
            </Pressable>
          </>


            
        )}
        
        {/* Modal for editing an employee*/}
        <Modal animationType="slide" transparent={true} visible={updateModalVisible}
                  onRequestClose={() => {setUpdateModalVisible(false); } } >
            
            
          <View style={styles.modal_container}>
              <View style={styles.modal_content}>
                <Text style={styles.modal_title}>Edit employee</Text>
                <Avatar activeOpacity={0.2} avatarStyle={{}} containerStyle={{ backgroundColor: colors.primary, margin: 10}}
                        icon={{}} iconStyle={{}} imageProps={{}} onLongPress={() => alert("onLongPress")}
                        onPress={() => alert("onPress")} overlayContainerStyle={{}} placeholderStyle={{}}
                        rounded size='large' titleStyle={{color: colors.secondary}}/>
                
                <TextInput style={styles.input} placeholder="Employee name..." placeholderTextColor={'white'} 
                          value={employee.name} onChangeText={(text) =>
                                              setEmployee((prevEmployee) => ({ ...prevEmployee, name: text }))
                }/>
                <TextInput style={styles.input} placeholder="Employee email..." placeholderTextColor={'white'} 
                          value={employee.email} onChangeText={(text) =>
                                              setEmployee((prevEmployee) => ({ ...prevEmployee, email: text }))
                }/>
                <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                  <Pressable style={{marginRight: 15,}}>
                      <Text onPress={()=>{setUpdateModalVisible(false); setIconsVisible(false); {/*setIsPressed(false);*/}}} 
                      style={styles.create_button_text}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.create_button}
                     onPress={onUpdatePress} >
                    <Text style={styles.create_button_text}>Update</Text>
                   </Pressable>
                </View>
              </View>
          </View>
        </Modal>
      </View>
    </Pressable>
  );
};


const EmployeeScreen = () => {

  let db;
  db = useSQLiteContext();
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] =useState({ name: '', email: '', avatarUrl: '' });
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const defaultAvatar = require('../assets/new_employee_avatar.png');
  
  const list = [
    { title: 'Choose a photo' , containerStyle: {backgroundColor: colors.light_primary}},
    { title: 'Take a photo' , containerStyle: {backgroundColor: colors.light_primary}},
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: colors.secondary },
      titleStyle: { color: 'white' },
      onPress: () => setBottomSheetVisible(false),
    },
  ];

  const loadEmployeesFromDatabase = async (db) => {
    try {
      setLoadedEmployees(await getAllEmployees(db));
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    loadEmployeesFromDatabase(db);
  }, [db]);
 
  onCreateButtonPress=()=>{

      
      addEmployee(db, newEmployee);
      loadEmployeesFromDatabase(db);
      setModalVisible(false);
      console.log(newEmployee.name);

  }

  return (

    //Main screen
    <View style={styles.container}>
      <ScrollView style={styles.scroll_view}>
         {
            loadedEmployees.map((employee) => (
                <Fragment key={employee.id}>
                    <EmployeeCard {...employee} setLoadedEmployees={setLoadedEmployees} setModalVisible={setModalVisible}
                      newEmployee={newEmployee}
                    />
                    <Divider inline={true} style={{ backgroundColor: 'grey', height: 1 }} />
                </Fragment>
              ))
        }
      </ScrollView>

       <Pressable style={styles.add_button}>
          <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} 
                onPress={()=>{setModalVisible(true)}}/>
       </Pressable>

       {/* Bottom sheet*/}
       <BottomSheet modalProps={{}} isVisible={bottomSheetVisible}>
        {list.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={l.containerStyle}
          onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
        </ListItem>
        ))}
       </BottomSheet>
       {/* Modal for adding a new employee */}
       <Modal animationType="slide" transparent={true} visible={modalVisible}
                  onRequestClose={() => {setModalVisible(false); } } >
            
            
          <View style={styles.modal_container}>
              <View style={styles.modal_content}>
                <Text style={styles.modal_title}>Create a new employee</Text>
                <Avatar activeOpacity={0.2} avatarStyle={{}} containerStyle={{ backgroundColor: colors.primary, margin: 10}}
                        icon={{}} iconStyle={{}} imageProps={{}} onLongPress={() => alert("onLongPress")}
                        onPress={{}} overlayContainerStyle={{}} placeholderStyle={{}}
                        rounded size='large' titleStyle={{color: colors.secondary}}/>
                
                <TextInput style={styles.input} placeholder="Employee name..." placeholderTextColor={'white'} 
                          value={newEmployee.name} onChangeText={(text) =>
                                              setNewEmployee((prevEmployee) => ({ ...prevEmployee, name: text }))
                }/>
                <TextInput style={styles.input} placeholder="Employee email..." placeholderTextColor={'white'} 
                          value={newEmployee.email} onChangeText={(text) =>
                                              setNewEmployee((prevEmployee) => ({ ...prevEmployee, email: text }))
                }/>
                <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                  <Pressable style={{marginRight: 15,}}>
                      <Text onPress={()=> setModalVisible(false)}
                      style={styles.create_button_text}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.create_button}
                     onPress={onCreateButtonPress} >
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
 
  employee_card_pressed: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 5, 
   
    opacity: 0.4
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

  edit_button :{

    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 10,
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,
    bottom: 10, 
    right: 60, 
    opacity: 1

  },
  delete_button:{

    position: 'absolute',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 10,
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 5, 
    paddingHorizontal: 5,
    right: 10,
    bottom: 10, 
    opacity: 1
    

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



export default EmployeeScreen;