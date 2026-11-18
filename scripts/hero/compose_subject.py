"""Build public/hero/layer-1-subject.png: Mahmoud (ink-stylized from the hallway photo, with
headphones) in front of an Alfa Romeo Giulia Quadrifoglio drawn in brush ink.

usage: python3 -I compose.py <pylib> <cutout.png> <out.png> [preview.png]
"""
import math
import sys

sys.path.insert(0, sys.argv[1])
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from stylize import granulation, stylize

CUTOUT, OUT = sys.argv[2], sys.argv[3]
PREVIEW = sys.argv[4] if len(sys.argv) > 4 else None

W, H = 2400, 1350
SS = 3  # supersampling for the vector parts
INK = np.array([20, 18, 16], np.float32)
PAPER = np.array([242, 237, 226], np.float32)
RED = np.array([168, 36, 28], np.float32)
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- helpers
def dry_brush(shape, scale=1.0, density=0.08, angle=-8):
    """Streaky noise in [0,1]: 1 = ink stays, 0 = paper shows through (dry-brush flecks)."""
    h, w = shape
    n = rng.random((h, w)).astype(np.float32)
    ksize = max(3, int(41 * scale)) | 1
    k = np.zeros((ksize, ksize), np.float32)
    k[ksize // 2, :] = 1
    rot = cv2.getRotationMatrix2D((ksize / 2, ksize / 2), angle, 1)
    k = cv2.warpAffine(k, rot, (ksize, ksize))
    k /= k.sum()
    n = cv2.filter2D(n, -1, k)
    n = (n - n.mean()) / (n.std() + 1e-6)
    thr = 2.6 - density * 8  # density 0.1 -> ~2% of pixels become paper flecks
    return np.clip(1 - (n - thr) * 1.5, 0, 1)


def brush_path(draw, pts, width, taper=True, jitter=0.0):
    """Polyline as a brush stroke: dense stamps whose radius swells mid-stroke and tapers at ends."""
    pts = np.asarray(pts, np.float32)
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    total = seg.sum()
    if total == 0:
        return
    steps = max(2, int(total / 1.5))
    cum = np.concatenate([[0], np.cumsum(seg)])
    for i in range(steps + 1):
        d = total * i / steps
        j = min(len(seg) - 1, np.searchsorted(cum, d, side="right") - 1)
        t = (d - cum[j]) / (seg[j] or 1)
        x, y = pts[j] + (pts[j + 1] - pts[j]) * t
        u = d / total
        r = width / 2 * ((0.35 + 0.65 * math.sin(math.pi * u)) if taper else 1)
        r *= 1 + jitter * (rng.random() - 0.5)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=255)


def arc_pts(cx, cy, r, a0, a1, n=48):
    """Arc in car space (y up), a0->a1 degrees counter-clockwise from +x."""
    return [(cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))) for a in np.linspace(a0, a1, n)]


# ---------------------------------------------------------------- the car (vector, supersampled)
CAR_X0, GROUND, K = 1110, 1062, 0.242  # rear bumper x, ground y, px per mm (Giulia: 4639 mm long)
WHEELBASE, FRONT_OH = 2820, 850
WF = 4639 - FRONT_OH
WR = WF - WHEELBASE
WC_Y = 340
ARCH_R, TYRE_R, RIM_R = 395, 345, 250


def C(x, y):
    """car mm -> supersampled canvas px (car faces right: rear at x=0)."""
    return ((CAR_X0 + x * K) * SS, (GROUND - y * K) * SS)


def Cs(pts):
    return [C(x, y) for x, y in pts]


