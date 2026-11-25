"""Detect content blocks (renders/drawings) on each flattened portfolio page.
Writes a JSON of bounding boxes and debug overlays for visual review."""
import sys, json, os
import numpy as np, cv2

src = sys.argv[1]; out = sys.argv[2]
os.makedirs(out, exist_ok=True)
result = {}
for fn in sorted(os.listdir(src)):
    if not fn.lower().endswith(('.jpg', '.png')): continue
    img = cv2.imread(os.path.join(src, fn))
    h, w = img.shape[:2]
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # non-paper pixels: darker than near-white or saturated
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = ((g < 236) | (hsv[..., 1] > 40)).astype(np.uint8) * 255
    k = max(3, w // 160)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((k, k), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    boxes = []
    for i in range(1, n):
        x, y, bw, bh, area = stats[i]
        if bw * bh < (w * h) * 0.004: continue
        boxes.append([int(x), int(y), int(bw), int(bh), int(area)])
    boxes.sort(key=lambda b: (b[1] // max(1, h // 12), b[0]))
    result[fn] = {"size": [w, h], "boxes": boxes}
    dbg = img.copy()
    for j, (x, y, bw, bh, a) in enumerate(boxes):
        cv2.rectangle(dbg, (x, y), (x + bw, y + bh), (0, 0, 255), max(2, w // 400))
        cv2.putText(dbg, str(j), (x + 8, y + 40 * w // 1190), cv2.FONT_HERSHEY_SIMPLEX, 1.2 * w / 1190, (0, 0, 255), 3)
    scale = 900 / w
    cv2.imwrite(os.path.join(out, fn.rsplit('.', 1)[0] + '.jpg'), cv2.resize(dbg, (900, int(h * scale))), [cv2.IMWRITE_JPEG_QUALITY, 70])
json.dump(result, open(os.path.join(out, 'regions.json'), 'w'), indent=1)
for fn, r in result.items():
    print(fn, r['size'], [b[:4] for b in r['boxes']])
