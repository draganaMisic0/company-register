// SplashScreen.js
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import colors from '../styles/colors.js'; // Adjust this path as necessary

const SplashScreen = ({ navigation }) => {
  const [timePassed, setTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimePassed(true);
      navigation.navigate('Home Screen'); // Navigate after timeout
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [navigation]);

  if (!timePassed) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Entypo name="houzz" size={80} color={'red'} />
        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>
          COMPANY REGISTER
        </Text>
      </View>
    );
  }
  return null; // Render nothing after time has passed and navigation
};

export default SplashScreen;
