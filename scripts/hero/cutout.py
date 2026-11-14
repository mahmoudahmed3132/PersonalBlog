"""Step 1: segment Mahmoud from the hallway photo with GrabCut. Writes an RGBA cutout for inspection."""
import sys

sys.path.insert(0, sys.argv[1])
import cv2
import numpy as np

src, out = sys.argv[2], sys.argv[3]
img = cv2.imread(src)
h, w = img.shape[:2]

mask = np.full((h, w), cv2.GC_BGD, np.uint8)
# Probable foreground: generous polygon around the figure (original photo coords).
fg_poly = np.array(
    [
        (1100, 120), (1130, 60), (1200, 40), (1275, 60), (1315, 120), (1305, 240), (1300, 290),
        (1360, 340), (1380, 460), (1370, 700), (1360, 960), (1300, 1066), (1020, 1066), (1050, 900),
        (1060, 640), (960, 610), (880, 580), (860, 520), (880, 470), (930, 440), (1020, 430),
        (1060, 460), (1100, 420), (1110, 330), (1090, 280), (1070, 240), (1065, 180), (1085, 140),
    ],
    np.int32,
)
cv2.fillPoly(mask, [fg_poly], cv2.GC_PR_FGD)
# Sure foreground: face, hair core, jacket core.
for poly in (
    [(1150, 90), (1260, 90), (1260, 260), (1150, 260)],
    [(1140, 330), (1330, 330), (1330, 900), (1140, 900)],
    [(1080, 600), (1200, 600), (1200, 700), (1080, 700)],
):
    cv2.fillPoly(mask, [np.array(poly, np.int32)], cv2.GC_FGD)

# Sure background: lower hand + cup (disconnected from its sleeve), table leg, curtain slivers.
for poly in (
    [(840, 497), (905, 490), (950, 505), (965, 530), (960, 620), (840, 620)],
    [(1342, 600), (1400, 600), (1400, 1066), (1342, 1066)],
    [(1312, 322), (1350, 322), (1350, 390), (1330, 390)],
    [(1063, 675), (1094, 675), (1094, 835), (1063, 835)],
):
    cv2.fillPoly(mask, [np.array(poly, np.int32)], cv2.GC_BGD)

bgd = np.zeros((1, 65), np.float64)
fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

# Keep the largest component, close small holes, soften the edge by a pixel.
n, labels, stats, _ = cv2.connectedComponentsWithStats(alpha)
largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
alpha = np.where(labels == largest, 255, 0).astype(np.uint8)
alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)

rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
rgba[:, :, 3] = alpha
cv2.imwrite(out, rgba)
cv2.imwrite(out.replace(".png", "-alpha.png"), alpha)
print("ok", alpha.mean())
