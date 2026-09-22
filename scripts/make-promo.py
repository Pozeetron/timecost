#!/usr/bin/env python3
"""Compose Google Play promo images from screenshots + captions."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "gp_content"
SHOTS = ROOT / "screenshots"
OUT = ROOT / "promo"

W, H = 1080, 1920
BG_TOP = (232, 245, 243)
BG_BOTTOM = (245, 247, 250)
TEAL = (13, 148, 136)
TEAL_DARK = (15, 118, 110)
TEXT = (26, 35, 50)
MUTED = (90, 106, 126)
WHITE = (255, 255, 255)

PROMO = [
    ("01-main-result.png", "01-see-time-cost.png", "See purchases in hours of work", "Know what things really cost you"),
    ("02-settings.png", "02-flexible-rates.png", "Hour, day, or week — your rate", "Set the way you actually get paid"),
    ("03-onboarding-currency.png", "03-your-currency.png", "Works in your currency", "Choose from dozens of popular currencies"),
    ("04-onboarding-rate.png", "04-quick-setup.png", "Set up in under a minute", "Just your rate — then start converting"),
    ("05-large-purchase.png", "05-big-decisions.png", "Big buys, clear decisions", "See weeks and months of work at a glance"),
]


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFNS.ttf",
    ]
    for path in candidates:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def gradient_bg(size):
    img = Image.new("RGB", size, BG_BOTTOM)
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        t = y / max(size[1] - 1, 1)
        r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return mask


def wrap_text(draw, text, fnt, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textlength(test, font=fnt) <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def compose(shot_name, out_name, title, subtitle):
    canvas = gradient_bg((W, H))
    draw = ImageDraw.Draw(canvas)

    title_font = font(54, bold=True)
    sub_font = font(30, bold=False)
    brand_font = font(22, bold=True)

    # brand
    draw.text((64, 56), "TIMECOST", font=brand_font, fill=TEAL)

    # title
    y = 110
    for line in wrap_text(draw, title, title_font, W - 128):
        draw.text((64, y), line, font=title_font, fill=TEXT)
        y += 64

    y += 8
    for line in wrap_text(draw, subtitle, sub_font, W - 128):
        draw.text((64, y), line, font=sub_font, fill=MUTED)
        y += 40

    # phone frame
    shot = Image.open(SHOTS / shot_name).convert("RGBA")
    frame_w = 820
    frame_h = int(frame_w * shot.height / shot.width)
    max_bottom = H - 80
    if y + 40 + frame_h > max_bottom:
        frame_h = max_bottom - (y + 40)
        frame_w = int(frame_h * shot.width / shot.height)

    shot = shot.resize((frame_w - 24, frame_h - 24), Image.Resampling.LANCZOS)

    frame = Image.new("RGBA", (frame_w, frame_h), (255, 255, 255, 255))
    frame_mask = rounded_mask((frame_w, frame_h), 48)
    # dark bezel
    bezel = Image.new("RGBA", (frame_w, frame_h), (26, 35, 50, 255))
    bezel.putalpha(frame_mask)

    inner = Image.new("RGBA", (frame_w - 24, frame_h - 24), WHITE)
    inner_mask = rounded_mask((frame_w - 24, frame_h - 24), 36)
    shot.putalpha(inner_mask)
    inner.paste(shot, (0, 0), shot)

    fx = (W - frame_w) // 2
    fy = y + 36
    canvas.paste(bezel, (fx, fy), bezel)
    canvas.paste(inner, (fx + 12, fy + 12), inner)

    # soft shadow under phone
    # already pasted; keep simple

    out_path = OUT / out_name
    canvas.convert("RGB").save(out_path, "PNG", optimize=True)
    print("wrote", out_path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for shot, out, title, subtitle in PROMO:
        compose(shot, out, title, subtitle)


if __name__ == "__main__":
    main()
