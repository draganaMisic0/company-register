import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './BasicAssetsScreen.js';
import BasicAssetsScreen from './BasicAssetsScreen.js';
import EmployeeScreen from './EmployeeScreen.js';
import LocationScreen from './LocationScreen.js';
import AllInventoryListsScreen from './AllInventoryListsScreen.js';
import { Icon } from '@rneui/themed';
import colors from '../styles/colors.js'
import { View, StyleSheet, Text } from 'react-native';
import { color } from '@rneui/base';
import languageDictionary from './languageDictionary.js';
import SettingsScreen from './SettingsScreen.js'
import { useTranslation } from 'react-i18next';


const Drawer= createDrawerNavigator();



const MenuScreen = () => {


  //const selectedLanguage = languageDictionary[value];
    
    const iconSize = 30;
    const defaultColor = '#000000';
    const activeColor = colors.secondary;
    const {t} = useTranslation();

    return (
        <Drawer.Navigator screenOptions={{
                        drawerStyle: {
                        backgroundColor: colors.primary,
                        width: 70,
                        marginTop: 0, 
                    },
        }}>
            
            <Drawer.Screen  name={t('assets.basicAssets')}  component={BasicAssetsScreen} 
            options={{headerStyle:styles.header, headerRight: ()=> (
              <View style={styles.header_icons}>
                <Icon name="search-outline" type="ionicon" iconStyle={{marginRight:10}} />
               
              </View> ), 

            drawerLabel: () => null, drawerIcon: ({ focused }) => <Icon name="prism" type="ionicon" 
            size={iconSize} color={focused ? activeColor : defaultColor}/>}}
            />
            <Drawer.Screen  name={t('employees.employees')} component={EmployeeScreen} 
            options={{headerStyle:styles.header, headerRight: ()=>(
              <View style={styles.header_icons}>
                <Icon name="search-outline" type="ionicon" iconStyle={{marginRight:10}} />
              

              </View>
            ),drawerLabel: () => null, drawerIcon: ({ focused}) => <Icon name="people" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor}/>}}/>
            <Drawer.Screen  name={t('location.location')} component={LocationScreen} 
            options={{headerStyle:styles.header, 
            headerRight: ()=>(
              <View style={styles.header_icons}>
                <Icon name="search-outline" type="ionicon" iconStyle={{marginRight:10}} />
              

              </View>
            ),
            drawerLabel: () => null, drawerIcon: ({ focused }) => <Icon name="map" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor}/>}}/>
            <Drawer.Screen  name={t('inventory.inventory')} component={AllInventoryListsScreen} 
            options={{headerStyle:styles.header, 
            headerRight: ()=>(
              <View style={styles.header_icons}>
                <Icon name="search-outline" type="ionicon" iconStyle={{marginRight:10}} />
              

              </View>
            ),
            drawerLabel: () => null, drawerIcon: ({ focused }) => <Icon name="file-tray-full" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor}/>}}/>
            <Drawer.Screen  name={t('settings.settings')} component={SettingsScreen} 
            options={{headerStyle:styles.header, drawerLabel: () => null, drawerIcon: ({ focused }) => <Icon name="settings" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor}/>}}/>
        </Drawer.Navigator>
    );

}

const styles = StyleSheet.create({
  header: {

    backgroundColor: colors.secondary, // Change color here
  },
  header_icons:{
    flexDirection: 'row', 
  }
});
export default MenuScreen;