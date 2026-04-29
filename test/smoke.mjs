import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildGlyphForChar,
  decomposeChar,
  measureText,
  textToGlyphs,
  unicodeBoxGlyph
} from "../src/thf3x9.js";

const font = JSON.parse(await readFile(new URL("../font/thf-3x9-gray.json", import.meta.url), "utf8"));
const hangulStart = 0xac00;
const hangulEnd = 0xd7a3;

assert.deepEqual(decomposeChar("\ud55c"), ["\u314e", "\u314f", "\u3134"]);
assert.deepEqual(decomposeChar("\uae00"), ["\u3131", "\u3161", "\u3139"]);
assert.equal(textToGlyphs("\ud55c\uae00", font).length, 2);
assert.equal(font.generatedHangulSyllables, 11172);

for (const [name, rows] of Object.entries(font.glyphs)) {
  assert.equal(rows.length, font.cellHeight, `${name} must be ${font.cellHeight} rows`);

  for (const row of rows) {
    assert.equal(row.length, font.cellWidth, `${name} row must be ${font.cellWidth} pixels wide`);
    assert.match(row, /^[0-3]+$/, `${name} row uses only 0-3 grayscale levels`);
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
assert.equal(glyph.length, 9);
assert(glyph.some((row) => row !== "000"));

const unknownGlyph = buildGlyphForChar("\u2603", undefined, font);
assert.deepEqual(unknownGlyph, unicodeBoxGlyph("\u2603", font));
assert.equal(unknownGlyph[0], "333");
assert.equal(unknownGlyph.at(-1), "333");

const size = measureText("\ud55c\uae00", font, { scale: 8 });
assert.equal(size.width, 56);
assert.equal(size.height, 72);

console.log("smoke ok");
