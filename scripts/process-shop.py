#!/usr/bin/env python3
"""Normaliseer fles-shots: witte achtergrond wegsnijden + alle flessen op identieke
hoogte centreren op een uniform transparant canvas. Lost 'witte bg' + 'ingezoomd' op.
Plus: merkillustratie (tuinmanshuisje + boom) downscalen naar web-webp met alpha."""
from PIL import Image
from collections import deque
import os, shutil, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WDIR = os.path.join(ROOT, "public/echt/wijnen")
BACK = os.path.join(ROOT, "_work/wijnen-orig")
os.makedirs(BACK, exist_ok=True)

WINES = ["moestuin","de-twi-gemete","tuin-van-zeeland","hof-triton","de-zes-oxhoofden",
         "de-bogerd","clos-driehoek","tritons-hofjuweel","blanc-de-blancs","rose-brut",
         "tuin-van-zeeland-brut"]

CANVAS_W, CANVAS_H = 640, 1320
TARGET_H = 1180          # uniforme fleshoogte
MAXFRAC_W = 0.90         # max breedte t.o.v. canvas

def key_white(im, thr=224):
    """Flood-fill vanaf de 4 hoeken over (bijna-)witte, verbonden pixels -> transparant.
    Interieur (label, glas-highlights) blijft want dat is omsloten door donkerder glas."""
    px = im.load(); w, h = im.size
    def white(p): return p[0] >= thr and p[1] >= thr and p[2] >= thr
    seen = bytearray(w*h)
    dq = deque()
    for c in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]:
        if white(px[c]):
            dq.append(c); seen[c[1]*w+c[0]] = 1
    while dq:
        x, y = dq.popleft()
        r,g,b,a = px[x,y]; px[x,y] = (r,g,b,0)
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and white(px[nx,ny]):
                seen[ny*w+nx] = 1; dq.append((nx,ny))
    return im

def process(name):
    p = os.path.join(WDIR, name + ".webp")
    shutil.copy2(p, os.path.join(BACK, name + ".webp"))
    im = Image.open(p).convert("RGBA")
    if im.getextrema()[3][0] >= 250:        # geen alpha -> witte bg
        im = key_white(im)
    bbox = im.split()[3].getbbox()
    if not bbox:
        print("  !! geen inhoud:", name); return
    im = im.crop(bbox)
    bw, bh = im.size
    scale = TARGET_H / bh
    if bw*scale > CANVAS_W*MAXFRAC_W:
        scale = (CANVAS_W*MAXFRAC_W) / bw
    nw, nh = max(1, round(bw*scale)), max(1, round(bh*scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0,0,0,0))
    canvas.paste(im, ((CANVAS_W-nw)//2, (CANVAS_H-nh)//2), im)
    canvas.save(p, "WEBP", quality=90, method=6)
    print(f"  ok {name:24} fles {nw}x{nh} -> canvas {CANVAS_W}x{CANVAS_H}")

print("Flessen normaliseren:")
for w in WINES:
    process(w)

# Podcastpakket (rij flessen): alleen witte bg wegsnijden, verhouding behouden.
for extra in ["podcast-pakket"]:
    p = os.path.join(WDIR, extra + ".webp")
    if os.path.exists(p):
        shutil.copy2(p, os.path.join(BACK, extra + ".webp"))
        im = Image.open(p).convert("RGBA")
        if im.getextrema()[3][0] >= 250:
            im = key_white(im)
        bb = im.split()[3].getbbox()
        if bb: im = im.crop(bb)
        im.save(p, "WEBP", quality=90, method=6)
        print(f"  ok {extra} (bijgesneden, transparant)")

# Merkillustratie -> web-webp met alpha (getrimd + gedownscaled).
ILSRC = os.path.join(ROOT, "_work/illu/Illustratie-logoCOLOR-01.png")
if os.path.exists(ILSRC):
    il = Image.open(ILSRC).convert("RGBA")
    bb = il.split()[3].getbbox()
    if bb: il = il.crop(bb)
    MAXW = 1500
    if il.size[0] > MAXW:
        r = MAXW / il.size[0]
        il = il.resize((MAXW, round(il.size[1]*r)), Image.LANCZOS)
    out = os.path.join(ROOT, "public/echt/illustratie.webp")
    il.save(out, "WEBP", quality=82, method=6)
    print(f"  illustratie -> {il.size[0]}x{il.size[1]}  ({os.path.getsize(out)//1024} kB)")
