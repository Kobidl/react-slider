'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Handles = function (_Component) {
  _inherits(Handles, _Component);

  function Handles() {
    var _temp, _this, _ret;

    _classCallCheck(this, Handles);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getHandleProps = function (id) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this$props = _this.props,
          emitMouse = _this$props.emitMouse,
          emitTouch = _this$props.emitTouch;


      return _extends({}, props, {
        onMouseDown: (0, _utils.callAll)(props.onMouseDown, function (e) {
          return emitMouse(e, id);
        }),
        onTouchStart: (0, _utils.callAll)(props.onTouchStart, function (e) {
          return emitTouch(e, id);
        })
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Handles.prototype.render = function render() {
    var getHandleProps = this.getHandleProps,
        _props = this.props,
        children = _props.children,
        handles = _props.handles;


    var renderedChildren = children({ handles: handles, getHandleProps: getHandleProps });
    return renderedChildren && _react2.default.Children.only(renderedChildren);
  };

  return Handles;
}(_react.Component);

Handles.propTypes = {
  /** @ignore */
  handles: _propTypes2.default.array,
  /** @ignore */
  emitMouse: _propTypes2.default.func,
  /** @ignore */
  emitTouch: _propTypes2.default.func,
  /**
   * A function to render the handles.
   * The function receives an object with an array of handles and functions to get handle props
   * `({ handles, getHandleProps }): element`
   */
  children: _propTypes2.default.func.isRequired
};

exports.default = Handles;