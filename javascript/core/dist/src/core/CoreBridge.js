'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultCoreBridge = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CallbackHelper = require('./CallbackHelper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_GET_FRIENDS = 'getFriends';
var MESSAGE_GET_BM_BALANCE = 'getBmBalance';
var MESSAGE_CREATE_BET = 'createBet';
var MESSAGE_CLAIM_BET = 'claimBet';
var MESSAGE_PAY = 'pay';

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
      var resolve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var reject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var param = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (resolve) {
        this._callbackHelper.setCoreCallback(message, resolve);
      }
      if (reject) {
        this._callbackHelper.setErrorCallback(message, reject);
      }
      this._callbackHelper.processMessage(message, null, param);
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

    /**
    Requests the AQ App to return a list of available Bengga Money balances.
    */

  }, {
    key: 'getBmBalance',
    value: function getBmBalance() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._saveCallbackAndProcessMessage(MESSAGE_GET_BM_BALANCE, resolve, reject);
      });
    }

    /**
    Requests the AQ App to create a bet for the current user
    */

  }, {
    key: 'createBet',
    value: function createBet(amount, tag) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2._saveCallbackAndProcessMessage(MESSAGE_CREATE_BET, resolve, reject, {
          amount: amount,
          tag: tag
        });
      });
    }

    /**
    Requests the AQ App to create a bet for the current user
    */

  }, {
    key: 'claimBet',
    value: function claimBet(userId, amount, tag) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3._saveCallbackAndProcessMessage(MESSAGE_CLAIM_BET, resolve, reject, {
          userId: userId,
          amount: amount,
          tag: tag
        });
      });
    }

    /**
    Requests the AQ App to pay another user
    */

  }, {
    key: 'pay',
    value: function pay(userId, amount) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._saveCallbackAndProcessMessage(MESSAGE_PAY, resolve, reject, {
          userId: userId,
          amount: amount
        });
      });
    }
  }]);

  return CoreBridge;
}();

var defaultCoreBridge = new CoreBridge(_CallbackHelper.defaultCallbackHelper);
exports.defaultCoreBridge = defaultCoreBridge;