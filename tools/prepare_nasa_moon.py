"""Project NASA LROC's lunar equirectangular map into a transparent moon disc."""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets/models'
source = np.asarray(Image.open(root / 'moon-nasa-lroc-2k.jpg').convert('RGB'))
h, w = source.shape[:2]
size = 512
y, x = np.mgrid[0:size, 0:size]
nx = (x + .5 - size / 2) / (size * .455)
ny = (size / 2 - y - .5) / (size * .455)
r2 = nx * nx + ny * ny
z = np.sqrt(np.maximum(0, 1 - r2))
lon = np.arctan2(nx, z)
lat = np.arcsin(np.clip(ny, -1, 1))
sx = np.mod((.5 + lon / (2 * np.pi)) * w, w).astype(int)
sy = np.clip((.5 - lat / np.pi) * h, 0, h - 1).astype(int)
light = np.clip(.77 + .23 * z, 0, 1)
rgb = np.clip(source[sy, sx] * light[..., None] * 1.10, 0, 255).astype(np.uint8)
alpha = (np.clip((1 - r2) * 95, 0, 1) * 255).astype(np.uint8)
Image.fromarray(np.dstack([rgb, alpha]), 'RGBA').save(root / 'moon-nasa-disc.png', optimize=True)
