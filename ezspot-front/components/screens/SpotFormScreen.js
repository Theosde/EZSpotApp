import React from 'react';
import {View, ScrollView, StyleSheet, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, CheckBox, Slider, Button, Text } from 'react-native-elements';
import {connect} from 'react-redux';
import ipAddress from '../../config';

class spotFormScreen extends React.Component {

  state = {
    name: '',
    description: '',
    userId: '',
    checkedLedge: false,
    checkedStairs: false,
    checkedRail: false,
    checkedGap: false,
    accessNewbie: false,
    accessAdvanced: false,
    accessPro: false,
    accessUndefined: false,
    checkedPublic: false,
    checkedPrivate: false,
    checkedIndoor: false,
    checkedOutdoor: false
  }

  handleSubmit = () => {

    AsyncStorage.getItem("users",(error, data) => {
      if (data) {
        parseData = JSON.parse(data);
        console.log(parseData);

        var ctx = this;

        var spot = {
          name: this.state.name.trim(),
          description: this.state.description.trim(),
          type: {
            ledge: this.state.checkedLedge,
            stairs: this.state.checkedLedge,
            rail: this.state.checkedRail,
            gap: this.state.checkedGap
          },
          level: {
            newbie: this.state.accessNewbie,
            advanced: this.state.accessAdvanced,
            pro: this.state.accessPro,
            undefined: this.state.accessUndefined
          },
          environment: {
            public: this.state.checkedPublic,
            private: this.state.checkedPrivate,
            indoor: this.state.checkedIndoor,
            outdoor: this.state.checkedOutdoor
          },
          lat: this.props.coordinate.latitude,
          lon: this.props.coordinate.longitude,
          users: parseData._id
        }

        fetch(ipAddress + '/spot/add-spot', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(spot)
        })
        .then((response) =>{
          return response.json()
        }).then((data)=>{
          console.log('fetch spot',data);
          ctx.props.handleSpotData(data);
          ctx.props.handleNewSpot();
          ctx.props.refrechSPOTLIST()
          this.props.navigation.navigate('Spot')
        }).catch((error)=>{
          console.log(error);
        });
      }else {
        console.log("No Data in Local Storage");
      }
    })

  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text h3 style={styles.title}>Create your spot (2/2)</Text>
          <Input
            inputContainerStyle={styles.input}
            label='SPOT NAME'
            labelStyle={styles.label}
            placeholder=''
            onChangeText={(e)=> this.setState({name: e})}
          />
          <Input
            inputContainerStyle={styles.input}
            label='DESCRIPTION'
            labelStyle={styles.label}
            placeholder=''
            onChangeText={(e)=> this.setState({description: e})}
          />
          <View>
            <Text h4 style={styles.label}>TYPE</Text>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Ledge'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedLedge}
                onPress={() => this.setState({checkedLedge: !this.state.checkedLedge})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Stairs'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedStairs}
                onPress={() => this.setState({checkedStairs: !this.state.checkedStairs})}
              />
            </View>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Rail'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedRail}
                onPress={() => this.setState({checkedRail: !this.state.checkedRail})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Gap'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedGap}
                onPress={() => this.setState({checkedGap: !this.state.checkedGap})}
              />
            </View>
          </View>
          <View>
            <Text h4 style={styles.label}>LEVEL</Text>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Newbie'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.accessNewbie}
                onPress={() => this.setState({accessNewbie: !this.state.accessNewbie})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Advanced'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.accessAdvanced}
                onPress={() => this.setState({accessAdvanced: !this.state.accessAdvanced})}
              />
            </View>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Pro'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.accessPro}
                onPress={() => this.setState({accessPro: !this.state.accessPro})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Undefined'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.accessUndefined}
                onPress={() => this.setState({accessUndefined: !this.state.accessUndefined})}
              />
            </View>
          </View>
          <View>
            <Text h4 style={styles.label}>ENVIRONMENT</Text>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Public'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedPublic}
                onPress={() => this.setState({checkedPublic: !this.state.checkedPublic})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Private'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedPrivate}
                onPress={() => this.setState({checkedPrivate: !this.state.checkedPrivate})}
              />
            </View>
            <View style={styles.checkbox}>
              <CheckBox
                containerStyle={styles.check}
                title='Indoor'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedIndoor}
                onPress={() => this.setState({checkedIndoor: !this.state.checkedIndoor})}
              />
              <CheckBox
                containerStyle={styles.check}
                title='Outdoor'
                textStyle={{color: "#12100E"}}
                checkedColor='#12FADD'
                checked={this.state.checkedOutdoor}
                onPress={() => this.setState({checkedOutdoor: !this.state.checkedOutdoor})}
              />
            </View>
          </View>
          <Button
            buttonStyle={{backgroundColor: '#12FADD', margin: 20, padding: 10}}
            titleStyle={{color: '#12100E'}}
            icon={
              <Icon
                name="map-marker"
                size={15}
                color="#12100E"
              />
            }
            title=" CREATE YOUR SPOT"
            onPress={this.handleSubmit}
          />
        </View>
      </ScrollView>);
  }
};

function mapStateToProps(state) {
  console.log('state sur le spotFormScreen : coordonnées', state);
  return {coordinate: state.spotMarker}
}

function mapDispatchToProps(dispatch) {
  return {
    handleSpotData: function(newSpot) {
      console.log('dispatch handleSpotData', newSpot);
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
    refrechSPOTLIST: function() {
      dispatch({
        type: 'refreshSpotList'
      })
    }
  }
};

const styles = StyleSheet.create(
  {
    checkbox: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    },
    check: {
      width: '50%',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    input: {
      marginTop: 10,
      marginBottom: 10
    },
    label: {
      fontSize: 20,
      color: "#12100E",
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 20
    },
    title: {
      color: "#12100E",
      fontWeight: 'bold',
      marginTop: 25,
      marginBottom: 25
    }
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(spotFormScreen);
