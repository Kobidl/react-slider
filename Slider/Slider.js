'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Rail = require('../Rail');

var _Rail2 = _interopRequireDefault(_Rail);

var _Ticks = require('../Ticks');

var _Ticks2 = _interopRequireDefault(_Ticks);

var _Tracks = require('../Tracks');

var _Tracks2 = _interopRequireDefault(_Tracks);

var _Handles = require('../Handles');

var _Handles2 = _interopRequireDefault(_Handles);

var _modes = require('./modes');

var _utils = require('./utils');

var _LinearScale = require('./LinearScale');

var _LinearScale2 = _interopRequireDefault(_LinearScale);

var _DiscreteScale = require('./DiscreteScale');

var _DiscreteScale2 = _interopRequireDefault(_DiscreteScale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prfx = 'react-compound-slider:';

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var noop = function noop() {};

var compare = function compare(b) {
  return function (m, d, i) {
    return m && b[i] === d;
  };
};

var equal = function equal(a, b) {
  return a === b || a.length === b.length && a.reduce(compare(b), true);
};

var Slider = function (_PureComponent) {
  _inherits(Slider, _PureComponent);

  function Slider(props) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, _PureComponent.call(this, props));

    _this.state = { values: [] };

    _this.slider = null;

    _this.valueToPerc = new _LinearScale2.default();
    _this.valueToStep = new _DiscreteScale2.default();
    _this.pixelToStep = new _DiscreteScale2.default();

    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.submitUpdate = _this.submitUpdate.bind(_this);

    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onStart = _this.onStart.bind(_this);

    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    return _this;
  }

  Slider.prototype.componentWillMount = function componentWillMount() {
    var _props = this.props,
        values = _props.values,
        domain = _props.domain,
        step = _props.step,
        reversed = _props.reversed;


    this.updateRange(domain, step, reversed);
    this.setValues(values, reversed);
  };

  Slider.prototype.componentWillReceiveProps = function componentWillReceiveProps(next) {
    var domain = next.domain,
        step = next.step,
        reversed = next.reversed,
        values = next.values;
    var props = this.props;


    if (domain[0] !== props.domain[0] || domain[1] !== props.domain[1] || step !== props.step || reversed !== props.reversed) {
      this.updateRange(domain, step, reversed);
      var remapped = this.reMapValues(reversed);

      if (values === undefined || values === props.values) {
        next.onChange(remapped);
        next.onUpdate(remapped);
      }
    }

    if (!equal(values, props.values)) {
      this.setValues(values, reversed);
    }
  };

  Slider.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeListeners();
  };

  Slider.prototype.removeListeners = function removeListeners() {
    if (isBrowser) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
  };

  Slider.prototype.reMapValues = function reMapValues(reversed) {
    var values = this.state.values;

    return this.setValues(values.map(function (d) {
      return d.val;
    }), reversed);
  };

  Slider.prototype.setValues = function setValues() {
    var _this2 = this;

    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var reversed = arguments[1];

    var changes = 0;

    var values = arr.map(function (x) {
      var val = _this2.valueToStep.getValue(x);

      if (x !== val) {
        changes += 1;
        (0, _warning2.default)(false, prfx + ' Invalid value encountered. Changing ' + x + ' to ' + val + '.');
      }

      return val;
    }).map(function (val, i) {
      return { key: '$$-' + i, val: val };
    }).sort((0, _utils.getSortByVal)(reversed));

    var valuesArr = values.map(function (d) {
      return d.val;
    });

    if (changes > 0) {
      this.props.onUpdate(valuesArr);
      this.props.onChange(valuesArr);
    }

    this.setState(function () {
      return { values: values };
    });

    return valuesArr;
  };

  Slider.prototype.updateRange = function updateRange(_ref, step, reversed) {
    var min = _ref[0],
        max = _ref[1];

    var range = (0, _utils.getStepRange)(min, max, step);

    this.valueToStep.setRange(range).setDomain([min - step / 2, max + step / 2]);

    if (reversed === true) {
      this.valueToPerc.setDomain([min, max]).setRange([100, 0]);
      range.reverse();
    } else {
      this.valueToPerc.setDomain([min, max]).setRange([0, 100]);
    }

    this.pixelToStep.setRange(range);

    (0, _warning2.default)(max > min, prfx + ' Max must be greater than min (even if reversed). Max is ' + max + '. Min is ' + min + '.');

    (0, _warning2.default)(range.length <= 10001, prfx + ' Increase step value. Found ' + range.length.toLocaleString() + ' values in range.');

    var last = range.length - 1;

    (0, _warning2.default)(range[reversed ? last : 0] === min && range[reversed ? 0 : last] === max, prfx + ' The range is incorrectly calculated. Check domain (min, max) and step values.');
  };

  Slider.prototype.onMouseDown = function onMouseDown(e, handleID) {
    this.onStart(e, handleID, false);
  };

  Slider.prototype.onTouchStart = function onTouchStart(e, handleID) {
    if ((0, _utils.isNotValidTouch)(e)) {
      return;
    }

    this.onStart(e, handleID, true);
  };

  Slider.prototype.onStart = function onStart(e, handleID, isTouch) {
    var values = this.state.values,
        onSlideStart = this.props.onSlideStart;


    e.stopPropagation && e.stopPropagation();
    e.preventDefault && e.preventDefault();

    var found = values.find(function (value) {
      return value.key === handleID;
    });

    if (found) {
      this.active = handleID;
      onSlideStart(values.map(function (d) {
        return d.val;
      }), { activeHandleID: handleID });
      isTouch ? this.addTouchEvents() : this.addMouseEvents();
    } else {
      this.active = null;
      this.handleRailAndTrackClicks(e, isTouch);
    }
  };

  Slider.prototype.handleRailAndTrackClicks = function handleRailAndTrackClicks(e, isTouch) {
    var curr = this.state.values,
        _props2 = this.props,
        vertical = _props2.vertical,
        reversed = _props2.reversed;
    var slider = this.slider;

    // double check the dimensions of the slider

    this.pixelToStep.setDomain((0, _utils.getSliderDomain)(slider, vertical));

    // find the closest value (aka step) to the event location
    var updateValue = void 0;

    if (isTouch) {
      updateValue = this.pixelToStep.getValue((0, _utils.getTouchPosition)(vertical, e));
    } else {
      updateValue = this.pixelToStep.getValue(vertical ? e.clientY : e.pageX);
    }

    // find the closest handle key
    var updateKey = null;
    var minDiff = Infinity;

    for (var i = 0; i < curr.length; i++) {
      var _curr$i = curr[i],
          key = _curr$i.key,
          val = _curr$i.val;

      var diff = Math.abs(val - updateValue);

      if (diff < minDiff) {
        updateKey = key;
        minDiff = diff;
      }
    }

    // generate a "candidate" set of values - a suggestion of what to do
    var nextValues = (0, _utils.getUpdatedValues)(curr, updateKey, updateValue, reversed);

    // submit the candidate values
    this.submitUpdate(nextValues, true);
  };

  Slider.prototype.addMouseEvents = function addMouseEvents() {
    if (isBrowser) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  };

  Slider.prototype.addTouchEvents = function addTouchEvents() {
    if (isBrowser) {
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchend', this.onTouchEnd);
    }
  };

  Slider.prototype.onMouseMove = function onMouseMove(e) {
    var curr = this.state.values,
        _props3 = this.props,
        vertical = _props3.vertical,
        reversed = _props3.reversed;
    var updateKey = this.active,
        slider = this.slider;

    // double check the dimensions of the slider

    this.pixelToStep.setDomain((0, _utils.getSliderDomain)(slider, vertical));

    // find the closest value (aka step) to the event location
    var updateValue = this.pixelToStep.getValue(vertical ? e.clientY : e.pageX);

    // generate a "candidate" set of values - a suggestion of what to do
    var nextValues = (0, _utils.getUpdatedValues)(curr, updateKey, updateValue, reversed);

    // submit the candidate values
    this.submitUpdate(nextValues);
  };

  Slider.prototype.onTouchMove = function onTouchMove(e) {
    var curr = this.state.values,
        _props4 = this.props,
        vertical = _props4.vertical,
        reversed = _props4.reversed;
    var updateKey = this.active,
        slider = this.slider;


    if ((0, _utils.isNotValidTouch)(e)) {
      return;
    }

    // double check the dimensions of the slider
    this.pixelToStep.setDomain((0, _utils.getSliderDomain)(slider, vertical));

    // find the closest value (aka step) to the event location
    var updateValue = this.pixelToStep.getValue((0, _utils.getTouchPosition)(vertical, e));

    // generate a "candidate" set of values - a suggestion of what to do
    var nextValues = (0, _utils.getUpdatedValues)(curr, updateKey, updateValue, reversed);

    // submit the candidate values
    this.submitUpdate(nextValues);
  };

  Slider.prototype.submitUpdate = function submitUpdate(next, callOnChange) {
    var _props5 = this.props,
        mode = _props5.mode,
        step = _props5.step,
        onUpdate = _props5.onUpdate,
        onChange = _props5.onChange,
        reversed = _props5.reversed;
    var getValue = this.valueToStep.getValue;


    this.setState(function (_ref2) {
      var curr = _ref2.values;

      var values = void 0;

      // given the current values and a candidate set, decide what to do
      if (typeof mode === 'function') {
        values = mode(curr, next, step, reversed, getValue);
        (0, _warning2.default)(Array.isArray(values), 'Custom mode function did not return an array.');
      } else {
        switch (mode) {
          case 1:
            values = (0, _modes.mode1)(curr, next);
            break;
          case 2:
            values = (0, _modes.mode2)(curr, next);
            break;
          case 3:
            values = (0, _modes.mode3)(curr, next, step, reversed, getValue);
            break;
          default:
            values = next;
            (0, _warning2.default)(false, prfx + ' Invalid mode value.');
        }
      }

      onUpdate(values.map(function (d) {
        return d.val;
      }));

      if (callOnChange) {
        onChange(values.map(function (d) {
          return d.val;
        }));
      }

      return { values: values };
    });
  };

  Slider.prototype.onMouseUp = function onMouseUp() {
    var values = this.state.values,
        _props6 = this.props,
        onChange = _props6.onChange,
        onSlideEnd = _props6.onSlideEnd;

    var activeHandleID = this.active;
    this.active = null;

    onChange(values.map(function (d) {
      return d.val;
    }));
    onSlideEnd(values.map(function (d) {
      return d.val;
    }), { activeHandleID: activeHandleID });

    if (isBrowser) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  };

  Slider.prototype.onTouchEnd = function onTouchEnd() {
    var values = this.state.values,
        _props7 = this.props,
        onChange = _props7.onChange,
        onSlideEnd = _props7.onSlideEnd;

    this.active = null;

    onChange(values.map(function (d) {
      return d.val;
    }));
    onSlideEnd(values.map(function (d) {
      return d.val;
    }));

    if (isBrowser) {
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }
  };

  Slider.prototype.render = function render() {
    var _this3 = this;

    var values = this.state.values,
        _props8 = this.props,
        className = _props8.className,
        rootStyle = _props8.rootStyle;


    var handles = values.map(function (_ref3) {
      var key = _ref3.key,
          val = _ref3.val;

      return { id: key, value: val, percent: _this3.valueToPerc.getValue(val) };
    });

    var children = _react2.default.Children.map(this.props.children, function (child) {
      if (child.type.name === _Rail2.default.name || child.type.name === _Ticks2.default.name || child.type.name === _Tracks2.default.name || child.type.name === _Handles2.default.name) {
        return _react2.default.cloneElement(child, {
          scale: _this3.valueToPerc,
          handles: handles,
          emitMouse: _this3.onMouseDown,
          emitTouch: _this3.onTouchStart
        });
      }

      return child;
    });

    return _react2.default.createElement(
      'div',
      {
        style: rootStyle || {},
        className: className,
        ref: function ref(d) {
          return _this3.slider = d;
        }
      },
      children
    );
  };

  return Slider;
}(_react.PureComponent);

