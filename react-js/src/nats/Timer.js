// @flow
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import './Timer.css';

type Props = {
  /** Initial timer duration in seconds */
  duration: number,
  /** Width of timer */
  width?: number,
  /** Height of timer */
  height?: number,
  /** Border thickness */
  borderWidth?: number,
  /** Border color */
  borderColor?: string,
  /** Rounded corner radius */
  borderRadius?: number,
  /** Text color */
  textColor?: string,
  /** Background color */
  backgroundColor?: string,
  /** Callback to be called when timer reaches zero */
  onTimeout: () => void
}

/**
Countdown timer component
*/
export default class Timer extends Component {

  state: {
    started: boolean,
    duration: number
  }

  props: Props;

  static defaultProps = {
    duration: 0,
    width: 200,
    height: 40,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 20,
    textColor: 'black',
    backgroundColor: 'red'
  }

  constructor(props: Props){
    super(props);
    this.state = {
      started: false,
      duration: this.props.duration * 1000
    }
  }

  timer: ?number;

  /**
  * Starts the timer
  *
  * @public
  */
  start(){
    if (!this.state.started) {
      this.setState({started: true});
      const
   			now = Date.now(),
   			duration = this.state.duration;

        this.timer = setInterval(() => {
            if (this.state.duration > 0) {
                let newDuration = duration + (now - Date.now());
                if (newDuration < 0) newDuration = 0;
                this.setState({
                    duration: newDuration
                });
            } else {
                this.setState({duration: 0}, () => {
                  if (this.props.onTimeout) this.props.onTimeout();
                });
                if (this.timer) clearInterval(this.timer);
                this.setState({started: false});
            }
        }, 50);
    }
  }

  /**
  * Starts the timer
  *
  * @public
  */
  restart(){
    if (!this.state.started) {
      this.setState({duration: this.props.duration * 1000}, () => { this.start(); });
    }
  }

  /**
  * Stops the timer
  *
  * @public
  */
  stop(){
      if (this.timer && this.state.started){
          clearInterval(this.timer);
          this.setState({started: false});
      }
  }

  render() {
    return(
      <div>
        <div
          className="aq_timer"
          style={{
            width: this.props.width,
            height: this.props.height,
            borderStyle: 'solid',
            borderColor: this.props.borderColor,
            borderWidth: this.props.borderWidth,
            borderRadius: this.props.borderRadius,
            color: this.props.textColor,
            backgroundColor: this.props.backgroundColor
          }}
        >
            Time left: <span className='aq_timer_span'>{this.state.duration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
        </div>
      </div>
    );
  }
}
