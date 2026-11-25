"""Batch Real-ESRGAN x4 (CPU, ncnn) over all render/photo crops, priority order.
Output capped to 3200px longest side, saved as high-quality JPEG in assets-src/sr/."""
import os, sys, json, time
import numpy as np, ncnn
from PIL import Image

MODEL = sys.argv[1]; SRC = 'assets-src/crops'; OUT = 'assets-src/sr'
os.makedirs(OUT, exist_ok=True)
meta = json.load(open(f'{SRC}/crops.json'))
first = ['rcc-night', 'rcc-day', 'mrc-aerial', 'mrc-night-a', 'mrc-night-b', 'mrc-street', 'fac-street', 'fac-aerial',
         'mvr-r1', 'mvr-r2', 'v1-render', 'slv-aerial', 'cc-aerial', 'slv-r1', 'slv-r2', 'slv-r3', 'slv-r4',
         'cc-r1', 'cc-r2', 'cc-r3', 'cc-r4', 'rcc-night-2', 'rcc-aerial', 'rcc-off-render', 'v2-r1', 'v2-r2',
         'cc-model-1', 'cc-model-2', 'cc-sketch-1', 'cc-sketch-2', 'toki-osman', 'toki-aerial', 'toki-court']
order = first + sorted(k for k, m in meta.items() if m['kind'] == 'r' and k not in first)
net = ncnn.Net(); net.opt.use_vulkan_compute = False; net.opt.num_threads = 4
net.load_param(f'{MODEL}/realesrgan-x4plus.param'); net.load_model(f'{MODEL}/realesrgan-x4plus.bin')
T, P, S = 200, 12, 4
for k in order:
    dst = f'{OUT}/{k}.jpg'
    if os.path.exists(dst): continue
    t0 = time.time()
    arr = np.asarray(Image.open(f'{SRC}/{k}.png').convert('RGB')).astype(np.float32) / 255.0
    H, W, _ = arr.shape
    # every tile is exactly (T+2P)² — reflect-pad the whole image so edge tiles are never a different size
    # (odd-sized edge tiles came back corrupted from the ncnn CPU path)
    Hp, Wp = -(-H // T) * T, -(-W // T) * T
    pad = np.pad(arr, ((P, Hp - H + P), (P, Wp - W + P), (0, 0)), mode='reflect')
    out = np.zeros((Hp * S, Wp * S, 3), np.float32)
    for y in range(0, Hp, T):
        for x in range(0, Wp, T):
            tile = np.ascontiguousarray(pad[y:y + T + 2 * P, x:x + T + 2 * P].transpose(2, 0, 1))
            ex = net.create_extractor()
            ex.input('data', ncnn.Mat(tile))
            _, o = ex.extract('output'); o = np.array(o).transpose(1, 2, 0)
            out[y * S:(y + T) * S, x * S:(x + T) * S] = o[P * S:(P + T) * S, P * S:(P + T) * S]
    out = out[:H * S, :W * S]
    im = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
    # integrity check: the upscale, shrunk back, must match the source tile by tile
    back = np.asarray(im.resize((W, H), Image.BOX)).astype(np.float32) / 255.0
    worst = max(float(np.abs(back[y:y + 64, x:x + 64] - arr[y:y + 64, x:x + 64]).mean()) for y in range(0, H, 64) for x in range(0, W, 64))
    if worst > 0.06: print(f'!! SUSPECT {k}: worst tile error {worst:.3f}', flush=True)
    m = max(im.size)
    if m > 3200: im = im.resize((round(im.width * 3200 / m), round(im.height * 3200 / m)), Image.LANCZOS)
    im.save(dst, quality=95, subsampling=0)
    print(f'{k:16s} {W}x{H} -> {im.width}x{im.height}  {time.time() - t0:.0f}s', flush=True)
print('DONE', flush=True)
