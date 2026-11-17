"""Verify the nine delivered emotion PNGs and responsive variants with Pillow.

No production dependencies; run: python tests/art-batch-5-files.py
"""
from pathlib import Path
import hashlib
import json
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/art-batch-5'
expected={f'emo-{s}' for s in ['alegria','calma','sorpresa','curiosidad','inseguridad','frustracion','tristeza','enfado','cansancio']}
exports=json.loads((OUT/'exports.json').read_text())
assert {e['id'] for e in exports} == expected
seen=[]
for e in exports:
    native=ROOT/e['source']
    assert hashlib.sha256(native.read_bytes()).hexdigest() == e['nativeSha256']
    for f in [e,*e['variants']]:
        path=ROOT/('public'+f['file'])
        assert hashlib.sha256(path.read_bytes()).hexdigest() == f['sha256']
        with Image.open(path) as im:
            im.load()
            assert im.format == 'PNG' and im.mode == 'RGBA', path
            assert list(im.size) == f['exportSize'], path
            assert im.width in (1024,256,512) and im.width == im.height, path
            assert im.info.get('icc_profile'), path
            alpha=im.getchannel('A')
            low, high = alpha.getextrema()
            assert low == 0 and high >= 250, path
            # Safe transparent border: subject cannot touch or clip canvas edges.
            assert alpha.crop((0,0,im.width,2)).getbbox() is None, path
            assert alpha.crop((0,im.height-2,im.width,im.height)).getbbox() is None, path
            assert alpha.crop((0,0,2,im.height)).getbbox() is None, path
            assert alpha.crop((im.width-2,0,im.width,im.height)).getbbox() is None, path
            histogram=alpha.histogram()
            assert histogram[0] > im.width*im.height*.1, path
            # Resampled painted interiors may be alpha=254 rather than 255.
            assert sum(histogram[250:]) > im.width*im.height*.1, path
            seen.append(dict(file=f['file'],size=list(im.size),alpha=alpha.getextrema(),bytes=path.stat().st_size,sha256=f['sha256']))
assert len(seen)==27
(OUT/'file-validation.json').write_text(json.dumps(seen,indent=2)+'\n')
print('PASS 9 native checksums + 27 PNG files: hashes, format, sizes, ICC, real alpha, safe transparent borders')
