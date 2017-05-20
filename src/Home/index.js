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
  ActivityIndicator,
  Button,ScrollView,Modal
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import moment from 'moment';
import Navbg from '../../assets/images/dr.png';
const {width,height} = Dimensions.get('window');
import styles from './styles.js'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import User from '../auth/model';
import Visit from '../visits/model';
import Navbgs from '../../assets/images/topnav.png';
import Shortlist from './shortlist';

import Visits from '../visits/screens';
import {iconsMap} from '../icons';

const Tabs = props =><View style={{marginHorizontal:15}}><ScrollView horizontal={true} style={props.style}>
        {props.titles.map((i,key)=>{
          let label = typeof props.label === 'function' ? props.label : ()=>'All day';
          const sel = (props.selected||0)===key;
        return <TouchableOpacity key={key+label(i)} onPress={props.onChange} style={[sel ? styles.active : styles.inactive,key===0?styles.first:{},key===props.titles.length-1?styles.last:{},]}>
        <Text style={sel ? styles.activeText : styles.inactiveText}>{label(i)}</Text>
        </TouchableOpacity>}
        )}
      </ScrollView></View>

const datePicker = (open, date) => <TouchableOpacity onPress={()=>open()} style={[styles.row,{backgroundColor:'rgba(237,237,237,1)',padding:5,borderRadius:5}]}>
  <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:2}}>
  <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('DD')}</Text></View>
  <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:2}}>
  <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('MMMM')}</Text></View>
  <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:0}}>
  <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('YYYY')}</Text></View>
</TouchableOpacity>

class Home extends Component {
  constructor(props){
      super(props);
      this.state = {
        date:moment(this.props.currentDay)
      };
      this.openModal = this.openModal.bind(this)
      if(!this.state.date.isValid())this.state.date = moment();
       this.props.navigator.setOnNavigatorEvent((event)=>(event.type == 'NavBarButtonPress' && event.id==='logout') && this.props.logout(Navigation.dismissAllModals({animationType: 'slide-down'})));
  }

  componentWillMount(){
    this.props.fetch();
  }
  componentWillReceiveProps(props){
    if(props.currentDay !== this.props.currentDay){
      // console.debug('day changed',props,moment(props.currentDay));
      date = moment(props.currentDay);
      this.setState({date:date.isValid() ? date : moment()})
    }
  }
  renderPicker(){
    return null;
  }
  renderTabs(){

  }
  openModal(edit){
    this.props.navigator.push({
      screen: edit ? "ivf.EditVisit" : "ivf.CreateVisit" , // unique ID registered with Navigation.registerScreen
      title: edit ? "Edit" : "Create", // title of the screen as appears in the nav bar (optional)
      passProps: {}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {
        leftButtons: [
        {
          icon: iconsMap['ios-person'], // for icon button, provide the local image asset name
          id: 'logout', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          buttonColor: 'white',
          disableIconTint: true,
        }
        ]
      }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }
  render(){
    const date = this.state.date;

    const Search = (this.props.route && this.props.route.params && this.props.route.params.search)?this.props.route.params.search:false

    return <View style={{flex:1}}>
      <Image source={Navbg} style={{width,height:height*.3,zIndex:-1,position:'absolute',top:0}}>
        <View style={{backgroundColor:'rgba(144,75,120,.6)',flex:1}} />
      </Image>

        {Search||this.props.user_role==='admin' &&
        <TouchableOpacity onPress={()=>this.setState({showDatePicker:true})} style={[styles.row,{marginTop:0,marginHorizontal:-20,backgroundColor:'purple',padding:15}]}>
            <View style={{flex:1,borderColor:'white',borderRightWidth:2}}>
            <Text style={{textAlign:'center',color:'white'}}>{date.format('DD')}</Text></View>
            <View style={{flex:1,borderColor:'white',borderRightWidth:2}}>
            <Text style={{textAlign:'center',color:'white'}}>{date.format('MMMM')}</Text></View>
            <View style={{flex:1,borderColor:'white',borderRightWidth:0}}>
            <Text style={{textAlign:'center',color:'white'}}>{date.format('YYYY')}</Text></View>
        </TouchableOpacity>}

        {!Search && <View style={{justifyContent:'center',alignItems:'center'}}>
        <ScrollView horizontal={true} style={{height:60, margin:8,flexDirection:'row'}}>
          <View style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
            <Text style={{fontWeight:'bold','textAlign':'center'}}>All</Text>
            <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>11</Text>
          </View>
          <View style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
            <Text style={{fontWeight:'bold',color:'purple','textAlign':'center'}}>Pre%</Text>
            <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>23</Text>
          </View>
          <View style={[styles.minicard,{minWidth:Math.max((width/4),70)}]}>
            <Text style={{fontWeight:'bold',color:'green','textAlign':'center'}}>Half</Text>
            <Text style={{fontWeight:'bold','textAlign':'center',fontSize:20}}>50</Text>
          </View>
        </ScrollView>
        </View>}


        <Tabs selected={Search ? 1:0} titles={['All day'].concat(Object.values(this.props.rooms||{a:{name:'Search'}}))} label={i=>i.name ? i.name : 'All day'} onChange={(page)=>this.props.navigate('home',{search:true})} style={{minHeight:40}}/>

        <View style={[styles.card,{flex:1,margin:10}]}>
          <ScrollView>
            <Shortlist
              master={this.props.visits}
              getValue={f=>{console.debug('value for:',f);return f.patient.toLowerCase();}}
              keyword={this.props.filters.patient||''}
              renderItem={k=><Visits.Row data={this.props.visits[k]} {...this.props}/>} minLength={3} />

            <TouchableOpacity onPress={()=>this.openModal()}>
            <View style={{alignItems:'center',justifyContent:'center',flex:1,marginTop:40}}>
              <Text style={{color:'grey'}}>You didn't Book any Appointements yet</Text>
              <Text style={{color:'grey'}}>Create one now !</Text>
              <Icon name="arrow-down" size={24} color="grey" style={{marginTop:30}}/>
            </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{justifyContent:'center',alignItems:'center',margin:20}}>
        <Icon.Button onPress={()=>this.openModal(true)} name="plus" backgroundColor="blue">
          Book new Appointement
        </Icon.Button>
        </View>
  </View>
  }

}
const state = state =>({
  filters:Visit.selectFilters(state)||{},
  visits:state.visits.payload||state.visits,
})
const act = dispatch =>({
  dispatch,
  fetch: ()=>dispatch(Visit.fetch())
})
export default connect(state,act)(Home);