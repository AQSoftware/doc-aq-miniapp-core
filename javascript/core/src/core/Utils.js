// @flow

/**
Utility methods

Copyright (c) 2017 AQ Software Inc.
*/

class Utils {

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
    return sDir + sPath.substr(nStart);
  }
}

export default Utils = new Utils();
