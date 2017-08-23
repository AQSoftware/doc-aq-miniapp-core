// @flow
import React, { Component } from 'react';
import '../css/Background.css';

/**
Background component
*/
export default class Background extends Component {
  render() {
    return (
      <img className='aqBackground' src={this.props.image} alt='background'/>
    )
  }
}
