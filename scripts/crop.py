"""Crop every render / drawing / photo out of the flattened portfolio pages.
Boxes are in native page pixels (pages are 1190x841 @72dpi, 2480x1754 @150dpi, 2381x1683 @144dpi).
kind: r = render/photo (gets super-resolution), d = drawing (kept crisp, background whitened)."""
import os, sys, json
import numpy as np
from PIL import Image

P = 'assets-src/pages/'
C = {
 # Mixed-use residential complex (6 towers)
 'mrc-site-plan':   ('p-003-002.jpg', (109, 158, 851, 1440), 'd'),
 'mrc-street':      ('p-003-002.jpg', (1128, 284, 1200, 532), 'r'),
 'mrc-shop-plan':   ('p-003-002.jpg', (1392, 1126, 755, 498), 'd'),
 'mrc-section-n':   ('p-004-003.jpg', (144, 128, 1229, 585), 'd'),
 'mrc-floor-plan':  ('p-004-003.jpg', (1696, 67, 544, 725), 'd'),
 'mrc-section-e':   ('p-004-003.jpg', (51, 944, 2307, 685), 'd'),
 'mrc-aerial':      ('p-005-004.jpg', (194, 15, 802, 811), 'r'),
 'mrc-night-a':     ('p-006-005.jpg', (123, 0, 948, 458), 'r'),
 'mrc-night-b':     ('p-006-005.jpg', (123, 459, 948, 382), 'r'),
 # Residential & commercial complex (mall + 3 towers)
 'rcc-mall-g':      ('p-008-007.jpg', (100, 64, 768, 655), 'd'),
 'rcc-mall-1':      ('p-008-007.jpg', (1664, 71, 761, 655), 'd'),
 'rcc-mall-site':   ('p-008-007.jpg', (704, 440, 1035, 841), 'd'),
 'rcc-mall-2':      ('p-008-007.jpg', (80, 973, 784, 650), 'd'),
 'rcc-mall-3':      ('p-008-007.jpg', (1648, 944, 792, 669), 'd'),
 'rcc-legend':      ('p-008-007.jpg', (955, 1432, 730, 300), 'd'),
 'rcc-base-1':      ('p-009-008.jpg', (216, 206, 567, 480), 'd'),
 'rcc-base-2':      ('p-009-008.jpg', (945, 206, 569, 482), 'd'),
 'rcc-base-3':      ('p-009-008.jpg', (1704, 206, 574, 482), 'd'),
 'rcc-apt-low-mix': ('p-009-008.jpg', (214, 1047, 516, 648), 'd'),
 'rcc-apt-low':     ('p-009-008.jpg', (735, 1047, 502, 648), 'd'),
 'rcc-apt-high-mix':('p-009-008.jpg', (1286, 1047, 483, 648), 'd'),
 'rcc-apt-high':    ('p-009-008.jpg', (1774, 1047, 516, 648), 'd'),
 'rcc-off-g':       ('p-010-009.jpg', (15, 252, 579, 427), 'd'),
 'rcc-off-1-4':     ('p-010-009.jpg', (610, 252, 578, 427), 'd'),
 'rcc-off-5-9':     ('p-010-009.jpg', (1206, 249, 581, 433), 'd'),
 'rcc-off-10-12':   ('p-010-009.jpg', (17, 754, 582, 432), 'd'),
 'rcc-off-13':      ('p-010-009.jpg', (616, 754, 580, 432), 'd'),
 'rcc-off-14':      ('p-010-009.jpg', (1210, 754, 579, 432), 'd'),
 'rcc-off-15':      ('p-010-009.jpg', (20, 1262, 582, 432), 'd'),
 'rcc-off-16-21':   ('p-010-009.jpg', (619, 1263, 582, 431), 'd'),
 'rcc-off-22':      ('p-010-009.jpg', (1218, 1263, 582, 431), 'd'),
 'rcc-section':     ('p-010-009.jpg', (1829, 1034, 637, 640), 'd'),
 'rcc-off-render':  ('p-010-009.jpg', (1882, 337, 538, 399), 'r'),
 'rcc-night':       ('p-011-010.jpg', (271, 83, 649, 610), 'r'),
 'rcc-day':         ('p-012-011.jpg', (39, 114, 685, 646), 'r'),
 'rcc-night-2':     ('p-012-011.jpg', (771, 100, 342, 321), 'r'),
 'rcc-aerial':      ('p-012-011.jpg', (769, 461, 350, 331), 'r'),
 # Senior living village (diploma)
 'slv-sheet-a':     ('p-014-013.jpg', (0, 0, 1190, 841), 'd'),
 'slv-site-plan':   ('p-014-013.jpg', (704, 195, 462, 634), 'r'),
 'slv-concept':     ('p-014-013.jpg', (640, 10, 545, 170), 'd'),
 'slv-dorm-1':      ('p-015-014.jpg', (40, 135, 1180, 520), 'd'),
 'slv-dorm-2':      ('p-015-014.jpg', (40, 690, 1180, 560), 'd'),
 'slv-dorm-3':      ('p-015-014.jpg', (40, 1250, 1180, 470), 'd'),
 'slv-health':      ('p-015-014.jpg', (1260, 140, 1200, 520), 'd'),
 'slv-admin':       ('p-015-014.jpg', (1260, 690, 1200, 560), 'd'),
 'slv-services':    ('p-015-014.jpg', (1260, 1320, 1200, 400), 'd'),
 'slv-aerial':      ('p-016-015.jpg', (0, 146, 1190, 646), 'r'),
 'slv-r1':          ('p-017-016.jpg', (29, 14, 1160, 828), 'r'),
 'slv-r2':          ('p-017-016.jpg', (1210, 17, 1156, 827), 'r'),
 'slv-r3':          ('p-017-016.jpg', (29, 887, 1159, 772), 'r'),
 'slv-r4':          ('p-017-016.jpg', (1205, 888, 1159, 771), 'r'),
 # Community center
 'cc-sketch-1':     ('p-019-018.jpg', (509, 0, 328, 198), 'r'),
 'cc-sketch-2':     ('p-019-018.jpg', (845, 0, 334, 195), 'r'),
 'cc-site-plan':    ('p-019-018.jpg', (540, 205, 636, 451), 'r'),
 'cc-model-1':      ('p-019-018.jpg', (508, 637, 263, 199), 'r'),
 'cc-model-2':      ('p-019-018.jpg', (856, 648, 276, 172), 'r'),
 'cc-plan-g':       ('p-020-019.jpg', (36, 0, 1132, 799), 'd'),
 'cc-plan-1':       ('p-020-019.jpg', (1326, 0, 1130, 795), 'd'),
 'cc-elev-a':       ('p-020-019.jpg', (33, 888, 1166, 780), 'd'),
 'cc-elev-b':       ('p-020-019.jpg', (1256, 878, 1200, 790), 'd'),
 'cc-aerial':       ('p-021-020.jpg', (17, 136, 1158, 617), 'r'),
 'cc-r1':           ('p-022-021.jpg', (16, 16, 596, 396), 'r'),
 'cc-r2':           ('p-022-021.jpg', (613, 94, 577, 303), 'r'),
 'cc-r3':           ('p-022-021.jpg', (4, 514, 396, 270), 'r'),
 'cc-r4':           ('p-022-021.jpg', (401, 479, 789, 341), 'r'),
 # Villa one
 'v1-section-a':    ('p-024-023.jpg', (684, 64, 506, 200), 'd'),
 'v1-section-b':    ('p-024-023.jpg', (684, 280, 506, 232), 'd'),
 'v1-site':         ('p-024-023.jpg', (4, 307, 296, 193), 'r'),
 'v1-massing':      ('p-024-023.jpg', (327, 349, 299, 113), 'r'),
 'v1-plan-render':  ('p-024-023.jpg', (94, 606, 357, 235), 'r'),
 'v1-plans':        ('p-024-023.jpg', (593, 575, 597, 266), 'd'),
 'v1-render':       ('p-025-024.jpg', (0, 136, 1190, 705), 'r'),
 # Villa two
 'v2-section-a':    ('p-027-026.jpg', (676, 60, 468, 199), 'd'),
 'v2-section-b':    ('p-027-026.jpg', (651, 280, 493, 232), 'd'),
 'v2-r1':           ('p-027-026.jpg', (19, 286, 517, 302), 'r'),
 'v2-r2':           ('p-027-026.jpg', (17, 602, 519, 239), 'r'),
 'v2-plans':        ('p-027-026.jpg', (613, 580, 577, 261), 'd'),
 # Facade design, residential complex (blocks A-D)
 'fac-plans':       ('p-029-028.jpg', (200, 40, 2169, 1660), 'd'),
 'fac-elevation':   ('p-030-029.jpg', (144, 114, 1138, 494), 'd'),
 'fac-site':        ('p-030-029.jpg', (1488, 42, 930, 716), 'd'),
 'fac-sec-n':       ('p-030-029.jpg', (200, 983, 916, 593), 'd'),
 'fac-sec-e':       ('p-030-029.jpg', (1309, 1015, 955, 582), 'd'),
 'fac-aerial':      ('p-031-030.jpg', (0, 0, 1190, 841), 'r'),
 'fac-street':      ('p-032-031.jpg', (0, 0, 1190, 841), 'r'),
 # Modern villa residences
 'mvr-plan-b':      ('p-034-033.jpg', (304, 64, 784, 656), 'd'),
 'mvr-plan-g':      ('p-034-033.jpg', (1408, 64, 885, 656), 'd'),
 'mvr-plan-1':      ('p-034-033.jpg', (256, 929, 871, 735), 'd'),
 'mvr-plan-r':      ('p-034-033.jpg', (1449, 929, 886, 735), 'd'),
 'mvr-site-sec':    ('p-035-034.jpg', (249, 104, 1963, 423), 'd'),
 'mvr-elev':        ('p-035-034.jpg', (42, 574, 799, 380), 'd'),
 'mvr-side-sec':    ('p-035-034.jpg', (1529, 574, 920, 380), 'd'),
 'mvr-site-plan':   ('p-035-034.jpg', (385, 1106, 1710, 474), 'd'),
 'mvr-r1':          ('p-036-035.jpg', (0, 0, 1190, 841), 'r'),
 'mvr-r2':          ('p-037-036.jpg', (0, 0, 1190, 841), 'r'),
 # Cover drawing
 'cover-wire':      ('p-001-000.jpg', (284, 0, 906, 841), 'd'),
}
# whole small photos (site supervision) — kept whole
WHOLE = {
 'toki-aerial': 'p-038-037.jpg', 'toki-court': 'p-038-038.jpg', 'toki-osman': 'p-038-039.jpg',
 'toki-roof': 'p-038-040.jpg', 'toki-mosque': 'p-038-041.jpg',
 'cer-d10-before': 'p-039-042.jpg', 'cer-d10-after': 'p-039-043.jpg',
 'cer-d12-before': 'p-039-044.jpg', 'cer-d12-after': 'p-039-045.jpg',
 'cer-d7-before': 'p-039-046.jpg', 'cer-d7-after': 'p-039-047.jpg',
 'leak-d20': 'p-040-048.jpg', 'leak-b02': 'p-040-049.jpg', 'leak-d21': 'p-040-050.jpg',
 'fix-silicone': 'p-040-051.jpg', 'fix-collar': 'p-040-052.jpg', 'fix-membrane': 'p-040-053.jpg',
 'doc-defect': 'p-041-054.jpg', 'doc-overview-a': 'p-041-055.jpg', 'doc-overview-b': 'p-041-056.jpg',
 'doc-glass-table': 'p-041-057.png', 'doc-ceramic-table': 'p-041-058.jpg',
}

