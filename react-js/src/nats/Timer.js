// @flow
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import './Timer.css';

/**
Countdown timer component
*/
export default class Timer extends Component {

  state: {
    started: boolean
  }

  static propTypes = {
    timer: PropTypes.number.required,
    /** Style properties */
    style: PropTypes.shape({
      /** Width of timer */
      width: PropTypes.number,
      /** Height of timer */
      height: PropTypes.number,
      /** Rounded corner radius */
      borderRadius: PropTypes.number,
      /** Text color */
      color: PropTypes.string,
      /** Background color */
      backgroundColor: PropTypes.string
    }),
    /** Called when timer reaches 0 */
    onTimeout: PropTypes.func
  };

  start(){
    alert('start');
  }

  render() {
    return(
      <div>
        <div
          className="aq_timer"
          style={{
            width: this.props.style.width,
            height: this.props.style.height,
            borderRadius: this.props.style.borderRadius,
            color: this.props.style.textColor,
            backgroundColor: this.props.style.backgroundColor
          }}
        >
            Time left: <span>{this.props.timer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
        </div>
      </div>
    );
  }
}
