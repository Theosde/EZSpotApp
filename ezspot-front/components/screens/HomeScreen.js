import React from 'react';
import {navigationOptions} from 'react-navigation';
import {Button,Input,Divider } from 'react-native-elements';
import {View, Text, ImageBackground,ScrollView, AsyncStorage} from 'react-native';
import { AuthSession } from 'expo';
import {connect} from 'react-redux';


import { Icon } from 'react-native-elements'


import ipAddress from '../../config';


class homeScreen extends React.Component {
  constructor(props){
    super(props);
  };

  static navigationOptions = {
    header: null
  }

  state = {
    inLocalStorage: false,
    homeScreen: true,
    errorIn:{
      email:" ",
      password:" ",
    },
    errorUp:{
      pseudo:" ",
      email:" ",
      password:" ",
      confirmePassword:" ",
    },

    emailIn:"",
    passwordIn:"",

    pseudoUp:"",
    emailUp:"",
    passwordUp:"",
    ConfirmPasswordUp:"",

    defaultVisible: true,
    statusSignIn: {},
    statusSignUp: {display:"none"},
  }

  signVisible = () => {
    if (!this.state.defaultVisible) {
      this.setState({
        statusSignIn: {},
        statusSignUp: {display:"none"},
        defaultVisible:!this.state.defaultVisible

      })
    }else {
      this.setState({
        statusSignIn: {display:"none"},
        statusSignUp: {},
        defaultVisible:!this.state.defaultVisible

      })
    }

  }


