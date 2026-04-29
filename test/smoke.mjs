import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildGlyphForChar,
  decomposeChar,
  measureText,
  textToGlyphs,
  unicodeBoxGlyph
} from "../src/thf-original.js";

const font = JSON.parse(await readFile(new URL("../font/thf-original.json", import.meta.url), "utf8"));
const hangulStart = 0xac00;
const hangulEnd = 0xd7a3;

assert.deepEqual(decomposeChar("\ud55c"), ["\u314e", "\u314f", "\u3134"]);
assert.deepEqual(decomposeChar("\uae00"), ["\u3131", "\u3161", "\u3139"]);
assert.equal(textToGlyphs("\ud55c\uae00", font).length, 2);
assert.equal(font.generatedHangulSyllables, 11172);
assert.equal(font.cellWidth, 8);
assert.equal(font.cellHeight, 9);

for (const [name, rows] of Object.entries(font.glyphs)) {
  assert.equal(rows.length, font.cellHeight, `${name} must be ${font.cellHeight} rows`);

  for (const row of rows) {
    assert.equal(row.length, font.cellWidth, `${name} row must be ${font.cellWidth} pixels wide`);
    assert.match(row, /^[01]+$/, `${name} row uses only monochrome levels`);
  }
}

let hangulCount = 0;
for (let codePoint = hangulStart; codePoint <= hangulEnd; codePoint += 1) {
  const char = String.fromCodePoint(codePoint);

  assert(font.glyphs[char], `${char} must have a dedicated glyph`);
  hangulCount += 1;
}

assert.equal(hangulCount, 11172);

const glyph = buildGlyphForChar("\ud55c", undefined, font);
assert.deepEqual(glyph, font.glyphs["\ud55c"]);
assert.equal(glyph.length, font.cellHeight);
assert(glyph.some((row) => row !== "000"));

const unknownGlyph = buildGlyphForChar("\u2603", undefined, font);
assert.deepEqual(unknownGlyph, font.glyphs["\u2603"]);

for (const char of "AaZz!?@#$%^&*()[]{}") {
  assert(font.glyphs[char], `${char} must have a dedicated ASCII glyph`);
}

for (const char of ["\u2665", "\u263a", "\ud83d\ude00", "\ud83d\udc4d"]) {
  assert(font.glyphs[char], `${char} must have a dedicated symbol or emoji glyph`);
}

for (const char of ["\u3131", "\u3132", "\u3133", "\u3134", "\u3139", "\u314e", "\u314f", "\u3150", "\u3158", "\u3161", "\u3163"]) {
  assert(font.glyphs[char], `${char} must have a dedicated standalone jamo glyph`);
  assert.notDeepEqual(buildGlyphForChar(char, undefined, font), unicodeBoxGlyph(char, font));
}

const boxGlyph = buildGlyphForChar("\u25ca", undefined, font);
assert.deepEqual(boxGlyph, unicodeBoxGlyph("\u25ca", font));
assert.equal(boxGlyph[0], "1".repeat(font.cellWidth));
assert.equal(boxGlyph.at(-1), "1".repeat(font.cellWidth));

const size = measureText("\ud55c\uae00", font, { scale: 8 });
assert.equal(size.width, 136);
assert.equal(size.height, 72);

console.log("smoke ok");
