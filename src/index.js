/** @jsx createVirtualElement */
function createVirtualElement(type, props, ...children) {
  return { type, props, children };
}

const mySearchForm = (
  <form class='search'>
    <input class='search__input' placeholder='무엇을 검색하실건가요?' />
    <button class='search__button'>검색</button>
  </form>
);

const $app = document.getElementById('app');

$app.innerHTML = `${JSON.stringify(mySearchForm, null, 2)}`;
