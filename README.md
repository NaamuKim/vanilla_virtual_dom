## virtual dom은 무엇을 해야하는가?

jsx나 템플릿꼴이나 함수의 실행된 꼴을 객체형태로 저장하고 있으면 됨

그러면 컴포넌트가 함수이고 리턴값이 템플릿이라고 하자.
상태가 변했을 때 흐름은

1. 상태가 변한 것을 감지 (옵저버나 여러 방법으로)
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

으로 children에 다시 createElement를 return 하는 재귀적인 구조로 작성할 수 있다.
하지만 이런것은 jsx를 이용하면 이렇게 보기 안좋게 쓸 필요 없이 그냥 html처럼 사용할 수 있다.

그러면 babel 이용하여 직접 html형태의 템플릿을 만들어보자
babel jsx 세팅을 해주고

```
// babel.config.json
{
  "presets": [["@babel/env"]],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

jsx만드는 함수라고 아래처럼 명명해준 뒤에

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
