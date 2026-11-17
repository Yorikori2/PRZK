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
    hip = y0 + int((y1 - y0) * 0.75)
    fx = [x for y in range(y1 - 6, y1 + 1) for x in range(w) if px[x, y][3]]
    return hip, y1, min(fx) - 1, max(fx) + 1


def passing(im, pull=0.6, bob=-1, lift_side=0, lift=0):
    """Bring the stride legs together: pixels left of the feet centre move right and
    vice versa, growing from 0 at the hip to `pull` of the gap at the feet; body up 1px."""
    w, h = im.size; px = im.load()
    hip, y1, fl, fr = legs_box(im)
    cx = (fl + fr) / 2; L = max(1, y1 - hip)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); op = out.load()
    for y in range(h):
        for x in range(w):
            q = px[x, y]
            if q[3] and not (y >= hip and fl <= x <= fr) and 0 <= y + bob < h:
                op[x, y + bob] = q
    # each leg half moves toward the centre; the half nearer the viewer is drawn last
    for side in (-1, 1):
        for y in range(hip, h):
            t = (y - hip) / L
            gap = (cx - fl) if side < 0 else (fr - cx)
            dx = side * -1 * pull * gap * t
            up = int(round(lift * max(0.0, (t - 0.55) / 0.45))) if side == lift_side else 0
            for x in range(fl, fr + 1):
                if (x < cx) != (side < 0):
                    continue
                q = px[x, y]
                if not q[3]:
                    continue
                X = int(round(x + dx)); Y = (y + bob if y < hip + 3 else y) - up
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
            if len(comp) <= 6:
                for a, b in comp:
                    op[a, b] = (0, 0, 0, 0)
    return out


FWD = {'east': 1, 'west': -1, 'south-east': 1, 'north-east': 1, 'south-west': -1, 'north-west': -1}
NF = 8


def main(stride_dir, idle_dir, out_dir):
    """8-frame cycle. Leg spread follows |cos| of the phase (1, .7, 0, .7, 1, ...) so the legs
    open and close in steps instead of snapping; the body is 1px higher around the passing
    pose and the trailing foot lifts as it swings through."""
    import math
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):
        os.remove(os.path.join(out_dir, f))
    for d in DIRS:
        st = Image.open(os.path.join(stride_dir, d + '.png')).convert('RGBA')
        front = d in ('south', 'north')
        alt = swap_legs(st) if front else st
        for i in range(NF):
            c = math.cos(2 * math.pi * i / NF)
            src = st if (c >= 0 or not front) else alt
            spread = abs(c)
            pull = (1 - spread) * (0.45 if front else 0.85)
            bob = -1 if spread < 0.5 else 0
            lift_side = 0
            if not front and spread < 0.9:
                lift_side = -1 if FWD[d] > 0 else 1      # trailing leg is the one behind the facing
            lift = 2 if spread < 0.5 else 1
            fr = st if (spread > 0.99 and not front) else (src if spread > 0.99 else passing(src, pull, bob, lift_side, lift if lift_side else 0))
            fr.save(os.path.join(out_dir, f'{d}_{i}.png'))
    print('done', out_dir)


if __name__ == '__main__':
    main(*sys.argv[1:4])
