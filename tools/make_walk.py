"""Build 6-frame walk cycles (8 directions) from single idle sprites.

Each sprite has a small hand-measured rig (hip line, leg box, arm boxes with shoulder
pivots).  Per frame, with phase p = 2*pi*f/6 and swing s = sin(p):
  * body above the hip bobs up 1px on the passing poses (|s| small)
  * legs split at the feet centre; side views swing them forward/back with a shear
    that grows toward the feet, front/back views lift the swinging foot (knee bend),
    diagonals mix both
  * arms swing opposite to the leg on the same side: front/back views slide the
    hand up/down (shoulder fixed), side views shear the arm forward/back around the
    shoulder
Usage: python3 tools/make_walk.py
"""
import math, os
from PIL import Image

N = 6
DIRS = ['south', 'south-east', 'east', 'north-east', 'north', 'north-west', 'west', 'south-west']
FWD = {'east': 1, 'west': -1, 'south-east': 1, 'north-east': 1, 'south-west': -1, 'north-west': -1, 'south': 0, 'north': 0}
# arm: (x0, y0, x1, y1, pivot_x, pivot_y)  -- boxes are inclusive
RIG = {
 'female': {
  'south':      {'hip': 31, 'arms': [(11, 14, 16, 31, 15, 15), (32, 13, 38, 31, 33, 14)]},
  'north':      {'hip': 30, 'arms': [(13, 14, 17, 30, 16, 15), (31, 14, 35, 30, 32, 15)]},
  'east':       {'hip': 30, 'arms': [(25, 14, 32, 30, 27, 15)]},
  'west':       {'hip': 30, 'arms': [(17, 14, 23, 30, 21, 15)]},
  'south-east': {'hip': 30, 'arms': [(12, 14, 16, 30, 15, 15), (31, 15, 36, 30, 32, 16)]},
  'south-west': {'hip': 30, 'arms': [(14, 15, 18, 31, 17, 16), (29, 14, 33, 29, 30, 15)]},
  'north-east': {'hip': 31, 'arms': [(28, 15, 34, 31, 30, 15)]},
  'north-west': {'hip': 31, 'arms': [(12, 15, 17, 31, 16, 16), (30, 17, 34, 29, 31, 17)]},
 },
 'male': {
  'south':      {'hip': 41, 'arms': [(8, 15, 16, 43, 13, 17), (37, 17, 47, 43, 40, 18)]},
  'north':      {'hip': 42, 'arms': [(13, 17, 20, 42, 18, 18), (39, 17, 46, 42, 41, 18)]},
  'east':       {'hip': 41, 'arms': [(30, 17, 39, 42, 33, 18)]},
  'west':       {'hip': 41, 'arms': [(25, 17, 33, 42, 29, 18)]},
  'south-east': {'hip': 41, 'arms': [(10, 17, 17, 41, 14, 18), (37, 18, 45, 41, 39, 19)]},
  'south-west': {'hip': 41, 'arms': [(14, 18, 22, 41, 18, 19), (40, 17, 49, 41, 43, 18)]},
  'north-east': {'hip': 42, 'arms': [(37, 20, 45, 41, 39, 21)]},
  'north-west': {'hip': 43, 'arms': [(14, 20, 22, 45, 18, 21)]},
 },
}


def opaque(p):
    return p[3] > 0


