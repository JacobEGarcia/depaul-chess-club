# DePaul Chess Club

Club site + weekly poster generator.

**Live site:** https://jacobegarcia.github.io/depaul-chess-club/

## Weekly routine (under a minute)

```bash
python3 generate_poster.py          # makes poster.png + caption.txt for the upcoming Thursday
python3 generate_poster.py --date 2026-09-24   # or a specific Thursday
```

1. Run the generator.
2. Post `out/poster.png` (1080x1350) to Instagram.
3. Paste `out/caption.txt` as the Reel/post caption.
4. Optional: copy the new `poster.png` over the repo's `poster.png` and push to refresh the site's "this week" poster.

Week numbers count from the first meeting (Sep 10, 2026 = Week 01).
Restyle by editing the `TEMPLATE` block at the top of `generate_poster.py` (colors, fonts, text, tagline).

## Files

- `index.html` - the whole site, no dependencies
- `generate_poster.py` - poster + caption generator (needs only Pillow)
- `poster.png` - current week's poster, shown on the site
- `caption.txt` - current week's caption

## 3D variants (three.js)

- `3d.html` - The Arena: full 3D set (cream vs DePaul royal) on a turntable, scarlet hero knight monument
- `3d-monolith.html` - The Knight: monumental scarlet knight on a royal pedestal, orbit camera, pawn ring
- `3d-play.html` - Pick a Piece: interactive board - hover lifts a piece, click it for club info (each piece answers a question)

Pieces are modeled procedurally in `pieces.js` (lathe + primitive construction, no external assets). three.js r128 is vendored at `vendor/three.min.js` so everything works offline/static.

## Mascot variant

- `3d-vinny.html` - VINNY: the club's blue demon mascot (Blender-built, `vinny.glb`), standing on a royal pedestal with a cream/royal back-rank guard of honor. He holds a scarlet knight. Front-arc camera sweep, idle bounce. Loads `vinny.glb` via vendored GLTFLoader (needs HTTP serving, like all GLB pages - fine on GitHub Pages).

`vinny.glb` was modeled procedurally in Blender 3.6 headless (32 parts: chibi demon body, horns, ears, grin, goatee, tail with scarlet spade, raised arm holding a scarlet knight).
