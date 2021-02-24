import React from 'react';
import {View, ScrollView, AsyncStorage} from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import {connect} from 'react-redux';

import { Icon } from 'react-native-elements'

import ActuComponent from "./actuComponent"

import ipAddress from '../../config';


class profileScreen extends React.Component {

  state = {
    dataUser:this.props.userData._id,
    allMedia: this.props.userState.allMedia,
    nbMedia:0,
    nbMediaLike:0,
    nbFollow:0,
  }

  componentDidMount(){
    AsyncStorage.getItem("users",(error, data) => {
      if (data) {
        parseData = JSON.parse(data);

        fetch(ipAddress+"/user/profile/"+parseData._id)
        .then((response) => {
          return response.json();
        })
        .then((dataMedia) => {

          console.log("fetch retour",dataMedia);
          this.setState({
            dataUser: parseData,
            nbMedia: dataMedia.nbMedia,
            allMedia: dataMedia.allMedia,
            nbMediaLike: dataMedia.nbMediaLike,
            nbFollow: dataMedia.nbFollow
          })

        })
        .catch((error) => {
          console.log('Request failed didmount', error)
        });

        console.log("data in Local Storage",this.state.dataUser);
      }else {
        console.log("No Data in Local Storage");
        this.props.navigation.navigate('Home')

      }
    })
  }
  componentDidUpdate(prevProps, prevState){
    console.log(this.props.actualisation);
    if (this.props.actualisation) {
      console.log("photo ok");
      AsyncStorage.getItem("users",(error, data) => {
        if (data) {
          parseData = JSON.parse(data);

          fetch(ipAddress+"/user/profile/"+parseData._id)
          .then((response) => {
            return response.json();
          })
          .then((dataMedia) => {

            console.log("fetch retour",dataMedia);
            this.setState({
              dataUser: parseData,
              nbMedia: dataMedia.nbMedia,
              allMedia: dataMedia.allMedia,
              nbMediaLike: dataMedia.nbMediaLike,
              nbFollow: dataMedia.nbFollow

            })

          })
          .catch((error) => {
            console.log('Request failed didupdate', error)
          });

          console.log("data in Local Storage",this.state.dataUser);
        }else {
          console.log("No Data in Local Storage");
          this.props.navigation.navigate('Home')

        }

      })


      this.props.actualisationProfile()

    }




  }

  handleClick = (isLike, name) => {

    fetch(ipAddress+"/user/profile/"+isLike+"/"+name+"/"+this.state.dataUser._id)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (isLike) {
        this.setState({
          nbMediaLike: this.state.nbMediaLike + 1
        })
      }else{
        this.setState({
          nbMediaLike: this.state.nbMediaLike - 1
        })
      }
      console.log("Fetch retour like",data);
    })
    .catch((error) => {
      console.log('Request failed', error)
    });

  }

  render() {

    var nbFollowing = 0;
    if (this.state.dataUser.idSpot) {
      nbFollowing = this.state.dataUser.idSpot;
      nbFollowing = nbFollowing.length
    }


    var filactu = this.state.allMedia.map(unMedia => {
      return <ActuComponent key={unMedia.name} idUser={this.props.userData._id} likeStatus={unMedia.likedBy} nameMedia={unMedia.name} handleClickParent={this.handleClick} urlImgSpot="https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg" spotName={unMedia.spot.name} userName={unMedia.user.userName} urlImgMedia={unMedia.cloudinaryUrl} updateDate={unMedia.timestamp} />
    })


    return (
      <ScrollView>
        <View style={{backgroundColor:"rgba(17, 250, 221, 0.55)", paddingBottom:30}}>

        <View style={{flex: 1, justifyContent: 'flex-start', alignItems:'center', marginTop:15}} >

          <Avatar
            size="xlarge"
            rounded
            source={{uri:this.props.userData.avatar}}
          />
          <Text h3>{this.props.userData.userName}</Text>
        </View>
        <View>

        </View>
        <View style={style.dataUser}>
          <View style={style.partData}>
            <Text style={{width:"100%", textAlign:"center", alignItems:"center", fontSize:30}}>{this.props.userState.nbFollow}</Text>
            <Text style={{width:"100%", textAlign:"center", alignItems:"center"}}>Fillowing</Text>
          </View>
          <View style={style.partData}>
            <Text style={{width:"100%", textAlign:"center", alignItems:"center", fontSize:30}}>{this.props.userState.nbMedia}</Text>
            <Text style={{width:"100%", textAlign:"center", alignItems:"center"}}>Média</Text>
          </View>
          <View style={style.partData}>
            <Text h5 style={{width:"100%", textAlign:"center", alignItems:"center", fontSize:30}}>{this.props.userState.nbMediaLike}</Text>
            <Text style={{width:"100%", textAlign:"center", alignItems:"center"}}>Liked</Text>
          </View>
        </View>

      </View>

      <View>
        {filactu}
      </View>


      </ScrollView>
    );
  }
}


function mapStateToProps(state) {
  console.log("mapStateToProps gjvhbjhgkjbkvhbjk",state);
  return {
    actualisation: state.actualisationProfile,
    userState: state.stateUser,
    userData: state.userData

  }
}

function mapDispatchToProps(dispatch) {
  return {
    actualisationProfile: function() {
        dispatch( {type: 'actualisationProfile'} )
    }
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(profileScreen);


var style = {
  dataUser:{
    borderRadius:10,
    backgroundColor:"#F4D03F",
    height:100,
    width:"90%",
    marginTop:15,
    marginLeft:"5%",
    flex: 1,
    flexDirection: 'row',
  },
  partData:{
    width:"33%",
    textAlign:"center",
    alignItems:"center",
    justifyContent: 'center',
  }
}
