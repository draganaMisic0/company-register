import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './BasicAssetsScreen.js';
import BasicAssetsScreen from './BasicAssetsScreen.js';
import EmployeeScreen from './EmployeeScreen.js';
import LocationScreen from './LocationScreen.js';
import AllInventoryListsScreen from './AllInventoryListsScreen.js';
import { Icon } from '@rneui/themed';
import colors from '../styles/colors.js';
import { View, StyleSheet, Text } from 'react-native';
import { color } from '@rneui/base';
import languageDictionary from './languageDictionary.js';
import SettingsScreen from './SettingsScreen.js';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Modal, Portal, Provider } from 'react-native-paper';

const Drawer = createDrawerNavigator();

const MenuScreen = () => {
  const [searchModal, setSearchModal] = useState(false);

  const openSearch = () => {
    setSearchModal(true);
  };

  const iconSize = 30;
  const defaultColor = '#000000';
  const activeColor = colors.secondary;
  const { t } = useTranslation();

  // BasicAssetsScreenWrapper component
  const BasicAssetsScreenWrapper = (props) => {
    return <BasicAssetsScreen {...props} searchModal={searchModal} setSearchModal={setSearchModal} />;
  };

  // EmployeeScreenWrapper component
  const EmployeeScreenWrapper = (props) => {
    return <EmployeeScreen {...props} searchModal={searchModal} setSearchModal={setSearchModal} />;
  };

  // AllInventoryListsScreenWrapper component
  const AllInventoryListsScreenWrapper = (props) => {
    return <AllInventoryListsScreen {...props} searchModal={searchModal} setSearchModal={setSearchModal} />;
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 70,
          marginTop: 0,
        },
      }}
    >
      <Drawer.Screen
        name={t('assets.basicAssets')}
        component={BasicAssetsScreenWrapper}
        options={{
          headerStyle: styles.header,
          headerRight: () => (
            <View style={styles.header_icons}>
              <Icon name="search-outline" type="ionicon" iconStyle={{ marginRight: 20 }} onPress={openSearch} />
            </View>
          ),
          drawerLabel: () => null,
          drawerIcon: ({ focused }) => (
            <Icon name="prism" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor} />
          ),
        }}
      />
      <Drawer.Screen
        name={t('employees.employees')}
        component={EmployeeScreenWrapper}
        options={{
          headerStyle: styles.header,
          headerRight: () => (
            <View style={styles.header_icons}>
              <Icon name="search-outline" type="ionicon" iconStyle={{ marginRight: 20 }} onPress={openSearch} />
            </View>
          ),
          drawerLabel: () => null,
          drawerIcon: ({ focused }) => <Icon name="people" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor} />,
        }}
      />
      <Drawer.Screen
        name={t('location.location')}
        component={LocationScreen}
        options={{
          headerStyle: styles.header,
          drawerLabel: () => null,
          drawerIcon: ({ focused }) => <Icon name="map" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor} />,
        }}
      />
      <Drawer.Screen
        name={t('inventory.inventory')}
        component={AllInventoryListsScreenWrapper}
        options={{
          headerStyle: styles.header,
          headerRight: () => (
            <View style={styles.header_icons}>
              <Icon name="search-outline" type="ionicon" iconStyle={{ marginRight: 20 }} onPress={openSearch} />
            </View>
          ),
          drawerLabel: () => null,
          drawerIcon: ({ focused }) => <Icon name="file-tray-full" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor} />,
        }}
      />
      <Drawer.Screen
        name={t('settings.settings')}
        component={SettingsScreen}
        options={{
          headerStyle: styles.header,
          drawerLabel: () => null,
          drawerIcon: ({ focused }) => <Icon name="settings" type="ionicon" size={iconSize} color={focused ? activeColor : defaultColor} />,
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary, // Change color here
  },
  header_icons: {
    flexDirection: 'row',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default MenuScreen;
