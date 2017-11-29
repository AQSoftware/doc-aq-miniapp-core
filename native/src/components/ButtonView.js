// from https://github.com/larsvinter/react-native-awesome-button
import React, { Component, PropTypes } from 'react';
import { ActivityIndicator, Animated, View, StyleSheet, Text, TouchableOpacity } from 'react-native';


export default class ButtonView extends Component {

  render() {
    const styles = StyleSheet.flatten({
      labelStyle: this.props.labelStyle,
      backgroundStyle: this.props.backgroundStyle
    });

    return(
      <TouchableOpacity
        onPress={this.props.onPress}
        activeOpacity={0.9}
        disabled={this.props.disabled}
      >
        <Animated.View style={styles.backgroundStyle}>
          <View style={{ flexDirection: 'row' }}>
            { (this.props.icon && this.props.iconAlignment === 'left') ?
              this.props.icon
              : null
            }
            { this.props.spinner ?
              <ActivityIndicator {...this.props.spinnerProps} style={{ marginRight: 10 }} />
              : null
            }
            <Text style={styles.labelStyle}>{this.props.text}</Text>
            { (this.props.icon && this.props.iconAlignment === 'right') ?
              this.props.icon
              : null
            }
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}


ButtonView.propTypes = {
  backgroundStyle: PropTypes.array,
  labelStyle: PropTypes.object,
  spinnerProps: PropTypes.object,
  text: PropTypes.string,
  onPress: PropTypes.func,
  spinner: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.element,
  iconAlignment: PropTypes.string
};

ButtonView.defaultProps = {
  backgroundStyle: {
    flex: 1,
    maxHeight: 40,
    backgroundColor: '#1155DD',
    borderRadius: 20
  },
  labelStyle: {
    color: '#FFFFFF',
    textAlign: 'center'
  },
  spinnerProps: {
    animating: true,
    color: '#FFFFFF'
  },
  text: 'Click here',
  spinner: false,
  disabled: true,
  icon: null,
  iconAlignment: null,
  onPress: (() => {}) // work-around to suppress eslinters no-default-prop
};
