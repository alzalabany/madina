import {createSelector} from 'reselect';
import merge from 'lodash/merge';


const Nav = {};

Nav.replace = payload => ({type:'IVF/NAV/GO', payload});

Nav.initial = {navigation:{
  page:'home',
  title:'',
  params:{},
}}

Nav.canHandle = action => action.type.indexOf('/NAV/')>-1

Nav.selectRoute = state => state.navigation;

Nav.selectHistory = createSelector(Nav.selectRoute , nav=>nav.history||[]);

Nav.getSettings = (api) => (dispatch,getState)=>{
  const state = getState();
  api.get('system/settings',{day:state.currentDay}).then(r=>{
    console.debug('loaded settings',r);
    dispatch({type:'SETTINGS',data:r.data});
  })
}

Nav.reducer = (state, action) => {

  if(action.type === 'IVF/NAV/GO'){
    return merge({},state, { navigation: action.payload })
  }

  return state;
}



export default Nav;