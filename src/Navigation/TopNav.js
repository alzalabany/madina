import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Image,
  Dimensions,
  LayoutAnimation,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Navbg from '../../assets/images/topnav.png';

const {width,height} = Dimensions.get('window');
class TopNav extends Component {
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  render() {
    const title = this.props.title || 'Home';
    const showSearch = (this.props.route && this.props.route.params) ? Boolean(this.props.route.params.search) : false;
    const nav = this.props.nav;
    //
    //nav('home')
    //nav('logout')
    const leftAction = () => this.props.route.page==='home' ? this.props.leftAction() : nav('home',{search:false});

    return (
        <View style={[styles.container,{flexDirection:'row',backgroundColor:'purple'}]}>

        {!showSearch &&
        <View style={[{margin:15,backgroundColor:"transparent"}]}>
          <FontAwesome
            onPress={leftAction}
            name={this.props.back ? "arrow-left":"user-md"} size={30} color="white" />
        </View>}

        {!showSearch && <View style={[styles.flex,{justifyContent:'center',alignItems:'center',backgroundColor:"transparent"}]}>
        <Text style={[styles.header,{textAlign:'center',fontSize:title.length>10 ? 25 : 40,marginRight:50,backgroundColor:'transparent'}]}>
          {title}
        </Text></View>}



        <View style={{width:Boolean(!showSearch && this.props.back) ? width : 50,overflow:'hidden'}}>

                  {this.props.loading ? <ActivityIndicator
                                          animating={true}
                                          color="white"
                                          size="large" /> :
                                    <FontAwesome backgroundColor="transparent"
                                    style={{marginTop:30,width:50}}
                                    onPress={()=>nav('home',{search:!showSearch})}
                                    name={showSearch ? 'arrow-left' : 'search'}
                                    size={30} color="white" />
                  }


          {showSearch && <TextInput onChangeText={this.props.onSearch} style={styles.searchInput}/>}
        </View>
        </View>
    );
  }
}

const searchBar = visible => ({
  backgroundColor:'transparent',
  justifyContent:'center',
  flexDirection:'row',
  display:'flex',
  minWidth:50,
})

const styles = StyleSheet.create({
  container:{
    height:(Platform.OS === 'ios') ? 86 : 66,
    width,
    paddingTop:(Platform.OS === 'ios') ? 22 : 0,
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
    fontSize:30,
    paddingLeft:20,
    color:'purple',
    borderBottomColor:'grey',
    borderBottomWidth:2,
    backgroundColor:'rgba(255,255,255,0.7)'
  }
});

export default TopNav