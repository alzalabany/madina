import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Button,ScrollView
} from 'react-native';

import Tabs from './tabs';
import TopNav from './TopNav';

import Nav from './model';
import User from '../auth/model';
import Home from '../Home';
import Blog from '../Blog/screen';
import More from '../more/screen';
import Visits from '../visits/model';
import api from '../api';
const {width,height} = Dimensions.get('window');

var PushNotification = require('react-native-push-notification');



async function registerForPushNotificationsAsync(api) {
  PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        return api.post('/token/push',{token:`${token}`});
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        alert(notification.message)
    },

    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
  });
}

class Navigator extends Component {
  constructor(props){
      super(props);
      this.state = {};
      this.nav = this.nav.bind(this);
      this.router = this.router.bind(this);
      this.notification = [];
      this.registeredForPush = false;
      //this._notificationSubscription = Notifications.addListener(this._handleNotification);

  }
  componentDidMount(){
    registerForPushNotificationsAsync()
  }
  _handleNotification(notification){
    this.notification = this.notification.concat(notification)
  }

  nav(r,params={}){
    const page = r.toLowerCase();
    this.props.nav(
    {
      page:page||'home',
      title:page==='home' ? 'Home' : page==='blog' ? 'News'  : '',
      params,
    })
  }
  router(){
    if(this.props.route.page==='more') return <More navigate={this.nav} {...this.props}/>
    if(this.props.route.page==='blog') return <Blog navigate={this.nav} {...this.props}/>
    //if(this.props.route.page==='home') return <Home {...this.props}/>

    return <Home {...this.props} navigate={this.nav}/>
  }
  render(){
  return <View style={{flex:1}}>
    <TopNav onSearch={this.props.setSearch} leftAction={this.props.logout} title={this.props.route.title} route={this.props.route} nav={this.nav} />
    <View style={{flex:1}}>
      {this.router()}
    </View>
    <Tabs onChange={this.nav} route={this.props.route} />
  </View>
  }
}

const state = state =>({
  route:Nav.selectRoute(state)||{},
});

const props = dispatch => ({
  nav: payload => dispatch(Nav.replace(payload)),
  logout: () => dispatch(User.logout()),
  setSearch: key=>dispatch(Visits.setSearch(key.toLowerCase())),
})

export default connect(state, props)(Navigator)
