import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, TextInput, Alert} from 'react-native';
import colors from '../styles/colors';
import {Image } from '@rneui/base';
import { ButtonGroup, Icon} from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { getAllInventoryLists } from '../database/db_queries';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { addInventoryList, deleteInventoryList } from '../database/db_queries';


const InventoryListCard = ({
    id,
    name="Inventory List Name",
    setLoadedInventoryLists
}) => {

    const [deleteModalVisible, setDeleteModalVisible]= useState(false);
  
    let db; 
    db = useSQLiteContext();
    
    const loadInventoryLists = async (db) => {
      try {
        setLoadedInventoryLists(await getAllInventoryLists(db));
      } catch (error) {
        console.error('Error loading inventory lists:', error);
      }
    };
    const onLongPress = () => {
      
      setDeleteModalVisible(true);
    };
    
    const onCancelPress =( )=>{

      setDeleteModalVisible(false);
    }
    const onDeleteButtonPress=()=>{

      deleteInventoryList(db, id);
      setDeleteModalVisible(false);
      loadInventoryLists(db);
    }
    const navigation=useNavigation();
    const handlePress=()=>{
        navigation.navigate('Inventory List', {listId: id, listName: name, setLoadedInventoryLists});
    }
    
    return (

      <View>
        <Pressable onPress={handlePress} onLongPress={onLongPress} >
          <View style={styles.list_container}>
          
            <Text style={styles.list_name}>{name}</Text>
            <Modal animationType="slide" transparent={true} visible={deleteModalVisible}
                            onRequestClose={() => {setDeleteModalVisible(false); } } >
                    <View style={styles.modal_container}>
                      <View style={styles.modal_content}>
                      
                        <Text style={styles.modal_title}>Delete Inventory List</Text>
                        
                        <Text style={{fontSize: 14, color:'white', alignSelf:'flex-start', marginBottom: 20}}>Are you sure you want to delete this inventory list?</Text>
                      <View style={{flexDirection: 'row', alignSelf:'flex-end', alignItems:'center'}}>
                      <Pressable style={{marginRight: 15}} onPress={onCancelPress}>
                          <Text style={styles.submit_button_text}>Cancel</Text>
                      </Pressable>
                      <Pressable style={{backgroundColor: colors.secondary, width: 80, height: 30, borderRadius: 10, justifyContent:'center'}}
                                  onPress={onDeleteButtonPress} >
                          <Text style={styles.submit_button_text}>Delete</Text>
                      </Pressable>
                      </View>
                      </View>
                    </View>
                  </Modal>
         
           </View>
        </Pressable>
      </View>
    );
}

const AllInventoryListsScreen = ({searchModal, setSearchModal}) => {

    let db; 
    db = useSQLiteContext();
    const [loadedInventoryLists, setLoadedInventoryLists] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newInventoryList, setNewInventoryList] = useState('');
    const [filteredLists, setFilteredLists]=useState([]);
      const [searchValue, setSearchValue]=useState('');
    const navigation=useNavigation();
    const loadInventoryLists = async (db) => {
    try {

      const tempLists=await getAllInventoryLists(db);
      console.log("tempList");
      console.log(tempLists);
      
      setLoadedInventoryLists(tempLists);
      console.log("duzina liste");
      console.log(loadedInventoryLists.length);
    } catch (error) {
      console.error('Error loading inventory lists:', error);
    }
  };
    useEffect( () => {
     // console.log("loading inventory lists");
       loadInventoryLists(db);
    }, []);

    

   
    const onAddButtonPress= () => {

     // console.log("add inventory list pressed");
      

    }
    const onSubmitButtonPress = async () => {
      try {
        // Log the new inventory list name for debugging
        //console.log(`New inventory list: ${newInventoryList}`);
    
        if (!newInventoryList.trim()) {
          console.error("Inventory list name cannot be empty.");
          return;
        }
        const result = await addInventoryList(db, { name: newInventoryList });
        await loadInventoryLists(db);
        setModalVisible(false);
      }
      catch(error){
        console.log(error);
      }
    };
    const handleSearch=(searchValue)=>{

      setSearchValue(searchValue);
      setFilteredLists(loadedInventoryLists);
      const filteredLists = loadedInventoryLists.filter(item => 
        (item.name && item.name.toLowerCase().includes(searchValue.toLowerCase()))
      
      );
      console.log("gotovo filtriranje");
      console.log(filteredLists);
      setFilteredLists(filteredLists);
     // setSearchModal(false);
  
    }

    return (
        
        <View style={styles.container}>
            <ScrollView>
               
            {
              loadedInventoryLists.map((list) => (
              <InventoryListCard key={list.id} {...list} setLoadedInventoryLists={setLoadedInventoryLists} />
                ))
            }
      
              
            </ScrollView>
            <Pressable style={styles.add_button} onPress={()=> {setModalVisible(true); setNewInventoryList('');}}>
                <Icon name="add" type="ionicon" size={24} iconStyle={{ color: 'black', fontWeight:'bold'}} />
            </Pressable>
            
            <Modal animationType="slide" transparent={true} visible={modalVisible}
                  onRequestClose={() => {setModalVisible(false); } } >
            
            
            <View style={styles.modal_container}>
              <View style={styles.modal_content}>
                <Text style={styles.modal_title}>Create a new inventory list</Text>
                <TextInput style={styles.input} placeholder="Inventory list name..." placeholderTextColor={'white'} 
                          value={newInventoryList} onChangeText={setNewInventoryList}/>
                <View style={{flexDirection: 'row', justifyContent:'flex-end'}}>
                <Pressable style={styles.cancel_button}
                    onPress={()=> setModalVisible(false)} >
                  <Text style={styles.submit_button_text}>Cancel </Text>
                </Pressable>
                <Pressable style={styles.submit_button}
                 onPress={onSubmitButtonPress} >
                  <Text style={styles.submit_button_text}>Submit </Text>
                </Pressable>
                </View>
              </View>
            </View>
            </Modal>


{/*Search modal*/}
        
                <Modal animationType="slide" transparent={true} visible={searchModal} 
                          onRequestClose={() => {setSearchModal(false); } }>
                  <View style={styles.search_modal}>
                      
                      <TextInput style={styles.input_search} placeholder="Search..." placeholderTextColor={'white'} 
                                  value={searchValue} onChangeText={(text) =>{
                                    setFilteredLists(loadedInventoryLists);
                                    setSearchValue(text);
                                  }
                                                      
                      }/>
                      <Icon name="search-circle-outline" type="ionicon" iconStyle={{marginRight:14, color:'white', marginLeft:20, bottom:3}}
                          onPress={()=>{
                            console.log(searchValue);
                            handleSearch(searchValue);}}
                       />
                  </View>
        
                  <ScrollView style={styles.scroll_view}>
            
            {
              filteredLists.map((list, index) => (
              
               
                 <InventoryListCard {...list} />
              
        
          ))
            }
              
            </ScrollView>   
                
              </Modal>
    
        </View>
    )
}
const styles = StyleSheet.create({

  input_search: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      color: 'white',
      
      
      
    },
    search_modal:{
    
        width: '100%',
        backgroundColor: colors.primary,
        padding: 10,
        flexDirection:'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        color:'white', 
        marginTop:56
        
        
    
      },
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
  }
});


export default AllInventoryListsScreen;