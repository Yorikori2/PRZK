"""Build a 4-frame walk from one exported stride pose + the idle pose per direction.

frames: 0 stride, 1 passing, 2 stride with the other leg forward, 3 passing
All frames come from the stride drawing (the idle drawing differs slightly in pose and
detail, so alternating the two flickers). The passing pose pulls the two legs of the
stride toward each other (more at the feet) and raises the body 1px.
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


def legs_box(im):
    w, h = im.size; px = im.load()
    ys = [y for y in range(h) for x in range(w) if px[x, y][3]]
    y0, y1 = min(ys), max(ys)
    hip = y0 + int((y1 - y0) * 0.66)
    fx = [x for y in range(y1 - 6, y1 + 1) for x in range(w) if px[x, y][3]]
    return hip, y1, min(fx) - 1, max(fx) + 1


def passing(im, pull=0.6):
    """Bring the stride legs together: pixels left of the feet centre move right and
    vice versa, growing from 0 at the hip to `pull` of the gap at the feet; body up 1px."""
    w, h = im.size; px = im.load()
    hip, y1, fl, fr = legs_box(im)
    cx = (fl + fr) / 2; L = max(1, y1 - hip)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); op = out.load()
    for y in range(h):
        for x in range(w):
            q = px[x, y]
            if q[3] and not (y >= hip and fl <= x <= fr) and y - 1 >= 0:
                op[x, y - 1] = q
    # each leg half moves toward the centre; the half nearer the viewer is drawn last
    for side in (-1, 1):
        for y in range(hip, h):
            t = (y - hip) / L
            gap = (cx - fl) if side < 0 else (fr - cx)
            dx = side * -1 * pull * gap * t * 0.5
            for x in range(fl, fr + 1):
                if (x < cx) != (side < 0):
                    continue
                q = px[x, y]
                if not q[3]:
                    continue
                X = int(round(x + dx)); Y = y - 1 if y < hip + 3 else y
                if 0 <= X < w and 0 <= Y < h:
                    op[X, Y] = q
    # close 1px holes
    for _ in range(2):
        c = out.copy(); cp = c.load()
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if cp[x, y][3]:
                    continue
                u, d, l, r = cp[x, y - 1], cp[x, y + 1], cp[x - 1, y], cp[x + 1, y]
                if u[3] and d[3]:
                    op[x, y] = d
                elif l[3] and r[3] and (u[3] or d[3]):
                    op[x, y] = l
    # drop specks: tiny detached clusters (<=3 px) created by the leg shift
    c = out.copy(); cp = c.load(); seen = set()
    for y in range(h):
        for x in range(w):
            if not cp[x, y][3] or (x, y) in seen:
                continue
            stack = [(x, y)]; comp = []; seen.add((x, y))
            while stack:
                a, b = stack.pop(); comp.append((a, b))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        X, Y = a + dx, b + dy
                        if 0 <= X < w and 0 <= Y < h and (X, Y) not in seen and cp[X, Y][3]:
                            seen.add((X, Y)); stack.append((X, Y))
            if len(comp) <= 3:
                for a, b in comp:
                    op[a, b] = (0, 0, 0, 0)
    return out


def main(stride_dir, idle_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):
        os.remove(os.path.join(out_dir, f))
    for d in DIRS:
        st = Image.open(os.path.join(stride_dir, d + '.png')).convert('RGBA')
        idle = Image.open(os.path.join(idle_dir, d + '.png')).convert('RGBA')
        alt = swap_legs(st) if d in ('south', 'north') else st
        pull = 0.35 if d in ('south', 'north') else 0.7
        for i, fr in enumerate([st, passing(st, pull), alt, passing(alt, pull)]):
            fr.save(os.path.join(out_dir, f'{d}_{i}.png'))
    print('done', out_dir)


if __name__ == '__main__':
    main(*sys.argv[1:4])
