import React, { Component } from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  TextInput,Image,
  TouchableOpacity,
} from 'react-native';
import Navbg from '../../assets/images/topnav.png';

const {width,height} = Dimensions.get('window');

class Tabs extends Component {
  state={
    search:false,
    step: this.props.page==='blog' ? 0 : this.props.page==='more' ? .66 : .33
  }
  componentWillMount() {
    this.onChange = this.onChange.bind(this);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  is_selected(view){
    return this.state.selected === view;
  }
  isActive(active){
    return active ? styles.active : styles.inactive;
  }
  onChange(){
    console.log(this.state);
    this.props.onChange(this.state.selected)
  }
  render() {

    return (
      <Image  source={Navbg} style={styles.container}>
        <TouchableOpacity onPress={()=>this.setState({selected:'blog',step:0},this.onChange)} style={styles.tab}>
        <FontAwesome name="rocket" size={30} color='white' />
        <Text style={styles.tabText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.setState({selected:'home',step:0.33},this.onChange)}  style={styles.tab}>
        <FontAwesome name="home" size={30} color='white' />
        <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.setState({selected:'more',step:0.66},this.onChange)}  style={styles.tab}>
        <FontAwesome name="bars" backgroundColor="transparent" size={30} color='white' />
        <Text style={styles.tabText}>Contact</Text>
        </TouchableOpacity>
        <View style={[styles.marker,{left:width*this.state.step||0}]} />
      </Image>
    );
  }
}


const styles = StyleSheet.create({
  marker:{
    position:'absolute',
    top:0,
    bottom:0,
    backgroundColor:'rgba(200,200,200,0.4)',
    zIndex:-1,
    width:width*.33,
  },
  container:{
    height:Math.min(height*.1,50),
    backgroundColor:'purple',
    display:'flex',
    flexDirection:'row',
    width:width,
  },
  tab:{
    justifyContent:'center',
    alignItems:'center',
    height:Math.min(height*.1,50),
    flex:1,
    backgroundColor:'transparent',
  },
  tabText:{
    backgroundColor:'transparent',
    color:'white',
  },
  flex:{
    flex:1
  },
  header:{
    color:'white',
    fontWeight:'500',
  },
  searchInput:{
    flex:1,
    borderBottomColor:'grey',
    borderBottomWidth:2,
    backgroundColor:'rgba(255,255,255,0.7)'
  }
});

export default Tabs
