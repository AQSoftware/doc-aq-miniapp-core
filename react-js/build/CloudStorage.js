'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(exports,'__esModule',{value:!0}),exports.CloudStorage=void 0;require('whatwg-fetch');var _hawk=require('hawk'),_hawk2=_interopRequireDefault(_hawk);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function getAuthHeader(a,b,c){return _hawk2.default.client.header(a,b,{credentials:c,ext:'funtype-client'}).field}function checkStatus(a){if(200<=a.status&&300>a.status)return a;throw new Error(a.statusText)}function parseJSON(a){return a.json()}var DEV_BASE_URL='http://v2.dev.api.bengga.com/2.0/miniApp',LIVE_BASE_URL='http://v2.dev.api.bengga.com/2.0/miniApp',CloudStorage=exports.CloudStorage=function(){function a(b){var c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'devt';_classCallCheck(this,a),this.credentials={id:b.id,key:b.key,algorithm:'sha256'},this.environment=c}return _createClass(a,[{key:'_getFullUrl',value:function _getFullUrl(a){return'devt'===this.environment?''+DEV_BASE_URL+a:''+LIVE_BASE_URL+a}},{key:'_jsonize',value:function _jsonize(a){return a.then(checkStatus).then(parseJSON)}},{key:'_request',value:function _request(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},d=this._getFullUrl(b),e={method:a,headers:{Authorization:getAuthHeader(d,a,this.credentials),"Content-Type":'application/json'},mode:'cors'};return'GET'!==a&&'HEAD'!==a&&(e.body=JSON.stringify(c)),fetch(d,e).then(checkStatus).then(parseJSON)}},{key:'insert',value:function insert(a){return this._request('POST','',a)}},{key:'update',value:function update(a,b){return this._request('PUT','/'+a,b)}},{key:'get',value:function get(a){return this._request('GET','/'+a)}}]),a}();