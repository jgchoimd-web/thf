import { writeFile } from "node:fs/promises";

const FONT_PATH = new URL("../font/thf-4x9-gray.json", import.meta.url);
const WIDTH = 4;
const HEIGHT = 9;
const HANGUL_BASE = 0xac00;
const HANGUL_COUNT = 11172;
const JUNGSEONG_COUNT = 21;
const JONGSEONG_COUNT = 28;

const INITIALS = [
  "g", "gg", "n", "d", "dd", "r", "m", "b", "bb", "s",
  "ss", "ng", "j", "jj", "ch", "k", "t", "p", "h"
];

const MEDIALS = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"
];

const FINALS = [
  "", "g", "gg", "gs", "n", "nj", "nh", "d", "r", "rg",
  "rm", "rb", "rs", "rt", "rp", "rh", "m", "b", "bs", "s",
  "ss", "ng", "j", "ch", "k", "t", "p", "h"
];

const compatibilityConsonants = [
  ["\u3131", "g"], ["\u3132", "gg"], ["\u3133", "gs"], ["\u3134", "n"], ["\u3135", "nj"], ["\u3136", "nh"],
  ["\u3137", "d"], ["\u3138", "dd"], ["\u3139", "r"], ["\u313a", "rg"], ["\u313b", "rm"], ["\u313c", "rb"],
  ["\u313d", "rs"], ["\u313e", "rt"], ["\u313f", "rp"], ["\u3140", "rh"], ["\u3141", "m"], ["\u3142", "b"],
  ["\u3143", "bb"], ["\u3144", "bs"], ["\u3145", "s"], ["\u3146", "ss"], ["\u3147", "ng"], ["\u3148", "j"],
  ["\u3149", "jj"], ["\u314a", "ch"], ["\u314b", "k"], ["\u314c", "t"], ["\u314d", "p"], ["\u314e", "h"]
];

const compatibilityVowels = [
  ["\u314f", "a"], ["\u3150", "ae"], ["\u3151", "ya"], ["\u3152", "yae"], ["\u3153", "eo"], ["\u3154", "e"],
  ["\u3155", "yeo"], ["\u3156", "ye"], ["\u3157", "o"], ["\u3158", "wa"], ["\u3159", "wae"], ["\u315a", "oe"],
  ["\u315b", "yo"], ["\u315c", "u"], ["\u315d", "wo"], ["\u315e", "we"], ["\u315f", "wi"], ["\u3160", "yu"],
  ["\u3161", "eu"], ["\u3162", "ui"], ["\u3163", "i"]
];

const initialPatterns = {
  g: ["3330", "0030", "0020"],
  gg: ["3333", "3030", "3030"],
  n: ["3000", "3000", "3330"],
  d: ["3330", "3000", "3330"],
  dd: ["3333", "3030", "3330"],
  r: ["3330", "0030", "3330"],
  m: ["3330", "3030", "3330"],
  b: ["3030", "3330", "3030"],
  bb: ["3033", "3330", "3330"],
  s: ["0330", "3030", "3003"],
  ss: ["3030", "3333", "3003"],
  ng: ["3330", "3030", "3330"],
  j: ["3330", "0330", "3003"],
  jj: ["3333", "0330", "3033"],
  ch: ["0330", "3330", "3003"],
  k: ["3330", "0030", "3330"],
  t: ["3330", "3300", "3330"],
  p: ["3030", "3333", "3330"],
  h: ["0330", "3330", "3030"]
};

const finalPatterns = {
  g: ["3330", "0030"],
  gg: ["3333", "3030"],
  gs: ["3330", "0333"],
  n: ["3000", "3330"],
  nj: ["3030", "3333"],
  nh: ["3300", "3333"],
  d: ["3330", "3300"],
  r: ["3330", "3300"],
  rg: ["3330", "0333"],
  rm: ["3333", "3333"],
  rb: ["3030", "3333"],
  rs: ["3330", "3003"],
  rt: ["3330", "3300"],
  rp: ["3033", "3333"],
  rh: ["0330", "3333"],
  m: ["3330", "3330"],
  b: ["3030", "3330"],
  bs: ["3330", "3033"],
  s: ["0330", "3003"],
  ss: ["3030", "3003"],
  ng: ["3330", "3330"],
  j: ["3330", "3003"],
  ch: ["0330", "3330"],
  k: ["3330", "0330"],
  t: ["3330", "3300"],
  p: ["3033", "3330"],
  h: ["0330", "3330"]
};

