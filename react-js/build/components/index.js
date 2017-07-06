'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Background = require('./js/Background');

Object.keys(_Background).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Background[key];
    }
  });
});

var _Button = require('./js/Button');

Object.keys(_Button).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Button[key];
    }
  });
});

var _StaticCanvas = require('./js/StaticCanvas');

Object.keys(_StaticCanvas).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _StaticCanvas[key];
    }
  });
});

var _Panel = require('./js/Panel');

Object.keys(_Panel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Panel[key];
    }
  });
});