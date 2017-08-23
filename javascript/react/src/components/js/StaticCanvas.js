// @flow
import React, { Component } from 'react';

let requestAnimationFrame =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  function(callback) {
    global.setTimeout(callback, 1000 / 60);
  };

type State = {
  width: number,
  height: number
}

type Props = {
  width: number,
  height: number
}

/**
Component that renders random static noise just like an old TV
*/
export default class StaticCanvas extends Component {
  state: State;

  canvas: HTMLCanvasElement;
  updateDimensions: () => void;

  animate(handle: () => void){
    handle();
    requestAnimationFrame(() => {
      this.animate(handle);
    });
  }

  noise(ctx: CanvasRenderingContext2D, stateCallback: () => State) {
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
      if (ctx != null) {
        this.noise(ctx, () => {return this.state; });
      }
    });

  }

  constructor(props: Props){
    super(props);
    this.state = { width: props.width, height: props.height };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  render() {
    return(
      <canvas id={this.props.id} width={this.state.width} height={this.state.height} ref={(input) => { this.canvas = input; }}></canvas>
    );
  }
}
