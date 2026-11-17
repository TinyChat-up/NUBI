"""Export Image Gen artwork only: PNG/sRGB sizes and labelled review sheets.

No character drawing. Native raster files stay in docs, outside the application.
Run from any directory after generation.json records have been populated.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw, ImageFont, ImageCms
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/art-batch-5'
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
records = json.loads((OUT / 'generation.json').read_text())['records']
assert len(records) == 9
exports = []
for record in records:
    native = ROOT / record['nativeFile']
    image = Image.open(native).convert('RGBA')
    assert image.width == image.height
    assert image.getchannel('A').getextrema() == (0,255)
    # Image Gen leaves isolated alpha=1/2 pixels far outside the subject.
    # Remove only this <1% opacity export noise; retain native raster unchanged.
    image.putalpha(image.getchannel('A').point(lambda a: 0 if a <= 2 else a))
    files = []
    for width in (1024,256,512):
        suffix = '' if width == 1024 else f'-{width}w'
        relative = f"/media/emotions/{record['id'].removeprefix('emo-')}{suffix}.png"
        dest = ROOT / ('public' + relative)
        dest.parent.mkdir(parents=True, exist_ok=True)
        output = image if image.size == (width,width) else image.resize((width,width), Image.Resampling.LANCZOS)
        output.save(dest, optimize=True, icc_profile=SRGB)
        files.append(dict(file=relative, width=width, exportSize=[width,width], sourceSize=list(image.size), resampled=image.size != (width,width), alphaNoiseFloor=2, bytes=dest.stat().st_size, sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
    main, *variants = files
    main.pop('width')
    exports.append(dict(id=record['id'], source=record['nativeFile'], nativeSha256=hashlib.sha256(native.read_bytes()).hexdigest(), **main, variants=variants))
(OUT/'exports.json').write_text(json.dumps(exports, ensure_ascii=False, indent=2)+'\n')
manifest_file = ROOT/'docs/art-direction/delivery.json'
manifest = json.loads(manifest_file.read_text())
ids = {e['id'] for e in exports}
manifest['assets'] = [a for a in manifest['assets'] if a['id'] not in ids] + exports
manifest['lastBatch'] = 'phase-10-batch-5'
manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font = ImageFont.truetype(font_path, 19)
names = ['Alegría','Calma','Sorpresa','Curiosidad','Inseguridad','Frustración','Tristeza','Enfado','Cansancio']
for target, sizes, cell in [('collection-review.png',[280],(360,340)),('small-size-review.png',[64,80,100],(360,180))]:
    sheet = Image.new('RGB',(cell[0]*3,cell[1]*3),'#fbf5ea')
    draw = ImageDraw.Draw(sheet)
    for i, (record,name) in enumerate(zip(records,names)):
        image = Image.open(ROOT/('public'+exports[i]['file']))
        x,y=(i%3)*cell[0],(i//3)*cell[1]
        if len(sizes)==1:
            thumb=image.resize((280,280),Image.Resampling.LANCZOS)
            sheet.paste(thumb,(x+40,y+10),thumb)
        else:
            for dx,size in zip([20,125,235],sizes):
                thumb=image.resize((size,size),Image.Resampling.LANCZOS)
                sheet.paste(thumb,(x+dx,y+12+100-size),thumb)
                draw.text((x+dx,y+115),str(size)+' px',font=font,fill='#22606b')
        draw.text((x+cell[0]//2,y+cell[1]-28),name,font=font,fill='#163f47',anchor='mt')
    sheet.save(OUT/target,icc_profile=SRGB,optimize=True)
# Alpha review on dark surface at native 1:1 scaled for comparison.
sheet=Image.new('RGB',(900,900),'#163f47')
for i,e in enumerate(exports):
    thumb=Image.open(ROOT/('public'+e['file'])).resize((280,280),Image.Resampling.LANCZOS)
    sheet.paste(thumb,((i%3)*300+10,(i//3)*300+10),thumb)
sheet.save(OUT/'alpha-review.png',icc_profile=SRGB,optimize=True)
print('Exported 9 PNGs + 18 responsive variants, sRGB; 3 review sheets. Resampling recorded in exports.json.')
