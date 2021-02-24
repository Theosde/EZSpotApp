import React from 'react';
import {View, Text, Button, ScrollView, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem } from 'react-native-elements';
import {connect} from 'react-redux';
import ipAddress from '../../config';

class spotListScreen extends React.Component {

  state = {
    idUser: '',
    spotsList: this.props.dataSpotList
  }

  handleSpotPress = (dataSpot) => {
    this.props.handleListPress(dataSpot);
    this.props.navigation.navigate('Spot')
  }

  componentDidMount(){

    var ctx = this;

    AsyncStorage.getItem("users",(error, data) => {
      if (data) {
        var parseData = JSON.parse(data);
        ctx.setState({
          idUser: parseData._id
        });
        console.log('MAJ du state idUser dans Spot List', this.state.idUser);
        fetch(ipAddress+'/spot/my-spots/'+this.state.idUser)
        .then((response) => {
          return response.json();
        })
        .then((data)=>{
          console.log('fetch OK de spots List',data)
          ctx.setState({
            spotsList: data.spots
          })
        })
        .catch((err)=>{
          console.log('fetch error...', err)
        });
      } else {
        console.log('erreur MAJ du state idUser sur Spot List',error)
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.refreshed){

      var ctx = this;
      ctx.props.handleNewSpot()

      fetch(ipAddress+'/spot/my-spots/'+this.state.idUser)
      .then((response) => {
        return response.json();
      })
      .then((data)=>{
        ctx.setState({
          spotsList: data.spots
        })
        console.log('MAJ de spotList dans le didUpdate', this.state.spotsList)
      })
      .catch((error)=>{
        console.log('fetch spotList error...', error)
      });
    }
  }

  render() {

    var mySpots = this.state.spotsList.map((spot,x) => (<ListItem key={x} title={spot.name} subtitle={spot.description} onPress={()=>this.handleSpotPress(spot)} leftIcon={<Icon name='map-marker' type='font-awesome' color="#12100E"/>} rightIcon={<Icon name='caret-right' type='font-awesome' color="#12100E"/>} />));

    return (
      <ScrollView>
        <View>
          {mySpots}
        </View>
      </ScrollView>);
  }
}

function mapStateToProps(state){
  console.log("LOG FRONT SPOT LIST",state.DataSpotList);
  return {
    dataSpotList: state.DataSpotList.spots,
    refreshed: state.refreshSpotList

  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleListPress: function(newSpot) {
      console.log('dispatchToProps from Spot List', newSpot);
      dispatch({
        type: 'newspot',
        newSpot: newSpot
      })
    },
    handleNewSpot: function() {
      dispatch({
        type: 'refreshSpotList'
      })
    }
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(spotListScreen);
