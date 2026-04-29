import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { decomposeChar, measureText, textToGlyphs } from "../src/thf3x8.js";

const font = JSON.parse(await readFile(new URL("../font/thf-3x8-gray.json", import.meta.url), "utf8"));

assert.deepEqual(decomposeChar("한"), ["ㅎ", "ㅏ", "ㄴ"]);
assert.deepEqual(decomposeChar("글"), ["ㄱ", "ㅡ", "ㄹ"]);
assert.deepEqual(textToGlyphs("값"), ["ㄱ", "ㅏ", "ㅂ", "ㅅ"]);

for (const [name, rows] of Object.entries(font.glyphs)) {
  assert.equal(rows.length, font.cellHeight, `${name} must be ${font.cellHeight} rows`);

  for (const row of rows) {
    assert.equal(row.length, font.cellWidth, `${name} row must be ${font.cellWidth} pixels wide`);
    assert.match(row, /^[0-3]+$/, `${name} row uses only 0-3 grayscale levels`);
  }
}

const size = measureText("한글", font, { scale: 8 });
assert.equal(size.width, 184);
assert.equal(size.height, 64);

console.log("smoke ok");