const asciiPatterns = {
  " ": ["0000", "0000", "0000", "0000", "0000"],
  "!": ["0300", "0300", "0300", "0000", "0300"],
  "\"": ["3030", "3030", "0000", "0000", "0000"],
  "#": ["3030", "3333", "3030", "3333", "3030"],
  "$": ["0330", "3300", "3330", "0033", "3330"],
  "%": ["3003", "0030", "0330", "3000", "3003"],
  "&": ["0330", "3030", "0330", "3033", "0333"],
  "'": ["0300", "0300", "0000", "0000", "0000"],
  "(": ["0030", "0300", "0300", "0300", "0030"],
  ")": ["0300", "0030", "0030", "0030", "0300"],
  "*": ["0000", "3030", "0330", "3030", "0000"],
  "+": ["0000", "0300", "3330", "0300", "0000"],
  ",": ["0000", "0000", "0000", "0300", "3000"],
  "-": ["0000", "0000", "3330", "0000", "0000"],
  ".": ["0000", "0000", "0000", "0000", "0300"],
  "/": ["0003", "0030", "0330", "3000", "0000"],
  "0": ["3330", "3003", "3003", "3003", "3330"],
  "1": ["0300", "3300", "0300", "0300", "3330"],
  "2": ["3330", "0003", "3330", "3000", "3333"],
  "3": ["3330", "0003", "0330", "0003", "3330"],
  "4": ["3003", "3003", "3333", "0003", "0003"],
  "5": ["3333", "3000", "3330", "0003", "3330"],
  "6": ["0330", "3000", "3330", "3003", "3330"],
  "7": ["3333", "0003", "0030", "0300", "0300"],
  "8": ["3330", "3003", "3330", "3003", "3330"],
  "9": ["3330", "3003", "3333", "0003", "3330"],
  ":": ["0000", "0300", "0000", "0300", "0000"],
  ";": ["0000", "0300", "0000", "0300", "3000"],
  "<": ["0030", "0300", "3000", "0300", "0030"],
  "=": ["0000", "3330", "0000", "3330", "0000"],
  ">": ["3000", "0300", "0030", "0300", "3000"],
  "?": ["3330", "0003", "0330", "0000", "0300"],
  "@": ["0330", "3003", "3033", "3000", "0333"],
  "A": ["0330", "3003", "3333", "3003", "3003"],
  "B": ["3330", "3003", "3330", "3003", "3330"],
  "C": ["0333", "3000", "3000", "3000", "0333"],
  "D": ["3330", "3003", "3003", "3003", "3330"],
  "E": ["3333", "3000", "3330", "3000", "3333"],
  "F": ["3333", "3000", "3330", "3000", "3000"],
  "G": ["0333", "3000", "3033", "3003", "0333"],
  "H": ["3003", "3003", "3333", "3003", "3003"],
  "I": ["3330", "0300", "0300", "0300", "3330"],
  "J": ["0003", "0003", "0003", "3003", "3330"],
  "K": ["3003", "3030", "3300", "3030", "3003"],
  "L": ["3000", "3000", "3000", "3000", "3333"],
  "M": ["3003", "3333", "3333", "3003", "3003"],
  "N": ["3003", "3303", "3333", "3033", "3003"],
  "O": ["0330", "3003", "3003", "3003", "0330"],
  "P": ["3330", "3003", "3330", "3000", "3000"],
  "Q": ["0330", "3003", "3003", "3033", "0333"],
  "R": ["3330", "3003", "3330", "3030", "3003"],
  "S": ["0333", "3000", "0330", "0003", "3330"],
  "T": ["3333", "0300", "0300", "0300", "0300"],
  "U": ["3003", "3003", "3003", "3003", "3333"],
  "V": ["3003", "3003", "3003", "0330", "0300"],
  "W": ["3003", "3003", "3333", "3333", "3003"],
  "X": ["3003", "0330", "0300", "0330", "3003"],
  "Y": ["3003", "0330", "0300", "0300", "0300"],
  "Z": ["3333", "0030", "0300", "3000", "3333"],
  "[": ["3330", "3000", "3000", "3000", "3330"],
  "\\": ["3000", "0300", "0330", "0003", "0000"],
  "]": ["3330", "0030", "0030", "0030", "3330"],
  "^": ["0300", "3030", "0000", "0000", "0000"],
  "_": ["0000", "0000", "0000", "0000", "3333"],
  "`": ["0300", "0030", "0000", "0000", "0000"],
  "a": ["0000", "0330", "0003", "3333", "3333"],
  "b": ["3000", "3000", "3330", "3003", "3330"],
  "c": ["0000", "0333", "3000", "3000", "0333"],
  "d": ["0003", "0003", "0333", "3003", "0333"],
  "e": ["0000", "0330", "3333", "3000", "0333"],
  "f": ["0033", "0300", "3330", "0300", "0300"],
  "g": ["0000", "0333", "3003", "0333", "0003"],
  "h": ["3000", "3000", "3330", "3003", "3003"],
  "i": ["0300", "0000", "3300", "0300", "3330"],
  "j": ["0030", "0000", "0030", "3030", "0300"],
  "k": ["3000", "3030", "3300", "3030", "3003"],
  "l": ["3300", "0300", "0300", "0300", "3330"],
  "m": ["0000", "3330", "3333", "3333", "3003"],
  "n": ["0000", "3330", "3003", "3003", "3003"],
  "o": ["0000", "0330", "3003", "3003", "0330"],
  "p": ["0000", "3330", "3003", "3330", "3000"],
  "q": ["0000", "0333", "3003", "0333", "0003"],
  "r": ["0000", "3330", "3003", "3000", "3000"],
  "s": ["0000", "0333", "3300", "0033", "3330"],
  "t": ["0300", "3330", "0300", "0300", "0033"],
  "u": ["0000", "3003", "3003", "3003", "0333"],
  "v": ["0000", "3003", "3003", "0330", "0300"],
  "w": ["0000", "3003", "3333", "3333", "3003"],
  "x": ["0000", "3003", "0330", "0330", "3003"],
  "y": ["0000", "3003", "0333", "0003", "3330"],
  "z": ["0000", "3333", "0030", "0300", "3333"],
  "{": ["0033", "0300", "3300", "0300", "0033"],
  "|": ["0300", "0300", "0300", "0300", "0300"],
  "}": ["3300", "0030", "0033", "0030", "3300"],
  "~": ["0000", "0333", "3330", "0000", "0000"]
};

