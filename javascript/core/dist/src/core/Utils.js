'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base64Js = require('base64-js');

var _base64Js2 = _interopRequireDefault(_base64Js);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
Utility methods

Copyright (c) 2017 AQ Software Inc.
*/

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'generateId',


    /**
    Generates a unique URL-safe Base64-encoded Id
    */
    value: function generateId() {
      var arr = new Array(16);
      (0, _v2.default)(null, arr, 0);
      return _base64Js2.default.fromByteArray(arr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    /**
    Converts a relative url to it's absolute url equivalent
     @param {string} relativePath - Relative path to convert
     @return {string} Absolute path
    */

  }, {
    key: 'relativeToAbsolutePath',
    value: function relativeToAbsolutePath(relativePath) {
      var nUpLn,
          sDir = "",
          sPath = window.location.pathname.replace(/[^\/]*$/, relativePath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
      for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
        nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
        sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + (nUpLn - 1) / 3 + "}$"), "/");
      }
      return window.location.origin + sDir + sPath.substr(nStart);
    }
  }]);

  return Utils;
}();

exports.default = Utils = new Utils();