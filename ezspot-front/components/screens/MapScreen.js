import React from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker} from 'react-native-maps';
import { Location, Permissions } from 'expo';
import ipAddress from '../../config';
import {connect} from 'react-redux';

class mapScreen extends React.Component {

  constructor(){
    super();
    this.handleCalloutPress = this.handleCalloutPress.bind(this);
    this.state = {
      latitude: 0,
      longitude: 0,
      errorMessage: null,
      markers: [],
      idUser: '',
    }
  }

  handleCalloutPress(dataSpot) {
    this.props.handleMarkerPress(dataSpot);
    this.props.navigation.navigate('Spot')
  }

  componentDidMount() {

    var ctx = this;

    AsyncStorage.getItem("users",(error, data) => {
      if (data) {
        var parseData = JSON.parse(data);
        ctx.setState({
          idUser: parseData._id
        });

// DATA SPOT LISTE
        fetch(ipAddress+'/spot/my-spots/'+this.props.userdata._id)
        .then((response) => {
          return response.json();
        })
        .then((spotsListe)=>{

          this.props.DataSpotList(spotsListe)

          // console.log('fetch OK de spots List',spotsListe)
        })
        .catch((err)=>{
          console.log('fetch error...', err)
        });


//DATA USER PROFILE
        fetch(ipAddress+"/user/profile/"+this.props.userdata._id)
        .then((response) => {
          return response.json();
        })
        .then((dataMedia) => {
          // console.log("fetch retour",dataMedia);

          this.props.addStateUser({nbFollow:dataMedia.nbFollow,nbMedia:dataMedia.nbMedia,nbMediaLike:dataMedia.nbMediaLike,name:parseData.userName,allMedia:dataMedia.allMedia})

        })
        .catch((error) => {
          console.log('Request failed didmount', error)
        });

        console.log('MAJ du state idUser dans Map avec local storage', parseData._id);
      } else {
        console.log('erreur didMount idUser sur Map',error)
      }
    });


    fetch(ipAddress+'/spot/spots-list')
    .then((response) => {
      return response.json();
    })
    .then((data)=>{
      ctx.setState({
        markers : data.data
      });
    })
    .catch((err)=>{
      console.log('fetch error...', err)
    });
  }

  componentDidUpdate(prevProps, prevState){
    console.log("prevProps",prevProps);
    console.log("refresh azertyuiop^mlkjhgfdswxcvbn,;",this.props.markerRefreshed);
    if (this.props.markerRefreshed){
      var ctx = this;

      fetch(ipAddress+'/spot/spots-list')
      .then((response) => {
        return response.json();
      })
      .then((data)=>{
        ctx.props.handleNewSpot()
        ctx.setState({
          markers : data.data
        });
      })
      .catch((error)=>{
        console.log('fetch error...', error)
      });
    }
  }

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      })
    }

    Location.watchPositionAsync({distanceInterval: 5}, (location) => {
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    });
  }

  render() {

    var Markers = this.state.markers.map((spot,x) => {
      return(<Marker key={x} pinColor="#12FADD" title={spot.name} description={spot.description} onCalloutPress={() => this.handleCalloutPress(spot)} coordinate={{latitude:spot.lat, longitude: spot.lon}}/>)
    });

    return (
        <View style={{flex : 1}}>
          <MapView style={{flex : 1}}

            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsMyLocationButton
          >
            {Markers}
          </MapView>
          <Button
            buttonStyle={{backgroundColor: '#12FADD'}}
            titleStyle={{color: '#12100E'}}
            icon={
              <Icon
                name="map-marker"
                size={15}
                color="#12100E"
              />
            }
            title=" ADD A SPOT"
            onPress={() => this.props.navigation.navigate('SpotPosition')}
          />
        </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleMarkerPress: function(newSpot) {
      console.log('dispatch Marker from Map component', newSpot);
      dispatch({
        type: 'newspot',
        newSpot: newSpot
      })
    },
    handleNewSpot: function() {
      dispatch({
        type: 'markerRefreshed'
      })
    },
    addStateUser: function(data) {
      dispatch({
        type: 'StateUser',
        userState: data
      })
    },
    DataSpotList: function(list) {
      console.log("mapdispatch",list);
      dispatch({
        type: 'spotListData',
        spotList: list
      })
    }
  }
};

function mapStateToProps(state){
  console.log("mapStateToProps MAP SCREEN",state.refreshed);
  return {
    markerRefreshed: state.refreshed
  },
  {
    userdata: state.userData
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapScreen);
