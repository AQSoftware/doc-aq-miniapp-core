// @flow

export class CallbackHelper {
  uiCallbacks: Object;
  coreCallbacks: Object;

  /**
  Constructor
  @constructor
  */
  constructor(){
    this.uiCallbacks = {};
    this.coreCallbacks = {};
  }

  postToWebKit(message: string, param: ?Object){
    window.webkit.messageHandlers[message].postMessage(param);
  }

  setUiCallback(message: string, key: string, callback: (key: string, value: any) => void){
    let uiCallbacks = this.uiCallbacks[message];
    if (typeof uiCallbacks === 'undefined') uiCallbacks = {};
    uiCallbacks[key] = callback;
    this.uiCallbacks[message] = uiCallbacks;
  }

  setCoreCallback(message: string, callback: (value: any) => void){
    this.coreCallbacks[message] = callback;
  }

  processMessage(message: string, key: ?string, param: ?Object) {
    let parameters = {...param};
    if (key) parameters.key = key;

    if (typeof window.webkit !== "undefined") {
      this.postToWebKit(message, parameters);
    }
  }
}

function b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function sanitize(value: any, shouldDecode: boolean): any {
  let sanitized = value;
  if (shouldDecode) {
    let jsonString = b64DecodeUnicode(value);
    sanitized = JSON.parse(jsonString);
  }
  return sanitized;
}

window.funTypeCallback = function(message: string, key: string, value: any, shouldDecode: boolean) {
  if (defaultCallbackHelper.uiCallbacks[message] != null) {
    let selectorCallbacks = defaultCallbackHelper.uiCallbacks[message];
    if (selectorCallbacks[key] != null){
      let callback = selectorCallbacks[key];
      callback(key, sanitize(value, shouldDecode));
    }
  }
  else if (defaultCallbackHelper.coreCallbacks[message] != null) {
    let callback = defaultCallbackHelper.coreCallbacks[message];
    callback(key, sanitize(value, shouldDecode));
  }
}

const defaultCallbackHelper = new CallbackHelper();
export { defaultCallbackHelper };
