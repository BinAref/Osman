import sys, glob, os
from PIL import Image, ImageDraw
src, out, pattern = sys.argv[1], sys.argv[2], sys.argv[3]
H = int(sys.argv[4]) if len(sys.argv) > 4 else 200
fs = sorted(glob.glob(os.path.join(src, pattern)))
W = 1500; x = y = 0; tiles = []
for f in fs:
    im = Image.open(f).convert('RGB'); s = H / im.height
    nw = int(im.width * s)
    if nw > W: s = W / im.width; nw = W
    im = im.resize((nw, int(im.height * s)))
    if x + im.width > W: x = 0; y += H + 26
    tiles.append((f, im, x, y)); x += im.width + 8
sheet = Image.new('RGB', (W, y + H + 30), (200, 205, 210)); d = ImageDraw.Draw(sheet)
for f, im, x, y in tiles:
    sheet.paste(im, (x, y + 20)); d.text((x + 2, y + 4), os.path.basename(f)[:-4], fill=(200, 0, 0))
sheet.save(out, quality=82); print(out, sheet.size, len(fs))
