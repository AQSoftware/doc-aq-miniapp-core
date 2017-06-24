'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var requestAnimationFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || function (callback) {
  global.setTimeout(callback, 1000 / 60);
};

var StaticCanvas = function (_Component) {
  _inherits(StaticCanvas, _Component);

  _createClass(StaticCanvas, [{
    key: 'animate',
    value: function animate(handle) {
      var _this2 = this;

      handle();
      requestAnimationFrame(function () {
        _this2.animate(handle);
      });
    }
  }, {
    key: 'noise',
    value: function noise(ctx, stateCallback) {
      var w = stateCallback().width,
          h = stateCallback().height,
          idata = ctx.createImageData(w, h),
          buffer32 = new Uint32Array(idata.data.buffer),
          len = buffer32.length,
          i = 0;

      for (; i < len;) {
        buffer32[i++] = (255 * Math.random() | 0) << 24;
      }
      ctx.putImageData(idata, 0, 0);
    }
  }, {
    key: 'updateDimensions',
    value: function updateDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      window.addEventListener("resize", this.updateDimensions);

      var ctx = this.canvas.getContext('2d');
      this.animate(function () {
        _this3.noise(ctx, function () {
          return _this3.state;
        });
      });
    }
  }]);

  function StaticCanvas(props) {
    _classCallCheck(this, StaticCanvas);

    var _this = _possibleConstructorReturn(this, (StaticCanvas.__proto__ || Object.getPrototypeOf(StaticCanvas)).call(this, props));

    _this.state = { width: props.width, height: props.height };
    _this.updateDimensions = _this.updateDimensions.bind(_this);
    return _this;
  }

  _createClass(StaticCanvas, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement('canvas', { width: this.state.width, height: this.state.height, ref: function ref(input) {
          _this4.canvas = input;
        } });
    }
  }]);

  return StaticCanvas;
}(_react.Component);

exports.default = StaticCanvas;