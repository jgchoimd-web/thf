import json
from pathlib import Path


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

CHOSEONG = [
    "g", "gg", "n", "d", "dd", "r", "m", "b", "bb", "s",
    "ss", "ng", "j", "jj", "ch", "k", "t", "p", "h",
]

JUNGSEONG = [
    "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
    "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
]

JONGSEONG = [
    "", "g", "gg", "gs", "n", "nj", "nh", "d", "r", "rg",
    "rm", "rb", "rs", "rt", "rp", "rh", "m", "b", "bs", "s",
    "ss", "ng", "j", "ch", "k", "t", "p", "h",
]

JAMO_KEYS = {
    **dict(zip([chr(code) for code in range(0x3131, 0x314F)], [
        "g", "gg", "gs", "n", "nj", "nh", "d", "dd", "r", "rg", "rm", "rb", "rs", "rt", "rp", "rh",
        "m", "b", "bb", "bs", "s", "ss", "ng", "j", "jj", "ch", "k", "t", "p", "h",
    ])),
    **dict(zip([chr(code) for code in range(0x314F, 0x3164)], JUNGSEONG)),
}

ASCII = {
    " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
    "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
    "\"": ["01010", "01010", "00000", "00000", "00000", "00000", "00000"],
    "#": ["01010", "11111", "01010", "01010", "11111", "01010", "01010"],
    "$": ["00100", "11110", "10100", "11110", "00101", "11110", "00100"],
    "%": ["11001", "11010", "00100", "01000", "10110", "00110", "00000"],
    "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
    "'": ["00100", "00100", "00000", "00000", "00000", "00000", "00000"],
    "(": ["00010", "00100", "01000", "01000", "01000", "00100", "00010"],
    ")": ["01000", "00100", "00010", "00010", "00010", "00100", "01000"],
    "*": ["00000", "10101", "01110", "00100", "01110", "10101", "00000"],
    "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
    ",": ["00000", "00000", "00000", "00000", "00100", "00100", "01000"],
    "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
    "/": ["00001", "00010", "00100", "01000", "10000", "00000", "00000"],
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
    "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
    "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
    "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
    ":": ["00000", "00100", "00100", "00000", "00100", "00100", "00000"],
    ";": ["00000", "00100", "00100", "00000", "00100", "00100", "01000"],
    "<": ["00010", "00100", "01000", "10000", "01000", "00100", "00010"],
    "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
    ">": ["01000", "00100", "00010", "00001", "00010", "00100", "01000"],
    "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
    "@": ["01110", "10001", "10111", "10101", "10111", "10000", "01110"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
    "J": ["00001", "00001", "00001", "00001", "10001", "10001", "01110"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "W": ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
    "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
}

for char in "abcdefghijklmnopqrstuvwxyz":
    ASCII[char] = ASCII[char.upper()]

for char, rows in {
    "[": ["01110", "01000", "01000", "01000", "01000", "01000", "01110"],
    "\\": ["10000", "01000", "00100", "00010", "00001", "00000", "00000"],
    "]": ["01110", "00010", "00010", "00010", "00010", "00010", "01110"],
    "^": ["00100", "01010", "10001", "00000", "00000", "00000", "00000"],
    "_": ["00000", "00000", "00000", "00000", "00000", "00000", "11111"],
    "`": ["01000", "00100", "00000", "00000", "00000", "00000", "00000"],
    "{": ["00010", "00100", "00100", "01000", "00100", "00100", "00010"],
    "|": ["00100", "00100", "00100", "00100", "00100", "00100", "00100"],
    "}": ["01000", "00100", "00100", "00010", "00100", "00100", "01000"],
    "~": ["00000", "00000", "01001", "10110", "00000", "00000", "00000"],
}.items():
    ASCII[char] = rows

SYMBOLS = {
    "♥": ["00000000", "01100110", "11111111", "11111111", "01111110", "00111100", "00011000", "00000000", "00000000"],
    "♡": ["00000000", "01100110", "10011001", "10000001", "01000010", "00100100", "00011000", "00000000", "00000000"],
    "★": ["00011000", "00011000", "11111111", "00111100", "01111110", "01011010", "10000001", "00000000", "00000000"],
    "☆": ["00011000", "00100100", "11000011", "00111100", "01000010", "10011001", "00000000", "00000000", "00000000"],
    "♪": ["00001100", "00001100", "00001111", "00001001", "01111001", "11110000", "01100000", "00000000", "00000000"],
    "☺": ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100", "00000000"],
    "☹": ["00111100", "01000010", "10100101", "10000001", "10011001", "10100101", "01000010", "00111100", "00000000"],
    "☀": ["10011001", "01011010", "00111100", "11111111", "00111100", "01011010", "10011001", "00000000", "00000000"],
    "☁": ["00000000", "00011000", "00111100", "01111110", "11111111", "11111111", "00000000", "00000000", "00000000"],
    "☂": ["00011000", "01111110", "11111111", "00011000", "00011000", "10011000", "01110000", "00000000", "00000000"],
    "☃": ["00011000", "00111100", "00011000", "01111110", "01011010", "01111110", "00100100", "00000000", "00000000"],
    "😀": ["00111100", "01000010", "10100101", "10000001", "10111101", "10000001", "01000010", "00111100", "00000000"],
    "😂": ["10100101", "00111100", "01000010", "10111101", "10000001", "01011010", "00111100", "00000000", "00000000"],
    "😉": ["00111100", "01000010", "10100001", "10000101", "10111101", "10000001", "01000010", "00111100", "00000000"],
    "😍": ["00111100", "01000010", "10100101", "10000001", "10111101", "10111101", "01000010", "00111100", "00000000"],
    "😎": ["00111100", "01000010", "11111111", "10000001", "10111101", "10000001", "01000010", "00111100", "00000000"],
    "😢": ["00111100", "01000010", "10100101", "10000001", "10011001", "10100101", "01010010", "00111100", "00000000"],
    "😡": ["00111100", "01000010", "10011001", "10100101", "10000001", "10111101", "01000010", "00111100", "00000000"],
    "👍": ["00010000", "00110000", "01111110", "11111111", "11111110", "01111110", "00111100", "00000000", "00000000"],
    "👎": ["00111100", "01111110", "11111110", "11111111", "01111110", "00110000", "00010000", "00000000", "00000000"],
}


def main():
    glyphs = {}

    for codepoint in range(ASCII_START, ASCII_END + 1):
        char = chr(codepoint)
        glyphs[char] = center(ASCII.get(char, ASCII["?"]))

    for codepoint in range(JAMO_START, JAMO_END + 1):
        char = chr(codepoint)
        glyphs[char] = make_jamo(char)

    for codepoint in range(HANGUL_START, HANGUL_END + 1):
        glyphs[chr(codepoint)] = make_hangul(codepoint)

    for char, rows in SYMBOLS.items():
        glyphs[char] = rows

    font = {
        "name": "THF Original",
        "version": "0.5.0",
        "cellWidth": WIDTH,
        "cellHeight": HEIGHT,
        "advance": WIDTH + 1,
        "levels": LEVELS,
        "fallback": "?",
        "generatedHangulSyllables": HANGUL_END - HANGUL_START + 1,
        "supportedAsciiRange": "U+0020-U+007E",
        "supportedJamoRange": "U+3131-U+3163",
        "supportedEmojiCodepoints": [f"U+{ord(char):X}" for char in SYMBOLS],
        "sourceFont": None,
        "rendering": "hand-authored monochrome bitmap patterns and Hangul composition rules",
        "glyphs": glyphs,
    }

    FONT_PATH.parent.mkdir(parents=True, exist_ok=True)
    FONT_PATH.write_text(json.dumps(font, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def make_hangul(codepoint):
    index = codepoint - HANGUL_START
    initial = CHOSEONG[index // (21 * 28)]
    medial = JUNGSEONG[(index % (21 * 28)) // 28]
    final = JONGSEONG[index % 28]
    rows = blank()

    draw_initial(rows, initial, final != "")
    draw_medial(rows, medial, final != "")
    if final:
        draw_final(rows, final)

    return serialize(rows)


def make_jamo(char):
    key = JAMO_KEYS.get(char)
    rows = blank()
    if key in CHOSEONG or key in JONGSEONG:
        draw_initial(rows, key, False, y_offset=2)
    elif key in JUNGSEONG:
        draw_medial(rows, key, False)
    return serialize(rows)


def draw_initial(rows, key, has_final, y_offset=0):
    bottom = 3 if has_final else 4
    y0 = y_offset
    y1 = min(HEIGHT - 1, y_offset + bottom)
    if key in {"g", "gg", "k"}:
        hline(rows, 1, 5, y0)
        vline(rows, 5, y0, y1)
        if key in {"gg", "k"}:
            hline(rows, 2, 5, y0 + 2)
    elif key in {"n"}:
        vline(rows, 1, y0, y1)
        hline(rows, 1, 5, y1)
    elif key in {"d", "dd", "t"}:
        hline(rows, 1, 5, y0)
        vline(rows, 1, y0, y1)
        hline(rows, 1, 5, y1)
        if key in {"dd", "t"}:
            hline(rows, 1, 5, y0 + 2)
    elif key.startswith("r"):
        hline(rows, 1, 5, y0)
        hline(rows, 2, 5, y0 + 2)
        vline(rows, 1, y0 + 2, y1)
        hline(rows, 1, 5, y1)
    elif key == "m":
        box(rows, 1, y0, 5, y1)
    elif key in {"b", "bb", "p"}:
        vline(rows, 1, y0, y1)
        vline(rows, 5, y0, y1)
        hline(rows, 1, 5, y0 + 2)
        hline(rows, 1, 5, y1)
        if key in {"bb", "p"}:
            hline(rows, 1, 5, y0)
    elif key in {"s", "ss"}:
        point(rows, 3, y0)
        diag(rows, 3, y0 + 1, 1, y1)
        diag(rows, 3, y0 + 1, 5, y1)
        if key == "ss":
            point(rows, 2, y0)
            point(rows, 4, y0)
    elif key == "ng":
        box(rows, 2, y0, 5, y1)
    elif key in {"j", "jj", "ch"}:
        hline(rows, 1, 5, y0)
        point(rows, 3, y0 + 1)
        diag(rows, 3, y0 + 2, 1, y1)
        diag(rows, 3, y0 + 2, 5, y1)
        if key in {"jj", "ch"}:
            hline(rows, 2, 4, y0 - 1 if y0 > 0 else y0 + 1)
    elif key == "h":
        hline(rows, 2, 4, y0)
        box(rows, 2, y0 + 2, 5, y1)
    elif key in {"gs", "nj", "nh", "rg", "rm", "rb", "rs", "rt", "rp", "rh", "bs"}:
        draw_initial(rows, key[0], has_final, y_offset)
        point(rows, 6, y1)


def draw_medial(rows, key, has_final):
    bottom = 6 if has_final else 8
    if key in {"a", "ae", "ya", "yae", "i"}:
        vline(rows, 6, 1, bottom)
        if key in {"a", "ae", "ya", "yae"}:
            hline(rows, 4, 6, 3)
        if key in {"ya", "yae"}:
            hline(rows, 4, 6, 5)
        if key in {"ae", "yae"}:
            vline(rows, 4, 1, bottom)
    elif key in {"eo", "e", "yeo", "ye"}:
        vline(rows, 1, 1, bottom)
        hline(rows, 1, 3, 3)
        if key in {"yeo", "ye"}:
            hline(rows, 1, 3, 5)
        if key in {"e", "ye"}:
            vline(rows, 3, 1, bottom)
    elif key in {"o", "yo"}:
        hline(rows, 1, 6, 5 if has_final else 6)
        vline(rows, 3, 3, 5 if has_final else 6)
        if key == "yo":
            vline(rows, 2, 3, 5 if has_final else 6)
            vline(rows, 4, 3, 5 if has_final else 6)
    elif key in {"u", "yu", "eu"}:
        hline(rows, 1, 6, 4 if has_final else 5)
        if key in {"u", "yu"}:
            vline(rows, 3, 4 if has_final else 5, 6 if has_final else 8)
        if key == "yu":
            vline(rows, 2, 4 if has_final else 5, 6 if has_final else 8)
            vline(rows, 4, 4 if has_final else 5, 6 if has_final else 8)
    else:
        draw_medial(rows, "o" if key in {"wa", "wae", "oe"} else "u", has_final)
        vline(rows, 6, 1, bottom)
        if key in {"wa", "wae", "wo", "we"}:
            hline(rows, 4, 6, 3)
        if key in {"wae", "we", "ui"}:
            vline(rows, 4, 2, bottom)


def draw_final(rows, key):
    y0, y1 = 7, 8
    if key in {"g", "gg", "k"}:
        hline(rows, 1, 6, y0)
        vline(rows, 6, y0, y1)
    elif key in {"n"}:
        vline(rows, 1, y0, y1)
        hline(rows, 1, 6, y1)
    elif key in {"d", "t"}:
        hline(rows, 1, 6, y0)
        hline(rows, 1, 6, y1)
        vline(rows, 1, y0, y1)
    elif key.startswith("r"):
        hline(rows, 1, 6, y0)
        hline(rows, 1, 6, y1)
    elif key in {"m", "ng"}:
        box(rows, 2, y0, 5, y1)
    elif key in {"b", "p"}:
        vline(rows, 1, y0, y1)
        vline(rows, 6, y0, y1)
        hline(rows, 1, 6, y1)
    elif key in {"s", "ss", "j", "ch", "h"}:
        point(rows, 3, y0)
        point(rows, 2, y1)
        point(rows, 4, y1)
    else:
        hline(rows, 1, 6, y1)


def center(pattern):
    rows = blank()
    h = len(pattern)
    w = len(pattern[0])
    ox = (WIDTH - w) // 2
    oy = (HEIGHT - h) // 2
    for y, row in enumerate(pattern):
        for x, value in enumerate(row):
            if value == "1":
                point(rows, ox + x, oy + y)
    return serialize(rows)


def blank():
    return [[0 for _ in range(WIDTH)] for _ in range(HEIGHT)]


def serialize(rows):
    return ["".join(str(value) for value in row) for row in rows]


def point(rows, x, y):
    if 0 <= x < WIDTH and 0 <= y < HEIGHT:
        rows[y][x] = 1


def hline(rows, x0, x1, y):
    for x in range(min(x0, x1), max(x0, x1) + 1):
        point(rows, x, y)


def vline(rows, x, y0, y1):
    for y in range(min(y0, y1), max(y0, y1) + 1):
        point(rows, x, y)


def box(rows, x0, y0, x1, y1):
    hline(rows, x0, x1, y0)
    hline(rows, x0, x1, y1)
    vline(rows, x0, y0, y1)
    vline(rows, x1, y0, y1)


def diag(rows, x0, y0, x1, y1):
    steps = max(abs(x1 - x0), abs(y1 - y0), 1)
    for step in range(steps + 1):
        x = round(x0 + (x1 - x0) * step / steps)
        y = round(y0 + (y1 - y0) * step / steps)
        point(rows, x, y)


if __name__ == "__main__":
    main()
