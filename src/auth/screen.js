import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,LayoutAnimation,
  Button,ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SocialAuth from 'react-native-social-auth';
import bg from '../../assets/images/bg 2.png';
import logo from '../../assets/images/logo.png';
import user from '../../assets/images/userIcon.png';
import pass from '../../assets/images/passwordIcon.png';
import lgnbtn from '../../assets/images/btnBg.png';
import api from '../api';

const {width,height} = Dimensions.get('window');



class LoginApp extends Component {
  constructor(props){
      super(props);
      this.state = {
        error:[],
        moveOut: false,
        loading:false };
      this.login = this.login.bind(this);
      //SocialAuth.setFacebookApp({id: '1301593236623308', name: 'Madina Women Hospital ICSI'});
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  login(){
    const {username, password} = this.state;
    if(!username || !password)return this.setState({error:['please user you username and password','or use facebook if you have an invitation']});

    this.setState({loading:true});
    fetch('http://localhost/ivf/token',{
      method:'POST',
      body:JSON.stringify({username:'admin', password:'1'})
    }).then(console.debug).catch(e=>console.debug('no',alert(1)))
    api.post('/token',{username, password}).then(r=>{
      if(r.ok && r.data.username === this.state.username){
        this.refs.circ.transitionTo({scale:100},1500)
        setTimeout(()=>this.props.onSuccess(r.data), 2000);
      } else {
        console.debug('R',r);
        this.setState({loading:false,scale:30,error:[(r.data && r.data.message) ? r.data.message:'ops login failed !']});
        this.refs.circ.transitionTo({scale:1},1500);
      }
    })
  }
  async loginWithFacebook(){
    if(this.state.nofacebook)return this.login();
    this.setState({error:[],loading:true});
    let r;
    try{
      const fb = await SocialAuth.getFacebookCredentials(['public_profile','email','user_work_history'], SocialAuth.facebookPermissionsType.read);
      r = await api.post('/token/invite/'+fb.userId+'/'+this.state.username||'', {token:fb.accessToken});
    }catch(e){
      r = {ok:false,data:{message:''}};
    }



    if(r.ok){

      this.refs.circ.transitionTo({scale:100},1500)
      setTimeout(()=>this.props.onSuccess(r.data), 2000);
      this.setState({loading:false,error:[r.data && r.data.message]});

    } else {
      this.refs.circ.transitionTo({scale:1},1500)
          this.setState({error:[
            'Oops!',
            'Login failed!',
            r.data && r.data.message
            ],loading:false})
    }

  }
  render() {
    let scale = {transform: [{scale: 1}]};
    return (
          <Image source={bg} style={{
          height:height,
          width,
          resizeMode:'cover'}} >

          <View style={{flex:2,alignItems:'center',justifyContent:'center'}}>
          <Animatable.View animation="zoomInDown" duration={2000} style={[{elevation:4, display:'flex',alignItems:'center',justifyContent:'center',zIndex:99,borderRadius:width*.66,elevation:10,height:width*.66,width:width*.66,marginTop:20},styles.shadow]}>
            <Image source={logo} style={{resizeMode:'contain',height:width*.6,width:width*.6,marginTop:-15}}/>
          </Animatable.View>
          </View>


          <View style={{flex:2,justifyContent:'flex-end',flexDirection:'column',marginBottom:height*.1}}>
          <View style={[styles.box,{paddingBottom:0,overflow:'hidden'}]} >

          {!!this.state.loading && <ActivityIndicator color="white" style={{backgroundColor:'transparent',marginTop:15}} /> }
          <Text style={[{textAlign:'center',fontSize:15,color:'red'}]}>{this.state.error.join(" \n")}</Text>


          <View style={[styles.btnbox,{marginBottom:0}]}>
          <FontAwesome name="envelope-o" color="purple" size={18}/>
          <TextInput
            blurOnSubmit={true}
            autoFocus={false}
            placeholder={this.state.nofacebook ? 'Username' : 'Invitation code'}
            returnKeyType="next"
            autoCorrect={false}
            value={this.state.username}
            underlineColorAndroid='rgba(0,0,0,0)'
            onSubmitEditing={()=>this.refs.pwd && this.refs.pwd.focus()}
            onChangeText={username=>this.setState({error:[],username:username.toLowerCase()})}
            style={[{flex:1,marginLeft:-40,textAlign:'center'}]}/>
          </View>

          {this.state.nofacebook && <View style={[styles.btnbox,{marginBottom:0}]}>
          <FontAwesome name="lock" color="purple" size={18}/>
          <TextInput ref="pwd"
          blurOnSubmit={true}
            autoFocus={false}
            secureTextEntry={true}
            value={this.state.password}
            placeholder=' Password'
            returnKeyType="go"
            underlineColorAndroid='rgba(0,0,0,0)'
            onSubmitEditing={this.login}
            onChangeText={password=>this.setState({error:[],loadgin:false,password})}
            style={[{flex:1,marginLeft:-40,textAlign:'center'}]}/>
          </View>}



          <TouchableWithoutFeedback  onPress={this.loginWithFacebook.bind(this)} style={{}}>
            <View style={{marginTop:20}}>
            <Animatable.View duration={1000} transition="height" style={{backgroundColor:"#3b5998",height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <FontAwesome name={this.state.nofacebook ? "power-off" :"facebook"} color="white" size={18}/>
              <Text style={{color:'white',margin:10,fontWeight:'500'}}>
                {this.state.nofacebook ? 'Login with password' : 'Register or Login with Facebook'}
              </Text>
              <Animatable.View ref="circ" duration={1000} transition="width" style={[{backgroundColor:'#3b5998',borderRadius:10,height:10,zIndex:-1,width:10}]} />
            </Animatable.View>
            </View>
          </TouchableWithoutFeedback>

          <View style={{flex:1}} />

          <TouchableOpacity style={[{marginTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}]} onPress={()=>this.setState({username:'',password:'',nofacebook:!this.state.nofacebook})}>
              <Text style={[styles.btnText,{borderBottomWidth:1,color:'purple',fontSize:16,overflow:'hidden'}]}> {this.state.nofacebook ? 'use ' : "I don't have"} facebook account </Text>
          </TouchableOpacity>

          </View>
          </View>

          </Image>
    );
  }
}


export default LoginApp;