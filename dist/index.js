"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/** @jsx createVirtualElement */
function createVirtualElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props,
    children: children
  };
}

function createRealElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  var $el = document.createElement(node.type);
  Object.entries(node.props || {}).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        value = _ref2[1];

    return value;
  }).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        attr = _ref4[0],
        value = _ref4[1];

    return $el.setAttribute(attr, value);
  });

  try {
    node.children.map(createRealElement).forEach(function (child) {
      return $el.appendChild(child);
    });
  } catch (err) {
    console.error(err);
    console.log(node + '에서 에러가 발생하였습니다.');
  }

  return $el;
}

var mySearchForm = createRealElement(createVirtualElement("form", {
  "class": "search"
}, createVirtualElement("input", {
  "class": "search__input",
  placeholder: "\uBB34\uC5C7\uC744 \uAC80\uC0C9\uD558\uC2E4\uAC74\uAC00\uC694?"
}), createVirtualElement("button", {
  "class": "search__button"
}, "\uAC80\uC0C9")));
var $app = document.getElementById('app');
$app.appendChild(mySearchForm);