  loginHandleClick = (loginData) => {
    var regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

    if (!regex.test(loginData.email)) {
      console.log("email error");
      this.setState({errorIn:{email:"Format de l'email non valide",password:" "}})
    }else {
      console.log("email ok");

      fetch(ipAddress+"/user/signin", {
       method: 'POST',
       headers: {'Content-Type':'application/json'},
       body: JSON.stringify({
         "email":loginData.email,
         "password":loginData.password
       })
      }).then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error === "email") {
          console.log("mauvais email");
          this.setState({errorIn:{email:"Aucun compte est associer a cette email",password:" "}})
        }else if (data.error === "password") {
          console.log("mauvais password");
          this.setState({errorIn:{email:" ",password:"Mauvais Mot de Passe"}})
        }else {
          console.log("LOGIN OK");
          AsyncStorage.setItem("users", JSON.stringify(data.user) )
          AsyncStorage.getItem("users", (error, data) => {
            console.log(data);
            if (data) {
              var storageData = JSON.parse(data)
              console.log("save storage ok");
              console.log(storageData);
              this.setState({
                inLocalStorage: true,
                homeScreen:false
              })
              this.props.navigation.navigate('Map')
            }else {
              console.log("save storage Fail");
              console.log(data);

            }
          })

        }
      })
      .catch((error) => {
        console.log('Request failed', error)
      });

    }

  }

  inscriptionHandleClick = (inscriptionData) => {

    var regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
    var regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/)

    var pseudo = this.state.errorUp.pseudo;
    var email = this.state.errorUp.email;
    var password = this.state.errorUp.password;
    var confirmePassword = this.state.errorUp.confirmePassword;

    if (!regex.test(inscriptionData.email)) {
      console.log("email error");
      email = "Format de l'email non valide";
    }else {
      console.log("email ok");
    }

    if (!regexPassword.test(inscriptionData.password) ) {
      console.log("Il doit avoir une Maj, un caractère spécial et une longeur de 8 caractère");
      password = "Format Password Fail"
    }else {
      console.log("Format Password ok");
      console.log(inscriptionData);
      console.log(inscriptionData.password);
      console.log(inscriptionData.confirmePassword);
      if (inscriptionData.password != inscriptionData.confirmePassword ) {
        console.log("Password Pas Identique");
        confirmePassword = "Password Different"
      }else {
        console.log("Password Identique");
      }
    }


    this.setState({errorUp:{pseudo:pseudo,email:email,password:password,confirmePassword:confirmePassword}})


    if (pseudo === " " && email === " " && password === " " && confirmePassword === " " ) {
      console.log("pas d'erreur");

      fetch(ipAddress+"/user/signup", {
       method: 'POST',
       headers: {'Content-Type':'application/json'},
       body: JSON.stringify({
          "avatar":"",
          "userName":inscriptionData.pseudo,
          "lastName":"",
          "firstName":"",
          "email":inscriptionData.email,
          "password":inscriptionData.password,
          "salt":"123456789",
          "idFacebook":"",
          "idGoogle":"",
          "idSpot":[]
       })
     }).then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch data",data);
        if (data.error === "email") {
          this.setState({errorUp:{pseudo:" ",email:"Email exist Deja",password:" ",confirmePassword:" "}})
        }else {
          console.log("Inscription OK");
          AsyncStorage.setItem("users", JSON.stringify(data.user) )
          AsyncStorage.getItem("users", (error, data) => {
            console.log(data);
            if (data) {
              var storageData = JSON.parse(data)
              console.log("save storage ok");
              console.log(storageData);
              this.setState({
                inLocalStorage: true,
                homeScreen:false
              })
              this.props.navigation.navigate('Map')
            }else {
              console.log("save storage Fail");
              console.log(data);

            }
          })
          // REDIRECTION + LOCAL STORAGE
        }
      })
      .catch((error) => {
        console.log('Request failed', error)
      });

    }

  }

  componentDidMount(){
    AsyncStorage.getItem("users",(error, data) => {
      console.log(data);
      if (data) {
        var storageData = JSON.parse(data)

        console.log("data in Local Storage");
        this.props.SaveDataUser(storageData)

        this.props.navigation.navigate('Map')
      }else {
        console.log("No Data in Local Storage");

      }
    })
  }
  componentDidUpdate(prevProps, prevState){
    if (this.state.inLocalStorage) {
      if (this.state.homeScreen) {
        AsyncStorage.getItem("users",(error, data) => {
          console.log(data);
          if (data) {
            var storageData = JSON.parse(data)
            console.log("data in Local Storage",storageData);
            this.props.SaveDataUser(storageData)
            this.props.navigation.navigate('Map')
          }else {
            console.log("No Data in Local Storage");

          }
        })
      }
    }

  }


  facebookSignIn = async () => {
    var redirectUrl = AuthSession.getRedirectUrl();
    console.log(redirectUrl);

    var result = await AuthSession.startAsync({
      authUrl:
        'https://murmuring-fortress-85793.herokuapp.com/user/auth/facebook?redirectUrl='+redirectUrl
    });

   console.log(result.params);
   if(result.type == "success"){

      fetch(ipAddress+"/user/signFaceBook", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "idFacebook":result.params.idFacebook,
        })
      })
      .then((response) => {
       return response.json();
      })
      .then((data) => {

        console.log(data);

        console.log("Inscription FaceBook OK");
        AsyncStorage.setItem("users", JSON.stringify(data.user) )
        AsyncStorage.getItem("users", (error, data) => {
         console.log(data);
         if (data) {
           var storageData = JSON.parse(data)
           console.log("save storage ok");
           console.log(storageData);
           this.setState({
             inLocalStorage: true,
             homeScreen:false
           })
           this.props.navigation.navigate('Map')
         }else {
           console.log("save storage Fail");
           console.log(data);

         }
        })

      })
      .catch(function(error) {
       console.log('Request failed', error)
      });


      this.props.navigation.navigate('Map');
   }
  }


  googleSignIn = async () => {
    var redirectUrl = AuthSession.getRedirectUrl();
    console.log(redirectUrl);

    var result = await AuthSession.startAsync({
      authUrl:
        'https://murmuring-fortress-85793.herokuapp.com/user/auth/google?redirectUrl='+redirectUrl
    });

   console.log(result.params);
   if(result.type == "success"){

      fetch(ipAddress+"/user/signGoogle", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "idGoogle":result.params.idGoogle,
        })
      })
      .then((response) => {
       return response.json();
      })
      .then((data) => {

        console.log(data);

        console.log("Inscription Google OK");
        AsyncStorage.setItem("users", JSON.stringify(data.user) )
        AsyncStorage.getItem("users", (error, data) => {
         console.log(data);
         if (data) {
           var storageData = JSON.parse(data)
           console.log("save storage ok");
           console.log(storageData);
           this.setState({
             inLocalStorage: true,
             homeScreen:false
           })
           this.props.navigation.navigate('Map')
         }else {
           console.log("save storage Fail");
           console.log(data);

         }
        })

      })
      .catch(function(error) {
       console.log('Request failed', error)
      });


      this.props.navigation.navigate('Map');
   }
  }


  render() {
    var alternStyle = {
      title:{
        color: "#12100E"
      },
      btn:{
        backgroundColor: "#f0f0f0",
        width: "50%",
        borderRadius:0,
      },
    }




    return (
      <ImageBackground style={{flex:1}} source={require("../../assets/Images/skateboard.jpg")}>
        <Button title="Delete all data saved"
          onPress={()=> AsyncStorage.clear() }
        />
        <View style={{flexDirection: 'row', margin:20, marginTop:30, marginBottom:0}}>
          <Button
            onPress={!this.state.defaultVisible ? this.signVisible : ()=>{}}
            title="SignIn"
            type="clear"
            titleStyle={ this.state.defaultVisible ? alternStyle.title : style.title}
            containerStyle={ this.state.defaultVisible ? alternStyle.btn : style.btn}
          />
          <Button
            onPress={this.state.defaultVisible ? this.signVisible : ()=>{}}
            title="SignUp"
            type="clear"
            titleStyle={ !this.state.defaultVisible ? alternStyle.title : style.title}
            containerStyle={ !this.state.defaultVisible ? alternStyle.btn : style.btn}
          />
        </View>
        <View style={{margin:20,marginTop:0 }}>

          <View style={[style.modal,this.state.statusSignIn]}>
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorIn.email}
              value={this.state.emailIn}
              onChangeText={(TextChange) => this.setState({emailIn:TextChange, errorIn:{email: " " ,password:this.state.errorIn.password}})}
              label="Email :" placeholder='test.test@test.fr'/>
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorIn.password}
              value={this.state.passwordIn}
              onChangeText={(TextChange) => this.setState({passwordIn:TextChange})}
              secureTextEntry={true}
              label="Password :"
              placeholder='*******'
            />
            <Divider style={{height:30, backgroundColor:"transparent"}}/>

            <Button
              title="Login"
              onPress={() => this.loginHandleClick({email:this.state.emailIn,password:this.state.passwordIn})}
            />
            <View style={{flexDirection: 'row', marginTop:10}}>
              <Button
                title="FaceBook"
                type="clear"
                titleStyle={{color:"#f0f0f0"}}
                containerStyle={{backgroundColor:"#1674ff",borderRadius:0,width: "50%"}}
                onPress={this.facebookSignIn}
              />
              <Button
                title="Google"
                type="clear"
                titleStyle={{color:"#f0f0f0"}}
                containerStyle={{backgroundColor:"#f92d2d",borderRadius:0,width: "50%",}}
                onPress={this.googleSignIn}
              />
            </View>
          </View>

          <ScrollView style={[style.modal,this.state.statusSignUp,{height:465}]}>
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorUp.pseudo}
              value={this.state.pseudoUp}
              onChangeText={(TextChange) => this.setState({pseudoUp:TextChange})}
              label="Pseudo :"
              placeholder='Wazaaaa'
            />
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorUp.email}
              value={this.state.emailUp}
              onChangeText={(TextChange) => this.setState({emailUp:TextChange, errorUp:{pseudo:this.state.errorUp.pseudo,email:" ",password:this.state.errorUp.password,confirmePassword:this.state.errorUp.confirmePassword} })}
              label="Email :"
              placeholder='test.test@test.fr'
            />
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorUp.password}
              value={this.state.passwordUp}
              onChangeText={(TextChange) => this.setState({passwordUp:TextChange, errorUp:{pseudo:this.state.errorUp.pseudo,email:this.state.errorUp.email,password:" ",confirmePassword:this.state.errorUp.confirmePassword} })}
              secureTextEntry={true}
              label="Password :"
              placeholder='*******'/>
            <Divider style={{height:20, backgroundColor:"transparent"}}/>
            <Input
              errorStyle={{ color: 'red', fontSize:10 }}
              errorMessage={this.state.errorUp.confirmePassword}
              value={this.state.ConfirmPasswordUp}
              onChangeText={(TextChange) => this.setState({ConfirmPasswordUp:TextChange, errorUp:{pseudo:this.state.errorUp.pseudo,email:this.state.errorUp.email,password:this.state.errorUp.password,confirmePassword:" "} })}
              secureTextEntry={true}
              label="Confirme Password :"
              placeholder='*******'/>
              <Icon
                name='arrow-downward'
              />
            <Divider style={{height:30, backgroundColor:"transparent"}}/>
            <Button
              title="Inscription"
              onPress={() => this.inscriptionHandleClick({pseudo:this.state.pseudoUp,email:this.state.emailUp,password:this.state.passwordUp,confirmePassword:this.state.ConfirmPasswordUp})}
            />
            <View style={{flexDirection: 'row', marginTop:10}}>
              <Button
                title="FaceBook"
                type="clear"
                titleStyle={{color:"#f0f0f0"}}
                containerStyle={{backgroundColor:"#1674ff",borderRadius:0,width: "50%"}}
                onPress={this.facebookSignIn}
              />
              <Button
                title="Google"
                type="clear"
                titleStyle={{color:"#f0f0f0"}}
                containerStyle={{backgroundColor:"#f92d2d",borderRadius:0,width: "50%",}}
                onPress={this.googleSignIn}
              />
            </View>
            <Divider style={{height:50, backgroundColor:"transparent"}}/>

          </ScrollView>


        </View>

      </ImageBackground>);
  }
}


function mapDispatchToProps(dispatch) {
  return {
    SaveDataUser: function(data) {
        dispatch( {type: 'SaveDataUser', userData: data} )
    }
  }
}

export default connect(
    null,
    mapDispatchToProps
)(homeScreen);



var style = {
  modal:{
    width:"100%",
    backgroundColor:"#f0f0f0",
    padding:10,
  },
  btn:{
    backgroundColor: "#12100E",
    width: "50%",
    borderRadius:0,
  },
  title:{
    color: "#12FADD"
  },
  left:{
    marginLeft: 10,
  }
}
