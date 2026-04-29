from pathlib import Path

from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "dist" / "THFOriginal.ttf"


font = TTFont(FONT_PATH)
cmap = font.getBestCmap()

assert len(font.getGlyphOrder()) > 11000
for char in ["\ud55c", "\uae00", "\u3131", "\u314f", "A", "a", "!", "\u2665", "\U0001f600"]:
    assert ord(char) in cmap, f"{char} must exist in the TTF cmap"

assert "glyf" in font
assert "cmap" in font
assert "name" in font

font.close()
print("ttf smoke ok")
