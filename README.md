# VanillaJS로 가상돔을 만들어보자.

## 겪은 문제와 해결

### 가상 돔을 리턴시키기 위해 객체 형태로 리턴 시키는 것은 매우 복잡하다.
- JSX문법으로 html형태로 사용할 수 있게 해보자.<br/>
  바벨의 transform jsx를 사용하고 프라그마는 직접 만듬 `createVirtualElement`로 바꿔주자.<br/>
- [해당 문제 해결 과정 정리 링크](https://naamukim.tistory.com/14)