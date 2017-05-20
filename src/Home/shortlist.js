import React, { Component } from 'react';
import {
  View
} from 'react-native';

class ShortList extends Component {
  //<Shortlist master={{}} style={{}} getValue={f=>f.title.toLowerCase()} keyword='search' renderItem={id=>null} minLength={3} />
  constructor(props){
      super(props);
      this.state = {list:[],keyword:String(props.keyword||'').toLowerCase()};
      this._hadleSearchMaster = this._hadleSearchMaster.bind(this)
      this._hadleSearchList = this._hadleSearchList.bind(this)
      this.trigger = this.trigger.bind(this)
      this.extract = typeof props.getValue==='function' ? props.getValue : f=>String(f);
      this.minLength = props.minLength||3;
      this.debounce = 0;
  }
  _hadleSearchMaster(){
    const list = Object.keys(this.props.master).map(id=>this.extract(this.props.master[id]).indexOf(this.state.keyword)>-1);
    console.log('searched master and returned'+this.state.keyword,Object.keys(this.props.master),list);
    this.setState({list});
  }
  _hadleSearchList(){
    console.log('searched shortlist and returned'+this.state.keyword,list);
    list = this.state.list.map(id=>this.extract(props.master[id]).indexOf(this.state.keyword)>-1);
    this.setState({list});
  }
  trigger(){
    clearTimeout(this.debounce);
    this.debounce = setTimeout(this._hadleSearchMaster, 200);
  }
  componentWillReceiveProps(props){
    this.extract = typeof props.getValue==='function' ? props.getValue : f=>String(f);
    if(props.getValue!==this.props.getValue)this.extract = props.getValue;
    if(props.minLength!==this.props.minLength)this.minLength = props.getValue;

    if(!props.keyword || props.keyword.length < this.minLength)return;
    if(props.keyword===this.props.keyword)return;
    this.setState({keyword:String(props.keyword||'').toLowerCase()},
                  this.trigger)

  }
  render() {
    return <View style={this.props.style}>{this.state.list.map(id=>this.props.renderItem(id))}</View>;
  }
}

export default ShortList