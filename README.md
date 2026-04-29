# THF 4x9 Gray

픽셀화된 4x9 그레이스케일 한국어 비트맵 폰트입니다. `가`부터 `힣`까지 완성형 한글 11,172자를 모두 4x9 픽셀 셀 하나씩 따로 저장합니다.

## 구성

- `font/thf-4x9-gray.json`: 4x9 픽셀 한글/ASCII/심볼/간단한 이모티콘 글리프 데이터
- `scripts/generate-font.mjs`: 완성형 한글과 기본 문자 전체 글리프 생성기
- `src/thf4x9.js`: Canvas 렌더러
- `demo/index.html`: 브라우저 데모

## 사용법

```html
<canvas id="screen"></canvas>
<script type="module">
  import { renderText } from "./src/thf4x9.js";

  const font = await fetch("./font/thf-4x9-gray.json").then((res) => res.json());
  const canvas = document.querySelector("#screen");
  renderText(canvas, "한글 4x9 Aa!? ♥", font, { scale: 8 });
</script>
```

로컬에서 데모를 확인하려면 정적 서버를 실행한 뒤 `demo/index.html`을 열면 됩니다.

```powershell
python -m http.server 8080
```

폰트 데이터를 다시 만들려면 아래 명령을 실행합니다.

```powershell
npm run build:font
```

## 디자인 노트

4x9 셀은 한글을 표현하기에 여전히 작기 때문에, 이 폰트는 인쇄용 폰트보다 레트로 UI, 게임 HUD, 저해상도 디스플레이, 글리치 그래픽에 어울립니다. 각 픽셀은 `0`부터 `3`까지 네 단계로 저장되며 렌더러가 그레이스케일 팔레트로 변환합니다.

한글 완성형 글자는 모두 개별 글리프로 저장되어 렌더링됩니다. 영어 대문자/소문자, 숫자, ASCII 특수기호, `♥`, `★`, `♪`, `☺`, `☹`, `☀`, `☁`, `☂`, `☃`, `😀`, `😂`, `😉`, `😍`, `😎`, `😢`, `😡`, `👍`, `👎` 같은 간단한 이모티콘도 포함합니다. 폰트 데이터에 없는 문자는 `?`로 대체하지 않고, 해당 코드포인트에서 파생된 4x9 유니코드 박스 글리프로 표시합니다.
