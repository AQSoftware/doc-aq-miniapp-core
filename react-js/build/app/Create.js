'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('../..');

var _Create = require('./js/Create1');

var _Create2 = _interopRequireDefault(_Create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NUM_PAGES = 2;

var Create = function (_Component) {
  _inherits(Create, _Component);

  function Create(props) {
    _classCallCheck(this, Create);

    var _this = _possibleConstructorReturn(this, (Create.__proto__ || Object.getPrototypeOf(Create)).call(this, props));

    _this.state = {
      currentPage: 1,
      title: null,
      backgroundImageUrl: null,
      itemImageUrl: null,
      coverImageUrl: null,
      uploadedItemImage: null,
      uploadedCoverImage: null
    };
    return _this;
  }

  _createClass(Create, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // Set callback function to be called when AQ app requests to preview the
      // current content of our create screen
      _2.defaultLifeCycle.setRequestPreviewCallback(this._showPreview.bind(this));
      _2.defaultLifeCycle.setPublishCallback(this._publish.bind(this));
    }
  }, {
    key: '_onNextPage',
    value: function _onNextPage(component) {
      if (this.state.currentPage < NUM_PAGES) {
        this.setState({ currentPage: this.state.currentPage + 1 });
      }
    }
  }, {
    key: '_onPrevPage',
    value: function _onPrevPage(component) {
      if (this.state.currentPage > 1) {
        this.setState({ currentPage: this.state.currentPage - 1 });
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(title, backgroundImage, itemImage, coverImage) {
      this.setState({
        title: title,
        backgroundImageUrl: backgroundImage,
        itemImageUrl: itemImage,
        coverImageUrl: coverImage
      });
    }
  }, {
    key: '_showPreview',
    value: function _showPreview() {
      // At the very least, AQ app requires a title and a cover image,
      // before the preview screen can be shown.

      if (this.state.title && this.state.backgroundImageUrl && this.state.itemImageUrl && this.state.coverImageUrl) {
        var _title = this.state.title;
        var _backgroundImageUrl = this.state.backgroundImageUrl;
        var _itemImageUrl = this.state.itemImageUrl;
        var _coverImageUrl = this.state.coverImageUrl;

        _2.defaultLifeCycle.showPreviewWithData(_title, _coverImageUrl, {
          title: _title,
          backgroundImageUrl: _backgroundImageUrl,
          itemImageUrl: _itemImageUrl,
          coverImageUrl: _coverImageUrl
        });
      }
    }
  }, {
    key: '_isDataUri',
    value: function _isDataUri(url) {
      if (url) {
        var regex = /data:(.*);base64,(.*)/ig;
        var match = regex.exec(url); // Regex should produce 3 capture groups
        return match.length === 3;
      } else {
        return false;
      }
    }
  }, {
    key: '_publish',
    value: function _publish(id) {
      var _this2 = this;

      // Upload data uri items first
      var itemImagePromise = void 0;
      var coverImagePromise = void 0;

      if (this._isDataUri(this.state.itemImageUrl)) {
        var itemImageMedia = this.props.mediaStorageClient.base64DataUrlToByteArray(this.state.itemImageUrl);
        itemImagePromise = this.props.mediaStorageClient.upload(itemImageMedia).then(function (response) {
          return _this2.props.mediaStorageClient.get(response.id);
        });
      } else if (this.state.itemImageUrl) {
        itemImagePromise = Promise.resolve({ mediaUrl: this.state.itemImageUrl, mediaUrlSmall: this.state.itemImageUrl });
      } else {
        itemImagePromise = Promise.resolve(null);
      }

      if (this._isDataUri(this.state.coverImageUrl)) {
        var coverImageMedia = this.props.mediaStorageClient.base64DataUrlToByteArray(this.state.coverImageUrl);
        coverImagePromise = this.props.mediaStorageClient.upload(coverImageMedia).then(function (response) {
          return _this2.props.mediaStorageClient.get(response.id);
        });
      } else if (this.state.coverImageUrl) {
        coverImagePromise = Promise.resolve({ mediaUrl: this.state.coverImageUrl, mediaUrlSmall: this.state.coverImageUrl });
      } else {
        coverImagePromise = Promise.resolve(null);
      }

      itemImagePromise.then(function (response) {
        _this2.setState({ uploadedItemImage: response });
        return coverImagePromise;
      }).then(function (response) {
        _this2.setState({ uploadedCoverImage: response });
        return _this2.props.cloudStorageClient.insert({
          id: id,
          title: _this2.state.title,
          backgroundImageUrl: _this2.state.backgroundImageUrl,
          itemImage: _this2.state.uploadedItemImage,
          coverImage: _this2.state.uploadedCoverImage,
          source: _this2.props.data.source
        });
      }).then(function (response) {
        _2.defaultLifeCycle.publishSucceded();
      }).catch(function (error) {
        console.log('Error occured while sending to cloud storage: ' + error);
        _2.defaultLifeCycle.publishFailed();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var render = null;

      var _state = this.state,
          _ = _state.currentPage,
          pageState = _objectWithoutProperties(_state, ['currentPage']);

      switch (this.state.currentPage) {
        case 1:
          render = _react2.default.createElement(_Create2.default, _extends({}, this.props, pageState, {
            onChange: this._onChange.bind(this),
            showPreview: this._showPreview.bind(this)
          }));
          break;
        default:
      }
      return render;
    }
  }]);

  return Create;
}(_react.Component);

exports.default = Create;