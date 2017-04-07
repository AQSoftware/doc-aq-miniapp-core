'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core_old = require('./core_old');

Object.defineProperty(exports, 'MiniApp', {
  enumerable: true,
  get: function get() {
    return _core_old.miniApp;
  }
});

var _UIBridge = require('./UIBridge');

Object.defineProperty(exports, 'defaultUIBridge', {
  enumerable: true,
  get: function get() {
    return _UIBridge.defaultUIBridge;
  }
});

var _CoreBridge = require('./CoreBridge');

Object.defineProperty(exports, 'defaultCoreBridge', {
  enumerable: true,
  get: function get() {
    return _CoreBridge.defaultCoreBridge;
  }
});

var _CloudStorage = require('./CloudStorage');

Object.keys(_CloudStorage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _CloudStorage[key];
    }
  });
});

var _MediaStorage = require('./MediaStorage');

Object.keys(_MediaStorage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _MediaStorage[key];
    }
  });
});

var _LifeCycle = require('./LifeCycle');

Object.keys(_LifeCycle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LifeCycle[key];
    }
  });
});