def frame(src, d, rig, f):
    w, h = src.size; sp = src.load()
    xs = [x for y in range(h) for x in range(w) if sp[x, y][3]]
    ys = [y for y in range(h) for x in range(w) if sp[x, y][3]]
    y1 = max(ys)
    hip = rig['hip']; L = max(1, y1 - hip)
    fx = [x for y in range(y1 - 4, y1 + 1) for x in range(w) if sp[x, y][3]]
    fl, fr = min(fx) - 1, max(fx) + 1
    cx = (fl + fr) / 2
    side = d in ('east', 'west'); diag = '-' in d; fwd = FWD[d] or 1
    p = 2 * math.pi * f / N; s = math.sin(p)
    bob = -1 if abs(s) < 0.6 else 0

    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); op = out.load()
    # 1) upper body with bob
    for y in range(h):
        for x in range(w):
            q = sp[x, y]
            if not q[3] or (y >= hip and fl <= x <= fr):
                continue
            if 0 <= y + bob < h:
                op[x, y + bob] = q
    # 2) arms: re-sample each arm box from the (un-bobbed) source
    for i, (ax0, ay0, ax1, ay1, px, py) in enumerate(rig['arms']):
        on_left = px < cx
        sw = (-s if on_left else s)          # opposite to the leg on the same side
        if side:
            sw = -s                           # the visible (near) arm
        dy_hand = 0; dx_hand = 0
        if side:
            dx_hand = 3.0 * sw * fwd
        elif diag:
            dy_hand = 1.5 * sw; dx_hand = 1.2 * sw * fwd
        else:
            dy_hand = 2.0 * sw
        span = max(1, ay1 - py)
        # clear box (bobbed position), then inverse-map
        for y in range(ay0, ay1 + 3):
            for x in range(ax0 - 4, ax1 + 5):
                yy = y + bob
                if 0 <= x < w and 0 <= yy < h and ax0 <= x <= ax1 and ay0 <= y <= ay1:
                    op[x, yy] = (0, 0, 0, 0)
        # refill from the source body behind the arm (torso pixels left of/right of box stay)
        for y in range(ay0, ay1 + 4):
            t = max(0.0, (y - py) / span)
            for x in range(ax0 - 4, ax1 + 5):
                sx = int(round(x - dx_hand * t)); sy = int(round(y - dy_hand * t))
                if not (ax0 <= sx <= ax1 and ay0 <= sy <= ay1):
                    continue
                q = sp[sx, sy]
                yy = y + bob
                if q[3] and 0 <= x < w and 0 <= yy < h and yy < hip + 3 + bob + 2:
                    op[x, yy] = q
        # holes inside the cleared box: take the original pixel (torso behind the arm)
        for y in range(ay0, ay1 + 1):
            for x in range(ax0, ax1 + 1):
                yy = y + bob
                if 0 <= yy < h and not op[x, yy][3]:
                    q = sp[x, y]
                    if q[3]:
                        nb = 0
                        for ddx, ddy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                            X, Y = x + ddx, yy + ddy
                            if 0 <= X < w and 0 <= Y < h and op[X, Y][3]:
                                nb += 1
                        if nb >= 3 or not (ax0 + 1 <= x <= ax1 - 1):
                            op[x, yy] = q
    # 3) legs
    amp = 3.2 if side else 2.0 if diag else 0.0
    for leg in ((-1, 1) if s * fwd >= 0 else (1, -1)):   # back leg first
        k = s * leg                                       # >0: this leg forward
        dx_amp = amp * k * fwd
        lift = 0.0
        if not side:
            lift = max(0.0, -k) * (2.5 if not diag else 1.5)   # the leg swinging through lifts
        else:
            lift = max(0.0, math.cos(p) * leg) * 1.5            # knee bend on the passing leg
        for y in range(hip, h):
            t = (y - hip) / L
            for x in range(fl - 5, fr + 6):
                if not (0 <= x < w):
                    continue
                sx = int(round(x - dx_amp * t))
                sy = int(round(hip + (y - hip) * (L + lift) / L)) if lift else y
                if not (fl <= sx <= fr and hip <= sy < h):
                    continue
                if (sx < cx) != (leg < 0):
                    continue
                q = sp[sx, sy]
                if not q[3]:
                    continue
                yy = y + (bob if y < hip + 3 else 0)
                if 0 <= yy < h:
                    op[x, yy] = q
    # 4) close 1px holes (seams from bob / shears)
    for _ in range(2):
        c = out.copy(); cp = c.load()
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if cp[x, y][3]:
                    continue
                u, dn, l, r = cp[x, y - 1], cp[x, y + 1], cp[x - 1, y], cp[x + 1, y]
                if u[3] and dn[3]:
                    op[x, y] = dn
                elif l[3] and r[3] and (u[3] or dn[3]):
                    op[x, y] = l
    # 5) drop stray specks left by the shears (opaque pixels with <=1 opaque neighbour)
    c = out.copy(); cp = c.load()
    for y in range(h):
        for x in range(w):
            if not cp[x, y][3]:
                continue
            n = sum(1 for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and 0 <= x + dx < w and 0 <= y + dy < h and cp[x + dx, y + dy][3])
            if n <= 1:
                op[x, y] = (0, 0, 0, 0)
    return out


def main():
    base = os.path.join(os.path.dirname(__file__), '..', 'assets', 'players')
    for ch, rigs in RIG.items():
        folder = os.path.join(base, ch); os.makedirs(os.path.join(folder, 'walk'), exist_ok=True)
        for f in os.listdir(os.path.join(folder, 'walk')):
            os.remove(os.path.join(folder, 'walk', f))
        for d in DIRS:
            src = Image.open(os.path.join(folder, d + '.png')).convert('RGBA')
            for f in range(N):
                frame(src, d, rigs[d], f).save(os.path.join(folder, 'walk', f'{d}_{f}.png'))
        print('done', ch)


if __name__ == '__main__':
    main()
