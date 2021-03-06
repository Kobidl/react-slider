'use strict';

exports.__esModule = true;
exports.getSortByVal = getSortByVal;
exports.getUpdatedValues = getUpdatedValues;
exports.getSliderDomain = getSliderDomain;
exports.getStepRange = getStepRange;
exports.isNotValidTouch = isNotValidTouch;
exports.getTouchPosition = getTouchPosition;
function getSortByVal(reversed) {
  return function sortByVal(a, b) {
    if (a.val > b.val) {
      return reversed ? -1 : 1;
    }

    if (b.val > a.val) {
      return reversed ? 1 : -1;
    }

    return 0;
  };
}

function getUpdatedValues(values, updateKey, updateValue, reversed) {
  var index = values.findIndex(function (v) {
    return v.key === updateKey;
  });

  if (index !== -1) {
    var _values$index = values[index],
        key = _values$index.key,
        val = _values$index.val;


    if (val === updateValue) {
      return values;
    }

    return [].concat(values.slice(0, index), [{ key: key, val: updateValue }], values.slice(index + 1)).sort(getSortByVal(reversed));
  }

  return values;
}

function getSliderDomain(slider, vertical) {
  if (!slider) {
    return [0, 0];
  }

  var s = slider.getBoundingClientRect();
  return vertical ? [s.top, s.bottom] : [s.left, s.right];
}

function precision(num) {
  var m = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

  if (!m) {
    return 0;
  }

  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
}

function getStepRange(min, max, step) {
  var fixed = precision(step);

  var pMin = +min.toFixed(fixed);
  var pMax = +max.toFixed(fixed);

  var range = [];

  var next = pMin;

  while (next <= pMax) {
    range.push(next);
    next = +(next + step).toFixed(fixed);
  }

  return range;
}

function isNotValidTouch(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === undefined ? '' : _ref$type,
      touches = _ref.touches;

  return !touches || touches.length > 1 || type.toLowerCase() === 'touchend' && touches.length > 0;
}

function getTouchPosition(vertical, e) {
  return vertical ? e.touches[0].clientY : e.touches[0].pageX;
}