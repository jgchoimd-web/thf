from pathlib import Path

from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "dist" / "THFOriginalGray.ttf"


font = TTFont(FONT_PATH)
cmap = font.getBestCmap()

assert len(font.getGlyphOrder()) > 11000
for char in ["한", "글", "ㄱ", "ㅏ", "A", "a", "!", "♥", "😀"]:
    assert ord(char) in cmap, f"{char} must exist in the TTF cmap"

assert "glyf" in font
assert "cmap" in font
assert "name" in font

font.close()
print("ttf smoke ok")
