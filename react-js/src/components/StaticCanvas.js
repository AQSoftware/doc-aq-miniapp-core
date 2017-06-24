import React, { Component } from 'react';

let requestAnimationFrame =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  function(callback) {
    global.setTimeout(callback, 1000 / 60);
  };

export default class StaticCanvas extends Component {

  animate(handle){
    handle();
    requestAnimationFrame(() => {
      this.animate(handle);
    });
  }

  noise(ctx, stateCallback) {
    var w = stateCallback().width,
        h = stateCallback().height,
        idata = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(idata.data.buffer),
        len = buffer32.length,
        i = 0;

    for(; i < len;){
        buffer32[i++] = ((255 * Math.random())|0) << 24
    }
    ctx.putImageData(idata, 0, 0);
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    var ctx = this.canvas.getContext('2d');
    this.animate(() => {
      this.noise(ctx, () => {return this.state; });
    });

  }

  constructor(props){
    super(props);
    this.state = { width: props.width, height: props.height };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  render() {
    return(
      <canvas width={this.state.width} height={this.state.height} ref={(input) => { this.canvas = input; }}></canvas>
    );
  }
}