Slider.propTypes = {
  /**
   * CSS class name applied to the root div of the slider.
   */
  className: _propTypes2.default.string,
  /**
   * An object with any inline styles you want applied to the root div.
   */
  rootStyle: _propTypes2.default.object,
  /**
   * Two element array of numbers providing the min and max values for the slider [min, max] e.g. [0, 100].
   * It does not matter if the slider is reversed on the screen, domain is always [min, max] with min < max.
   */
  domain: _propTypes2.default.array,
  /**
   * An array of numbers. You can supply one for a value slider, two for a range slider or more to create n-handled sliders.
   * The values should correspond to valid step values in the domain.
   * The numbers will be forced into the domain if they are two small or large.
   */
  values: _propTypes2.default.array,
  /**
   * The step value for the slider.
   */
  step: _propTypes2.default.number,
  /**
   * The interaction mode. Value of 1 will allow handles to cross each other.
   * Value of 2 will keep the sliders from crossing and separated by a step.
   * Value of 3 will make the handles pushable and keep them a step apart.
   * ADVANCED: You can also supply a function that will be passed the current values and the incoming update.
   * Your function should return what the state should be set as.
   */
  mode: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
  /**
   * Set to true if the slider is displayed vertically to tell the slider to use the height to calculate positions.
   */
  vertical: _propTypes2.default.bool,
  /**
   * Reverse the display of slider values.
   */
  reversed: _propTypes2.default.bool,
  /**
   * Function triggered when the value of the slider has changed. This will recieve changes at the end of a slide as well as changes from clicks on rails and tracks. Receives values.
   */
  onChange: _propTypes2.default.func,
  /**
   * Function called with the values at each update (caution: high-volume updates when dragging). Receives values.
   */
  onUpdate: _propTypes2.default.func,
  /**
   * Function triggered with ontouchstart or onmousedown on a handle. Receives values.
   */
  onSlideStart: _propTypes2.default.func,
  /**
   * Function triggered on ontouchend or onmouseup on a handle. Receives values.
   */
  onSlideEnd: _propTypes2.default.func,
  /**
   * Component children to render
   */
  children: _propTypes2.default.any
};

Slider.defaultProps = {
  mode: 1,
  step: 0.1,
  domain: [0, 100],
  vertical: false,
  reversed: false,
  onChange: noop,
  onUpdate: noop,
  onSlideStart: noop,
  onSlideEnd: noop
};

exports.default = Slider;