# VanillaJS로 가상돔 구현해보기 (JSX 문법 적용시키기)

## 가상돔은 무슨 문제를 해결하는가?

가상돔은 **렌더링 성능 문제**를 해결한다.

가상돔이 어떻게 렌더링 성능 문제를 해결하는 지 **함수형 컴포넌트**들을 만들어보며 확인해보자.

이번 글에서는 가상돔이 동작하는 환경을 조금 더 간결하게 만들기 위해 JSX문법을 적용시켜 가상돔을 리턴하는 함수를 만들어 사용할 수 있게끔 해보자.

### JSX가 무엇이고 왜 사용하는가?

JSX는 자바스크립트를 확장한 문법이다.  
리액트 공식문서에 있는 활용을 살펴보면  
`const element = <h1>Hello, {name}</h1>;`  
이런 식으로 HTML 템플릿을 하나의 값으로 사용할 수 있게 해준다.

### 사용이유는

1.  **문법의 간결함**
2.  **마크업과 로직을 포함하여 관심사를 분리하기 위함**
3.  **가상돔을 이용한다면 사실상 객체인 템플릿을 html문법으로 표현할 수 있다.**

문법이 간결해지는 것은 템플릿 리터럴로 리턴할 떄 수많은 `${}`가 생기는 것을 막을 수 있다.  
그리고 마크업과 로직을 한군데에다가 몰아두고 이벤트리스너를 붙이는 로직을 분리할 수 있다.  
리액트에서 JSX를 사용할 때 아래처럼 사용하는 것을 볼 수 있다.

```
<h2 className="clicked-header" onClick={handleClickEvent}>클릭해볼래요</h2>
```

JSX없이 이벤트를 걸려면

```
document.querySelector('.clicked-header').addEventListener('click',handleClickEvent)
```

이런식의 작성이 필요하다. 이벤트가 많아지고 큰 시스템이라면 위에 같은 엘리먼트를 찾고 이벤트를 등록하는 코드들이 반복되게 된다.  
JSX 문법을 사용하면 이러한 내용들을 간결하게 사용할 수 있다.

가상돔은 그냥 만들어지지 않는다.  
가상돔을 이용한다면 2번에서 말한 js와 마크업이 합쳐진 내용들이 사실상 가상돔 즉 **객체**이다.  
가상돔을 만드는 함수를 만들어 로직을 분리해놓고 바벨 같은 트랜스파일러를 이용해서 빌드 후에는 자동으로 JSX문법을 이용한 부분은 해당 함수에 감싸지게끔 사용하면 실제로 객체인 부분들을 html문법으로 표현할 수 있다. 이에 관련된 내용들을 살펴보자.

### JSX를 이용해서 HTML(XML)문법으로 작성된 것을 객체로 바꾸려면?

결국 JSX를 이용하려면 HTML 구조를 객체로 바꿀 수 있어야한다.

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

html 파서를 만들어서 객체로 만들 수도 있지만, 우리는 태그 타입, props, 자식 노드를 받아서 json 객체를 리턴하는 함수`createVirtualElement`라는 함수가 있다고 가정하자.  
왜 virtual이냐면 이는 객체이지 실제 DOM Element가 아니다.

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

하지만 JSX를 이용하면 이렇게 직접함수로 객체 리터럴을 감쌀필요없이 html꼴로  
사용할 수 있다.

#### 그러면 babel 이용하여 직접 html형태의 가상돔을 만들어보자!

babel.config.json 파일에 plugin-transform-react-jsx 플러그인을 사용한다고 명시해주자.

```
// babel.config.json
{
  "presets": [["@babel/env"]],
  "plugins": ["@babel/plugin-transform-react-jsx"]
}
```

JSX pragma를 이용하여 해당 함수가 리턴한 JSX 템플릿을 감싸야한다고 babel이 알 수 있도록 명시해주자.

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

사용하면 JSX가 잘 적용되는 것을 확인할 수 있다.  
번외로 react에서는 babel이 JSX문법을 만나면 `React.createElement`를 하는 코드로 바꾼다.

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

이러한 과정을 완성한 부분은 [여기서](https://github.com/NaamuKim/vanilla_virtual_dom/commit/8727664051af462f93244e768dd402cceed9d198)볼 수 있다.  
화면은 이렇게 보인다.

하지만 우리는 여러 JS파일을 만들어서 사용할 것이고 컴포넌트를 분리할 필요도 있다.  
그렇다면 어떻게 virtualDom을 만드는 함수를 분리해놓고 사용할 수 있을까?  
babel `"@babel/plugin-transform-react-jsx"` 설정에 `{fragma: 커스텀한virtualElement만드는함수이름}` 을 추가해줄 수 있겠다.  
하지만 나는 이 프로젝트에서 여러개의 파일과 디렉토리를 만들어 파일과 디렉토리 이름을 바탕으로 무엇을 하는 지 찾아가기 좋게 만드려고한다.  
하지만 여러개의 파일을 서버에 요청하는 것은 리소스가 크기 때문에 webpack을 이용한 번들링을 하려고 한다.  
개발환경, 배포환경을 구분하기 위해  
webpack.common.js, webpack.dev.js, webpack.prod.js를 나누어 주고 각각을 설정해주었다.  
웹팩 세팅에 관한 내용은 나중에 다루기로 하고 간단히 babel 설정 부분만 봐보자

```
{
    test : /\.js$/,
    exclude: /node_modules/,
    use : {
           loader: "babel-loader",
        options: {
            plugins: [
                ["@babel/plugin-transform-react-jsx", { "pragma": "createVirtualElement" }]
            ]}
        },
},
```

transform-react-jsx를 플러그인으로 사용하고 pragma(JSX문법을 감싸는 함수)를 내가 만든 `createVirtualElement`로 설정해준 부분이다.  
해당 설정을 완료해주면 이제 우리는 `createVirutualElement`를 import만 해주면 자동으로 JSX문법으로 작성한 html이 가상돔형태로 바뀐다.  
그 후 `createRealElement` 함수를 실행하여 app element에다 삽입만 해주면된다.

```
const realForm = createRealElement(SearchForm());
const realList = createRealElement(SearchList());
const $app = document.getElementById('app');

$app.appendChild(realForm);
$app.appendChild(realList);
```

여기까지 완성하면 첫 렌더링을 완성할 수 있다.

![스크린샷 2022-10-11 오후 2 33 18](https://user-images.githubusercontent.com/83356118/195006486-1341c505-ab8b-4fbd-aa47-ff3e616386ee.png)

다음글은 가상돔을 이용하여 렌더링 성능을 올려보는 부분을 포스팅해보려고 한다.

### 출처(참고문헌)

-   [준일님 블로그](https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/#_4-diff-%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%80%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8C%E1%85%B3%E1%86%B7-%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC)
-   [리액트 공식문서 중 JSX소개](https://ko.reactjs.org/docs/introducing-jsx.html)