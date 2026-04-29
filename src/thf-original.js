const CHOSEONG = [
  "\u3131", "\u3132", "\u3134", "\u3137", "\u3138", "\u3139", "\u3141", "\u3142", "\u3143", "\u3145",
  "\u3146", "\u3147", "\u3148", "\u3149", "\u314a", "\u314b", "\u314c", "\u314d", "\u314e"
];

const JUNGSEONG = [
  "\u314f", "\u3150", "\u3151", "\u3152", "\u3153", "\u3154", "\u3155", "\u3156", "\u3157", "\u3158",
  "\u3159", "\u315a", "\u315b", "\u315c", "\u315d", "\u315e", "\u315f", "\u3160", "\u3161", "\u3162", "\u3163"
];

const JONGSEONG = [
  "", "\u3131", "\u3132", "\u3133", "\u3134", "\u3135", "\u3136", "\u3137", "\u3139", "\u313a",
  "\u313b", "\u313c", "\u313d", "\u313e", "\u313f", "\u3140", "\u3141", "\u3142", "\u3144", "\u3145",
  "\u3146", "\u3147", "\u3148", "\u314a", "\u314b", "\u314c", "\u314d", "\u314e"
];

const DOUBLE_FINALS = {
  "\u3133": ["\u3131", "\u3145"],
  "\u3135": ["\u3134", "\u3148"],
  "\u3136": ["\u3134", "\u314e"],
  "\u313a": ["\u3139", "\u3131"],
  "\u313b": ["\u3139", "\u3141"],
  "\u313c": ["\u3139", "\u3142"],
  "\u313d": ["\u3139", "\u3145"],
  "\u313e": ["\u3139", "\u314c"],
  "\u313f": ["\u3139", "\u314d"],
  "\u3140": ["\u3139", "\u314e"],
  "\u3144": ["\u3142", "\u3145"]
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

export function textToGlyphs(text, font = null) {
  return [...String(text)].map((char) => ({
    char,
    glyph: buildGlyphForChar(char, textToParts(char), font)
  }));
}

export function measureText(text, font, options = {}) {
  const cellWidth = font.cellWidth;
  const cellHeight = font.cellHeight;
  const advance = options.advance ?? font.advance ?? cellWidth + 1;
  const lineGap = options.lineGap ?? 2;
  const scale = options.scale ?? 1;
  const lines = String(text).split("\n");
  const widths = lines.map((line) => [...line].length * advance - 1);
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

    [...line].forEach((char) => {
      const glyph = buildGlyphForChar(char, textToParts(char), font);
      drawGlyph(ctx, glyph, cursorX, cursorY, scale, palette);
      cursorX += advance;
    });
  });
}

export function buildGlyphForChar(char, parts = textToParts(char), font = null) {
  if (font?.glyphs[char]) {
    return font.glyphs[char];
  }

  if (parts.length === 1 && font) {
    return font.glyphs[parts[0]] || unicodeBoxGlyph(char, font);
  }

  if (parts.length < 2 || !font) {
    return null;
  }

  const rows = blankGlyph(font.cellWidth, font.cellHeight);
  const [initial, medial, ...finals] = parts;

  paintPart(rows, font.glyphs[initial], 0, 0, 3);
  paintPart(rows, font.glyphs[medial], 0, 2, finals.length ? 2 : 3);

  finals.forEach((final, index) => {
    paintPart(rows, font.glyphs[final], index % 2, 6, 2);
  });

  return rows.map((row) => row.join(""));
}

export function unicodeBoxGlyph(char, font) {
  const width = font.cellWidth;
  const height = font.cellHeight;
  const rows = blankGlyph(width, height);
  const codePoint = char.codePointAt(0) ?? 0;

  for (let x = 0; x < width; x += 1) {
    rows[0][x] = 3;
    rows[height - 1][x] = 3;
  }

  for (let y = 1; y < height - 1; y += 1) {
    rows[y][0] = 3;
    rows[y][width - 1] = 3;
  }

  for (let y = 2; y < height - 2; y += 1) {
    rows[y][1] = ((codePoint >> ((y - 2) * 2)) & 3) || 1;
  }

  return rows.map((row) => row.join(""));
}

function textToParts(char) {
  return decomposeChar(char);
}

function blankGlyph(width, height) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
}

function paintPart(target, source, xOffset, yOffset, maxRows) {
  if (!source) {
    return;
  }

  source.slice(0, maxRows).forEach((row, rowIndex) => {
    [...row].forEach((level, columnIndex) => {
      const x = Math.min(target[0].length - 1, xOffset + columnIndex);
      const y = Math.min(target.length - 1, yOffset + rowIndex);
      const value = Number(level);

      target[y][x] = Math.min(3, target[y][x] + value);
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