def draw_car():
    size = (W * SS, H * SS)
    paper = Image.new("L", size, 0)
    ink = Image.new("L", size, 0)
    red = Image.new("L", size, 0)
    wash = Image.new("L", size, 0)
    dp, di, dr, dw = (ImageDraw.Draw(m) for m in (paper, ink, red, wash))
    lw = 7 * SS  # base line weight

    # ground shadow (ink wash, blurred later)
    dw.ellipse([*C(-150, 60), *C(4800, -70)], fill=150)

    # body silhouette
    body = [
        (40, 175), (0, 330), (10, 560), (40, 780), (100, 930), (170, 968), (520, 990), (900, 1015),
        (1150, 1065), (1450, 1300), (1800, 1405), (2200, 1426), (2600, 1402), (2850, 1322), (3250, 1062),
        (3500, 1018), (3900, 978), (4300, 908), (4520, 822), (4612, 700), (4639, 560), (4630, 400),
        (4600, 250), (4560, 170), (4420, 142), (WF + ARCH_R, 150),
        *arc_pts(WF, WC_Y, ARCH_R, 0, 180),
        (WF - ARCH_R, 150), (WR + ARCH_R, 150),
        *arc_pts(WR, WC_Y, ARCH_R, 0, 180),
        (WR - ARCH_R, 160), (300, 168),
    ]
    body_px = Cs(body)
    dp.polygon(body_px, fill=255)

    # wheel arch interiors read as deep shadow
    for wc in (WR, WF):
        di.pieslice([*C(wc - ARCH_R + 10, WC_Y + ARCH_R - 10), *C(wc + ARCH_R - 10, WC_Y - ARCH_R + 10)], 180, 360, fill=255)

    # outline
    brush_path(di, body_px + [body_px[0]], lw * 1.1, taper=False, jitter=0.5)

    # greenhouse: dark glass with two slanted highlight streaks
    glass = Cs([(1185, 1080), (1470, 1292), (1820, 1384), (2200, 1400), (2580, 1378), (2815, 1308), (3190, 1080)])
    di.polygon(glass, fill=255)
    streaks = Image.new("L", size, 0)
    ds = ImageDraw.Draw(streaks)
    for x0 in (1700, 2620):
        brush_path(ds, Cs([(x0, 1110), (x0 + 210, 1350)]), lw * 1.6)
        brush_path(ds, Cs([(x0 + 110, 1110), (x0 + 250, 1270)]), lw * 0.7)
    ink.paste(0, mask=streaks)
    # B- and C-pillar
    ImageDraw.Draw(ink).polygon(Cs([(2330, 1075), (2410, 1075), (2420, 1395), (2335, 1396)]), fill=0)
    ImageDraw.Draw(ink).polygon(Cs([(1185, 1080), (1330, 1080), (1560, 1300), (1470, 1292)]), fill=0)
    brush_path(di, Cs([(2330, 1075), (2335, 1396)]), lw * 0.6)
    brush_path(di, Cs([(1330, 1080), (1560, 1300)]), lw * 0.6)

    # shoulder line, lower crease, door cuts, handles
    brush_path(di, Cs([(130, 868), (1200, 905), (2500, 935), (3700, 905), (4460, 852)]), lw * 0.9, jitter=0.4)
    brush_path(di, Cs([(760, 430), (1500, 390), (2400, 372), (3330, 360)]), lw * 0.6, jitter=0.4)
    brush_path(di, Cs([(2380, 1075), (2395, 700), (2405, 190)]), lw * 0.55)
    brush_path(di, Cs([(3215, 1065), (3330, 780), (3345, 190)]), lw * 0.55)
    brush_path(di, Cs([(1235, 1062), (1300, 800), (1320, 740)]), lw * 0.55)
    brush_path(di, Cs([(2150, 960), (2300, 962)]), lw * 0.9, taper=False)
    brush_path(di, Cs([(3010, 975), (3160, 972)]), lw * 0.9, taper=False)

    # mirror, headlight, taillight, diffuser, splitter, exhaust
    di.polygon(Cs([(3120, 1088), (3290, 1098), (3320, 1170), (3175, 1188)]), fill=255)
    di.polygon(Cs([(4250, 852), (4560, 792), (4605, 722), (4380, 762)]), fill=255)
    di.polygon(Cs([(15, 765), (330, 805), (385, 862), (55, 865)]), fill=255)
    di.polygon(Cs([(0, 175), (320, 172), (300, 265), (25, 275)]), fill=255)
    di.polygon(Cs([(4370, 142), (4625, 152), (4612, 195), (4362, 188)]), fill=255)
    for ex in (70, 190):
        dp.ellipse([*C(ex - 38, 250), *C(ex + 38, 190)], fill=255)
        brush_path(di, Cs(arc_pts(ex, 220, 34, 0, 360, 24)), lw * 0.7, taper=False)

    # carbon side skirt between the arches, and the QF front-fender vent
    di.polygon(Cs([(WR + ARCH_R + 20, 150), (WF - ARCH_R - 20, 150), (WF - ARCH_R - 30, 215), (WR + ARCH_R + 30, 228)]), fill=255)
    for i in range(3):
        vx = WF - ARCH_R - 140 - i * 70
        brush_path(di, Cs([(vx + 40, 560), (vx - 30, 420)]), lw * 1.1)

    # wheels: solid tyre, paper rim with five round windows (QF "teledial"), hub
    for wc in (WR, WF):
        di.ellipse([*C(wc - TYRE_R, WC_Y + TYRE_R), *C(wc + TYRE_R, WC_Y - TYRE_R)], fill=255)
        dp.ellipse([*C(wc - RIM_R, WC_Y + RIM_R), *C(wc + RIM_R, WC_Y - RIM_R)], fill=255)
        ImageDraw.Draw(ink).ellipse([*C(wc - RIM_R, WC_Y + RIM_R), *C(wc + RIM_R, WC_Y - RIM_R)], fill=0)
        brush_path(di, Cs(arc_pts(wc, WC_Y, RIM_R, 0, 360, 64)), lw * 0.9, taper=False)
        for i in range(5):
            a = math.radians(90 + i * 72)
            hx, hy = wc + 150 * math.cos(a), WC_Y + 150 * math.sin(a)
            di.ellipse([*C(hx - 62, hy + 62), *C(hx + 62, hy - 62)], fill=255)
        di.ellipse([*C(wc - 38, WC_Y + 38), *C(wc + 38, WC_Y - 38)], fill=255)
        # tyre highlight arc
        ImageDraw.Draw(ink).arc([*C(wc - TYRE_R + 40, WC_Y + TYRE_R - 40), *C(wc + TYRE_R - 40, WC_Y - TYRE_R + 40)], 200, 250, fill=0, width=int(lw * 0.7))

    # Quadrifoglio badge on the front fender: paper triangle, red four-leaf clover
    bx, by = 3450, 720
    tri = Cs([(bx - 95, by + 80), (bx + 95, by + 80), (bx, by - 85)])
    dp.polygon(tri, fill=255)
    ImageDraw.Draw(ink).polygon(tri, fill=0)
    brush_path(di, tri + [tri[0]], lw * 0.55, taper=False)
    for ang in (0, 90, 180, 270):
        a = math.radians(ang)
        lx, ly = bx + 26 * math.cos(a), by + 10 + 26 * math.sin(a)
        dr.ellipse([*C(lx - 24, ly + 24), *C(lx + 24, ly - 24)], fill=255)

    def down(img, blur=0):
        img = img.resize((W, H), Image.LANCZOS)
        return np.asarray(img.filter(ImageFilter.GaussianBlur(blur)) if blur else img, np.float32) / 255

    wash_a = down(wash, 18) * 0.55
    paper_d = down(paper)
    # body shading as sumi wash: darkens toward the sill, a lighter band under the shoulder line
    ys = np.arange(H, dtype=np.float32)[:, None]
    y_crease, y_sill = GROUND - 380 * K, GROUND - 150 * K
    y_shoulder = GROUND - 880 * K
    lower = np.clip((ys - y_crease) / (y_sill - y_crease), 0, 1) ** 0.8 * 0.85
    upper = np.exp(-(((ys - (y_shoulder + 18)) / 22) ** 2)) * 0.35
    body_wash = np.clip(lower + upper, 0, 1) * np.ones((1, W), np.float32) * paper_d
    body_wash *= granulation((H, W), rng, scale=1.5)
    return paper_d, down(ink), down(red), wash_a, body_wash


