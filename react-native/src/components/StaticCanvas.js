import React, { Component } from 'react';
import {
  Image
} from 'react-native';

export default class StaticCanvas extends Component {
  render(){
    return(
      <Image {...this.props} source={require('../assets/static.jpg')}/>
    )
  }
}
