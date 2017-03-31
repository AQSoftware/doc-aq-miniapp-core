'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CallbackHelper = exports.CallbackHelper = function () {

  /**
  Constructor
  @constructor
  */
  function CallbackHelper() {
    _classCallCheck(this, CallbackHelper);

    this.uiCallbacks = {};
    this.coreCallbacks = {};
  }

  _createClass(CallbackHelper, [{
    key: 'postToWebKit',
    value: function postToWebKit(message, param) {
      window.webkit.messageHandlers[message].postMessage(param);
    }
  }, {
    key: 'postToSimulator',
    value: function postToSimulator(message, param) {
      // console.log('aqMiniapp');
      if (window.parent) {
        window.parent.postMessage({ messageType: 'aqMiniAppSdk', message: message, param: param }, '*');
      }
    }
  }, {
    key: 'setUiCallback',
    value: function setUiCallback(message, key, callback) {
      var uiCallbacks = this.uiCallbacks[message];
      if (typeof uiCallbacks === 'undefined') uiCallbacks = {};
      uiCallbacks[key] = callback;
      this.uiCallbacks[message] = uiCallbacks;
    }
  }, {
    key: 'setCoreCallback',
    value: function setCoreCallback(message, callback) {
      this.coreCallbacks[message] = callback;
    }
  }, {
    key: 'processMessage',
    value: function processMessage(message, key, param) {
      var parameters = _extends({}, param);
      if (key) parameters.key = key;

      if (typeof window.webkit !== "undefined") {
        this.postToWebKit(message, parameters);
      } else if (typeof window.parent !== "undefined") {
        this.postToSimulator(message, parameters);
      }
    }
  }]);

  return CallbackHelper;
}();

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function sanitize(value, shouldDecode) {
  var sanitized = value;
  if (shouldDecode) {
    var jsonString = b64DecodeUnicode(value);
    sanitized = JSON.parse(jsonString);
  }
  return sanitized;
}

window.funTypeCallback = function (message, key, value, shouldDecode) {
  if (defaultCallbackHelper.uiCallbacks[message] != null) {
    var selectorCallbacks = defaultCallbackHelper.uiCallbacks[message];
    if (selectorCallbacks[key] != null) {
      var callback = selectorCallbacks[key];
      callback(key, sanitize(value, shouldDecode));
    }
  } else if (defaultCallbackHelper.coreCallbacks[message] != null) {
    var _callback = defaultCallbackHelper.coreCallbacks[message];
    _callback(sanitize(value, shouldDecode));
  }
};

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
  var data = event.data;

  // Filter out data relevant to AQ Miniapp SDK
  if (data.messageType !== 'aqMiniAppSdk') return;

  // If fun-type resides on localhost,
  // allow cross-site scripting
  if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !window.aqAppSimulatorConfirmed) {
    if (!confirm('AQ MiniApp Simulator from ' + origin + ' is trying to access this fun type. Allow access?')) return;
  }
  window.aqAppSimulatorConfirmed = true;

  var message = data.message,
      key = data.key,
      value = data.value,
      shouldDecode = data.shouldDecode;

  if (message) {
    window.funTypeCallback(message, key, value, shouldDecode);
  }
}

var defaultCallbackHelper = new CallbackHelper();
exports.defaultCallbackHelper = defaultCallbackHelper;