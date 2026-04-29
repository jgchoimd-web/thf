import json
import re
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen


ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "font" / "thf-original-gray.json"
TTF_PATH = ROOT / "dist" / "THFOriginalGray.ttf"
FAMILY_NAME = "THF Original Gray"
STYLE_NAME = "Regular"
UNITS_PER_EM = 1000
PIXEL_SIZE = 100
ASCENT = 760
DESCENT = -240


def main():
    font_data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    glyphs = font_data["glyphs"]
    width = font_data["cellWidth"]
    height = font_data["cellHeight"]
    advance = font_data.get("advance", width + 1) * PIXEL_SIZE

    glyph_order = [".notdef"]
    glyph_map = {".notdef": missing_glyph(width, height)}
    metrics = {".notdef": (advance, 0)}
    cmap = {}

    for char in sorted(glyphs, key=lambda item: item.encode("utf-32-be")):
        if len(char) != 1:
            continue

        codepoint = ord(char)
        glyph_name = glyph_name_for(codepoint)
        glyph_order.append(glyph_name)
        glyph_map[glyph_name] = draw_pixel_glyph(glyphs[char], width, height)
        metrics[glyph_name] = (advance, 0)
        cmap[codepoint] = glyph_name

    fb = FontBuilder(UNITS_PER_EM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyph_map)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=DESCENT,
        usWinAscent=ASCENT,
        usWinDescent=abs(DESCENT),
    )
    fb.setupNameTable({
        "familyName": FAMILY_NAME,
        "styleName": STYLE_NAME,
        "uniqueFontIdentifier": f"{FAMILY_NAME} {STYLE_NAME}",
        "fullName": f"{FAMILY_NAME} {STYLE_NAME}",
        "psName": re.sub(r"[^A-Za-z0-9-]", "", f"{FAMILY_NAME}-{STYLE_NAME}"),
        "version": f"Version {font_data.get('version', '0.1.0')}",
    })
    fb.setupPost()
    fb.setupMaxp()

    TTF_PATH.parent.mkdir(parents=True, exist_ok=True)
    fb.save(TTF_PATH)


def glyph_name_for(codepoint):
    return f"uni{codepoint:04X}" if codepoint <= 0xFFFF else f"u{codepoint:05X}"


def missing_glyph(width, height):
    rows = ["3" * width, *["3" + "0" * (width - 2) + "3" for _ in range(height - 2)], "3" * width]
    return draw_pixel_glyph(rows, width, height)


def draw_pixel_glyph(rows, width, height):
    pen = TTGlyphPen(None)

    for y, row in enumerate(rows):
        for x, value in enumerate(row):
            level = int(value)

            if level <= 0:
                continue

            inset = {1: 30, 2: 15, 3: 0}[level]
            left = x * PIXEL_SIZE + inset
            right = (x + 1) * PIXEL_SIZE - inset
            top = (height - y) * PIXEL_SIZE - inset
            bottom = (height - y - 1) * PIXEL_SIZE + inset
            draw_box(pen, left, bottom, right, top)

    return pen.glyph()


def draw_box(pen, left, bottom, right, top):
    pen.moveTo((left, bottom))
    pen.lineTo((right, bottom))
    pen.lineTo((right, top))
    pen.lineTo((left, top))
    pen.closePath()


if __name__ == "__main__":
    main()
