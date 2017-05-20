import {createSelector} from 'reselect';
import merge from 'lodash/merge';
import filter from 'lodash/filter';
import {selectFilters} from '../visits/model';

const Room = {};


Room.fetch = () => (dispatch,getState) => {
  return Api.get('ROOM/filter/',Room.selectFilters(getState())).then(r=>{
    if(r.ok){
      dispatch({type:'IVF/ROOM/MERGE',payload:r.data});
    }
  });
}

Room.initial = {
  rooms:{},
}

Room.canHandle = action => action.type.indexOf('/ROOM/')>-1

Room.selectFilters = ({patient,day,ROOM_id}) => {patient, day, ROOM_id};


Room.reducer = (state, action) => {
  const {type,...payload} = action;
  if(type==='IVF/ROOM/MERGE'){
    rooms = merge({},state.rooms,payload.rooms);
    holidays = merge({},state.holidays,payload.holidays);
    return merge({},state,{rooms,holidays})
  }

  return state;
}



export default Room;