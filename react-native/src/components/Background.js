// @flow
import React, { Component } from 'react';
import {
  Image
} from 'react-native';

export default class Background extends Component {
  render(){
    const {source, ...rest} = this.props;
    return(
      <Image {...rest} source={source}/>
    )
  }
}
