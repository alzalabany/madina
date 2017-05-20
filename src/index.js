import React from 'react';
import {
  AsyncStorage,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import Api from './api';

import Auth from './auth/screen';
import User from './auth/model';
import Navigator from './Navigation/screen';

class RootApp extends React.Component {
  constructor(props){
    super(props);
    const state = this.props.store.getState();
    const currentUser = User.selectCurrentUser(state);
    this.state = {
      user_token: currentUser.token,
      user_id  : Boolean(currentUser.id),
      user_role : String(currentUser.role).toLowerCase(),
      deleted: Boolean(currentUser.deleted),
    }
    this.api = Api;

  }
  shouldComponentUpdate(props,state){
    for(let i in state){
      if(this.state [i] !== state[i]) return true;
    }

    return false;
  }
  componentWillUnmount(){
    this.disconnectStore()
  }

  componentDidMount(){
    this.disconnectStore   = this.props.store.subscribe(()=>{
      const state = this.props.store.getState();
      const currentUser = User.selectCurrentUser(state);
      console.debug('redux changed', state, currentUser)
      this.setState({
        user_id  : Boolean(currentUser.id),
        user_token: currentUser.token||'',
        user_role : String(currentUser.role).toLowerCase(),
      })
    })
  }

  render(){
    const { store } = this.props
    const { user_id, user_role, user_token } = this.state
    this.api.setHeader('Authorization', 'Bearer '+user_token);
    if(user_token && user_id) return <Navigator api={this.api} user_id={user_id} user_role={user_role} store={store} />

    return <Auth  api={this.api} store={store} onSuccess={user => store.dispatch(User.setUser(user)) } />
  }

}


export default RootApp