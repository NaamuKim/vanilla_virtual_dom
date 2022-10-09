/** @jsx createVirtualElement */
function createVirtualElement(type, props, ...children) {
  return { type, props, children };
}

function createRealElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  Object.entries(node.props || {})
    .filter(([attr, value]) => value)
    .forEach(([attr, value]) => $el.setAttribute(attr, value));

  try {
    node.children.map(createRealElement).forEach((child) => $el.appendChild(child));
  } catch (err) {
    console.error(err);
    console.log(node + '에서 에러가 발생하였습니다.');
  }

  return $el;
}

const mySearchForm = createRealElement(
  <form class='search'>
    <input class='search__input' placeholder='무엇을 검색하실건가요?' />
    <button class='search__button'>검색</button>
  </form>
);

const $app = document.getElementById('app');

$app.appendChild(mySearchForm);
