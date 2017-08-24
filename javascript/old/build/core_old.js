'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(exports,'__esModule',{value:!0});function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _postToWebKit(a,b){window.webkit.messageHandlers.message.postMessage(b)}var Core=function(){function a(){_classCallCheck(this,a),this.callbacks={showWebImageSelector:{},showGalleryImageSelector:{},showFriendsSelector:{}}}return _createClass(a,[{key:'showWebImageSelector',value:function showWebImageSelector(a,b,c,d){var e=this.callbacks.showWebImageSelector;e[a]=d,this.callbacks.showWebImageSelector=e,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.showWebImageSelector.postMessage({key:a,title:b,imageUrls:c,callback:d.name})}},{key:'showGalleryImageSelector',value:function showGalleryImageSelector(a,b,c){var d=this.callbacks.showGalleryImageSelector;d[a]=c,this.callbacks.showGalleryImageSelector=d,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.showGalleryImageSelector.postMessage({key:a,title:b,callback:c.name})}},{key:'showTitleInput',value:function showTitleInput(a){this.callbacks.showTitleInput=a,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.showTitleInput.postMessage({callback:a.name})}},{key:'showFriendsSelector',value:function showFriendsSelector(a,b){var c=this.callbacks.showFriendsSelector;c[a]=b,this.callbacks.showFriendsSelector=c,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.showFriendsSelector.postMessage({key:a,callback:b.name})}},{key:'setContentEditorOutput',value:function setContentEditorOutput(a,b,c){'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.setContentEditorOutput.postMessage({title:a,coverImageUrl:b,data:c})}},{key:'setContentEditorOutputCallback',value:function setContentEditorOutputCallback(a){this.callbacks.getContentEditorOutput=a,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.getJoinPreviewData.postMessage(null)}},{key:'endWithOutput',value:function endWithOutput(a,b){'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.endWithOutput.postMessage({caption:a,imageUrl:b})}},{key:'getJoinPreviewData',value:function getJoinPreviewData(a){this.callbacks.getJoinPreviewData=a,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.getJoinPreviewData.postMessage(null)}},{key:'getFriends',value:function getFriends(a){this.callbacks.getFriends=a,'undefined'!=typeof window.webkit&&window.webkit.messageHandlers.getFriends.postMessage(null)}}]),a}();function b64DecodeUnicode(a){return decodeURIComponent(atob(a).split('').map(function(a){return'%'+('00'+a.charCodeAt(0).toString(16)).slice(-2)}).join(''))}function sanitize(a,b){var c=a;if(b){var d=b64DecodeUnicode(a);c=JSON.parse(d)}return c}window.funTypeCallback=function(a,b,c,d){if(null!=miniApp.callbacks[a]){var e=miniApp.callbacks[a];switch(a){case'showTitleInput':case'getJoinPreviewData':case'getFriends':e(sanitize(c,d));break;default:if(null!=b){var f=miniApp.callbacks[a];null!=f[b]&&(e=f[b],e(b,sanitize(c,d)))}}}};var miniApp=new Core;exports.miniApp=miniApp;