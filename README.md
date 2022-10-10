## virtual dom은 무엇을 해야하는가?

jsx나 템플릿꼴이나 함수의 실행된 꼴을 객체형태로 저장하고 있으면 됨

내가 만들 컴포넌트는 함수형이고 리턴값이 템플릿이나 JSX형식이라고 하자.
상태가 변했을 때 흐름은

1. 상태가 변한 것을 감지 (pub/sub패턴을 이용하거나 프록시를 이용하거나 등등)
2. virtual dom을 실제 HTML ELEMENT로 바꾼다.
3. 루트에 삽입한다.

### 일단 jsx를 babel로 바꿔서 써보자.

---

### html(xml) 구조를 객체로 나타내려면?

```
    <main id="app">
        <form class="search">
            <input class="search__input" placeholder="무엇을 검색하실건가요?"/>
            <button class="search__button">검색</button>
        </form>
    </main>
```

이런 html 트리 구조가 있다고 치자.
이것을 객체 형태로 바꾸려면 어떻게 해야할까?
객체는 아래와 같은 꼴일 것이다.

```
{
    type: 'main',
    props: {
        id: 'app',
    },
    children:[
        {
            type: 'form',
            props: {
                class: 'search',
            },
            children:[
                {
                    type: 'input',
                    props: {
                        class: 'search__input',
                        placeholder: '무엇을 검색하실건가요?'
                    }
                },
                {
                    type: 'button',
                    props: {
                        class: 'search__button',
                    }
                    children:{
                        '검색'
                    }
                }
            ]
        },
    ]
}
```

이런식일 것이다.
html 파서를 만들어서 객체로 만들 수도 있지만, 우리는 태그 타입, props, 자식 노드를 받아서 json 객체를 리턴하는 함수`createVirtualElement`라는 함수가 있다고 가정하자.
왜 virtual이냐면 이는 객체이지 dom이 아니다.

```
function createVirtualElement(type, props, ...children){
    return {
        type,
        props,
        children,
    }
}
```

이런 함수를 만들고

```
createVirtualElement('main',{id:'app'},
    createVirtualElement(
        ....
    )
    )
```

으로 children에 다시 createElement를 return 하는 재귀적인 구조로 작성할 수 있다. <br/>
하지만 jsx를 이용하면 이렇게 직접함수로 객체 리터럴을 감쌀필요없이 html꼴로
사용할 수 있다.

그러면 babel 이용하여 직접 html형태의 가상돔을 만들어보자!
babel.config.json 파일에 plugin-transform-react-jsx 플러그인을 사용한다고 명시해주자.

```
// babel.config.json
{
  "presets": [["@babel/env"]],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

jsx pragma를 이용하여 해당 함수가 리턴한 jsx 템플릿을 감싸야한다고 babel이 알 수 있도록 명시해주자.

```
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

```

사용하면 jsx가 잘 적용되는 것을 확인할 수 있다.
번외로 react에서는 babel이 jsx문법을 만나면 `React.createElement`를 하는 코드로 바꾼다.

이제 만들어진 virtualdom을 다시 realdom으로 바꿔주어야한다.

realdom을 만들기 위해 우리는 이용할 수 있는 DOM API들이 있다.
우리는 type이 있으므로 `document.createElement(type)`을 이용해서 새로운 엘리먼트를 만들 수 있다.
또 우리는 props들을 등록해주어야하는데 `$el.setAttribute(속성키(ex: 'class'), 속성값(ex: 'search__input'))`를 이용하여 등록할 수 있을 것이다.

이제 관련 코드를 살펴보자.

```
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
```

node가 태그가 아닌 텍스트 node 이면 문자열로 들어올 것이다.
텍스트 노드는 `document.createTextNode()`를 통해서 만들어준다.

```
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
```

props를 등록해줘야할 필요가 있다.
속성 값이 없는 것을 필터링 해주고 만들어진 element에 속성을 더한다.

```
  Object.entries(node.props || {})
    .filter(([attr, value]) => value)
    .forEach(([attr, value]) => $el.setAttribute(attr, value));
```

이제 자식을 재귀적으로 등록할 차례이다.
그냥 map안에 createRealElement를 넣어주는 것만으로도 구현이 가능하다.

```
  try {
    node.children.map(createRealElement).forEach((child) => $el.appendChild(child));
  } catch (err) {
    console.error(err);
    console.log(node + '에서 에러가 발생하였습니다.');
  }
```

### 출처(참고문헌)

- [준일님 블로그](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/#_4-diff-%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%80%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8C%E1%85%B3%E1%86%B7-%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC)
