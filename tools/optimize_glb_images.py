"""Losslessly preserve GLB structure while shrinking embedded display textures.

Usage: python tools/optimize_glb_images.py SOURCE OUTPUT
Only image buffer views change; mesh buffers, skins, clips and extensions stay intact.
"""
import io
import json
import struct
import sys
from pathlib import Path
from PIL import Image

src, dst = map(Path, sys.argv[1:3])
data = src.read_bytes()
magic, version, length = struct.unpack_from('<III', data)
assert magic == 0x46546c67 and version == 2 and length == len(data)
json_len, json_type = struct.unpack_from('<II', data, 12)
assert json_type == 0x4e4f534a
doc = json.loads(data[20:20 + json_len])
bin_chunk_at = 20 + json_len
bin_len, bin_type = struct.unpack_from('<II', data, bin_chunk_at)
assert bin_type == 0x004e4942
binary = data[bin_chunk_at + 8:bin_chunk_at + 8 + bin_len]
image_views = {}
for image in doc.get('images', []):
    view_idx = image.get('bufferView')
    if view_idx is None:
        continue
    view = doc['bufferViews'][view_idx]
    raw = binary[view.get('byteOffset', 0):view.get('byteOffset', 0) + view['byteLength']]
    bitmap = Image.open(io.BytesIO(raw))
    if bitmap.mode == 'P' and 'transparency' in bitmap.info:
        bitmap = bitmap.convert('RGBA')
    size_limit = 256 if image.get('name', '').lower() == 'thumbnail' else 1024
    if max(bitmap.size) > size_limit:
        bitmap.thumbnail((size_limit, size_limit), Image.Resampling.LANCZOS)
    output = io.BytesIO()
    has_alpha = bitmap.mode in ('RGBA', 'LA') and bitmap.getextrema()[-1][0] < 255
    # VRM transparent hair/eye textures need their alpha channel, normals stay PNG.
    if has_alpha or 'nml' in image.get('name', '').lower() or 'normal' in image.get('name', '').lower():
        bitmap.save(output, 'PNG', optimize=True)
        new_mime = 'image/png'
    else:
        bitmap.convert('RGB').save(output, 'JPEG', quality=88, optimize=True, subsampling=0)
        new_mime = 'image/jpeg'
    if len(output.getvalue()) < len(raw):
        image_views[view_idx] = output.getvalue()
        image['mimeType'] = new_mime

packed = bytearray()
for idx, view in enumerate(doc['bufferViews']):
    raw = image_views.get(idx)
    if raw is None:
        start = view.get('byteOffset', 0)
        raw = binary[start:start + view['byteLength']]
    while len(packed) % 4:
        packed.append(0)
    view['byteOffset'] = len(packed)
    view['byteLength'] = len(raw)
    packed.extend(raw)
while len(packed) % 4:
    packed.append(0)
doc['buffers'][0]['byteLength'] = len(packed)
json_bytes = json.dumps(doc, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
json_bytes += b' ' * (-len(json_bytes) % 4)
result = (struct.pack('<III', magic, version, 12 + 8 + len(json_bytes) + 8 + len(packed))
          + struct.pack('<II', len(json_bytes), json_type) + json_bytes
          + struct.pack('<II', len(packed), bin_type) + packed)
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_bytes(result)
print(f'{src}: {len(data):,} -> {len(result):,} bytes; {len(image_views)} images optimized')
