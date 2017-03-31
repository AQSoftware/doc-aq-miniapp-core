'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultCoreBridge = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CallbackHelper = require('./CallbackHelper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_REQUEST_PREVIEW = 'requestPreview';
var MESSAGE_ON_PREVIEW = 'onPreview';
var MESSAGE_GET_FRIENDS = 'getFriends';

/**
Core class that allows a MiniApp to send/receive various core messages
to and from the AQ App

Copyright (c) 2017 AQ Software Inc.
*/

var CoreBridge = function () {
  function CoreBridge(callbackHelper) {
    _classCallCheck(this, CoreBridge);

    this._callbackHelper = callbackHelper;
  }

  _createClass(CoreBridge, [{
    key: '_saveCallbackAndProcessMessage',
    value: function _saveCallbackAndProcessMessage(message) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (callback) {
        this._callbackHelper.setCoreCallback(message, callback);
      }
      this._callbackHelper.processMessage(message, null, param);
    }

    /**
    Sets the callback function to be called when the AQ App sets the preview data
    that will be used by the join screen.
     @param {function(value: Object): void} callback - Callback function to call
      when preview data is available from the AQ App
    */

  }, {
    key: 'setOnPreviewCallback',
    value: function setOnPreviewCallback(callback) {
      this._callbackHelper.setCoreCallback(MESSAGE_ON_PREVIEW, callback);
    }

    /**
    Sets the callback function to be called when the AQ App requests the create screen
    to provide it with the current item data. This data will then be passed by the AQ App
    to the join screen
     @param {function(): void} callback - Callback function to call
      when the AQ App requests the current item data
    */

  }, {
    key: 'setRequestPreviewCallback',
    value: function setRequestPreviewCallback(callback) {
      this._callbackHelper.setCoreCallback(MESSAGE_REQUEST_PREVIEW, callback);
    }

    /**
    Requests the AQ App to return a list of friends without going through the friends selector UI.
     @param {Core~requestCallback} callback - Callback function to be called when
      with the list of friends as the parameter.
    */

  }, {
    key: 'getFriends',
    value: function getFriends(callback) {
      this._saveCallbackAndProcessMessage(MESSAGE_GET_FRIENDS, callback);
    }
  }]);

  return CoreBridge;
}();

var defaultCoreBridge = new CoreBridge(_CallbackHelper.defaultCallbackHelper);
exports.defaultCoreBridge = defaultCoreBridge;