// App.js
import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen'; // Adjust the path as necessary
import MenuScreen from './screens/MenuScreen'; // Adjust the path as necessary
import InventoryListScreen from './screens/InventoryListScreen';
import colors from './styles/colors';
import AssetDetailsScreen from './screens/AssetDetailsScreen';
import EditAssetScreen from './screens/EditAssetScreen';
import SettingsScreen from './screens/SettingsScreen';
import { createTables, connectToDatabase } from './database/database';

const Stack = createStackNavigator();

const loadTables = useCallback(async () =>{

  try{
    const db=await connectToDatabase();
    if(!db)
    {
      throw new Error("Database connection return null or undefined");
    }
    await createTables(db);
  }
  catch(error){
    console.error(error.message);

  }
}, []);
const db = useSQLiteContext();
useEffect(()=>{
  
  loadTables();
  
}, [])
const App = () => {
  return (
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
  );
};

export default App;
