import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Navigation from './components/navigation/Navigation';

import DataSpotList from './reducer/DataSpotList.reducer';
import userData from './reducer/SaveDataUser.reducer';
import stateUser from './reducer/SaveStateUser.reducer';
import spotMarker from './reducer/marker.reducer';
import newSpot from './reducer/newspot.reducer';
import actualisationProfile from './reducer/actualisationProfile.reducer';
import actualisationMap from './reducer/actualisationProfile.reducer';
import refreshed from './reducer/reducer.refresh';
import refreshSpotList from './reducer/reducer.refreshSpotList';
import refreshFeed from './reducer/reducer.refreshFeed';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

const store = createStore(combineReducers({spotMarker, newSpot, refreshed, actualisationProfile,actualisationMap,userData,stateUser,DataSpotList,refreshSpotList,refreshFeed}));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation/>
      </Provider>
    );
  }
}
