import React from 'react';
import {View, StyleSheet, AsyncStorage, ScrollView} from 'react-native';
import {Image, Text, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import ipAddress from '../../config';
import ActuComponent from './actuComponent'
import { Constants, ImagePicker, Permissions } from 'expo';

class spotScreen extends React.Component {

  state = {
    follow: true,
    idUser: '',
    feed: {}
  }

  componentDidMount() {

    AsyncStorage.getItem("users", (error, data) => {
      console.log('data user en local storage sur la page spot', data);
      if (data) {
        var parseData = JSON.parse(data);
        console.log('log de parseData._id avec local storage', parseData._id);
        if (this.props.spotData.users.includes(parseData._id)) {
          this.setState({follow: false, idUser: parseData._id});
          console.log('MAJ du state idUser avec local storage', this.state.idUser)
        } else {
          this.setState({idUser: parseData._id})
        }
      } else {
        console.log('erreur didMount follow', error)
      }
    });

var ctx = this;

    fetch(ipAddress + '/spot/spot-medias/' + this.props.spotData._id).then((response) => {
      return response.json();
    }).then((data) => {
      console.log("result :", data);
      ctx.setState({
        feed: data.feed
      })
    }).catch((err) => {
      console.log('fetch error sur le spot-medias ...', err)
    });
  }


  handleFollow = () => {
    this.props.refrechMAP();
    this.props.refrechFEED();
    this.props.refrechSPOTLIST();
    console.log('console log idUser dans handleFollow', this.state.idUser)
    fetch(ipAddress + '/spot/follow/' + this.state.follow + '/' + this.props.spotData.name + '/' + this.state.idUser).then((response) => {
      return response.json()
    }).then((data) => {
      console.log('log des datas OK dans handleFollow', data);
      this.setState({
        follow: !this.state.follow
      })
    }).catch((error) => {
      console.log('erreur clic bouton follow', error);
    });
  }

 takePhoto = async () => {
const {
status: cameraPerm
} = await Permissions.askAsync(Permissions.CAMERA);
const {
status: cameraRollPerm
} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
// only if user allows permission to camera AND camera roll
if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
let pickerResult = await ImagePicker.launchCameraAsync({
allowsEditing: true,
aspect: [4, 3],
});
this.handleImagePicked(pickerResult);
}
};

 handleImagePicked = async pickerResult => {
let uploadResponse, uploadResult;
try {
this.setState({
uploading: true
});
if (!pickerResult.cancelled) {
  console.log("uri :", pickerResult.uri);
  console.log("je suis dans la fonction");
    AsyncStorage.getItem("users", (error, dataUser) => {
      if (dataUser) {
        parseData = JSON.parse(dataUser);
        var data = new FormData();

        data.append("spotId", this.props.spotData._id)
        data.append('userId', parseData._id)

        data.append('photo', {
          uri: pickerResult.uri,
          type: 'image/jpeg',
          name: 'nomImage'
        });

        fetch(ipAddress + "/media/upload-media", {
          method: 'post',
          body: data
        }).then(res => {
          console.log(res);
        }).then(data => {
          this.props.actualisationProfile()
        })
      }
    })
}
} catch (e) {
console.log("clog 1 :", uploadResponse );
console.log("clog 2 :", uploadResult );
console.log("clog 3 :", e );
} finally {
this.setState({
uploading: false
});
}
};

render() {

if (this.state.feed.medias) {
    var  spotMedia = this.state.feed.medias.map((medias,x) =>{
        return <ActuComponent key={x} idUser={this.state.idUser} nameMedia={medias.name} likeStatus={medias.likedBy} handleClickParent={this.handleClick} urlImgSpot='../../assets/skatesession.jpg' spotName=" " userName={medias.user.userName} urlImgMedia={medias.cloudinaryUrl} updateDate={medias.timestamp} />
      })
    }

  console.log('render dans le composant spot', this.props.spotData);

  var arrayType = Object.keys(this.props.spotData.type);
  var typeTrue = arrayType.map(x => {
    if (this.props.spotData.type[x]) {
      return <Text key={x}>{x}</Text>
    }
  });

  var levelType = Object.keys(this.props.spotData.level);
  var levelTrue = levelType.map(y => {
    if (this.props.spotData.level[y]) {
      return <Text key={y}>{y}</Text>
    }
  });

  var environmentType = Object.keys(this.props.spotData.environment);
  var environmentTrue = environmentType.map(z => {
    if (this.props.spotData.environment[z]) {
      return <Text key={z}>{z}</Text>
    }
  });

  return (
    <ScrollView>
      <View style={styles.container}>
    {/* <MapView
      style={{flex: 1}}
      provider={PROVIDER_GOOGLE}
      region={{
        latitude: 45.76305449192256,
        longitude: 4.849400093271003,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    /> */
    }
    <Image source={require('../../assets/skatesession.jpg')} style={styles.image}/>
    <View style={styles.title}>
      <View>
        <Text style={styles.text}>{this.props.spotData.name.toUpperCase()}</Text>
        <Text style={styles.text}>{this.props.spotData.description}</Text>
      </View>
      <Button buttonStyle={this.state.follow
          ? {
            backgroundColor: '#12FADD'
          }
          : {
            backgroundColor: '#12100E'
          }} titleStyle={this.state.follow
          ? {
            color: '#12100E'
          }
          : {
            color: '#12FADD'
          }} title={this.state.follow
          ? "FOLLOW"
          : "UNFOLLOW"} onPress={this.handleFollow}/>
    </View>
    <View>
      <View style={styles.assets}>
        <Text style={styles.assetsTitles}>TYPE</Text>
        <Text style={styles.assetsTitles}>LEVEL</Text>
        <Text style={styles.assetsTitles}>PLACE</Text>
      </View>
      <View style={styles.assets}>
        <View style={styles.props}>
          {typeTrue}
        </View>
        <View style={styles.props}>
          {levelTrue}
        </View>
        <View style={styles.props}>
          {environmentTrue}
        </View>
      </View>
    </View>
    <View style={styles.title}>
      <Button buttonStyle={{
          backgroundColor: '#12100E',
          margin: 20,
          padding: 10
        }} titleStyle={{
          color: '#12FADD'
        }} icon={<Icon
        name = "backward"
        size = {
          15
        }
        color = "#12FADD"
        />} title=" BACK TO MAP" onPress={() => this.props.navigation.navigate('Map')}/>
      <Button buttonStyle={{
          backgroundColor: '#12FADD',
          margin: 20,
          padding: 10
        }} titleStyle={{
          color: '#12100E'
        }} icon={<Icon
        name = "image"
        size = {
          15
        }
        color = "#12100E"
      />} title=" ADD A MEDIA" onPress={this.takePhoto}/>

    </View>
  </View>
    <View style={{flex: 1}}>
        {spotMedia}
    </View>
</ScrollView>

);
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center'
},
image: {
  width: 400,
  maxHeight: 175
},
title: {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 10
},
text: {
  fontSize: 20,
  color: "#12100E"
},
assets: {
  backgroundColor: "#F4D03F",
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'center'
},
assetsTitles: {
  flexDirection: 'row',
  width: '33%',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: 5,
  fontSize: 15,
  color: "#12100E",
  fontWeight: 'bold',
  alignItems: 'center',
  padding: 10
},
props: {
  flexDirection: 'column',
  width: '33%',
  justifyContent: 'flex-start',
  textAlign: 'center',
  borderRadius: 5,
  fontSize: 15,
  color: "#12100E",
  alignItems: 'center',
  padding: 5,
  marginTop: 5,
  marginBottom: 5
}
})

function mapStateToProps(state) {
   console.log('redux sur le composant Spot', state);
   return {
     spotData: state.newSpot.spot
       ? state.newSpot.spot
       : state.newSpot
   }
 }

 function mapDispatchToProps(dispatch) {
   return {
     refrechMAP: function() {
       dispatch({type: 'markerRefreshed'})
     },
     refrechFEED: function() {
       dispatch({type: 'refreshFeed'})
     },
     refrechSPOTLIST: function() {
       dispatch({type: 'refreshSpotList'})
     },
     actualisationProfile: function() {
       dispatch({type: 'actualisationProfile'})
     }
   }
 }

export default connect(mapStateToProps, mapDispatchToProps)(spotScreen);
