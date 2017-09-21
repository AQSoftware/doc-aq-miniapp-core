// @flow
import Base64JS from 'base64-js';
import uuidv1 from 'uuid/v1';

/**
Utility methods

Copyright (c) 2017 AQ Software Inc.
*/

class Utils {

  /**
  Generates a unique URL-safe Base64-encoded Id
  */
  generateId(): string {
    let arr = new Array(16);
    uuidv1(null, arr, 0);
    return Base64JS.fromByteArray(arr).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
  }

  /**
  Converts a relative url to it's absolute url equivalent

  @param {string} relativePath - Relative path to convert

  @return {string} Absolute path
  */
  relativeToAbsolutePath (relativePath: string) {
    var nUpLn, sDir = "", sPath = window.location.pathname.replace(/[^\/]*$/, relativePath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
    for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
      nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
      sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
    }
    return window.location.origin + sDir + sPath.substr(nStart);
  }
}

export default Utils = new Utils();
