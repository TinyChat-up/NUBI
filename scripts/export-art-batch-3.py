"""Export only: real image_gen artwork -> WebP sizes and review contact sheet.

No artwork is drawn by this script. Native PNGs are retained in the review folder.
Run from the repository root, with ImageMagick available.
"""
import hashlib
import json
from pathlib import Path
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/art-batch-3'
records = json.loads((OUT / 'generation.json').read_text())['records']
exports = []
for r in records:
    source = ROOT / r['nativeFile']
    assert hashlib.sha256(source.read_bytes()).hexdigest() == r['nativeSha256']
    original_size = list(Image.open(source).size)
    short = r['id'].removeprefix('ume-')
    base = '/media/stories/una-manana-diferente/options/' + short
    deliveries = []
    for width in [2048, 800, 1200]:
        height = width * 3 // 4
        file = base + ('' if width == 2048 else f'-{width}w') + '.webp'
        target = ROOT / ('public' + file)
        target.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['magick', str(source), '-strip', '-filter', 'Lanczos',
                        '-resize', f'{width}x{height}!', '-quality', '78',
                        '-define', 'webp:method=6', str(target)], check=True)
        assert Image.open(target).size == (width, height)
        deliveries.append(dict(file=file, source=Path(r['source']).name, sourceSize=original_size,
                               exportSize=[width, height], bytes=target.stat().st_size,
                               sha256=hashlib.sha256(target.read_bytes()).hexdigest(),
                               quality=78, resampled=original_size != [width, height], width=width))
    main, *variants = deliveries
    main.pop('width')
    exports.append(dict(id=r['id'], **main, variants=variants))

(OUT / 'exports.json').write_text(json.dumps(exports, indent=2) + '\n')
manifest_file = ROOT / 'docs/art-direction/delivery.json'
manifest = json.loads(manifest_file.read_text())
ids = {x['id'] for x in exports}
manifest['assets'] = [x for x in manifest['assets'] if x['id'] not in ids] + exports
manifest['lastBatch'] = 'phase-6-batch-3'
manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

# Comparison sheet: resize existing art + labels OUTSIDE the app artwork.
rows = []
for name in ['preguntar', 'horario', 'adulto', 'regulacion', 'tiempo', 'salir']:
    row = OUT / (name + '-review.webp')
    a = ROOT / ('public/media/stories/una-manana-diferente/options/opt-' + name + '.webp')
    b = ROOT / ('public/media/stories/una-manana-diferente/options/c-' + name + '.webp')
    subprocess.run(['magick', '(', str(a), '-resize', '600x450', ')', '(', str(b),
                    '-resize', '600x450', ')', '+append', '-background', '#fbf5ea',
                    '-fill', '#22606b', '-font', 'DejaVu-Sans', '-pointsize', '24',
                    '-gravity', 'north', '-splice', '0x46', '-annotate', '+0+9',
                    name.upper() + ' : OPCIÓN → CONSECUENCIA', '-quality', '85', str(row)], check=True)
    rows.append(row)
subprocess.run(['magick', *map(str, rows), '-append', '-quality', '85',
                str(OUT / 'pairs-review.webp')], check=True)
for row in rows:
    row.unlink()
print(f'Exported {len(exports)} illustrations + 24 variants; comparison sheet ready.')
