#!/usr/bin/env python3
"""
DePaul Chess Club - weekly poster + Reel caption generator.

Usage:
  python3 generate_poster.py                 # poster for the upcoming Thursday (today if Thursday)
  python3 generate_poster.py --date 2026-09-24
  python3 generate_poster.py --out ./out

Outputs (into --out, default ./out):
  poster.png   1080x1350 Instagram poster
  caption.txt  copy-paste Reel/post caption

Edit the TEMPLATE block below to restyle. No dependencies beyond Pillow.
"""
import argparse
from datetime import date, datetime, timedelta
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---------------- TEMPLATE ----------------
TEMPLATE = {
    "club_name": "DEPAUL CHESS CLUB",
    "day": "THURSDAY",
    "time": "6:00 - 7:30 PM",
    "place": "ARTS & LETTERS HALL - ROOM 412",
    "tagline": "BOARDS PROVIDED - ALL SKILL LEVELS WELCOME",
    "first_meeting": date(2026, 9, 10),   # week 1
    "weekday": 3,                          # Thursday (Mon=0)
    "size": (1080, 1350),
    "colors": {
        "bg": "#F6F1E7",        # warm paper
        "ink": "#181510",       # near-black
        "accent": "#7A1F1A",    # oxblood red
        "rule": "#181510",
    },
    "fonts": {
        "black": "/usr/share/fonts/truetype/noto/NotoSans-Black.ttf",
        "bold": "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
        "medium": "/usr/share/fonts/truetype/noto/NotoSans-Medium.ttf",
        "glyph": "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    },
    "knight": "♞",
}


COLORWAYS = {
    "classic": {"bg": "#F6F1E7", "ink": "#181510", "accent": "#7A1F1A", "rule": "#181510"},
    "depaul":  {"bg": "#005EB8", "ink": "#FFFFFF", "accent": "#DA291C", "rule": "#FFFFFF"},
}

CAPTION = """WEEK {week} - DePaul Chess Club meets this Thursday, {date_str}, 6:00-7:30 PM in Arts and Letters Hall room 412. Boards are provided and all skill levels are welcome - first-timers to rated players. Just show up.

#DePaul #DePaulUniversity #DePaulChess #ChessClub #Chess #ChicagoChess #CollegeChess #ChessLife #LincolnPark #BlueDemons
"""
# ------------------------------------------


def next_meeting(today: date, weekday: int) -> date:
    delta = (weekday - today.weekday()) % 7
    return today + timedelta(days=delta)


def week_number(meeting: date, first: date) -> int:
    return max(1, (meeting - first).days // 7 + 1)


def tracked(draw, xy, text, font, fill, tracking=0, anchor="mm"):
    """Draw letter-spaced text centered at xy (anchor=mm)."""
    x, y = xy
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    cx = x - total / 2
    for ch, w in zip(text, widths):
        draw.text((cx, y), ch, font=font, fill=fill, anchor="lm")
        cx += w + tracking


def render(meeting: date, week: int, t: dict, outdir: Path, args_colorway="classic"):
    W, H = t["size"]
    c = t["colors"]
    img = Image.new("RGB", (W, H), c["bg"])
    d = ImageDraw.Draw(img)
    F = {k: ImageFont.truetype(v, 100) for k, v in t["fonts"].items()}

    def font(kind, size):
        return F[kind].font_variant(size=size)

    ink, accent = c["ink"], c["accent"]
    margin = 56

    # frame
    d.rectangle([margin, margin, W - margin, H - margin], outline=c["rule"], width=3)

    # knight mark in a ring
    cy = 218
    d.ellipse([W/2 - 96, cy - 96, W/2 + 96, cy + 96], outline=ink, width=4)
    d.text((W/2, cy - 6), t["knight"], font=font("glyph", 128), fill=ink, anchor="mm")

    # club name, letter-spaced
    tracked(d, (W/2, 400), t["club_name"], font("medium", 40), ink, tracking=14)

    # thin rule
    d.line([W/2 - 260, 448, W/2 + 260, 448], fill=c["rule"], width=2)

    # WEEK N (accent)
    d.text((W/2, 560), f"WEEK {week:02d}", font=font("black", 118), fill=accent, anchor="mm")

    # THURSDAY (giant ink) + date
    d.text((W/2, 712), t["day"], font=font("black", 132), fill=ink, anchor="mm")
    d.text((W/2, 830), meeting.strftime("%B %-d, %Y").upper(), font=font("medium", 44), fill=ink, anchor="mm")

    # time + place
    d.text((W/2, 940), t["time"], font=font("bold", 66), fill=ink, anchor="mm")
    d.text((W/2, 1030), t["place"], font=font("medium", 40), fill=ink, anchor="mm")

    # checker strip
    sq, y0 = 56, 1120
    x0 = W/2 - 4 * sq
    for i in range(8):
        fill = ink if i % 2 == 0 else c["bg"]
        d.rectangle([x0 + i*sq, y0, x0 + (i+1)*sq, y0 + sq], fill=fill, outline=ink, width=2)

    # tagline
    tracked(d, (W/2, 1240), t["tagline"], font("medium", 28), ink, tracking=5)

    name = "poster.png" if args_colorway == "classic" else f"poster-{args_colorway}.png"
    out = outdir / name
    img.save(out)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", help="meeting date YYYY-MM-DD (default: upcoming Thursday)")
    ap.add_argument("--out", default="./out")
    ap.add_argument("--colorway", choices=list(COLORWAYS), default="classic")
    args = ap.parse_args()
    t = dict(TEMPLATE)

    if args.date:
        meeting = datetime.strptime(args.date, "%Y-%m-%d").date()
        assert meeting.weekday() == t["weekday"], "that date is not a Thursday"
    else:
        meeting = next_meeting(date.today(), t["weekday"])

    t["colors"] = COLORWAYS[args.colorway]
    week = week_number(meeting, t["first_meeting"])
    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)

    poster = render(meeting, week, t, outdir, args.colorway)
    caption = outdir / "caption.txt"
    caption.write_text(CAPTION.format(week=week, date_str=meeting.strftime("%B %-d")))

    print(f"poster:  {poster}  (WEEK {week:02d}, {meeting:%A %B %-d, %Y})")
    print(f"caption: {caption}")


if __name__ == "__main__":
    main()
