# THF 3x8 Gray

픽셀화된 3x8 그레이스케일 한국어 비트맵 폰트입니다. 완성형 한글을 직접 모두 저장하지 않고, 한글 음절을 초성/중성/종성으로 분해한 뒤 3x8 자모 글리프를 조합해 렌더링합니다.

## 구성

- `font/thf-3x8-gray.json`: 3x8 픽셀 자모/ASCII 글리프 데이터
- `src/thf3x8.js`: Canvas 렌더러와 한글 분해 로직
- `demo/index.html`: 브라우저 데모

## 사용법

```html
<canvas id="screen"></canvas>
<script type="module">
  import { renderText } from "./src/thf3x8.js";

  const font = await fetch("./font/thf-3x8-gray.json").then((res) => res.json());
  const canvas = document.querySelector("#screen");
  renderText(canvas, "한글 3x8", font, { scale: 8 });
</script>
```

로컬에서 데모를 확인하려면 정적 서버를 실행한 뒤 `demo/index.html`을 열면 됩니다.

```powershell
python -m http.server 8080
```

## 디자인 노트

3x8 셀은 한글을 표현하기에 극단적으로 작기 때문에, 이 폰트는 인쇄용 폰트보다 레트로 UI, 게임 HUD, 저해상도 디스플레이, 글리치 그래픽에 어울립니다. 각 픽셀은 `0`부터 `3`까지 네 단계로 저장되며 렌더러가 그레이스케일 팔레트로 변환합니다.
