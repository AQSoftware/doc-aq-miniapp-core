'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('whatwg-fetch');

var _base64Js = require('base64-js');

var _base64Js2 = _interopRequireDefault(_base64Js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var DEV_BASE_URL = "http://v2.dev.api.bengga.com/2.0/media";
var LIVE_BASE_URL = "http://v2.dev.api.bengga.com/2.0/media";

var MediaStorage = exports.MediaStorage = function () {
  function MediaStorage() {
    var environment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'devt';

    _classCallCheck(this, MediaStorage);

    this.environment = environment;
  }

  _createClass(MediaStorage, [{
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
    value: function _request(method, relativeUrl, media) {
      var fullUrl = this._getFullUrl(relativeUrl);

      var params = {
        method: method,
        mode: 'cors'
      };
      if (method !== 'GET' && method !== 'HEAD') {
        // $FlowFixMe
        params.body = media.data;
        // $FlowFixMe
        params.headers = {
          // $FlowFixMe
          'Content-Type': media.contentType
        };
      }
      return fetch(fullUrl, params).then(checkStatus).then(parseJSON);
    }
  }, {
    key: 'upload',
    value: function upload(media) {
      return this._request('POST', '', media);
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this._request('GET', '/' + id);
    }

    /**
    Extracts Content-Type from a data URI and converts its Base64 data to byte array
    */

  }, {
    key: 'base64DataUrlToByteArray',
    value: function base64DataUrlToByteArray(dataUrl) {
      var regex = /data:(.*);base64,(.*)/ig;
      var match = regex.exec(dataUrl); // Regex should produce 3 capture groups
      if (match.length == 3) {
        var _data = _base64Js2.default.toByteArray(match[2]);
        var _contentType = match[1];
        return { data: _data, contentType: _contentType };
      } else return null;
    }
  }]);

  return MediaStorage;
}();