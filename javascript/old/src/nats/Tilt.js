// @flow
import { Component } from 'react';

// Types for flow syntax-checking
type Props = {
  /**
  Callback to be called when device orientation (in degrees) changes.
  Normal position is 0 degrees, device tilted to the left is -90 degrees,
  device tilted to the right is 90 degrees.
  */
  onTilt: (degrees: number) => void
};

// $FlowFixMe
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

/**
Component which processes device orientation events.
*/
export default class Tilt extends Component {

  hasDeviceOrientation = window.DeviceOrientationEvent;

  props: Props;

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    if (this.hasDeviceOrientation) {
      window.addEventListener('deviceorientation', this.deviceOrientation, false);
    }
  }

  componentWillUnmount() {
    if (this.hasDeviceOrientation) {
      window.removeEventListener('deviceorientation', this.deviceOrientation, false);
    }
  }

  // $FlowFixMe
  handleOrientation(event) {
    // those angles are in degrees
    let beta = event.beta;
    let gamma = event.gamma;

    // JS math works in radians
    let betaR = beta / 180 * Math.PI;
    let gammaR = gamma / 180 * Math.PI;
    let spinR = Math.atan2(Math.cos(betaR) * Math.sin(gammaR), Math.sin(betaR));

    // convert back to degrees
    let spin = spinR * 180 / Math.PI;

    if (spin >= 90) {
      spin = 90;
    } else if (spin <= -90) {
      spin = -90;
    }

    return Math.round(spin);
}

  deviceOrientation = (e: Event) => {
    if (this.props.onTilt) {
      this.props.onTilt(this.handleOrientation(e));
    }
  }

  render() {
    return null;
  }
}
