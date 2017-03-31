'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultUIBridge = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CallbackHelper = require('./CallbackHelper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_SHOW_TITLE_INPUT = 'showTitleInput';
var MESSAGE_SHOW_WEB_IMAGE_SELECTOR = 'showWebImageSelector';
var MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR = 'showGalleryImageSelector';
var MESSAGE_SHOW_FRIENDS_SELECTOR = 'showFriendsSelector';
var MESSAGE_SHOW_PREVIEW_WITH_DATA = 'showPreviewWithData';

/**
Core class that allows a MiniApp to request various UI selectors available
in the AQ App

Copyright (c) 2017 AQ Software Inc.
*/

var UIBridge = function () {
  function UIBridge(callbackHelper) {
    _classCallCheck(this, UIBridge);

    this._callbackHelper = callbackHelper;
  }

  _createClass(UIBridge, [{
    key: '_saveCallbackAndProcessMessage',
    value: function _saveCallbackAndProcessMessage(message) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var param = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (key && callback) {
        this._callbackHelper.setUiCallback(message, key, callback);
      }
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
      });
    }

    /**
    Requests the AQ App to show a selector UI from a list of image web urls
     @param {string} key - Unique key identifying this particular Requests
    @param {string} title - Title to be shown to the selector UI
    @param {string[]} imageUrls - An array of urls pointing to images that will be
      shown by the selector UI
    @param {function(key: string, value: Object): void} callback - Callback function to be called when
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
    @param {function(key: string, value: Object): void} callback - Callback function to be called when
      an image is selected
    */

  }, {
    key: 'showGalleryImageSelector',
    value: function showGalleryImageSelector(key, title, callback) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_GALLERY_IMAGE_SELECTOR, key, callback, {
        title: title
      });
    }

    /**
    Requests the AQ App to show a selector UI showing a list of friends
     @param {string} key - Unique key identifying this particular Requests
    @param {function(key: string, value: Object[]): void} callback - Callback function to be called when
      a list of friends has been selected
    */

  }, {
    key: 'showFriendsSelector',
    value: function showFriendsSelector(key, callback) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_FRIENDS_SELECTOR, key, callback);
    }

    /**
    Requests the AQ App to show the preivew screen given some data.
     This function will trigger the AQ App to show the preview dialogue of the mini-app,
    eventually passing the given parameters as data for the preview.
     If any of the parameters, except data, is null, the preview screen will not be shown.
     @param {string} title - Title obtained from user through showTitleInput()
    @param {string} coverImageUrl - Cover image obtained from user. This can be a data-uri image,
      or normal web url.
    @param {Object} data - Any mini-app specific data.
    */

  }, {
    key: 'showPreviewWithData',
    value: function showPreviewWithData(title, coverImageUrl, data) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_PREVIEW_WITH_DATA, null, null, _extends({
        title: title,
        coverImageUrl: coverImageUrl
      }, data));
    }
  }]);

  return UIBridge;
}();

var defaultUIBridge = new UIBridge(_CallbackHelper.defaultCallbackHelper);
exports.defaultUIBridge = defaultUIBridge;