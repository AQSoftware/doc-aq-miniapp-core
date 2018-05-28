'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UIBridge = require('./core/UIBridge');

Object.defineProperty(exports, 'defaultUIBridge', {
  enumerable: true,
  get: function get() {
    return _UIBridge.defaultUIBridge;
  }
});

var _CoreBridge = require('./core/CoreBridge');

Object.defineProperty(exports, 'defaultCoreBridge', {
  enumerable: true,
  get: function get() {
    return _CoreBridge.defaultCoreBridge;
  }
});

var _CloudStorage = require('./core/CloudStorage');

Object.keys(_CloudStorage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _CloudStorage[key];
    }
  });
});

var _MediaStorage = require('./core/MediaStorage');

Object.keys(_MediaStorage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MediaStorage[key];
    }
  });
});

var _LifeCycle = require('./core/LifeCycle');

Object.keys(_LifeCycle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LifeCycle[key];
    }
  });
});

var _Leaderboard = require('./core/Leaderboard');

Object.keys(_Leaderboard).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Leaderboard[key];
    }
  });
});

var _Utils = require('./core/Utils');

Object.defineProperty(exports, 'Utils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Utils).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }