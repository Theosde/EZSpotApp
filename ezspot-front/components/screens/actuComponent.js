import React from 'react';
import {View, Text,ImageBackground} from 'react-native';
import { ListItem,Avatar } from 'react-native-elements';

import { Icon } from 'react-native-elements'


export default class actuComponent extends React.Component {
  state = {
    like: false
  }

  handleClick = () => {
    var isLike = !this.state.like;
    this.setState({
      like: isLike
    });
    this.props.handleClickParent(isLike, this.props.nameMedia);
  }

  componentDidMount(){
    if (this.props.likeStatus.includes(this.props.idUser)) {
      this.setState({
        like: true
      });
    }
  }

  render() {

    var dateUpload = new Date(parseInt(this.props.updateDate));

    diffdata = (date1, date2) => {
      var diff = {}                           // Initialisation du retour
      var tmp = date2 - date1;

      tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
      diff.sec = tmp % 60;                    // Extraction du nombre de secondes

      tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
      diff.min = tmp % 60;                    // Extraction du nombre de minutes

      tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
      diff.hour = tmp % 24;                   // Extraction du nombre d'heures

      tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
      diff.day = tmp;

      return diff;
    }

    var there = diffdata(dateUpload,new Date());
    var Month = ["Janv","Févr","Mars","Avril","Mai","Juin","Juill","Août","Sept","Oct","Nov","Déc"];
    var affDateDiff ;
    if (dateUpload) {

      if (there.day >= 30) {
        if (dateUpload.getFullYear() === new Date().getFullYear()) {
          affDateDiff = dateUpload.getDate()+" "+Month[dateUpload.getMonth()];
        }else {
          affDateDiff = dateUpload.getDate()+" "+Month[dateUpload.getMonth()]+" "+dateUpload.getFullYear();
        }
      }else {

        if (there.day > 0) {
          affDateDiff = "il y a "+there.day+" j"
        }else{
          if (there.hour > 0) {
            affDateDiff = "il y a "+there.hour+" h"
          }else {
            if (there.min > 0) {
              affDateDiff = "il y a "+there.min+" m"
            }else {
              if (there.sec > 0) {
                affDateDiff = "il y a "+there.sec+" s"
              }else {

              }
            }
          }
        }

      }

    }



    return (
      <View>
        <ListItem
          containerStyle={{borderBottomWidth:5,borderColor:"#F4D03F"}}
          key={this.props.userName}
          title={
            <View style={{flex:1, flexDirection:"row", marginBottom:10}}>
              <Avatar
                containerStyle={{width:"15%"}}
                size="medium"
                rounded
                source={{uri:this.props.urlImgSpot}}
              />
              <View style={{width:"55%", paddingLeft:15}}>
                <Text style={{fontWeight: "bold", fontSize:20}}>{this.props.spotName}</Text>
                <Text>{"upload by "+this.props.userName }</Text>
              </View>
              <Text style={{width:"30%", textAlign:"right"}}>{affDateDiff}</Text>
            </View>
          }
          subtitle={
            <ImageBackground style={{height:200, alignItems:"flex-end", justifyContent:"flex-end"}} source={{uri:this.props.urlImgMedia}}>

              <Icon
                name={this.state.like ? "favorite": "favorite-border"}
                color="rgb(255, 0, 0)"
                containerStyle={{
                  marginBottom:10,
                  marginRight:10,
                }}
                onPress={this.handleClick}

              />

            </ImageBackground>
          }
        />
      </View>
    );
  }
}
