// @flow
export * from './Messages';

export class AqMiniappSdk {
  messageHandlers: Object
  funTypeOrigin: string
  funTypeWindow: WindowProxy
  shouldHandleEvent: () => boolean

  constructor(funTypeOrigin: string, funTypeWindow: WindowProxy){
    this.funTypeOrigin = funTypeOrigin;
    this.funTypeWindow = funTypeWindow;
    this.messageHandlers = {};
    window.addEventListener('message', this._receiveMessageFromFunType.bind(this), false);
  }

  addMessageHandler(message: string, callback: (Object) => void) {
    this.messageHandlers[message] = callback;
  }

  sendMessageToFunType(message: string, key: string, value: any, shouldDecode: boolean){
    this.funTypeWindow.postMessage({messageType: 'aqMiniAppSdk', message: message, key: key, value: value, shouldDecode: shouldDecode}, '*');
  }

  _receiveMessageFromFunType(event){
    if (this.shouldHandleEvent && this.shouldHandleEvent()) {
      var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
      var data = event.data;

      // Filter out data relevant to AQ Miniapp SDK
      if (data.messageType !== 'aqMiniAppSdk')
        return;

      // If fun-type url is same as origin
      // allow cross-site scripting
      if (origin !== this.funTypeOrigin)
        return;

      // this.funTypeWindow = event.source;

      let {message, param} = data;
      if (message) {
        if (this.messageHandlers[message]){
          let callback = this.messageHandlers[message];
          callback(param);
        }
      }
    }
  }
}
