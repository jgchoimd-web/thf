# THF Original Gray

원본 스크린샷처럼 낮은 해상도로 뭉개진 한국어 그레이스케일 비트맵 폰트입니다. `가`부터 `힣`까지 완성형 한글 11,172자를 실제 한국어 폰트에서 작게 래스터라이즈해 각각 저장합니다.

## 구성

- `font/thf-original-gray.json`: 원본 스타일 한글/ASCII/심볼/간단한 이모티콘 글리프 데이터
- `scripts/generate-font.py`: 완성형 한글과 기본 문자 전체 글리프 생성기
- `src/thf-original.js`: Canvas 렌더러
- `demo/index.html`: 브라우저 데모

## 사용법

```html
<canvas id="screen"></canvas>
<script type="module">
  import { renderText } from "./src/thf-original.js";

  const font = await fetch("./font/thf-original-gray.json").then((res) => res.json());
  const canvas = document.querySelector("#screen");
  renderText(canvas, "한글 Aa!? ♥", font, { scale: 8 });
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

생성기는 Python과 Pillow를 사용합니다.

## 디자인 노트

이 폰트는 인쇄용 폰트보다 레트로 UI, 게임 HUD, 저해상도 디스플레이, 글리치 그래픽에 어울립니다. 각 글리프는 Windows의 Malgun Gothic Bold를 아주 작게 래스터라이즈한 뒤 4단계 회색 픽셀로 양자화해 생성합니다.

한글 완성형 글자는 모두 개별 글리프로 저장되어 렌더링됩니다. `ㄱ`, `ㄲ`, `ㄳ`, `ㅏ`, `ㅐ`, `ㅘ`, `ㅡ`, `ㅣ` 같은 호환 자모 단독 글자도 지원합니다. 영어 대문자/소문자, 숫자, ASCII 특수기호, `♥`, `★`, `♪`, `☺`, `☹`, `☀`, `☁`, `☂`, `☃`, `😀`, `😂`, `😉`, `😍`, `😎`, `😢`, `😡`, `👍`, `👎` 같은 간단한 이모티콘도 포함합니다. 폰트 데이터에 없는 문자는 `?`로 대체하지 않고, 해당 코드포인트에서 파생된 유니코드 박스 글리프로 표시합니다.
