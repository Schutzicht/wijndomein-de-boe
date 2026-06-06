#!/usr/bin/env python3
"""Verwerk de echte aangeleverde beelden tot nette web-assets in public/echt/."""
import os
from PIL import Image, ImageDraw

SRC = "public/Input voor wijndomein de boe"
OUT = "public/echt"
os.makedirs(OUT, exist_ok=True)

def make_logo(src, dst):
    """Logo: bestaande transparantie behouden; alleen als het volledig dekkend is
    (witte achtergrond) de witte achtergrond wegfilteren. Nooit alfa kapotmaken."""
    im = Image.open(src).convert("RGBA")
    alpha_min = im.getextrema()[3][0]
    if alpha_min >= 250:  # geen transparantie aanwezig -> wit wegsnijden
        px = im.load(); w, h = im.size
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if r > 236 and g > 236 and b > 236:
                    px[x, y] = (r, g, b, 0)
    im.save(dst)
    print("logo ->", dst, im.size, "alpha_min was", alpha_min)

def floodfill_bg(src, dst, thresh=42):
    """Object op witte achtergrond -> witte achtergrond transparant (vanaf de randen)."""
    im = Image.open(src).convert("RGBA")
    if im.getextrema()[3][0] < 250:
        # heeft al transparantie -> ongemoeid laten
        im.save(dst); print("fles -> (al transparant)", dst, im.size); return
    w, h = im.size
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for s in seeds:
        try:
            ImageDraw.floodfill(im, s, (0, 0, 0, 0), thresh=thresh)
        except Exception as e:
            print("floodfill skip", s, e)
    im.save(dst)
    print("fles ->", dst, im.size)

def copy_resave(src, dst):
    im = Image.open(src).convert("RGB")
    im.save(dst, quality=88)
    print("copy ->", dst, im.size)

make_logo(f"{SRC}/het logo van wijndomein de boe.webp", f"{OUT}/logo.png")
floodfill_bg(f"{SRC}/de fles van met echte logo en label Wijndomein-De-Boe-moestuin-276x1024.png", f"{OUT}/fles-moestuin.png")
copy_resave(f"{SRC}/de glazen van wijndomein de boe incl logo.webp", f"{OUT}/glazen.jpg")
copy_resave(f"{SRC}/wijngaard in zeeland met boer die plukt.webp", f"{OUT}/wijnboer.jpg")
print("klaar")
