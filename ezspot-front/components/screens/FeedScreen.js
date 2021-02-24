import React from 'react';
import {View, ScrollView, AsyncStorage} from 'react-native';
import { Avatar, Text, Icon } from 'react-native-elements';
import ipAddress from '../../config';
import ActuComponent from './actuComponent'
import {connect} from 'react-redux';

class feedScreen extends React.Component {

  state = {
    idUser: '',
    feed: [],
    dataUser: "",
  }

  componentDidMount(){

    var ctx = this;

    AsyncStorage.getItem("users",(error, data) => {
      if (data) {
        var parseData = JSON.parse(data);
        ctx.setState({
          idUser: parseData._id
        });
        console.log('MAJ du state idUser dans le feed', this.state.idUser);
        fetch(ipAddress+'/spot/spots-feed/'+this.state.idUser)
        .then((response) => {
          return response.json();
        })
        .then((data)=>{
          console.log("fetch");
          ctx.setState({
            feed: data.feed,
            users: data.users
          })
        })
        .catch((err)=>{
          console.log('fetch error sur le feed...', err)
        });
      } else {
        console.log('erreur MAJ du state idUser dans le feed',error)
      }
    });
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.refreshed){

      var ctx = this;
      ctx.props.handleNewSpot()

      fetch(ipAddress+'/spot/spots-feed/'+this.state.idUser)
      .then((response) => {
        return response.json();
      })
      .then((data)=>{
        ctx.setState({
          feed : data.feed
        });
        console.log('MAJ du feed dans le didUpdate', this.state.feed)
      })
      .catch((error)=>{
        console.log('fetch feed error...', error)
      });
    }
  }



  handleClick = (isLike, name) => {

    fetch(ipAddress+"/user/profile/"+isLike+"/"+name+"/"+this.state.idUser)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.props.actualisationProfile()
      console.log("Fetch retour like",data);
    })
    .catch((error) => {
      console.log('Request failed', error)
    });

  }

  render() {



      var spotFeed = [];

      for (var i = 0; i < this.state.feed.length; i++) {
        if (this.state.feed[i].medias.length > 0) {
          spotFeed.push(this.state.feed[i].medias.map((medias,x) =>{
            return <ActuComponent key={x} idUser={this.state.idUser} nameMedia={medias.name} likeStatus={medias.likedBy} handleClickParent={this.handleClick} urlImgSpot="https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg" spotName={this.state.feed[i].name} userName={medias.user.userName} urlImgMedia={medias.cloudinaryUrl} updateDate={medias.timestamp} />
          }))
        }
      }



    return (
      <ScrollView>
        <View style={{flex: 1}}>
          {spotFeed}
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state){
  return {
    refreshed: state.refreshFeed
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleNewSpot: function() {
      dispatch({
        type: 'refreshFeed'
      })
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(feedScreen);
