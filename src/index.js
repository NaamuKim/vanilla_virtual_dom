import SearchForm from './Components/SearchForm';
import SearchList from './Components/SearchList';

function createRealElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  Object.entries(node.props || {})
    .filter(([attr, value]) => value)
    .forEach(([attr, value]) => $el.setAttribute(attr, value));

  try {
    node.children.map(createRealElement).forEach(child => {
      $el.appendChild(child);
    });
  } catch (err) {
    console.error(err);
    console.log(`${JSON.stringify(node)}에서 에러가 발생하였습니다.`);
  }

  return $el;
}

const realForm = createRealElement(SearchForm());
const realList = createRealElement(SearchList());
const $app = document.getElementById('app');

$app.appendChild(realForm);
$app.appendChild(realList);
