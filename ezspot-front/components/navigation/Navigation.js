import React from 'react';
import {Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';

// import des différents composants
import CameraScreen from '../screens/CameraScreen';
import FeedScreen from '../screens/FeedScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SpotFormScreen from '../screens/SpotFormScreen';
import SpotPositionScreen from '../screens/SpotPositionScreen';
import SpotScreen from '../screens/SpotScreen';
import SpotsListScreen from '../screens/SpotsListScreen';

const MainNavigator = createBottomTabNavigator({
  Map: MapScreen,
  Feed: FeedScreen,
  Spots: SpotsListScreen,
  Profile: ProfileScreen
}, {
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, horizontal, tintColor}) => {
      var iconName;
      var outline = (focused)
        ? ''
        : '';
      if (navigation.state.routeName == 'Map') {
        Platform.OS === 'ios'
          ? iconName = 'ios-map'
          : iconName = 'md-map'
      } else if (navigation.state.routeName == 'Feed') {
        Platform.OS === 'ios'
          ? iconName = 'ios-paper'
          : iconName = 'md-paper'
      } else if (navigation.state.routeName == 'Spots') {
        Platform.OS === 'ios'
          ? iconName = 'ios-flag'
          : iconName = 'md-flag'
      } else if (navigation.state.routeName == 'Profile') {
        Platform.OS === 'ios'
          ? iconName = 'ios-person'
          : iconName = 'md-person'
      }

      return <Ionicons name={iconName + outline} size={25} color={tintColor}/>;
    }
  }),
  tabBarOptions: {

    activeTintColor: '#F4D03F',
    inactiveTintColor: '#12FADD',
    style: {
      backgroundColor: '#12100E',
    }
  }
});

var StackNavigator = createStackNavigator({
  Home: HomeScreen,
  SpotPosition: SpotPositionScreen,
  Spot: SpotScreen,
  SpotForm: SpotFormScreen,
  Camera: CameraScreen,
  MainNavigator: MainNavigator,
},{
  defaultNavigationOptions:{
    headerTitle: 'EZ Spot',
    headerTitleStyle: {color: '#12FADD'},
    headerStyle: {backgroundColor: '#12100E'},
    headerLeft: null
  }
})


export default Navigation = createAppContainer(StackNavigator);
