# THF Original

직접 만든 8x9 흑백 픽셀 획으로 구성한 한국어 비트맵 폰트입니다. 기존 시스템 폰트를 래스터라이즈하지 않고, 스크립트 안에 손으로 정의한 ASCII 패턴, 심볼 패턴, 한글 자모 획 규칙으로 글리프를 생성합니다.

## 구성

- `dist/THFOriginal.ttf`: 설치하거나 `@font-face`로 사용할 수 있는 TrueType 폰트 파일
- `font/thf-original.json`: Canvas 렌더러용 흑백 픽셀 글리프 데이터
- `scripts/generate-font.py`: 직접 작성한 픽셀 패턴과 한글 획 규칙으로 JSON 글리프를 생성
- `scripts/generate-ttf.py`: JSON 픽셀 글리프를 TrueType 윤곽선 글리프로 변환
- `src/thf-original.js`: Canvas 렌더러
- `demo/index.html`: 브라우저 데모

## 사용법

웹 폰트로 사용할 때:

```css
@font-face {
  font-family: "THF Original";
  src: url("./dist/THFOriginal.ttf") format("truetype");
}
```

Canvas 렌더러로 사용할 때:

```html
<canvas id="screen"></canvas>
<script type="module">
  import { renderText } from "./src/thf-original.js";

  const font = await fetch("./font/thf-original.json").then((res) => res.json());
  const canvas = document.querySelector("#screen");
  renderText(canvas, "한글 Aa!? ♥", font, { scale: 8 });
</script>
```

폰트 파일과 JSON 데이터를 다시 만들려면 아래 명령을 실행합니다.

```powershell
npm run build
```

생성기는 Python과 fontTools를 사용합니다.

## 디자인 노트

한글 완성형 글자는 모두 개별 글리프로 저장되어 렌더링됩니다. 완성형 11,172자는 손으로 정의한 초성/중성/종성 픽셀 획 규칙을 조합해 생성합니다. `ㄱ`, `ㄲ`, `ㄳ`, `ㅏ`, `ㅐ`, `ㅘ`, `ㅡ`, `ㅣ` 같은 호환 자모 단독 글자도 지원합니다.

영어 대문자/소문자, 숫자, ASCII 특수기호, `♥`, `★`, `♪`, `☺`, `☹`, `☀`, `☁`, `☂`, `☃`, `😀`, `😂`, `😉`, `😍`, `😎`, `😢`, `😡`, `👍`, `👎` 같은 간단한 이모티콘도 포함합니다.