const extraSymbols = new Map([
  [0x00a9, ["3333", "3003", "3033", "3003", "3333"]],
  [0x00ae, ["3333", "3033", "3330", "3030", "3003"]],
  [0x2661, ["0000", "3030", "3333", "0330", "0300"]],
  [0x2665, ["0000", "3230", "3333", "0330", "0300"]],
  [0x2605, ["0300", "3330", "0330", "3030", "0000"]],
  [0x2606, ["0300", "3130", "0330", "3030", "0000"]],
  [0x266a, ["0030", "0030", "0033", "0333", "0300"]],
  [0x2713, ["0000", "0003", "0030", "3030", "0300"]],
  [0x2715, ["0000", "3003", "0330", "0330", "3003"]],
  [0x263a, ["0000", "3003", "0000", "3003", "0330"]],
  [0x2639, ["0000", "3003", "0000", "0330", "3003"]],
  [0x2600, ["0330", "3333", "3333", "3333", "0330"]],
  [0x2601, ["0000", "0330", "3333", "3333", "0000"]],
  [0x2602, ["0330", "3333", "0300", "0300", "0030"]],
  [0x2603, ["0330", "0330", "3333", "0330", "3030"]],
  [0x1f600, ["0000", "3003", "0000", "3333", "0330"]],
  [0x1f602, ["3003", "0000", "3333", "0330", "3030"]],
  [0x1f609, ["3000", "0003", "0000", "3333", "0330"]],
  [0x1f60d, ["3030", "0000", "3333", "3333", "0330"]],
  [0x1f60e, ["3333", "0000", "3003", "3333", "0330"]],
  [0x1f622, ["3003", "0000", "0330", "3003", "0300"]],
  [0x1f621, ["3003", "0330", "0000", "3333", "3003"]],
  [0x1f44d, ["0300", "3330", "3333", "3330", "0300"]],
  [0x1f44e, ["0300", "3330", "3333", "3330", "0030"]]
]);

