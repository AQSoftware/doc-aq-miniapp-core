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

var _Background = require('./components/js/Background');

Object.defineProperty(exports, 'Background', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Background).default;
  }
});

var _Button = require('./components/js/Button');

Object.defineProperty(exports, 'Button', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Button).default;
  }
});

var _Panel = require('./components/js/Panel');

Object.defineProperty(exports, 'Panel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Panel).default;
  }
});

var _StaticCanvas = require('./components/js/StaticCanvas');

Object.defineProperty(exports, 'StaticCanvas', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_StaticCanvas).default;
  }
});

var _MiniApp = require('./app/MiniApp');

Object.defineProperty(exports, 'MiniApp', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MiniApp).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }