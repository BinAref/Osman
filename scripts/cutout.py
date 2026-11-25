"""Cut plan drawings out of their white sheet: keep the largest connected drawing (the plot / building),
fill its holes, feather the edge, and save RGBA. Used for the exploded stack of mall levels."""
import sys, os
import numpy as np, cv2
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for k in sys.argv[3:]:
    img = cv2.imread(f'{src}/{k}.png')
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ink = (g < 225).astype(np.uint8)
    ink = cv2.dilate(ink, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(ink, 8)
    big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = ndimage.binary_fill_holes(lab == big).astype(np.uint8) * 255
    mask = cv2.erode(mask, np.ones((3, 3), np.uint8))
    mask = cv2.GaussianBlur(mask, (5, 5), 0)
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[..., 3] = mask
    ys, xs = np.where(mask > 8)
    rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{dst}/{k}.png', rgba)
    print(k, rgba.shape[1], 'x', rgba.shape[0])
