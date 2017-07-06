'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _aqMiniapp = require('aq-miniapp');

require('../css/Create1.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITEM_WIDTH_PERCENTAGE = 0.65;

var Buttons = {
  BACKGROUND: 0,
  ITEM: 1,
  COVER: 2
};

var Create1 = function (_Component) {
  _inherits(Create1, _Component);

  function Create1(props) {
    _classCallCheck(this, Create1);

    var _this = _possibleConstructorReturn(this, (Create1.__proto__ || Object.getPrototypeOf(Create1)).call(this, props));

    _this.state = {
      selectedIndex: -1,
      backgroundImg: null,
      itemImg: null,
      coverImg: null,
      title: null
    };
    return _this;
  }

  _createClass(Create1, [{
    key: '_onChange',
    value: function _onChange() {
      if (this.props.onChange) {
        var _state = this.state,
            _title = _state.title,
            _backgroundImg = _state.backgroundImg,
            _itemImg = _state.itemImg,
            _coverImg = _state.coverImg;

        this.props.onChange(_title, _backgroundImg, _itemImg, _coverImg);
      }
    }
  }, {
    key: '_onButtonClick',
    value: function _onButtonClick(index) {
      this.setState({ selectedIndex: index });
      switch (index) {
        case Buttons.BACKGROUND:
          _aqMiniapp.defaultUIBridge.showWebImageSelector('background', 'Select a background template', ['https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg1.jpg', 'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg2.jpg', 'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg3.jpg', 'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg4.jpg', 'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg5.jpg', 'https://s3-ap-southeast-1.amazonaws.com/funminiapps/create/bg/bg6.jpg'], this._onRequestBackgroundImage.bind(this));
          break;
        case Buttons.ITEM:
          _aqMiniapp.defaultUIBridge.showGalleryImageSelector('item', 'Select an item to pass', this._onRequestItemImage.bind(this));
          // defaultUIBridge.showWebImageSelector(
          //   'item',
          //   'Select a background template',
          //   [
          //     'https://images3.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232nm5.png',
          //     'https://images3.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-beaver-victoria-234s89.png',
          //     'https://images1.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232h4x.png',
          //     'https://images2.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-234g7q.png'
          //   ],
          //   this._onRequestItemImage.bind(this)
          // );
          break;
        case Buttons.COVER:
          _aqMiniapp.defaultUIBridge.showGalleryImageSelector('cover', 'Select a cover photo', this._onRequestCoverImage.bind(this));
          // defaultUIBridge.showWebImageSelector(
          //   'cover',
          //   'Select a background template',
          //   [
          //     'https://images3.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232nm5.png',
          //     'https://images3.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-beaver-victoria-234s89.png',
          //     'https://images1.pixlis.com/background-image-stripes-and-lines-seamless-tileable-232h4x.png',
          //     'https://images2.pixlis.com/background-image-dual-two-line-striped-seamless-tileable-234g7q.png'
          //   ],
          //   this._onRequestCoverImage.bind(this)
          // );
          break;
        default:

      }
    }
  }, {
    key: '_onRequestBackgroundImage',
    value: function _onRequestBackgroundImage(key, backgroundImg) {
      this.setState({ backgroundImg: backgroundImg });
      this._onChange();
    }
  }, {
    key: '_onRequestItemImage',
    value: function _onRequestItemImage(key, itemImg) {
      this.setState({ itemImg: itemImg });
      this._onChange();
    }
  }, {
    key: '_onRequestCoverImage',
    value: function _onRequestCoverImage(key, coverImg) {
      this.setState({ coverImg: coverImg });
      this._onChange();
      _aqMiniapp.defaultUIBridge.showTitleInput(this._onRequestTitle.bind(this));
    }
  }, {
    key: '_onRequestTitle',
    value: function _onRequestTitle(title) {
      this.setState({ title: title });
      this._onChange();

      if (this.props.showPreview) {
        this.props.showPreview();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var width = window.innerWidth;
      var height = window.innerHeight;

      var background = null;
      var itemImage = null;
      var cover = null;

      if (this.state.selectedIndex !== Buttons.COVER) {
        if (this.state.backgroundImg != null) {
          background = _react2.default.createElement('img', { src: this.state.backgroundImg, className: 'create-background', alt: 'background' });
        } else {
          background = _react2.default.createElement(_aqMiniapp.StaticCanvas, { width: width, height: height });
        }
        if (this.state.itemImg != null) {
          itemImage = _react2.default.createElement('img', { src: this.state.itemImg, className: 'create-item', width: width * ITEM_WIDTH_PERCENTAGE, height: width * ITEM_WIDTH_PERCENTAGE, alt: 'item' });
        }
      } else {
        if (this.state.coverImg == null) {
          if (this.state.backgroundImg != null) {
            background = _react2.default.createElement('img', { src: this.state.backgroundImg, className: 'create-background', alt: 'background' });
          } else {
            background = _react2.default.createElement(_aqMiniapp.StaticCanvas, { width: width, height: height });
          }
          if (this.state.itemImg != null) {
            itemImage = _react2.default.createElement('img', { src: this.state.itemImg, className: 'create-item', width: width * ITEM_WIDTH_PERCENTAGE, height: width * ITEM_WIDTH_PERCENTAGE, alt: 'item' });
          }
        } else {
          cover = _react2.default.createElement('img', { src: this.state.coverImg, className: 'create-background', alt: 'background' });
        }
      }
      return _react2.default.createElement(
        'div',
        { className: 'create-container' },
        background,
        cover,
        itemImage,
        _react2.default.createElement(
          _aqMiniapp.Panel,
          { id: 'content', title: 'Content', backgroundColor: 'rgba(38, 38, 38, 0.8)', width: '200px', titleColor: 'White', className: 'uppercase lighter' },
          _react2.default.createElement(_aqMiniapp.Button, { title: 'Background', isActive: this.state.selectedIndex === 0, onClick: function onClick() {
              _this2._onButtonClick(0);
            } }),
          _react2.default.createElement(_aqMiniapp.Button, { title: 'Item', isActive: this.state.selectedIndex === 1, onClick: function onClick() {
              _this2._onButtonClick(1);
            } }),
          _react2.default.createElement(_aqMiniapp.Button, { title: 'Cover', isActive: this.state.selectedIndex === 2, onClick: function onClick() {
              _this2._onButtonClick(2);
            } })
        )
      );
    }
  }]);

  return Create1;
}(_react.Component);

exports.default = Create1;