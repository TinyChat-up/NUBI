"""Export real generated comic artwork, preserve native files, and build review sheet.

ImageMagick only resizes/compresses existing images and labels the review sheet.
Run from the repository root with Pillow and ImageMagick installed externally.
"""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/art-batch-4'
generation_file = OUT / 'generation.json'
generation = json.loads(generation_file.read_text())
plan = json.loads((OUT / 'plan.json').read_text())['panels']
specs = {p['illustration']: p['asset'] for p in plan}
(OUT / 'originals').mkdir(exist_ok=True)
exports = []
for r in generation['records']:
    native = ROOT / r.get('nativeFile', f"docs/art-batch-4/originals/{r['id']}.png")
    if not native.exists() or not r.get('nativeFile'):
        shutil.copyfile(r['source'], native)
    r['nativeFile'] = str(native.relative_to(ROOT))
    digest = hashlib.sha256(native.read_bytes()).hexdigest()
    if r.get('nativeSha256'):
        assert digest == r['nativeSha256']
    r['nativeSha256'] = digest
    original_size = list(Image.open(native).size)
    spec = specs[r['id']]
    size = spec['size']
    assert abs(original_size[0] / original_size[1] - size['width'] / size['height']) < .003
    files = []
    for width in [size['width'], 800, 1200]:
        height = round(width * size['height'] / size['width'])
        file = spec['file'] if width == size['width'] else spec['file'].replace('.webp', f'-{width}w.webp')
        dest = ROOT / ('public' + file)
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['magick', str(native), '-strip', '-filter', 'Lanczos', '-resize',
                        f'{width}x{height}!', '-quality', '76', '-define', 'webp:method=6', str(dest)], check=True)
        assert Image.open(dest).size == (width, height)
        files.append(dict(file=file, source=Path(r['source']).name, sourceSize=original_size,
                          exportSize=[width, height], bytes=dest.stat().st_size,
                          sha256=hashlib.sha256(dest.read_bytes()).hexdigest(), quality=76,
                          resampled=original_size != [width, height], width=width))
    main, *variants = files
    main.pop('width')
    exports.append(dict(id=r['id'], **main, variants=variants))
generation_file.write_text(json.dumps(generation, ensure_ascii=False, indent=2) + '\n')
(OUT / 'exports.json').write_text(json.dumps(exports, indent=2) + '\n')
manifest_file = ROOT / 'docs/art-direction/delivery.json'
manifest = json.loads(manifest_file.read_text())
ids = {x['id'] for x in exports}
manifest['assets'] = [x for x in manifest['assets'] if x['id'] not in ids] + exports
manifest['lastBatch'] = 'phase-8-batch-4'
manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

# Sheet includes the previously delivered first panel, without changing it.
cells = []
for panel in plan:
    source = ROOT / ('public' + panel['asset']['file'])
    if not source.exists():
        continue
    cell = OUT / (panel['id'] + '-cell.webp')
    subprocess.run(['magick', str(source), '-thumbnail', '396x297', '-background', '#fbf5ea',
                    '-gravity', 'center', '-extent', '400x300', '-fill', '#22606b',
                    '-font', 'DejaVu-Sans', '-pointsize', '20', '-gravity', 'south',
                    '-splice', '0x30', '-annotate', '+0+5', panel['illustration'], str(cell)], check=True)
    cells.append(cell)
subprocess.run(['magick', 'montage', *map(str, cells), '-tile', '3x', '-geometry', '+4+4',
                '-background', '#fbf5ea', '-quality', '85', str(OUT / 'sequence-review.webp')], check=True)
for cell in cells:
    cell.unlink()
print(f'Exported {len(exports)} new panels and {len(exports)*2} responsive variants.')
