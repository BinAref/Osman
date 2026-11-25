"""Local Real-ESRGAN x4plus super-resolution on CPU via ncnn (no data leaves the machine).
usage: python3 upscale.py MODEL_DIR in.png out.png [--scale 2|4] [--tile 160]
Runs 4x then (optionally) resamples to the requested scale with Lanczos."""
import sys, time, argparse
import numpy as np, ncnn
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('model_dir'); ap.add_argument('inp'); ap.add_argument('out')
ap.add_argument('--scale', type=float, default=4)
ap.add_argument('--tile', type=int, default=160)
ap.add_argument('--pad', type=int, default=10)
a = ap.parse_args()

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 4
net.load_param(f"{a.model_dir}/realesrgan-x4plus.param")
net.load_model(f"{a.model_dir}/realesrgan-x4plus.bin")

img = Image.open(a.inp).convert('RGB')
arr = np.asarray(img).astype(np.float32) / 255.0
H, W, _ = arr.shape
S = 4
out = np.zeros((H * S, W * S, 3), np.float32)
t0 = time.time(); T, P = a.tile, a.pad
for y in range(0, H, T):
    for x in range(0, W, T):
        y0, x0 = max(0, y - P), max(0, x - P)
        y1, x1 = min(H, y + T + P), min(W, x + T + P)
        tile = np.ascontiguousarray(arr[y0:y1, x0:x1].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(tile))
        _, o = ex.extract("output")
        o = np.array(o).transpose(1, 2, 0)
        oy, ox = (y - y0) * S, (x - x0) * S
        th, tw = (min(H, y + T) - y) * S, (min(W, x + T) - x) * S
        out[y * S:y * S + th, x * S:x * S + tw] = o[oy:oy + th, ox:ox + tw]
res = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
if a.scale != 4:
    res = res.resize((round(W * a.scale), round(H * a.scale)), Image.LANCZOS)
res.save(a.out, quality=95) if a.out.endswith('.jpg') else res.save(a.out)
print(f"{a.inp} {W}x{H} -> {res.size[0]}x{res.size[1]} in {time.time()-t0:.1f}s")
