import SearchForm from './Components/SearchForm';
import SearchList from './Components/SearchList';
import createRealElement from './core/createRealElement';
import './index.scss';
import { updateElement } from './core/updateElement';
const lists = [
  {
    id: 1,
    todo: "YOU DON'T KNOW JS 읽기",
    isDone: false,
    reviewCount: 0,
    completedCount: 5,
  },
  {
    id: 2,
    todo: '가상돔 만들기',
    isDone: false,
    reviewCount: 1,
    completedCount: 5,
  },
];
const newLists = [
  {
    id: 1,
    todo: "YOU DON'T KNOW JS 읽기",
    isDone: false,
    reviewCount: 0,
    completedCount: 5,
  },
  {
    id: 2,
    todo: 'diff 알고리즘 적용',
    isDone: false,
    reviewCount: 1,
    completedCount: 5,
  },
];
const realForm = createRealElement(SearchForm());
const realList = SearchList(lists);
const realList2 = SearchList(newLists);

const $app = document.getElementById('app');

updateElement({ parentNode: $app, newNode: realList });

setTimeout(() => {
  updateElement({ parentNode: $app, newNode: realList2, oldNode: realList });
}, 1000);
