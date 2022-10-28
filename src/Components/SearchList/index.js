import createVirtualElement from '@/core/virtualdom';

function SearchList(lists) {
  return (
    <ul>
      {lists.map(item => (
        <li>
          <span>{item.todo}</span>
          <button>✔</button>
          <span>
            {item.reviewCount}/{item.completedCount}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default SearchList;
