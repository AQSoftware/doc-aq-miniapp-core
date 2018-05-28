'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Leaderboard = exports.LeaderboardScoreSortOrder = exports.LeaderboardScoreType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client2 = require('./Client');

var _Client3 = _interopRequireDefault(_Client2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeaderboardScoreType = exports.LeaderboardScoreType = {
  INT: 0,
  DECIMAL: 1,
  DURATION: 2,
  COMPLETION: 3,
  RECENT: 4
};

var LeaderboardScoreSortOrder = exports.LeaderboardScoreSortOrder = {
  ASCENDING: 0,
  DESCENDING: 1
};

var BASE_PATH = "";

var Leaderboard = exports.Leaderboard = function (_Client) {
  _inherits(Leaderboard, _Client);

  function Leaderboard(credentials) {
    var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'devt';

    _classCallCheck(this, Leaderboard);

    return _possibleConstructorReturn(this, (Leaderboard.__proto__ || Object.getPrototypeOf(Leaderboard)).call(this, BASE_PATH, { 'id': credentials.id, 'key': credentials.key, 'algorithm': 'sha256' }, environment));
  }

  _createClass(Leaderboard, [{
    key: 'create',
    value: function create(engagementId, param) {
      var url = 'engagement/' + engagementId + '/leaderboard';
      return this.request("POST", url, param);
    }
  }, {
    key: 'add',
    value: function add(engagementId, param) {
      var url = 'engagement/' + engagementId + '/leaderboard';
      return this.request("PUT", url, param);
    }
  }]);

  return Leaderboard;
}(_Client3.default);