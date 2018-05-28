'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('isomorphic-fetch');

var _hawk = require('hawk');

var _hawk2 = _interopRequireDefault(_hawk);

var _Globals = require('./Globals');

var _Globals2 = _interopRequireDefault(_Globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(basePath, credentials) {
    var environment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'devt';

    _classCallCheck(this, Client);

    this.basePath = basePath;
    this.credentials = credentials;
    this.environment = environment;
  }

  _createClass(Client, [{
    key: 'getAuthHeader',
    value: function getAuthHeader(url, method, credentials) {
      return _hawk2.default.client.header(url, method, { credentials: credentials, ext: 'aq-miniapp-core' }).field;
    }
  }, {
    key: 'checkStatus',
    value: function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw new Error(response.statusText);
      }
    }
  }, {
    key: 'parseJSON',
    value: function parseJSON(response) {
      var _this = this;

      return response.json().then(function (result) {
        if (_this.isDevt()) {
          console.log('' + JSON.stringify(result));
        }
        return result;
      });
    }
  }, {
    key: 'isDevt',
    value: function isDevt() {
      return this.environment === 'devt';
    }
  }, {
    key: 'getFullUrl',
    value: function getFullUrl(url) {
      if (this.isDevt()) return _Globals2.default.DEV_BASE_URL + '/' + this.basePath + url;else return _Globals2.default.LIVE_BASE_URL + '/' + this.basePath + url;
    }
  }, {
    key: 'jsonize',
    value: function jsonize(promise) {
      return promise.then(this.checkStatus).then(this.parseJSON);
    }
  }, {
    key: 'request',
    value: function request(method, relativeUrl) {
      var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var fullUrl = this.getFullUrl(relativeUrl);
      if (this.isDevt()) {
        console.log(method + ' ' + fullUrl);
      }
      var params = {
        method: method,
        headers: {
          'Authorization': this.getAuthHeader(fullUrl, method, this.credentials),
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      };

      if (this.isDevt()) {
        // console.log(`${JSON.stringify(params)}`);
      }

      if (method !== 'GET' && method !== 'HEAD') {
        // $FlowFixMe
        params.body = JSON.stringify(body);
      }
      return fetch(fullUrl, params).then(this.checkStatus).then(this.parseJSON.bind(this));
    }
  }]);

  return Client;
}();

exports.default = Client;