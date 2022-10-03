"use strict";

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

var mySearchForm = createVirtualElement("form", {
  "class": "search"
}, createVirtualElement("input", {
  "class": "search__input",
  placeholder: "\uBB34\uC5C7\uC744 \uAC80\uC0C9\uD558\uC2E4\uAC74\uAC00\uC694?"
}), createVirtualElement("button", {
  "class": "search__button"
}, "\uAC80\uC0C9"));
var $app = document.getElementById('app');
$app.innerHTML = "".concat(JSON.stringify(mySearchForm, null, 2));