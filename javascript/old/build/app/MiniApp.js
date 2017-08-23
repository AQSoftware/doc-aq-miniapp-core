'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ = require('..');

var _reactRouterDom = require('react-router-dom');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _Create = require('./Create');

var _Create2 = _interopRequireDefault(_Create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Warning(props) {
  return _react2.default.createElement(
    'div',
    { style: { padding: 10 } },
    'Warning: ',
    props.message
  );
}

var MiniApp = function (_Component) {
  _inherits(MiniApp, _Component);

  //$FlowFixMe
  function MiniApp(props) {
    _classCallCheck(this, MiniApp);

    var _this = _possibleConstructorReturn(this, (MiniApp.__proto__ || Object.getPrototypeOf(MiniApp)).call(this, props));

    _this.clients = {
      cloudStorageClient: new _.CloudStorage(props.credentials),
      mediaStorageClient: new _.MediaStorage()
    };
    _this.state = {
      data: null
    };
    return _this;
  }

  _createClass(MiniApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      _.defaultLifeCycle.setOnDataCallback(this._onData.bind(this));
    }
  }, {
    key: '_onData',
    value: function _onData(data) {
      this.setState({ data: data });
    }

    // $FlowFixMe

  }, {
    key: '_route',
    value: function _route(routeProps) {
      // Depending on mode, this mini app will be called with the possible
      // query parameters:
      //
      // For Content Editor mode - http://server/index.html?action=create
      // For Join mode - http://server/index.html?action=join&id=some_id&joinId=some_id
      // For Preview mode - http://server/index.html?action=preview
      var search = routeProps.location.search;
      var query = _queryString2.default.parse(search);

      var Join = this.props.join;

      var width = window.innerWidth;
      var height = window.innerHeight;
      var render = _react2.default.createElement(_.StaticCanvas, { width: width, height: height });
      if (this.props.default) {
        render = _react2.default.createElement(this.props.default, _extends({}, routeProps, this.clients), null);
      }

      if (query && query.action) {
        switch (query.action) {
          case 'join':
            if (query.id == null) {
              var message = 'id was not passed for action=join';
              console.error(message);
              render = _react2.default.createElement(Warning, { message: message });
            } else {
              render = _react2.default.createElement(this.props.join, _extends({}, this.clients, { additionalInfo: this.state.data, id: query.id, mode: 'join' }), null);
              // render = <Join {...this.clients} mode='join' id={query.id} additionalInfo={this.state.data}/>
            }
            break;
          case 'preview':
            if (this.state.data != null) {
              render = _react2.default.createElement(this.props.join, _extends({}, this.clients, { data: this.state.data, mode: 'preview' }), null);
              // render = <Join {...this.clients} mode='preview' data={this.state.data}/>
            }
            break;
          default:
            if (this.props.create) {
              render = _react2.default.createElement(this.props.create, _extends({}, this.clients, { data: this.state.data }), null);
            } else {
              if (this.state.data != null) {
                render = _react2.default.createElement(_Create2.default, _extends({}, this.clients, { data: this.state.data }));
              }
            }
            break;
        }
      }
      return render;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactRouterDom.BrowserRouter,
        null,
        _react2.default.createElement(_reactRouterDom.Route, { path: '*', component: this._route.bind(this) })
      );
    }
  }]);

  return MiniApp;
}(_react.Component);

MiniApp.propTypes = {
  default: _propTypes2.default.func,
  create: _propTypes2.default.func,
  join: _propTypes2.default.func.isRequired,
  credentials: _propTypes2.default.shape({
    id: _propTypes2.default.string,
    key: _propTypes2.default.string
  })
};
MiniApp.defaultProps = {
  default: null
};
exports.default = MiniApp;