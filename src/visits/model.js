import {createSelector} from 'reselect';
import merge from 'lodash/merge';
import filter from 'lodash/filter';
import Api from '../api';

const Visits = {};

Visits.setSearch = patient =>  ({type:'IVF/VISITS/FILTER', patient});
Visits.setRoom   = room_id => ({type:'IVF/VISITS/FILTER', room_id});
Visits.setDay   = currentDay =>  ({type:'IVF/VISITS/FILTER',day: moment(moment(currentDay).isValid()?currentDay:undefined).format('YYYY-MM-DD')});

Visits.fetch = () => (dispatch,getState) => {
  return Api.get('visits/filter/',Visits.selectFilters(getState())).then(r=>{
    if(r.ok){
      dispatch({type:'IVF/VISITS/MERGE',payload:r.data});
    }
  });
}

Visits.initial = {
  visits :{},
  room_id:null,
  patient:null,
  day    : 'today',
}

Visits.canHandle = action => action.type.indexOf('/VISITS/')>-1

Visits.selectFilters = ({patient,day,room_id}) => ({patient, day, room_id});
Visits.selectCurrentDay = state => state.day;
Visits.selectedRoom = state => state.room_id;
Visits.selectedSearch = state => state.patient;

Visits.get = state=> state.visits||{};
Visits.selectAVisits = (state,id) => Visits.get(state)[id];


Visits.filter = createSelector(
                               Visits.selectFilters,
                               Visits.get,
                               (filters,visits)=>{
                                  const match = {};
                                  for(i in filters){
                                    if(filters[i])match[i] = filters[i];
                                  }
                                  return filter(visits,match)
                               }
                               )

Visits.reducer = (state, action) => {
  const {type,...payload} = action;
  if(type === 'IVF/VISITS/FILTER'){
    return merge({},state,payload);
  }

  if(type==='IVF/VISITS/MERGE'){
   return merge({},state,{visits: payload});
  }

  return state;
}



export default Visits;