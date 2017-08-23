'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('whatwg-fetch');

var _hawk = require('hawk');

var _hawk2 = _interopRequireDefault(_hawk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getAuthHeader(url, method, credentials) {
  return _hawk2.default.client.header(url, method, { credentials: credentials, ext: 'funtype-client' }).field;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.statusText);
  }
}

function parseJSON(response) {
  return response.json();
}

// const DEV_BASE_URL = "http://dev.api.aqsoftwareinc.com/2.0/miniApp";
// const LIVE_BASE_URL = "http://live.api.aqsoftwareinc.com/2.0/miniApp";
var DEV_BASE_URL = "http://v2.dev.api.bengga.com/2.0/miniApp";
var LIVE_BASE_URL = "http://v2.dev.api.bengga.com/2.0/miniApp";
// const DEV_BASE_URL = "http://192.168.100.52:38085/2.0/miniApp";
// const LIVE_BASE_URL = "http://192.168.100.52:38085/2.0/miniApp";


var CloudStorage = exports.CloudStorage = function () {
  function CloudStorage(credentials) {
    var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'devt';

    _classCallCheck(this, CloudStorage);

    this.credentials = { 'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256' };
    this.environment = environment;
  }

  _createClass(CloudStorage, [{
    key: '_getFullUrl',
    value: function _getFullUrl(url) {
      if (this.environment === 'devt') return '' + DEV_BASE_URL + url;else return '' + LIVE_BASE_URL + url;
    }
  }, {
    key: '_jsonize',
    value: function _jsonize(promise) {
      return promise.then(checkStatus).then(parseJSON);
    }
  }, {
    key: '_request',
    value: function _request(method, relativeUrl) {
      var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var fullUrl = this._getFullUrl(relativeUrl);

      var params = {
        method: method,
        headers: {
          'Authorization': getAuthHeader(fullUrl, method, this.credentials),
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      };
      if (method !== 'GET' && method !== 'HEAD') {
        // $FlowFixMe
        params.body = JSON.stringify(body);
      }
      return fetch(fullUrl, params).then(checkStatus).then(parseJSON);
    }
  }, {
    key: 'insert',
    value: function insert(data) {
      return this._request('POST', '', data);
    }
  }, {
    key: 'update',
    value: function update(id, data) {
      return this._request('PUT', '/' + id, data);
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this._request('GET', '/' + id);
    }
  }]);

  return CloudStorage;
}();