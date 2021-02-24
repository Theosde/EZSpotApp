import React from 'react';
import {
  Modal,
  Text,
  View,
  Alert,
  Button,
  AsyncStorage,
  TouchableHighlight,
  ImageBackground,
  StyleSheet,
  CameraRoll,
  Image
} from 'react-native';
import {Camera, Permissions} from 'expo';
import ipAddress from '../../config';
import {Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import {connect} from 'react-redux';

class CameraScreen extends React.Component {
  state = {
    modalVisible: false,
    permision: null,
    type: Camera.Constants.Type.back,
    urlImage: "https://tedconfblog.files.wordpress.com/2014/12/8photography_tips.png?w=900&h=540",
    photoData: {}
  };

  async componentDidMount() {
    var { status } = await Permissions.askAsync(Permissions.CAMERA);
    var permision = (status === 'granted')? true : false;
    this.setState({ permision });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onPictureSaved = async photo => {
    console.log("gfhvhjbdljqsbdljsqdblsqjkdbqskjdsqbdjkqdbk",this.props.spotData._id);
    console.log("gfhvhjbdljqsbdljsqdblsqjkdbqskjdsqbdjkqdbk",this.props);
console.log("photo 2 :" + photo);
    AsyncStorage.getItem("users", (error, dataUser) => {
      if (dataUser) {
    parseData = JSON.parse(dataUser);
    var data = new FormData();

    data.append("spotId", this.props.spotData._id)
    data.append('userId', parseData._id)

    data.append('photo', {
      uri: photo.uri,
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

console.log(photo.uri)

  }

  recupUri = async photo => {
    console.log("photo : " + photo);
    this.setState({urlImage: photo.uri, photoData: photo})
  }

  render() {
if (this.state.permision === null) {
  return <Text>permision : null</Text>;
} else if (this.state.permision === false) {
  return <Text>No access to camera</Text>;
} else {

  return (<View style={{
      flex: 1
    }}>
    <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <ImageBackground style={{
          flex: 1
        }} source={{
          uri: this.state.urlImage
        }}/>
      <View>
        <View>

          <Button title="Cancel" color="#ff0000" onPress={() => {
            this.setState({
              urlImage: "https://tedconfblog.files.wordpress.com/2014/12/8photography_tips.png?w=900&h=540"
            })
              this.setModalVisible(!this.state.modalVisible);
            }}/>
          <Button title="Send" color="#00ff00" onPress={() => {

              this.onPictureSaved(this.state.photoData);
              this.setModalVisible(!this.state.modalVisible);
            }}/>
        </View>
      </View>
    </Modal>
    <Camera style={{
        flex: 1
      }} type={this.state.type} ref={ref => {
        this.camera = ref;
      }}></Camera>

    <Button color="#12FADD" title="PHOTO" onPress={() => {
        this.setModalVisible(true);
        if (this.camera) {
          this.camera.takePictureAsync({onPictureSaved: this.recupUri, quality: 0.7, base64: true, exif: true});
        }
      }}/>
  </View>);
}

  }
}


function mapDispatchToProps(dispatch) {
  return {
    actualisationProfile: function() {
        dispatch( {type: 'actualisationProfile'} )
    }
  }
}

function mapStateToProps(state) {
  console.log('redux sur le composant Spot', state);
  return {spotData: state.newSpot.spot ? state.newSpot.spot : state.newSpot}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CameraScreen);
