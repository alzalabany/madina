import react from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import BlogScreen from './src/Blog/screen';
import BlogCreateModal from './src/Blog/modal';
import HomeScreen from './src/Home';
import MoreScreen from './src/more/screen';
import AuthScreen from './src/auth/screen';
import CreateVisit from './src/visits/CreateVisit';
import EditVisit from './src/visits/EditVisit';
import RoomsSettings from './src/Home/roomsSettings'

import User from './src/auth/model';
import {iconsMap,iconsLoaded} from './src/icons';
import { configStore } from './src/icons';

import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk';
import rootReducer from './src/rootReducer';

const store = createStore( rootReducer,
                                undefined,
                                compose(
                                        applyMiddleware(thunk),
                                        autoRehydrate()
                                      )
                              );

const persistor = new Promise((resolve, reject) => {
  persistStore(store, {storage: AsyncStorage},resolve);
})
new Promise.all(persistor,iconsLoaded)
.then(r=>new App(r));

class App{
  static root = 'none';
  constructor(navigatorStyle, navigatorButtons){
    this.registerScreens();
    this.navigatorStyle = navigatorStyle
    this.navigatorButtons = navigatorButtons
    store.subscribe(r=>this.letsGo(User.selectCurrentUserId(store.getState())).bind(this))
  }
  letsGo(id){
    if(this.user_id === id)return;
    this.user_id = id;
    return (user_id) ? runApp.bind(this)() : runLogin();
  }
  runLogin(){
    if(api.headers.Authorization !== head) api.setHeader('Authorization','Bearer '+User.selectToken(store.getState()));
    Navigation.startSingleScreenApp({
             screen: {
               screen: 'ivf.AuthScreen',
               title: 'Login',
               navigatorStyle:{ navBarHidden: true },
             },
             passProps: {
              logout    : none =>store.dispatch(User.logout()),
              onSuccess : user =>store.dispatch(User.setUser(user))
             }
            });
  }
  runApp(){
    this.root = 'app';
    api.setHeader('Authorization','Bearer '+User.selectToken(store.getState()));
    Navigation.startTabBasedApp({
      animationType: 'slide-down',
      title: 'Redux Example',
      tabsStyle:{
        tabBarBackgroundColor: 'purple',
        tabBarButtonColor: '#ffffff',
        tabBarSelectedButtonColor: 'white',
        tabBarTranslucent: false,
      },
      tabs: [
        {
          label: 'News',
          screen: 'ivf.BlogScreen', // this is a registered name for a screen
          icon: iconsMap["ios-desktop-outline"],
          selectedIcon: iconsMap["ios-desktop"],
          //selectedIcon: require('../img/one_selected.png'), // iOS only
          title: 'News',
          passProps: { },
          navigatorStyle:this.navigatorStyle,
          navigatorButtons:this.navigatorButtons
        },
        {
          label: 'Home',
          screen: 'ivf.HomeScreen',
          icon: iconsMap["ios-calendar-outline"],
          selectedIcon: iconsMap["ios-calendar"],
          //selectedIcon: require('../img/two_selected.png'), // iOS only
          title: 'Home',
          passProps: { },
          navigatorStyle:this.navigatorStyle,
          navigatorButtons:this.navigatorButtons
        },
        {
          label: 'About',
          screen: 'ivf.MoreScreen',
          icon: iconsMap["ios-more-outline"],
          selectedIcon: iconsMap["ios-more"],
          //selectedIcon: require('../img/two_selected.png'), // iOS only
          title: 'Madina Women Hospital',
          passProps: { },
          navigatorStyle:this.navigatorStyle,
          navigatorButtons:this.navigatorButtons
        },

      ]
      });
  }

  registerScreens(){
    Navigation.registerComponent('ivf.BlogScreen', () => BlogScreen,store, Provider);
    Navigation.registerComponent('ivf.HomeScreen', () => HomeScreen,store, Provider);
    Navigation.registerComponent('ivf.MoreScreen', () => MoreScreen,store, Provider);
    Navigation.registerComponent('ivf.AuthScreen', () => AuthScreen,store, Provider);
    Navigation.registerComponent('ivf.CreateVisit', () => CreateVisit,store, Provider);
    Navigation.registerComponent('ivf.EditVisit', () => EditVisit,store, Provider);
    Navigation.registerComponent('ivf.create.blog', () => BlogCreateModal,store, Provider);
    Navigation.registerComponent('ivf.RoomsSetting', () => RoomsSettings,store, Provider);
    Navigation.registerComponent('ivf.Profile', () => RoomsSettings, store, Provider);
    Navigation.registerComponent('ivf.autocomplete', () => RoomsSettings, store, Provider);
  }

}

export default {
  store,
  persistor,
  App,
}