# ---------------------------------------------------------------- Mahmoud (raster ink stylization)
S = 0.85
RIGHT_CANVAS = 1560  # canvas x of photo x=1400 (crop right edge)
TOP_ORIG, FADE_START, FADE_END = 40, 800, 975
TOP_CANVAS = 1190 - (FADE_END - TOP_ORIG) * S  # he stands closer to the camera than the car


def person_layers():
    rgba = cv2.imread(CUTOUT, cv2.IMREAD_UNCHANGED)
    bgr, alpha = rgba[:, :, :3], rgba[:, :, 3].astype(np.float32) / 255
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    h, w = gray.shape

    # headphones, drawn in photo coordinates so they sit on his ear and crown
    hp = Image.new("L", (w, h), 0)
    hd = ImageDraw.Draw(hp)
    brush_path(hd, [(1194, 196), (1195, 160), (1197, 135), (1200, 114), (1204, 98), (1209, 87), (1215, 81)], 24, taper=True)
    hd.ellipse([1158, 160, 1228, 262], fill=255)  # ear cup
    hp_a = np.asarray(hp, np.float32) / 255
    cup_hi = Image.new("L", (w, h), 0)
    ImageDraw.Draw(cup_hi).arc([1168, 172, 1216, 248], 110, 200, fill=255, width=6)
    # thin paper gap on the hair side of the band so it reads against the black hair
    brush_path(ImageDraw.Draw(cup_hi), [(1182, 165), (1185, 140), (1189, 118), (1194, 100)], 5, taper=True)
    cup_hi_a = np.asarray(cup_hi, np.float32) / 255

    cover0, ink, pwash = stylize(
        bgr, alpha, rng,
        head_box=(1080, 40, 1320, 250),
        skin_boxes=[(1050, 90, 1290, 330), (860, 410, 1075, 560)],
    )
    yy, xx = np.mgrid[0:h, 0:w]
    ink = np.maximum(ink, hp_a)
    ink = np.where(cup_hi_a > 0, 0, ink)
    pwash = pwash * (1 - hp_a)

    cover = np.maximum(alpha, hp_a)
    # dissolve into the paper below the waist with a ragged dry-brush edge
    fade = np.clip((FADE_END - yy) / (FADE_END - FADE_START), 0, 1).astype(np.float32)
    # horizontal dry-brush streaks: the figure dissolves into brush strokes, not fog
    ragged = cv2.GaussianBlur(rng.random((h, w)).astype(np.float32), (0, 0), sigmaX=28, sigmaY=1.2)
    ragged = (np.argsort(np.argsort(ragged.ravel())) / ragged.size).reshape(h, w).astype(np.float32)  # uniform
    fade = (fade > ragged).astype(np.float32) * np.clip(fade * 3, 0, 1)
    fade = cv2.GaussianBlur(fade, (0, 0), 0.8)
    cover *= fade
    ink *= fade
    pwash *= fade

    # place on the canvas
    x0 = int(840)
    crop = (slice(TOP_ORIG - 20, FADE_END + 5), slice(x0, 1400))
    cover_c, ink_c, wash_c = cover[crop], ink[crop], pwash[crop]
    nh, nw = int(cover_c.shape[0] * S), int(cover_c.shape[1] * S)
    cover_c = cv2.resize(cover_c, (nw, nh), interpolation=cv2.INTER_AREA)
    ink_c = cv2.resize(ink_c, (nw, nh), interpolation=cv2.INTER_AREA)
    wash_c = cv2.resize(wash_c, (nw, nh), interpolation=cv2.INTER_AREA)
    px = int(RIGHT_CANVAS - (1400 - x0) * S)
    py = int(TOP_CANVAS - 20 * S)
    P_cover, P_ink, P_wash = (np.zeros((H, W), np.float32) for _ in range(3))
    P_cover[py : py + nh, px : px + nw] = cover_c
    P_ink[py : py + nh, px : px + nw] = ink_c
    P_wash[py : py + nh, px : px + nw] = wash_c
    return P_cover, P_ink, P_wash, (px, py)


