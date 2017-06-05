'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLifeCycle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base64Js = require('base64-js');

var _base64Js2 = _interopRequireDefault(_base64Js);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _CallbackHelper = require('./CallbackHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_REQUEST_PREVIEW = 'requestPreview';
var MESSAGE_ON_DATA = 'onData';
var MESSAGE_SHOW_PREVIEW_WITH_DATA = 'showPreviewWithData';
var MESSAGE_JOIN = 'join';
var MESSAGE_PUBLISH = 'publish';
var MESSAGE_PUBLISH_STATUS = 'publishStatus';
var MESSAGE_END = 'end';

/**
Class that allows a MiniApp to call various functions related to a mini app's life cycle

Copyright (c) 2017 AQ Software Inc.
*/
var LifeCycle = function () {
  function LifeCycle(callbackHelper) {
    _classCallCheck(this, LifeCycle);

    this._callbackHelper = callbackHelper;
  }

  _createClass(LifeCycle, [{
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
    Sets the callback function to be called when the AQ App sets data
    that will be used by the miniapp.
     @param {function(value: Object): void} callback - Callback function to call
      when data is available from the AQ App
    */

  }, {
    key: 'setOnDataCallback',
    value: function setOnDataCallback(callback) {
      this._callbackHelper.setCoreCallback(MESSAGE_ON_DATA, callback);
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
    Instructs the mini app to save the current data produced by the create screens,
    to some persistent storage, usually a cloud storage. The AQ App provides an ID
    that will be associated with this data, which will be used at a later time when
    this same ID is provided to the join screen.
     Once the AQ App calls this function, you need to inform it whether publishing
    succeeded or not using the
     @param {function(id: string): void} callback - Callback function to call
      when the AQ App requests the the miniapp to publish the data
    */

  }, {
    key: 'setPublishCallback',
    value: function setPublishCallback(callback) {
      this._callbackHelper.setCoreCallback(MESSAGE_PUBLISH, callback);
    }

    /**
    Requests the AQ App to show the preview screen given some data.
     This function will trigger the AQ App to show the preview dialogue of the mini-app,
    eventually passing the given parameters as data for the preview.
     If any of the parameters, except data, is null, the preview screen will not be shown.
     @param {string} title - Title obtained from user through showTitleInput()
    @param {string} coverImageUrl - Cover image obtained from user. This can be a data-uri image,
      or normal web url and must be a 640x1136 JPEG image.
    @param {Object} data - Any mini-app specific data.
    */

  }, {
    key: 'showPreviewWithData',
    value: function showPreviewWithData(title, coverImageUrl, data) {
      this._saveCallbackAndProcessMessage(MESSAGE_SHOW_PREVIEW_WITH_DATA, null, _extends({
        title: title,
        coverImageUrl: coverImageUrl
      }, data));
    }

    /**
    Generates a unique URL-safe Base64-encoded Id
    */

  }, {
    key: 'generateId',
    value: function generateId() {
      var arr = new Array(16);
      (0, _v2.default)(null, arr, 0);
      return _base64Js2.default.fromByteArray(arr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
    Provides the AQ App join data for processing
     @param {string} id - Optional unique URL-safe UUID that will be used by the AQ app
      to reference this a particular join.
    @param {string} joinImageUrl - An image representing the output of the join screen.
      Join output image must a 640x1136 JPEG image and not a data-uri. If image obtained came from
      the phone's gallery, you need to upload it using CloudStorage.uploadMedia() api,
      to produce a valid url for the image.
    @param {string} winCriteriaPassed - Boolean value indicating whether this particular join
      resulted in a win or lose
    @param {Object} notificationItem - Object containing information to create notifications for
      users
    */

  }, {
    key: 'join',
    value: function join(id, joinImageUrl, winCriteriaPassed, notificationItem) {
      this._saveCallbackAndProcessMessage(MESSAGE_JOIN, null, {
        id: id,
        joinImageUrl: joinImageUrl,
        winCriteriaPassed: winCriteriaPassed,
        notificationItem: notificationItem
      });
    }

    /**
    Ends the join screen, providing the AQ App with a caption and a join output image.
    */

  }, {
    key: 'end',
    value: function end() {
      this._saveCallbackAndProcessMessage(MESSAGE_END, null, null);
    }

    /**
    Informs the AQ App that publishing succeeded.
     */

  }, {
    key: 'publishSucceded',
    value: function publishSucceded() {
      this._saveCallbackAndProcessMessage(MESSAGE_PUBLISH_STATUS, null, {
        status: true
      });
    }

    /**
    Informs the AQ App that publishing failed
    */

  }, {
    key: 'publishFailed',
    value: function publishFailed() {
      this._saveCallbackAndProcessMessage(MESSAGE_PUBLISH_STATUS, null, {
        status: false
      });
    }
  }]);

  return LifeCycle;
}();

var defaultLifeCycle = new LifeCycle(_CallbackHelper.defaultCallbackHelper);
exports.defaultLifeCycle = defaultLifeCycle;