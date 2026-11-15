"""Build a 4-frame walk from one exported stride pose + the idle pose per direction.

frames: 0 stride, 1 idle (body up 1px = passing), 2 stride with the other leg forward, 3 idle (up 1px)
For south/north the "other leg" stride mirrors only the legs (below the hip) so the
asymmetric upper body (straps, backpack) stays put. Side and diagonal views reuse the
stride pose, which reads the same with either leg forward at this size.
Usage: python3 tools/make_walk_from_stride.py <stride_dir> <idle_dir> <out_dir>
"""
import os, sys
from PIL import Image

DIRS = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west']


def bob(im, dy):
    out = Image.new('RGBA', im.size, (0, 0, 0, 0)); out.alpha_composite(im, (0, dy)); return out


def swap_legs(im):
    w, h = im.size; px = im.load()
    ys = [y for y in range(h) for x in range(w) if px[x, y][3]]
    y0, y1 = min(ys), max(ys)
    hip = y0 + int((y1 - y0) * 0.72)
    fx = [x for y in range(y1 - 6, y1 + 1) for x in range(w) if px[x, y][3]]
    fl, fr = min(fx) - 1, max(fx) + 1
    cx = (fl + fr) / 2
    out = im.copy(); op = out.load()
    for y in range(hip, h):
        for x in range(fl, fr + 1):
            op[x, y] = (0, 0, 0, 0)
    for y in range(hip, h):
        for x in range(fl, fr + 1):
            q = px[x, y]
            if q[3]:
                X = int(round(2 * cx - x))
                if 0 <= X < w:
                    op[X, y] = q
    return out


def main(stride_dir, idle_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):
        os.remove(os.path.join(out_dir, f))
    for d in DIRS:
        st = Image.open(os.path.join(stride_dir, d + '.png')).convert('RGBA')
        idle = Image.open(os.path.join(idle_dir, d + '.png')).convert('RGBA')
        alt = swap_legs(st) if d in ('south', 'north') else st
        for i, fr in enumerate([st, bob(idle, -1), alt, bob(idle, -1)]):
            fr.save(os.path.join(out_dir, f'{d}_{i}.png'))
    print('done', out_dir)


if __name__ == '__main__':
    main(*sys.argv[1:4])
