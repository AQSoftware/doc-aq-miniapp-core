'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./Timer.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
Countdown timer component
*/
var Timer = function (_Component) {
  _inherits(Timer, _Component);

  function Timer() {
    _classCallCheck(this, Timer);

    return _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).apply(this, arguments));
  }

  _createClass(Timer, [{
    key: 'start',
    value: function start() {
      alert('start');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          {
            className: 'aq_timer',
            style: {
              width: this.props.style.width,
              height: this.props.style.height,
              borderRadius: this.props.style.borderRadius,
              color: this.props.style.textColor,
              backgroundColor: this.props.style.backgroundColor
            }
          },
          'Time left: ',
          _react2.default.createElement(
            'span',
            null,
            this.props.timer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          )
        )
      );
    }
  }]);

  return Timer;
}(_react.Component);

Timer.propTypes = {
  timer: _propTypes2.default.number.required,
  /** Style properties */
  style: _propTypes2.default.shape({
    /** Width of timer */
    width: _propTypes2.default.number,
    /** Height of timer */
    height: _propTypes2.default.number,
    /** Rounded corner radius */
    borderRadius: _propTypes2.default.number,
    /** Text color */
    color: _propTypes2.default.string,
    /** Background color */
    backgroundColor: _propTypes2.default.string
  }),
  /** Called when timer reaches 0 */
  onTimeout: _propTypes2.default.func
};
exports.default = Timer;