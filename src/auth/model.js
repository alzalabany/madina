import {createSelector} from 'reselect';
import merge from 'lodash/merge';
import Api from '../api'

const User = {};

User.canHandle = action => action.type.indexOf('/AUTH/')>-1

User.setUser = user => ({type:'IVF/AUTH/ADD', user});
User.logout = user => ({type:'IVF/AUTH/LOGOUT'});
User.mergeUsers = users => ({type:'IVF/AUTH/MERGE', users})
User.updateUser = user => ({type:'IVF/AUTH/UPDATE', user})
User.activate = id => ({type:'IVF/AUTH/UPDATE', user:{id, deleted:0}})
User.filter = string => ({type:'IVF/AUTH/FILTER', string})

User.selectCurrentUserId = state => state.user_id||0;
User.selectUsers = state => state.users||{};

User.selectUsersFilter = state => state.keyword||'';

User.selectCurrentUser = createSelector(
                                        User.selectCurrentUserId,
                                        User.selectUsers,
                                        (id, users) => users[id]||{});
User.selectToken = createSelector(
                                  User.selectCurrentUser,
                                  (user) => (user && typeof user ==='object' && user.hasOwnProperty('token')) ? user.token : '');
User.selectUsersId = createSelector(
                                    User.selectUsers,
                                    users => Object.keys(users));

User.selectFiltered = createSelector(
                                     User.selectUsersFilter,
                                     User.selectUsersId,
                                     User.selectUsers,
                                     (word, ids, users)=>ids.map(id=>String(users[id].fullname).indexOf(word)>-1?users[id]:false).filter(Boolean)
                                     )

User.initial = {
  user_id:0,
  users:{},
  keyword:'',
}

User.reducer = (state, action) => {

  if(action.type === 'IVF/AUTH/ADD'){
    return merge({},state, {
      user_id: action.user.id,
      users:merge({},state.users,{[action.user.id]:action.user})
    })
  }

  if(action.type === 'IVF/AUTH/LOGOUT'){
    console.debug('-----OUT----')
    return merge({},state,{ user_id: 0 })
  }

  if(action.type === 'IVF/AUTH/MERGE'){
    return merge({},state,{ users: action.users })
  }

  if(action.type === 'IVF/AUTH/UPDATE'){
    return merge({},state,{ users: { [action.user.id]: action.user }})
  }


  return state;
}



export default User;