const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

const JUNGSEONG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
  "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"
];

const JONGSEONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
  "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

const DOUBLE_FINALS = {
  "ㄳ": ["ㄱ", "ㅅ"],
  "ㄵ": ["ㄴ", "ㅈ"],
  "ㄶ": ["ㄴ", "ㅎ"],
  "ㄺ": ["ㄹ", "ㄱ"],
  "ㄻ": ["ㄹ", "ㅁ"],
  "ㄼ": ["ㄹ", "ㅂ"],
  "ㄽ": ["ㄹ", "ㅅ"],
  "ㄾ": ["ㄹ", "ㅌ"],
  "ㄿ": ["ㄹ", "ㅍ"],
  "ㅀ": ["ㄹ", "ㅎ"],
  "ㅄ": ["ㅂ", "ㅅ"]
};

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const JUNGSEONG_COUNT = 21;
const JONGSEONG_COUNT = 28;

export function decomposeChar(char) {
  const code = char.codePointAt(0);

  if (code < HANGUL_BASE || code > HANGUL_END) {
    return [char];
  }

  const syllableIndex = code - HANGUL_BASE;
  const choseongIndex = Math.floor(syllableIndex / (JUNGSEONG_COUNT * JONGSEONG_COUNT));
  const jungseongIndex = Math.floor((syllableIndex % (JUNGSEONG_COUNT * JONGSEONG_COUNT)) / JONGSEONG_COUNT);
  const jongseongIndex = syllableIndex % JONGSEONG_COUNT;
  const final = JONGSEONG[jongseongIndex];

  return [
    CHOSEONG[choseongIndex],
    JUNGSEONG[jungseongIndex],
    ...(DOUBLE_FINALS[final] || (final ? [final] : []))
  ];
}

export function textToGlyphs(text) {
  return [...text].flatMap((char) => decomposeChar(char));
}

export function measureText(text, font, options = {}) {
  const cellWidth = font.cellWidth;
  const cellHeight = font.cellHeight;
  const advance = options.advance ?? font.advance ?? cellWidth + 1;
  const lineGap = options.lineGap ?? 2;
  const scale = options.scale ?? 1;
  const lines = String(text).split("\n");
  const widths = lines.map((line) => textToGlyphs(line).length * advance - 1);
  const width = Math.max(1, ...widths) * scale;
  const height = Math.max(1, lines.length * (cellHeight + lineGap) - lineGap) * scale;

  return { width, height };
}

export function renderText(canvas, text, font, options = {}) {
  const scale = options.scale ?? 4;
  const letterSpacing = options.letterSpacing ?? 1;
  const advance = options.advance ?? font.advance ?? font.cellWidth + letterSpacing;
  const lineGap = options.lineGap ?? 2;
  const background = options.background ?? "#f4f4f4";
  const palette = options.palette ?? font.levels;
  const padding = options.padding ?? 1;
  const lines = String(text).split("\n");
  const fallback = font.glyphs[font.fallback] || font.glyphs["?"];
  const metrics = measureText(text, font, { advance, lineGap, scale });
  const width = metrics.width + padding * 2 * scale;
  const height = metrics.height + padding * 2 * scale;
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  lines.forEach((line, lineIndex) => {
    let cursorX = padding;
    const cursorY = padding + lineIndex * (font.cellHeight + lineGap);

    textToGlyphs(line).forEach((glyphName) => {
      const glyph = font.glyphs[glyphName] || fallback;
      drawGlyph(ctx, glyph, cursorX, cursorY, scale, palette);
      cursorX += advance;
    });
  });
}

function drawGlyph(ctx, glyph, x, y, scale, palette) {
  glyph.forEach((row, rowIndex) => {
    [...row].forEach((level, columnIndex) => {
      const color = palette[Number(level)];

      if (!color || color === "transparent") {
        return;
      }

      ctx.fillStyle = color;
      ctx.fillRect((x + columnIndex) * scale, (y + rowIndex) * scale, scale, scale);
    });
  });
}
