// App.js
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen'; // Adjust the path as necessary
import MenuScreen from './screens/MenuScreen'; // Adjust the path as necessary
import InventoryListScreen from './screens/InventoryListScreen';
import colors from './styles/colors';
import AssetDetailsScreen from './screens/AssetDetailsScreen';
import EditAssetScreen from './screens/EditAssetScreen';
import SettingsScreen from './screens/SettingsScreen';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { connectToDatabase, getAllEmployees, addEmployee, createTables} from './database/db_queries';
import * as FileSystem from 'expo-file-system';
import {Asset}  from 'expo-asset';

//import * as SQLite from 'expo-sqlite';
//import {useSQLiteContext} from 'expo-sqlite/next';


const Stack = createStackNavigator();
/*const loadDatabase = async () =>{
  const dbName= "company.db";
  const dbAsset= require("./database/company.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath=`${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo= await FileSystem.getInfoAsync(dbFilePath);
  if(!fileInfo.exists){
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQlite`,
      {intermediates: true}
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
  const db = useSQLiteContext();


  // Query the employee table
  db.withTransactionSync(async () =>{
    await getData();
  })
  

}
async function getData() {
  const result = await db.getAllAsync('select * from employee');
  console.log(result);
}
  */
const App = () => {

  //const [dbLoaded, setDbLoaded] = useState(false);

  const exportDatabase = async () => {
    console.log("udje");
    const databaseName = 'companyRegister.db';
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;
    const downloadPath = `${FileSystem.cacheDirectory}companyRegister.db`;
  
    try {
      await FileSystem.copyAsync({
        from: dbFilePath,
        to: downloadPath,
      });
  
      console.log('Database copied to:', downloadPath);
    } catch (error) {
      console.error('Error copying database:', error);
    }
  };
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      if (!db) {
        throw new Error("Database connection returned null or undefined");
      }
      console.log("EVO TI JE BAZE PRIJE KREIRANJA TABELA");
      console.log(db);
      await createTables(db);
      await addEmployee(db, {name: "Joka", email: "joka@mail", avatarUrl: "joka.png"});
      const  allemployees = await getAllEmployees(db);
      allemployees.forEach(employee => {
        console.log(`Employee ID: ${employee.id}`);
        console.log(`Name: ${employee.name}`);
        console.log(`Email: ${employee.email}`);
        console.log('----------------------------'); // Add a separator for better readability
      });

      
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
    }
  }, []);
  
  useEffect(()=>{
    
    
    const initializeApp = async () => {
      await loadData();
      await exportDatabase();
    };
    initializeApp();
      
  
  }, [loadData]);

  
  return (
    
    <SQLiteProvider databaseName='companyRegister.db'>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash Screen">
        <Stack.Screen name="Splash Screen" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home Screen" component={MenuScreen}  options={{headerShown: false}} />
        <Stack.Screen name="Inventory List"  component={InventoryListScreen} options={{headerStyle: { backgroundColor: colors.secondary}}}/>
        <Stack.Screen name="Asset Details" component={AssetDetailsScreen}  options={{headerShown: false, 
        headerLeft: () => ( <Icon name="arrow-back" type="ionicon" size={24} iconStyle={{ marginLeft: 10 }} 
           onPress={() => navigation.goBack()} />),}} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    </SQLiteProvider>
        
  );
};

export default App;
