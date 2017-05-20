import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,Modal,Button,LayoutAnimation,
  TextInput,Dimensions,ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import Bg from '../../assets/images/longbg.png'
import { Navigation } from 'react-native-navigation';

const User = props => null;
const Calendar = props => null;

const {width,height} = Dimensions.get('window');

const innerWidth = width-60;

const extras = [
'imsi','emberyoscope','LAh','vit. all','PGD','basket'
];

class CreatePage extends Component {
  state={
    date:moment().add(2,'days'),
    width:width*.3,
    extra:[],
    showSection:'personal',
    sections:{
      personal:[{
  label:'patient',
  value:'Ola',
  type:'text',
},{
  label:'Husband',
  value:'',
  type:'text',
},{
  label:'patient age',
  value:'patient age',
  type:'text',
},{
  label:'E2',
  value:'E2',
  type:'text',
}],
oocytes:[{
  label:'D1',
  value:'D1',
  type:'text',
},{
  label:'D2',
  value:'D2',
  type:'text',
},{
  label:'D3',
  value:'D3',
  type:'text',
},{
  label:'Fertility',
  value:'Fertility',
  type:'text',
}],
andrology:[{
  label:'D1',
  value:'D1',
  type:'text',
},{
  label:'D2',
  value:'D2',
  type:'text',
},{
  label:'D3',
  value:'D3',
  type:'text',
},{
  label:'Fertility',
  value:'Fertility',
  type:'text',
}]
    },
  }
  componentWillMount(){
    this.props.navigator.setButtons({
      leftButtons: [ {
        title: 'back', // for a textual button, provide the button title (label)
        id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
        disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
        disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
        showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
        buttonColor: 'white', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }], // see "Adding buttons to the navigator" below for format (optional)
      rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
      animated: true // does the change have transition animation or does it happen immediately (optional)
    });
    this.props.navigator.setOnNavigatorEvent((event)=>event.id==='back' ? this.props.navigator.pop({animationType: 'slide-down'}) : console.debug('unknow event ',event));
  }
  changeDate(date){
    this.setState({date,loadingTimes:true,showDatePicker:false,time:null})
    setTimeout(() =>{
      this.setState({date,loadingTimes:false})
    }, 2000);
  }
  componentWillUpdate() {
       LayoutAnimation.easeInEaseOut();
  }
  render() {
    const isSelected = (prop,val,eq) => (this.state[prop]===val||eq) ? styles.selected : null
    const date = moment(this.state.date);

    return (

        <ScrollView onLayout={event=>this.setState({width:(event.nativeEvent.layout.width*.5)-20})} style={[styles.card,this.props.style,{flex:1,backgroundColor:'grey',padding:0,margin:-10}]}>
          <View style={[styles.row,{marginHorizontal:20}]}>
            <View style={{borderColor:'purple',borderWidth:1,flex:1,alignItems:'center'}}>
              <Text style={{color:'grey'}}>State</Text>
              <Text style={{height:10}}/>
              <Text style={{color:'purple'}}>Booked</Text>
            </View>
            <View style={{borderColor:'purple',borderWidth:1,flex:1,alignItems:'center'}}>
              <Text style={{color:'grey'}}>Pregnancy</Text>
              <Text style={{height:10}}/>
              <Text style={{color:'purple'}}>No</Text>
            </View>
            <View style={{borderColor:'purple',borderWidth:1,flex:1,alignItems:'center'}}>
              <Text style={{color:'grey'}}>Date</Text>
              <Text style={{color:'purple'}}>25-10-2017</Text>
              <Text style={{color:'purple'}}>11:00am</Text>
            </View>
          </View>
          {Object.keys(this.state.sections).map(i=>(<View><TouchableOpacity style={[styles.row,{backgroundColor:'purple',padding:10,marginVertical:10}]} onPress={()=>this.setState({showSection:i})}>
                      <Text style={[{flex:1,fontSize:20,color:'white',textAlign:'center'}]}>{i}</Text>
                      {this.state.showSection!==i && <Text style={{color:'white'}}>open</Text>}
                    </TouchableOpacity>
                    {this.state.showSection===i &&<View>
                      {this.state.sections[i].map(name=><View style={[styles.row,{borderWidth:1,borderColor:'purple'}]}>
                                      <View style={{overflow:'hidden',borderRightWidth:1,borderColor:'purple',padding:10,width:100}}>
                                      <Text style={[styles.label,{flex:1,textAlign:'left'}]}>{name.label}</Text>
                                      </View>
                                      <Text style={[styles.label,{flex:1,textAlign:'center',padding:10}]}>{name.value}</Text>
                                  </View>)}
                    </View>}
                    </View>))}
        </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
  },
  row:{
    backgroundColor:'white',
    display:'flex',
    flexDirection:'row',
  },
  option:{
    flex:1,
    borderRadius:5,
    display:'flex',
    flexDirection:'row'
  },
  cell:{
    backgroundColor:'rgba(237,237,237,1)',
    color:'rgba(112,168,180,1)',
    flex:1,
    margin:5,
    borderRadius:5,
    textAlign:'center',
    padding:5,
    width:innerWidth/3
  },
  selected:{
    color:'rgba(255,255,255,1)',
    backgroundColor:'rgba(96,166,215,1)',
  },
  btn:{
    marginTop:40,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:10,
    backgroundColor:'rgba(96,166,215,1)',
  },
  space:{marginTop:10},
  input:{
    height:40,
    borderColor:'purple',
    borderWidth:1,
    marginVertical:5,
    borderRadius:5,
    paddingLeft:15,
    backgroundColor:'rgba(237,237,237,1)'
  },
  label:{
    color:'rgba(174,118,174,1)',
    fontWeight:'500'
  },
  card:{
    margin:10,
    paddingVertical:20,
    paddingHorizontal:10,
    paddingBottom:50,
    borderRadius:4,
    backgroundColor:'white',
    shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 5,
      shadowOpacity: .60,
      elevation:5
  }
});

export default CreatePage;