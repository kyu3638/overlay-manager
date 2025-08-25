# Overlay-manager

overlay-manager는 React에서 모달 등 오버레이를 관리하기 위한 라이브러리입니다.

비즈니스 로직과 관계없이, 오직 오버레이를 관리하기 위한 **상태 관리**와 **조건부 렌더링**에서 벗어나기 위해 제작하였습니다.

아래 명령어로 설치할 수 있습니다.

```
npm install @kyu3638/overlay-manager
```

# 예제

## Provider 설정

```tsx
import { OverlayProvider } from "@kyu3638/overlay-manager";

const App = () => {
  return (
    <OverlayProvider>
	  ...
	</OverlayProvider>
  );
}
```

## Overlay 열어보기

```tsx
import { overlay } from "@kyu3638/overlay-manager";

const Home = () => {
  return (
    <Button
      onClick={() =>
        overlay.open(({ isOpen, close }) => {
          return <SampleDialog isOpen={isOpen} close={close} />;
        })
      }
    >
      회원가입
    </Button>
  );
};
```

## Overlay 닫기

```tsx
type SampleDialogProps = {
  isOpen: boolean;
  close: () => void;
};

const SampleDialog = ({ isOpen, close }: SampleDialogProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        {/* ... */}
        <Button onClick={close}>닫기</Button>
      </DialogContent>
    </Dialog>
  );
};
```

# overlay-manager이 추구하는 방향

## 1. 선언적 코드

- 명령형 오버레이 관리 방식은 오버레이를 위한 상태관리와 조건부 렌더링을 필요로 합니다.
- 비즈니스 로직 외 코드가 증가하고, 생산성과 개발자 경험을 낮추는 악영향을 주게 됩니다.
- overlay-manager는 직관적이고 선언적인 방식으로 관리할 수 있습니다.

## 2. 중첩된 오버레이 관리

- overlay-manager는 내부적으로 렌더링 되는 오버레이를 배열로 관리하고 있습니다.
- 덕분에 오버레이를 중첩되게 사용하더라도 렌더링 순서를 일관되도록 보장할 수 있습니다.

## 3. 컴포넌트 트리 외부에서 접근 가능하도록 API 구현

- 일반적으로 컴포넌트 내부에서만 오버레이 제어가 가능하지만,
- OverlayProvider 마운트 시 전역 이벤트 리스너와 React 상태를 연결하여 어디서든 overlay.open(…)으로 오버레이를 호출할 수 있습니다.

# 구현 과정 및 트러블 슈팅

## 1. 오버레이 관리에 있어 스택 구조의 한계와 ID 기반 관리로 전환

- 문제상황
    - 구현 초기 `overlay.open(<Dialog />)` 형태의 API로 구현하고, 오버레이를 단순 스택으로 관리하였습니다.
    - 하지만 내부에서 오버레이의 ID를 알 수 없기 때문에 선택적 제어가 불가능하고, Dialog, Toast 등 다양한 오버레이를 사용할 때 반드시 후입선출로 제어되어야 하는 문제가 발생했습니다.
- 해결과정
    - OverlayProvider 내부에서 오버레이 ID를 바인딩한 close 함수를 만들어 prop으로 전달하는 방식으로 API를 재설계하였습니다.
    - 오버레이 상태 관리 구조를 단순 스택에서 Record<id,OverlayItem> + ID 배열 구조로 변경하여 ID 기반 접근과 렌더링 순서를 모두 보장하도록 개선했습니다.
- 성과
    - 각 오버레이가 자신의 ID를 알지 못하더라도 close 함수를 사용하여 독립적인 제어가 가능해졌습니다.
    - Dialog와 Toast 등 다양한 오버레이를 복합적으로 사용하더라도 렌더링 순서에 상관없이 제어가 가능해졌습니다.
    - 개발자는 오버레이의 ID를 고려할 필요없이 개발하여 생산성이 향상될 수 있습니다.

## 2. 이벤트 브릿지 패턴을 이용한 컴포넌트 트리 외부에서 오버레이 제어

- 문제상황
    - React Context는 Provider 하위 컴포넌트에서만 접근 가능하기 때문에, 컴포넌트 트리 외부에서 오버레이를 제어할 수 없는 한계점이 있었습니다.
- 해결과정
    - 전역 싱글톤 이벤트 리스너와 OverlayProvider를 연결하는 브릿지 패턴 구현을 통해 한계점을 해결하고자 했습니다.
    - Provider 마운트 시 `enrollEventListener()`를 통해 오버레이 상태 관리 함수를 전역 리스너에 등록하여, 컴포넌트 트리 외부에서도 overlay API를 호출하면 React가 렌더링 되도록 연결하였습니다.
- 성과
    - 비동기 API 콜백, 외부 라이브러리 등 어디서든 overlay API 활용을 통해 오버레이를 제어할 수 있게 되었습니다.