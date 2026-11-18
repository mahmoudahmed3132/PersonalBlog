"""Inoue-style ink stylization of the cutout, at photo resolution.

Returns (cover, ink, wash) float maps in photo coords:
  cover: where the figure is (paper fill underneath)
  ink:   solid black ink
  wash:  grey ink wash (0..1), rendered at ~45% ink
"""
import cv2
import numpy as np


def _norm(a):
    a = a.astype(np.float32)
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


def granulation(shape, rng, scale=2.0):
    """Sumi wash pigment granulation: fine speckle modulated by soft blotches."""
    h, w = shape
    fine = cv2.GaussianBlur(rng.random((h, w)).astype(np.float32), (0, 0), 0.7)
    blot = cv2.GaussianBlur(rng.random((h, w)).astype(np.float32), (0, 0), 9 * scale)
    return np.clip(0.55 + (_norm(fine) - 0.5) * 0.6 + (_norm(blot) - 0.5) * 0.7, 0, 1)


def directional_streaks(shape, rng, length=31, angle=-75, keep=0.5):
    """Dry-brush streak field in [0,1] along `angle`; values above `keep` are where the brush skipped."""
    h, w = shape
    n = rng.random((h, w)).astype(np.float32)
    k = np.zeros((length, length), np.float32)
    k[length // 2, :] = 1
    rot = cv2.getRotationMatrix2D((length / 2, length / 2), angle, 1)
    k = cv2.warpAffine(k, rot, (length, length))
    k /= k.sum()
    return _norm(cv2.filter2D(n, -1, k))


def stylize(bgr, alpha, rng, head_box, skin_boxes):
    """head_box: hair region; skin_boxes: face/neck/hand regions that get full line art. Photo coords."""
    h, w = alpha.shape
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    inside = (alpha > 0.5).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w]

    def box(b, soft=6):
        x0, y0, x1, y1 = b
        m = ((xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)).astype(np.float32)
        return cv2.GaussianBlur(m, (0, 0), soft) if soft else m

    g = cv2.GaussianBlur(gray, (0, 0), 0.8)
    dark = (g < 70).astype(np.float32) * inside

    # --- hair: black mass with thin white strands carved from the photo's local highlights
    hair_region = box(head_box, soft=0)
    hair = dark * hair_region
    tophat = cv2.morphologyEx(g, cv2.MORPH_TOPHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    strands = np.clip((tophat - 7) / 10, 0, 1)
    strands = cv2.GaussianBlur(strands, (0, 0), 0.6)
    hair_ink = hair * (1 - strands * 0.95)

    # --- jacket/body: black with dry-brush fold highlights (large-scale local brightness)
    body = dark * (1 - hair_region)
    # stretch the near-black fabric locally so its real folds surface, then keep only the brightest
    clahe = cv2.createCLAHE(clipLimit=6.0, tileGridSize=(12, 12))
    gl = clahe.apply(gray.clip(0, 255).astype(np.uint8)).astype(np.float32)
    gl = cv2.GaussianBlur(gl, (0, 0), 2.5)
    vals = gl[body > 0.5]
    lo, hi = np.percentile(vals, 80), np.percentile(vals, 97)
    fold_hi = np.clip((gl - lo) / (hi - lo + 1e-6), 0, 1)
    streak = directional_streaks((h, w), rng, length=45, angle=-72)
    # brush skips along the folds; elsewhere only the rare dry-brush gap
    skip = np.clip(fold_hi * 1.4 - (1 - streak) * 0.9, 0, 1) + (streak > 0.93) * 0.8
    body_ink = body * np.clip(1 - skip, 0, 1)

    # --- line art (XDoG) for face, ear, hands, collar edges
    s1 = cv2.GaussianBlur(gray, (0, 0), 0.9)
    s2 = cv2.GaussianBlur(gray, (0, 0), 0.9 * 1.6)
    d = s1 - 0.985 * s2
    lines = np.clip((-d - 0.9) / 2.2, 0, 1) * inside
    skin = np.clip(sum(box(b) for b in skin_boxes), 0, 1) * inside * (1 - dark)
    lines = lines * np.maximum(skin, 0.35)

    # --- wash: shading on skin and hands as graded grey ink with granulation (no ruled hatching)
    light = (1 - dark) * inside
    shade = np.clip((175 - g) / 80, 0, 1) * light
    tones = np.round(shade * 3) / 3  # three wash values like layered sumi
    tones = cv2.GaussianBlur(tones, (0, 0), 1.2)
    wash = tones * granulation((h, w), rng) * 0.85

    ink = np.clip(np.maximum.reduce([hair_ink, body_ink, lines]), 0, 1)

    # --- variable-weight outline: heavier on the back (right) side, light on the face
    edge_in = inside - cv2.erode(inside, np.ones((3, 3), np.uint8))
    thick = cv2.dilate(edge_in, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    weight = np.clip((xx - 1150) / 120, 0.25, 1)  # face side light, back heavy
    outline = np.clip(edge_in + thick * weight * inside, 0, 1)
    ink = np.maximum(ink, outline)
    return inside, ink, wash
