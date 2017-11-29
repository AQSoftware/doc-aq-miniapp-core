// from https://github.com/larsvinter/react-native-awesome-button

import React, { Component, PropTypes } from 'react';
import AwesomeButton from './AwesomeButton';

export default class AQButton extends Component {
  render() {
    const { title, backgroundColor, onPress, width, height } = this.props;

    const buttonState = {
      default: {
        backgroundStyle: {
          backgroundColor: backgroundColor,
          minHeight: height,
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: height / 2
        },
        text: title,
        onPress: onPress
      }
    }

    return (
      <AwesomeButton states={buttonState}/>
    );
  }
}
