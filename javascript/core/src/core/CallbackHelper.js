// @flow
import Base64JS from 'base64-js';
import { TextDecoder } from 'text-encoding-utf-8';

export class CallbackHelper {
  uiCallbacks: Object;
  coreCallbacks: Object;
  errorCallbacks: Object;
  /**
  Constructor
  @constructor
  */
  constructor(){
    this.uiCallbacks = {};
    this.coreCallbacks = {};
    this.errorCallbacks = {};
  }

  postToWebKit(message: string, param: ?Object){
    window.webkit.messageHandlers[message].postMessage(param);
  }

  postToAndroidAqApp(message: string, param: ?Object) {
    window.aqJsPostMessage(message, param);
  }

  postToSimulator(message: string, param: ?Object){
    // console.log('aqMiniapp');
    if (window.parent) {
      window.parent.postMessage({messageType: 'aqMiniAppSdk', message: message, param: param},'*');
    }
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

  setErrorCallback(message: string, callback: (value: any) => void) {
    this.errorCallbacks[message] = callback;
  }

  processMessage(message: string, key: ?string, param: ?Object) {
    let parameters = {...param};
    if (key) parameters.key = key;

    if (typeof window.webkit !== "undefined") {
      this.postToWebKit(message, parameters);
    }
    else if (typeof window.aqJsPostMessage != 'undefined'){
      this.postToAndroidAqApp(message, parameters);
    }
    else if (typeof window.parent !== "undefined") {
      this.postToSimulator(message, parameters);
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
    // let jsonString = b64DecodeUnicode(value);
    let binaryJson = Base64JS.toByteArray(value);
    let jsonString = new TextDecoder("utf-8").decode(binaryJson);
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
    callback(sanitize(value, shouldDecode));
  }
}

window.errorCallback = function (message: string, value: any, shouldDecode: boolean) {
  if (defaultCallbackHelper.errorCallbacks[message] != null) {
    let callback = defaultCallbackHelper.errorCallbacks[message];
    callback(sanitize(value, shouldDecode));
  }
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
  var data = event.data;

  // Filter out data relevant to AQ Miniapp SDK
  if (data.messageType !== 'aqMiniAppSdk')
    return;

  // If fun-type resides on localhost,
  // allow cross-site scripting
  if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !window.aqAppSimulatorConfirmed) {
    if(!confirm(`AQ MiniApp Simulator from ${origin} is trying to access this fun type. Allow access?`))
      return;
  }
  window.aqAppSimulatorConfirmed = true;

  let {message, key, value, shouldDecode} = data;
  if (message) {
    window.funTypeCallback(message, key, value, shouldDecode);
  }
}

const defaultCallbackHelper = new CallbackHelper();
export { defaultCallbackHelper };
