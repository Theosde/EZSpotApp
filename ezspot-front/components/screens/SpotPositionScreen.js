import React from 'react';
import {View, Text} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker} from 'react-native-maps';
import { Location, Permissions } from 'expo';
import {connect} from 'react-redux';

class spotPositionScreen extends React.Component {

  constructor(){
    super();
    this.handlePress = this.handlePress.bind(this);
    this.state = {
      latitude: 0,
      longitude: 0,
      errorMessage: null,
      newSpotLat: 0,
      newSpotLong: 0
    }
  }

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {

    Location.watchPositionAsync({distanceInterval: 5}, (location) => {
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    });
  }

  handlePress(data) {
    console.log("nativeEvent",data.nativeEvent);
    this.setState({
      newSpotLat: data.nativeEvent.coordinate.latitude,
      newSpotLong: data.nativeEvent.coordinate.longitude,
      latitude: data.nativeEvent.coordinate.latitude,
      longitude: data.nativeEvent.coordinate.longitude
    });
    this.props.handleCoordinate(data.nativeEvent.coordinate.latitude, data.nativeEvent.coordinate.longitude)
    this.props.navigation.navigate('SpotForm');
  }

  render() {

    var newMarker = <Marker coordinate={{latitude: this.state.newSpotLat, longitude: this.state.newSpotLong}}/>;

    return (
        <View style={{flex : 1}}>
          <MapView style={{flex : 1}}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.01,
            }}
            showsMyLocationButton
            onPress={this.handlePress}
          >
            {newMarker}
          </MapView>
        </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleCoordinate: function(newLat, newLong) {
      dispatch({
        type: 'addspot',
        spotLat: newLat,
        spotLong: newLong
      })
    }
  }
};

export default connect(
  null,
  mapDispatchToProps
)(spotPositionScreen);