def main():
    car_paper, car_ink, car_red, wash, car_body_wash = draw_car()
    p_cover, p_ink, p_wash, origin = person_layers()

    alpha = np.clip(np.maximum.reduce([car_paper, car_ink, wash, p_cover]), 0, 1)
    # colour: car first, then the person on top
    col = np.zeros((H, W, 3), np.float32) + PAPER
    bw = (car_body_wash * 0.55)[..., None]
    col = col * (1 - bw) + INK * bw
    car_ink_tex = car_ink * dry_brush((H, W), density=0.06, angle=-12)
    col = col * (1 - car_ink_tex[..., None]) + INK * car_ink_tex[..., None]
    col = col * (1 - car_red[..., None]) + RED * car_red[..., None]
    shadow_only = wash * (1 - np.maximum(car_paper, car_ink))
    col = np.where(shadow_only[..., None] > 0, INK * 0.6 + PAPER * 0.4, col)
    col = col * (1 - p_cover[..., None]) + PAPER * p_cover[..., None]
    pw = (p_wash * 0.55)[..., None]
    col = col * (1 - pw) + INK * pw
    col = col * (1 - p_ink[..., None]) + INK * p_ink[..., None]

    out = np.dstack([col, alpha * 255]).clip(0, 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(OUT, optimize=True)
    # Where the headphone ear cup lands on the canvas, for the music-note overlay.
    ox, oy = origin
    print("ear cup canvas:", round(ox + (1193 - 840) * S), round(oy + (211 - TOP_ORIG + 20) * S))
    if PREVIEW:
        bg = Image.new("RGBA", (W, H), (242, 237, 226, 255))
        bg.alpha_composite(Image.fromarray(out, "RGBA"))
        bg.crop((1000, 300, 2400, 1350)).save(PREVIEW)


main()
