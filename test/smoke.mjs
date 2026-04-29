import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildGlyphForChar, decomposeChar, measureText, textToGlyphs } from "../src/thf3x9.js";

const font = JSON.parse(await readFile(new URL("../font/thf-3x9-gray.json", import.meta.url), "utf8"));

assert.deepEqual(decomposeChar("한"), ["ㅎ", "ㅏ", "ㄴ"]);
assert.deepEqual(decomposeChar("글"), ["ㄱ", "ㅡ", "ㄹ"]);
assert.equal(textToGlyphs("한글", font).length, 2);

for (const [name, rows] of Object.entries(font.glyphs)) {
  assert.equal(rows.length, font.cellHeight, `${name} must be ${font.cellHeight} rows`);

  for (const row of rows) {
    assert.equal(row.length, font.cellWidth, `${name} row must be ${font.cellWidth} pixels wide`);
    assert.match(row, /^[0-3]+$/, `${name} row uses only 0-3 grayscale levels`);
  }
}

const glyph = buildGlyphForChar("한", undefined, font);
assert.equal(glyph.length, 9);
assert(glyph.some((row) => row !== "000"));

const size = measureText("한글", font, { scale: 8 });
assert.equal(size.width, 56);
assert.equal(size.height, 72);

console.log("smoke ok");
