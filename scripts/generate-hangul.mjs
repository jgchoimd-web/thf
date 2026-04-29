import { readFile, writeFile } from "node:fs/promises";

const FONT_PATH = new URL("../font/thf-3x9-gray.json", import.meta.url);
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

const initialPatterns = {
  g: ["333", "003", "001"],
  gg: ["333", "203", "203"],
  n: ["300", "300", "333"],
  d: ["333", "300", "333"],
  dd: ["333", "303", "333"],
  r: ["333", "023", "330"],
  m: ["333", "303", "333"],
  b: ["303", "333", "303"],
  bb: ["333", "303", "333"],
  s: ["030", "303", "201"],
  ss: ["303", "333", "303"],
  ng: ["333", "303", "333"],
  j: ["333", "030", "303"],
  jj: ["333", "232", "303"],
  ch: ["030", "333", "303"],
  k: ["333", "033", "003"],
  t: ["333", "330", "333"],
  p: ["303", "333", "333"],
  h: ["030", "333", "303"]
};

const finalPatterns = {
  g: ["333", "003"],
  gg: ["333", "303"],
  gs: ["333", "033"],
  n: ["300", "333"],
  nj: ["303", "333"],
  nh: ["330", "333"],
  d: ["333", "330"],
  r: ["333", "330"],
  rg: ["333", "233"],
  rm: ["333", "333"],
  rb: ["303", "333"],
  rs: ["333", "303"],
  rt: ["333", "330"],
  rp: ["303", "333"],
  rh: ["330", "333"],
  m: ["333", "333"],
  b: ["303", "333"],
  bs: ["333", "303"],
  s: ["030", "303"],
  ss: ["303", "303"],
  ng: ["333", "333"],
  j: ["333", "303"],
  ch: ["030", "333"],
  k: ["333", "033"],
  t: ["333", "330"],
  p: ["303", "333"],
  h: ["030", "333"]
};

const verticalMedials = new Set(["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "i"]);
const horizontalMedials = new Set(["o", "yo", "u", "yu", "eu"]);

const baseFont = JSON.parse(await readFile(FONT_PATH, "utf8"));
const glyphs = {};

for (const [name, glyph] of Object.entries(baseFont.glyphs)) {
  if (!isHangulSyllable(name)) {
    glyphs[name] = glyph;
  }
}

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

const nextFont = {
  ...baseFont,
  generatedHangulSyllables: HANGUL_COUNT,
  glyphs
};

await writeFile(FONT_PATH, `${JSON.stringify(nextFont, null, 2)}\n`, "utf8");

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

  return rows.map((row) => row.join(""));
}

function paintVerticalVowel(rows, medial, hasFinal) {
  const rightSide = ["a", "ae", "ya", "yae", "i"].includes(medial);
  const col = rightSide ? 2 : 0;
  const armCol = rightSide ? 1 : 1;
  const start = 2;
  const end = hasFinal ? 6 : 8;

  for (let y = start; y <= end; y += 1) {
    rows[y][col] = Math.max(rows[y][col], 3);
  }

  if (["a", "ae", "ya", "yae"].includes(medial)) {
    rows[3][armCol] = 3;
  }

  if (["ya", "yae"].includes(medial)) {
    rows[5][armCol] = 2;
  }

  if (["eo", "e", "yeo", "ye"].includes(medial)) {
    rows[3][armCol] = 3;
  }

  if (["yeo", "ye"].includes(medial)) {
    rows[5][armCol] = 2;
  }

  if (["ae", "yae", "e", "ye"].includes(medial)) {
    rows[2][1] = Math.max(rows[2][1], 2);
    rows[4][1] = Math.max(rows[4][1], 2);
    rows[6][1] = Math.max(rows[6][1], 2);
  }
}

function paintHorizontalVowel(rows, medial, hasFinal) {
  const y = hasFinal ? 5 : 6;

  rows[y][0] = 3;
  rows[y][1] = 3;
  rows[y][2] = 3;

  if (["o", "yo"].includes(medial)) {
    rows[y - 1][1] = 3;
  }

  if (medial === "yo") {
    rows[y - 1][0] = 2;
    rows[y - 1][2] = 2;
  }

  if (["u", "yu"].includes(medial)) {
    rows[y + 1][1] = 3;
  }

  if (medial === "yu") {
    rows[y + 1][0] = 2;
    rows[y + 1][2] = 2;
  }
}

function paintCompoundVowel(rows, medial, hasFinal) {
  const barY = hasFinal ? 5 : 6;
  const bottom = hasFinal ? 6 : 8;

  rows[barY][0] = 3;
  rows[barY][1] = 3;
  rows[barY][2] = 3;

  for (let y = 2; y <= bottom; y += 1) {
    rows[y][2] = Math.max(rows[y][2], 3);
  }

  if (["wa", "wae", "oe"].includes(medial)) {
    rows[barY - 1][1] = 3;
  }

  if (["wo", "we", "wi"].includes(medial)) {
    rows[barY + 1][1] = 3;
  }

  if (["wae", "we", "ui"].includes(medial)) {
    rows[3][1] = Math.max(rows[3][1], 2);
    rows[6][1] = Math.max(rows[6][1], 2);
  }
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
    if (rows[y][1] === 0 && (rows[y][0] || rows[y][2])) {
      rows[y][1] = 1;
    }
  }
}

function blank() {
  return Array.from({ length: 9 }, () => [0, 0, 0]);
}

function isHangulSyllable(char) {
  if ([...char].length !== 1) {
    return false;
  }

  const code = char.codePointAt(0);
  return code >= HANGUL_BASE && code < HANGUL_BASE + HANGUL_COUNT;
}
