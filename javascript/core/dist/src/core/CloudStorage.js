'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client2 = require('./Client');

var _Client3 = _interopRequireDefault(_Client2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BASE_PATH = "miniApp";

var CloudStorage = exports.CloudStorage = function (_Client) {
  _inherits(CloudStorage, _Client);

  function CloudStorage(credentials) {
    var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'devt';

    _classCallCheck(this, CloudStorage);

    return _possibleConstructorReturn(this, (CloudStorage.__proto__ || Object.getPrototypeOf(CloudStorage)).call(this, BASE_PATH, { 'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256' }, environment));
  }

  _createClass(CloudStorage, [{
    key: 'insert',
    value: function insert(data) {
      return this.request('POST', '', data);
    }
  }, {
    key: 'update',
    value: function update(id, data) {
      return this.request('PUT', '/' + id, data);
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.request('GET', '/' + id);
    }
  }]);

  return CloudStorage;
}(_Client3.default);