const verticalMedials = new Set(["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "i"]);
const horizontalMedials = new Set(["o", "yo", "u", "yu", "eu"]);
const glyphs = makeBaseGlyphs();

for (let index = 0; index < HANGUL_COUNT; index += 1) {
  const char = String.fromCodePoint(HANGUL_BASE + index);
  const choseongIndex = Math.floor(index / (JUNGSEONG_COUNT * JONGSEONG_COUNT));
  const jungseongIndex = Math.floor((index % (JUNGSEONG_COUNT * JONGSEONG_COUNT)) / JONGSEONG_COUNT);
  const jongseongIndex = index % JONGSEONG_COUNT;

  glyphs[char] = makeSyllableGlyph(
    INITIALS[choseongIndex],
    MEDIALS[jungseongIndex],
    FINALS[jongseongIndex]
  );
}

const font = {
  name: "THF 4x9 Gray",
  version: "0.2.0",
  cellWidth: WIDTH,
  cellHeight: HEIGHT,
  advance: 5,
  levels: ["transparent", "#4f4f4f", "#9a9a9a", "#f1f1f1"],
  fallback: "?",
  generatedHangulSyllables: HANGUL_COUNT,
  supportedAsciiRange: "U+0020-U+007E",
  supportedEmojiCodepoints: [...extraSymbols.keys()].map((codePoint) => `U+${codePoint.toString(16).toUpperCase()}`),
  glyphs
};

await writeFile(FONT_PATH, `${JSON.stringify(font, null, 2)}\n`, "utf8");

function makeBaseGlyphs() {
  const result = {};

  for (const [char, rows] of Object.entries(asciiPatterns)) {
    result[char] = stylizeGlyph(placeFiveHigh(rows));
  }

  for (const [codePoint, rows] of extraSymbols) {
    result[String.fromCodePoint(codePoint)] = stylizeGlyph(placeFiveHigh(rows));
  }

  for (const [char, key] of compatibilityConsonants) {
    result[char] = makeStandaloneConsonantGlyph(key);
  }

  for (const [char, key] of compatibilityVowels) {
    result[char] = makeStandaloneVowelGlyph(key);
  }

  return result;
}

function makeSyllableGlyph(initial, medial, final) {
  const rows = blank();
  const hasFinal = Boolean(final);

  paint(rows, initialPatterns[initial], 0, 0, 2);

  if (verticalMedials.has(medial)) {
    paintVerticalVowel(rows, medial, hasFinal);
    soften(rows, 1, hasFinal ? 5 : 7);
  } else if (horizontalMedials.has(medial)) {
    paintHorizontalVowel(rows, medial, hasFinal);
  } else {
    paintCompoundVowel(rows, medial, hasFinal);
    soften(rows, 1, hasFinal ? 5 : 7);
  }

  if (hasFinal) {
    paint(rows, finalPatterns[final], 0, 7, 3);
  }

  return stylizeGlyph(serialize(rows));
}

function paintVerticalVowel(rows, medial, hasFinal) {
  const rightSide = ["a", "ae", "ya", "yae", "i"].includes(medial);
  const col = rightSide ? 3 : 0;
  const armCol = rightSide ? 2 : 1;
  const start = 2;
  const end = hasFinal ? 6 : 8;

  for (let y = start; y <= end; y += 1) {
    rows[y][col] = Math.max(rows[y][col], 3);
  }

  if (["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye"].includes(medial)) {
    rows[3][armCol] = 3;
  }

  if (["ya", "yae", "yeo", "ye"].includes(medial)) {
    rows[5][armCol] = 2;
  }

  if (["ae", "yae", "e", "ye"].includes(medial)) {
    rows[2][2] = Math.max(rows[2][2], 2);
    rows[4][2] = Math.max(rows[4][2], 2);
    rows[6][2] = Math.max(rows[6][2], 2);
  }
}

function paintHorizontalVowel(rows, medial, hasFinal) {
  const y = hasFinal ? 5 : 6;

  rows[y][0] = 3;
  rows[y][1] = 3;
  rows[y][2] = 3;
  rows[y][3] = 3;

  if (["o", "yo"].includes(medial)) {
    rows[y - 1][1] = 3;
    rows[y - 1][2] = 3;
  }

  if (medial === "yo") {
    rows[y - 2][1] = 2;
    rows[y - 2][2] = 2;
  }

  if (["u", "yu"].includes(medial)) {
    rows[y + 1][1] = 3;
    rows[y + 1][2] = 3;
  }

  if (medial === "yu") {
    rows[y + 2][1] = 2;
    rows[y + 2][2] = 2;
  }
}

function paintCompoundVowel(rows, medial, hasFinal) {
  const barY = hasFinal ? 5 : 6;
  const bottom = hasFinal ? 6 : 8;

  rows[barY][0] = 3;
  rows[barY][1] = 3;
  rows[barY][2] = 3;
  rows[barY][3] = 3;

  for (let y = 2; y <= bottom; y += 1) {
    rows[y][3] = Math.max(rows[y][3], 3);
  }

  if (["wa", "wae", "oe"].includes(medial)) {
    rows[barY - 1][1] = 3;
    rows[barY - 1][2] = 2;
  }

  if (["wo", "we", "wi"].includes(medial)) {
    rows[barY + 1][1] = 3;
    rows[barY + 1][2] = 2;
  }

  if (["wae", "we", "ui"].includes(medial)) {
    rows[3][2] = Math.max(rows[3][2], 2);
    rows[6][2] = Math.max(rows[6][2], 2);
  }
}

function placeFiveHigh(rows) {
  return ["0000", ...rows, "0000", "0000", "0000"];
}

function makeStandaloneConsonantGlyph(key) {
  const rows = blank();
  const pattern = initialPatterns[key] || finalPatterns[key];
  const source = pattern.length === 2 ? [...pattern, "0000"] : pattern;

  paint(rows, source, 0, 2, 3);
  return stylizeGlyph(serialize(rows));
}

function makeStandaloneVowelGlyph(key) {
  const rows = blank();

  if (verticalMedials.has(key)) {
    paintVerticalVowel(rows, key, false);
  } else if (horizontalMedials.has(key)) {
    paintHorizontalVowel(rows, key, false);
  } else {
    paintCompoundVowel(rows, key, false);
  }

  return stylizeGlyph(serialize(rows));
}

function stylizeGlyph(glyph) {
  const source = glyph.map((row) => [...row].map(Number));
  const result = source.map((row) => [...row]);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const value = source[y][x];

      if (value === 0) {
        continue;
      }

      spread(result, x + 1, y, Math.max(1, value - 1));
      spread(result, x, y + 1, Math.max(1, value - 1));
      spread(result, x - 1, y, value >= 3 ? 1 : 0);
    }
  }

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      if (source[y][x] >= 3) {
        result[y][x] = 3;
      }
    }
  }

  return serialize(result);
}

function spread(rows, x, y, value) {
  if (value <= 0 || x < 0 || y < 0 || y >= HEIGHT || x >= WIDTH) {
    return;
  }

  rows[y][x] = Math.max(rows[y][x], value);
}

function paint(target, pattern, xOffset, yOffset, strength = 3) {
  for (let y = 0; y < pattern.length; y += 1) {
    for (let x = 0; x < pattern[y].length; x += 1) {
      const value = Number(pattern[y][x]);

      if (!value) {
        continue;
      }

      const yy = y + yOffset;
      const xx = x + xOffset;

      if (yy < target.length && xx < target[yy].length) {
        target[yy][xx] = Math.max(target[yy][xx], Math.min(3, value, strength));
      }
    }
  }
}

function soften(rows, startY, endY) {
  for (let y = startY; y <= endY; y += 1) {
    if (rows[y][1] === 0 && (rows[y][0] || rows[y][2] || rows[y][3])) {
      rows[y][1] = 1;
    }
  }
}

function blank() {
  return Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0));
}

function serialize(rows) {
  return rows.map((row) => row.join(""));
}
