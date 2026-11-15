"""Generate 4-frame walk cycles from 8-direction idle sprites.

The legs (pixels below the hip line, inside the feet column span) are split into
two legs at the feet centre and re-sampled per frame:
  side views     -> legs swing forward/back (horizontal shear growing toward the feet)
  front/back     -> one foot lifts (vertical compression of that leg)
  diagonals      -> a mix of both
The upper body bobs 1px on the passing frames.
Usage: python3 tools/make_walk.py assets/players/female assets/players/male
"""
import sys, os
from PIL import Image

DIRS = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west']
FWD = {'east': 1, 'west': -1, 'south-east': 1, 'north-east': 1, 'south-west': -1, 'north-west': -1, 'south': 0, 'north': 0}


def bbox_alpha(px, w, h):
    xs, ys = [], []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0:
                xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def make_frames(im, d):
    im = im.convert('RGBA'); w, h = im.size; px = im.load()
    x0, y0, x1, y1 = bbox_alpha(px, w, h)
    H = y1 - y0 + 1
    hip = y0 + int(H * 0.62)
    # feet span: opaque columns in the bottom 5 rows
    fx = [x for y in range(y1 - 4, y1 + 1) for x in range(w) if px[x, y][3] > 0]
    fl, fr = min(fx) - 1, max(fx) + 1
    cx = (fl + fr) / 2
    L = max(1, y1 - hip)
    side = d in ('east', 'west')
    diag = '-' in d
    fwd = FWD[d]
    frames = []
    for f in range(4):
        out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); op = out.load()
        bob = -1 if f in (0, 2) else 0          # passing frames are higher
        s = {1: 1, 3: -1}.get(f, 0)              # which leg leads
        amp = 3 if side else 2 if diag else 0
        lift = 0 if side else (2 if not diag else 1)
        # upper body (and anything outside the leg columns) copied with bob
        for y in range(h):
            for x in range(w):
                p = px[x, y]
                if p[3] == 0:
                    continue
                if y >= hip and fl <= x <= fr:
                    continue
                yy = y + bob
                if 0 <= yy < h:
                    op[x, yy] = p
        # legs: inverse-map each output pixel to leg A (x<cx) or leg B (x>=cx)
        def leg_params(leg):  # leg: -1 for A, +1 for B
            k = s * leg                          # +1 -> this leg forward, -1 back
            dx_amp = amp * k * (fwd if fwd else 1)
            lft = lift if (s != 0 and k < 0) else 0   # back leg lifts in front/back views
            if side and f in (0, 2):
                lft = 1 if leg == (1 if f == 0 else -1) else 0
            return dx_amp, lft
        params = {-1: leg_params(-1), 1: leg_params(1)}
        order = [-1, 1] if (s * fwd) >= 0 else [1, -1]   # draw back leg first, forward leg on top
        for leg in order:
            dxa, lft = params[leg]
            for y in range(hip, h):
                t = (y - hip) / L
                for x in range(fl - amp - 1, fr + amp + 2):
                    if not (0 <= x < w):
                        continue
                    sx = int(round(x - dxa * t))
                    sy = int(round(hip + (y - hip) * (L + lft) / L)) if lft else y
                    if not (0 <= sx < w and hip <= sy < h):
                        continue
                    if (sx < cx) != (leg < 0):
                        continue
                    if not (fl <= sx <= fr):
                        continue
                    p = px[sx, sy]
                    if p[3] == 0:
                        continue
                    yy = y + bob if y < hip + 2 else y   # top of legs follows the body a little
                    if 0 <= yy < h:
                        op[x, yy] = p
        # close 1px holes and the seam left by the body bob (only inside the leg box)
        for _ in range(2):
            src = out.copy(); sp = src.load()
            for y in range(max(0, hip - 3), h - 1):
                for x in range(max(1, fl - amp - 2), min(w - 1, fr + amp + 3)):
                    if sp[x, y][3]:
                        continue
                    up, dn, lf, rt = sp[x, y - 1], sp[x, y + 1], sp[x - 1, y], sp[x + 1, y]
                    if up[3] and dn[3]:
                        op[x, y] = dn
                    elif lf[3] and rt[3] and y >= hip:
                        op[x, y] = lf
        frames.append(out)
    return frames


def main(folders):
    for folder in folders:
        os.makedirs(os.path.join(folder, 'walk'), exist_ok=True)
        for d in DIRS:
            im = Image.open(os.path.join(folder, d + '.png'))
            for i, fr in enumerate(make_frames(im, d)):
                fr.save(os.path.join(folder, 'walk', f'{d}_{i}.png'))
        print('done', folder)


if __name__ == '__main__':
    main(sys.argv[1:])
