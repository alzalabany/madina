import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,Modal,Button,
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
  }
  static navigatorStyle = {
    navBarTextColor: 'white', // change the text color of the title (remembered across pushes)
    navBarBackgroundColor: 'purple', // change the background color of the nav bar (remembered across pushes)
  };
  changeDate(date){
    this.setState({date,loadingTimes:true,showDatePicker:false,time:null})
    setTimeout(() =>{
      this.setState({date,loadingTimes:false})
    }, 2000);
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
  render() {
    const isSelected = (prop,val,eq) => (this.state[prop]===val||eq) ? styles.selected : null
    const date = moment(this.state.date);
    return (

        <ScrollView onLayout={event=>this.setState({width:(event.nativeEvent.layout.width*.5)-20})} style={this.props.style ? this.props.style : styles.card}>
          <TouchableOpacity style={styles.row} onPress={()=>this.setState({showDrSelect:true})}>
            <Text style={styles.label}>Doctor: </Text>
            <User id={this.state.ref_id} render={data=><Text style={styles.label}>{data.fullname||'please select'}</Text>} />
          </TouchableOpacity>
          <TextInput placeholder="Patient Name*" style={styles.input}/>
          <TextInput placeholder="Husband Name" style={styles.input}/>
          <TextInput placeholder="Phone number" style={styles.input}/>

          <Text style={[styles.label,styles.space]}>Type of service*</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.option]} onPress={()=>this.setState({type:'icsi'})}>
            <Text style={[styles.cell, isSelected('type','icsi')]}>
              ICSI
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option]} onPress={()=>this.setState({type:'iui'})}>
            <Text style={[styles.cell,isSelected('type','iui')]}>
              IUI
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={()=>this.setState({type:'thawing'})}>
            <Text style={[styles.cell,isSelected('type','thawing')]}>
              thawing
            </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.row,{marginBottom:20}]}>
            <TouchableOpacity style={styles.option} onPress={()=>this.setState({type:'dxmicro'})}>
            <Text style={[styles.cell,isSelected('type','dxmicro')]}>
              Diagnostic Microscopy
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={()=>this.setState({type:'hysteroscopy'})}>
            <Text style={[styles.cell,isSelected('type','hysteroscopy')]}>
              Hysteroscopy
            </Text>
            </TouchableOpacity>
          </View>

          {this.state.type ==='icsi' && <TextInput placeholder="Final E2" style={[styles.input,{}]}/>}

          <Text style={[styles.label,styles.space,{marginTop:20}]}>Booking Date*</Text>

          {this.state.type !=='icsi' ?
          <TouchableOpacity onPress={()=>this.setState({showDatePicker:true})} style={[styles.row,{backgroundColor:'rgba(237,237,237,1)',padding:5,borderRadius:5}]}>
            <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:2}}>
            <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('DD')}</Text></View>
            <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:2}}>
            <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('MMMM')}</Text></View>
            <View style={{flex:1,borderColor:'rgba(96,166,215,1)',borderRightWidth:0}}>
            <Text style={{textAlign:'center',color:'rgba(96,166,215,1)'}}>{date.format('YYYY')}</Text></View>
          </TouchableOpacity>

          : <ScrollView horizontal={true} style={styles.row} >
            {this.state.loadingTimes===true && <ActivityIndicator />}
            {['11-12-2017','11-12-2017','15-12-2017','13-12-2017'].map(time=>(
            <Text key={time} onPress={()=>this.setState({time})} style={[styles.cell,{minWidth:100,minHeight:30},isSelected('time',time)]}>
              {time}
            </Text>))}
          </ScrollView>}

          <Calendar
            visible={this.state.showDatePicker}
            close={()=>this.setState({showDatePicker:false})}
            isDisabled={date=>{
              if(this.state.type !=='icsi')return false;
              const d = moment().diff(date,'day');
              //const weekday = moment(date).weekday();

              if(d <= -4)return true;
              if(d > -1)return true;

              return false;
            }}
            currentDay={this.state.date}
            onChange={this.changeDate.bind(this)}/>

          {this.state.type ==='icsi' && <Text style={[styles.label,styles.space,{marginTop:20}]}>Available Time</Text>}

          {this.state.type ==='icsi' && <View style={styles.row} >
            {this.state.loadingTimes===true && <ActivityIndicator />}
            {this.state.loadingTimes===false && ['08:00am','08:40am','11:00am','07:00am'].map(time=>(
            <Text key={time} onPress={()=>this.setState({time})} style={[styles.cell,isSelected('time',time)]}>
              {time}
            </Text>))}
          </View>}




          <Text style={[styles.label,styles.space,{marginTop:20}]}>Extra Services</Text>
          <View style={{flexDirection:'row','flexWrap':'wrap'}}>
            {extras.map(n=><TouchableOpacity key={n} style={[styles.option,{width:Math.max(this.state.width),flex:undefined}]} onPress={()=>this.setState({extra:(this.state.extra||[]).indexOf(n)>-1?(this.state.extra||[]).filter(i=>i!==n):(this.state.extra||[]).concat([n])})}>
            <Text style={[styles.cell,isSelected('extra',n,(this.state.extra||[]).indexOf(n)>-1)]}>
              {n}
            </Text>
            </TouchableOpacity>)}
          </View>

          <View style={[styles.row,{display:'flex',justifyContent:'center',marginVertical:30}]}>
              <Button style={{color:'white',marginTop:50}} onPress={this.props.close} title={"Book appointement"} />
          </View>


          <Modal animationType={"slide"}
          transparent={true}
          visible={Boolean(this.state.showDrSelect)}
          onRequestClose={()=>this.setState({showDrSelect:false})}>
            <TouchableOpacity onPress={()=>this.setState({showDrSelect:false})} style={{justifyContent:'flex-end',flex:1}}>
            <View style={{height:400,backgroundColor:'white',padding:10}}>

            <View style={{marginBottom:20}}>
              <Text>Select doctor</Text>
              <TextInput placeholder="search" />
            </View>

            <ScrollView style={{flex:1}}>
              {Object.keys({}).map(id=>(
              <TouchableOpacity key={id} style={{borderBottomWidth:1,borderBottomColor:'purple'}}
                onPress={()=>this.setState({showDrSelect:false,ref_id:id})}>
                <Text style={[styles.label,{textAlign:'center',padding:20,fontSize:18}]}>{this.props.users[id].fullname}</Text>
              </TouchableOpacity>
              ))}
            </ScrollView>

            </View>
            </TouchableOpacity>
          </Modal>

        </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
  },
  row:{
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