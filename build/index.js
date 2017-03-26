'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

Object.defineProperty(exports, 'MiniApp', {
  enumerable: true,
  get: function get() {
    return _core.miniApp;
  }
});

var _ui = require('./ui');

Object.defineProperty(exports, 'UI', {
  enumerable: true,
  get: function get() {
    return _ui.ui;
  }
});

var _cloud_storage = require('./cloud_storage');

Object.keys(_cloud_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cloud_storage[key];
    }
  });
});