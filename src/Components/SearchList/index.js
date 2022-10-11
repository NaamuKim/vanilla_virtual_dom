import createVirtualElement from '@/core/virtualdom';

function SearchList() {
  const lists = [
    { id: 'hi', todo: '놀기', isDone: false },
    {
      id: 'hihi',
      todo: '가상돔 만들기',
      isDone: false,
    },
  ];
  const toggleTodo = id => {
    console.log(id);
  };
  return (
    <ul>
      {lists.map(item => (
        <li>
          <span>{item.todo}</span>
          <button>✔</button>
        </li>
      ))}
    </ul>
  );
}

export default SearchList;
