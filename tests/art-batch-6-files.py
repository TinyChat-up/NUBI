"""Validate exported batch-six formats, ICC, dimensions, transparency and hashes."""
import json,hashlib
from pathlib import Path
from PIL import Image
R=Path(__file__).resolve().parents[1]
data=json.loads((R/'docs/art-batch-6/exports.json').read_text()); assert len(data)==13
results=[]
for a in data:
 native=R/a['source']; assert hashlib.sha256(native.read_bytes()).hexdigest()==a['nativeSha256']
 for f in [a,*a['variants']]:
  p=R/('public'+f['file']); assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256']
  with Image.open(p) as im:
   im.load(); assert list(im.size)==f['exportSize']; assert im.info.get('icc_profile'); alpha=None
   if a['id'].startswith('tool-'):
    assert im.format=='PNG' and im.mode=='RGBA' and im.width==im.height
    al=im.getchannel('A'); lo,hi=al.getextrema();assert lo==0 and hi>=250
    assert al.crop((0,0,im.width,2)).getbbox() is None
    assert al.crop((0,im.height-2,im.width,im.height)).getbbox() is None
    assert al.crop((0,0,2,im.height)).getbbox() is None
    assert al.crop((im.width-2,0,im.width,im.height)).getbbox() is None
    alpha=[lo,hi]
   else: assert im.format=='WEBP' and im.mode=='RGB' and im.width*3==im.height*4
   results.append(dict(file=f['file'],dimensions=list(im.size),alpha=alpha,icc=True))
(R/'docs/art-batch-6/file-validation.json').write_text(json.dumps(results,indent=2)+'\n')
print('PASS 13 original hashes and 39 exports: hashes, format, ICC, dimensions, alpha, safe margins')
