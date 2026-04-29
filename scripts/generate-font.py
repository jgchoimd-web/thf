import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "font" / "thf-original.json"
WIDTH = 8
HEIGHT = 9
HANGUL_START = 0xAC00
HANGUL_END = 0xD7A3
ASCII_START = 0x20
ASCII_END = 0x7E
JAMO_START = 0x3131
JAMO_END = 0x3163
LEVELS = ["transparent", "#eeeeee"]

TEXT_FONT = ImageFont.truetype(r"C:\Windows\Fonts\malgunbd.ttf", 12)
EMOJI_FONT = ImageFont.truetype(r"C:\Windows\Fonts\seguiemj.ttf", 11)

EXTRA_CODEPOINTS = [
    0x00A9, 0x00AE, 0x2600, 0x2601, 0x2602, 0x2603, 0x2605, 0x2606,
    0x263A, 0x2639, 0x2661, 0x2665, 0x266A, 0x2713, 0x2715,
    0x1F600, 0x1F602, 0x1F609, 0x1F60D, 0x1F60E, 0x1F622, 0x1F621,
    0x1F44D, 0x1F44E,
]


def main():
    glyphs = {}

    for codepoint in range(ASCII_START, ASCII_END + 1):
        char = chr(codepoint)
        glyphs[char] = rasterize(char, TEXT_FONT)

    for codepoint in range(JAMO_START, JAMO_END + 1):
        char = chr(codepoint)
        glyphs[char] = rasterize(char, TEXT_FONT)

    for codepoint in range(HANGUL_START, HANGUL_END + 1):
        char = chr(codepoint)
        glyphs[char] = rasterize(char, TEXT_FONT)

    for codepoint in EXTRA_CODEPOINTS:
        char = chr(codepoint)
        font = EMOJI_FONT if codepoint >= 0x1F000 else TEXT_FONT
        glyphs[char] = rasterize(char, font)

    font = {
        "name": "THF Original",
        "version": "0.4.0",
        "cellWidth": WIDTH,
        "cellHeight": HEIGHT,
        "advance": WIDTH + 1,
        "levels": LEVELS,
        "fallback": "?",
        "generatedHangulSyllables": HANGUL_END - HANGUL_START + 1,
        "supportedAsciiRange": "U+0020-U+007E",
        "supportedJamoRange": "U+3131-U+3163",
        "supportedEmojiCodepoints": [f"U+{codepoint:X}" for codepoint in EXTRA_CODEPOINTS],
        "sourceFont": "Malgun Gothic Bold",
        "rendering": "rasterized, downsampled, and thresholded to monochrome pixels",
        "glyphs": glyphs,
    }

    FONT_PATH.parent.mkdir(parents=True, exist_ok=True)
    FONT_PATH.write_text(json.dumps(font, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rasterize(char, font):
    canvas = Image.new("L", (40, 40), 0)
    draw = ImageDraw.Draw(canvas)
    bbox = draw.textbbox((0, 0), char, font=font, stroke_width=0)

    if not bbox:
        return ["0" * WIDTH for _ in range(HEIGHT)]

    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (canvas.width - text_width) // 2 - bbox[0]
    y = (canvas.height - text_height) // 2 - bbox[1]
    draw.text((x, y), char, fill=255, font=font)

    bbox = canvas.getbbox()
    if not bbox:
        return ["0" * WIDTH for _ in range(HEIGHT)]

    glyph = canvas.crop(bbox)
    glyph.thumbnail((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

    cell = Image.new("L", (WIDTH, HEIGHT), 0)
    ox = (WIDTH - glyph.width) // 2
    oy = (HEIGHT - glyph.height) // 2
    cell.paste(glyph, (ox, oy))

    # A tiny blur before quantization mimics the source's soft grayscale pixels.
    rows = []
    for y in range(HEIGHT):
        row = []
        for x in range(WIDTH):
            value = cell.getpixel((x, y))
            row.append(str(quantize(value)))
        rows.append("".join(row))
    return rows


def quantize(value):
    return 1 if value >= 96 else 0


if __name__ == "__main__":
    main()
