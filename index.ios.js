/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SocialAuth from 'react-native-social-auth';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { Navigation } from 'react-native-navigation';

console.debug = console.log;

class Madina extends Component {
  state ={
    fb:{},
    d:{},
  }
    componentWillMount() {
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
    console.log('Device info: ', device);
    }
    async fb(){
      const fb = await SocialAuth.getFacebookCredentials(['public_profile','email','user_work_history'], SocialAuth.facebookPermissionsType.read)
      this.setState({fb});
      const d = await fetch('http://localhost/ivf/system/settings');
      this.setState({d});
    }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>

        <Button onPress={this.fb.bind(this)} title="test facebook"/>
        <Button onPress={()=>console.log('testing')} title="console.log" />
        <Button onPress={()=>console.debug('testing')} title="console.debug" />
        <Button onPress={()=>console.warn('testing')} title="console.warn" />
        <Button onPress={()=>console.error('testing')} title="console.error" />

        <Button onPress={()=>OneSignal.checkPermissions((permissions) => {
  console.log(permissions);
  console.log(OneSignal);
})} title="Push" />
        <Text style={styles.instructions}>
          {JSON.stringify(this.state.fb||{})}
        </Text>
        <FontAwesome name="user" color="blue" size={44}/>
        <Text style={styles.instructions}>
          {JSON.stringify(this.state.d||{})}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
 Navigation.registerComponent('example.FirstTabScreen', () => Madina);

 Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      screen: 'example.FirstTabScreen', // this is a registered name for a screen
      //icon: require('../img/one.png'),
      //selectedIcon: require('../img/one_selected.png'), // iOS only
      title: 'Screen One'
    }
    ]})
//AppRegistry.registerComponent('madina', () => madina);

