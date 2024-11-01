// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen'; // Adjust the path as necessary
import MenuScreen from './screens/MenuScreen'; // Adjust the path as necessary

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash Screen">
        <Stack.Screen name="Splash Screen" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home Screen" component={MenuScreen}  options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
