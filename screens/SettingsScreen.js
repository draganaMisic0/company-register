import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import MapView, { Marker } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import languageDictionary from './languageDictionary';
import i18next from '../lang/i18n';


const SettingsScreen = () => {

  const [open, setOpen] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language)
  const [value, setValue] = useState(selectedLanguage);
    const [items, setItems] = useState([
       
        { label: 'English' , value: 'en' },
        { label: 'Srpski' , value: 'sr' },
        
    ]);
   

    return (
        <View style={styles.container}>

            <Text style={{color:'white', fontSize: 18, marginLeft: 40, marginTop: 60}}>{i18next.t('settings.selectLanguage')}</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                onChangeValue={lng => {console.log(lng); setSelectedLanguage(lng); i18next.changeLanguage(lng)}}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={styles.dropdown}
                textStyle={styles.text}
                dropDownContainerStyle={styles.dropdownContainer}
                
             />
        </View>
    );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-start',
   
    backgroundColor: colors.primary, 

  },
  dropdown: {
    backgroundColor: colors.light_primary,
    borderColor: '#ccc',
    width: '80%',
    alignSelf: 'center',
    marginTop: 20, 
    
     
  },
  dropdownContainer: {
    backgroundColor: colors.light_primary,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20
   

  },
  text:{

    color: 'white',
    fontSize: 16, 

  }
});


export default SettingsScreen;

   