WHITEN = {
 'cover-wire': [(0, 90, 790, 315)],
 'fac-plans':  [(60, 110, 390, 215)],
}

def trim(im, thr=242, frac=0.985, pad=0):
    """Trim near-white margins (rows/cols that are almost entirely paper)."""
    a = np.asarray(im.convert('L'))
    white = a >= thr
    rows = white.mean(1) < frac; cols = white.mean(0) < frac
    if not rows.any() or not cols.any(): return im
    y0, y1 = np.argmax(rows), len(rows) - np.argmax(rows[::-1])
    x0, x1 = np.argmax(cols), len(cols) - np.argmax(cols[::-1])
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

out = sys.argv[1]; os.makedirs(out, exist_ok=True)
meta = {}
for k, (f, (x, y, w, h), kind) in C.items():
    page = Image.open(P + f).convert('RGB')
    for (a0, b0, a1, b1) in WHITEN.get(k, []):
        page.paste((255, 255, 255), (a0, b0, a1, b1))
    im = page.crop((x, y, x + w, y + h))
    im = trim(im, pad=2 if kind == 'r' else 14)
    im.save(f'{out}/{k}.png'); meta[k] = {'kind': kind, 'src': f, 'size': im.size}
for k, f in WHOLE.items():
    im = Image.open(P + f).convert('RGB'); im.save(f'{out}/{k}.png')
    meta[k] = {'kind': 'r' if 'table' not in k else 'd', 'src': f, 'size': im.size}
json.dump(meta, open(f'{out}/crops.json', 'w'), indent=1)
print(len(meta), 'crops')
for k, m in meta.items(): print(f"{k:18s} {m['kind']} {m['size']}")
