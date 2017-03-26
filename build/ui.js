'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
Core class that allows a MiniApp to request various UI selectors available
in the AQ App

Copyright (c) 2017 AQ Software Inc.
*/

var MESSAGE_SHOW_TITLE_INPUT = 'showTitleInput';
var MESSAGE_SHOW_WEB_IMAGE_SELECTOR = 'showWebImageSelector';
var MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = 'showGalleryImageSelector';

var CallbackHelper = function () {

  /**
  Constructor
  @constructor
  */
  function CallbackHelper() {
    _classCallCheck(this, CallbackHelper);

    this.callbacks = {
      showTitleInput: {},
      showWebImageSelector: {},
      showGalleryImageSelector: {},
      showFriendsSelector: {}
    };
  }

  _createClass(CallbackHelper, [{
    key: 'postToWebKit',
    value: function postToWebKit(message, param) {
      window.webkit.messageHandlers[message].postMessage(param);
    }
  }, {
    key: 'saveCallback',
    value: function saveCallback(message, key, callback) {
      var callbacks = this.callbacks[message];
      callbacks[key] = callback;
      this.callbacks[message] = callbacks;
    }
  }, {
    key: 'processMessage',
    value: function processMessage(message, key, param) {
      var parameters = _extends({}, param);
      parameters.key = key;

      if (typeof window.webkit !== "undefined") {
        this.postToWebKit(message, parameters);
      }
    }
  }]);

  return CallbackHelper;
}();

var UI = function () {
  function UI(callbackHelper) {
    _classCallCheck(this, UI);

    this._callbackHelper = callbackHelper;
  }

  _createClass(UI, [{
    key: '_saveCallbackAndProcessMessage',
    value: function _saveCallbackAndProcessMessage(message, key, callback, param) {
      this._callbackHelper.saveCallback(message, key, callback);
      this._callbackHelper.processMessage(message, key, param);
    }

    /**
    Requests the AQ App to show a text input UI for the user to input a title
     @param {function(value: string): void} callback - Callback function to be called when
      a title has been input by the user
    */

  }, {
    key: 'showTitleInput',
    value: function showTitleInput(callback) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_TITLE_INPUT, 'default', function (k, v) {
        callback(v);
      }, null);
    }

    /**
    Requests the AQ App to show a selector UI from a list of image web urls
     @param {string} key - Unique key identifying this particular Requests
    @param {string} title - Title to be shown to the selector UI
    @param {string[]} imageUrls - An array of urls pointing to images that will be
      shown by the selector UI
    @param {function(key: string, value: string): void} callback - Callback function to be called when
      an image is selected from imageUrls
    */

  }, {
    key: 'showWebImageSelector',
    value: function showWebImageSelector(key, title, imageUrls, callback) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_WEB_IMAGE_SELECTOR, key, callback, {
        title: title,
        imageUrls: imageUrls
      });
    }

    /**
    Requests the AQ App to show a selector UI showing a list of available gallery images
     @param {string} key - Unique key identifying this particular Requests
    @param {string} title - Title to be shown to the selector UI
    @param {function(key: string, value: string): void} callback - Callback function to be called when
      an image is selected
    */

  }, {
    key: 'showGalleryImageSelector',
    value: function showGalleryImageSelector(key, title, callback) {

      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, key, callback, {
        title: title
      });
    }
  }]);

  return UI;
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

window.funTypeCallback = function (selector, key, value, shouldDecode) {
  if (callbackHelper.callbacks[selector] != null) {
    var callback = callbackHelper.callbacks[selector];
    var selectorCallbacks = callbackHelper.callbacks[selector];
    if (selectorCallbacks[key] != null) {
      callback = selectorCallbacks[key];
      callback(key, sanitize(value, shouldDecode));
    }
  }
};

var callbackHelper = new CallbackHelper();
var ui = new UI(callbackHelper);
exports.ui = ui;