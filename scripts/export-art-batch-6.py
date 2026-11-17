"""Export real generated raster art and review sheets; no drawing of application assets."""
from pathlib import Path
import json,hashlib
from PIL import Image,ImageCms,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1]; O=R/'docs/art-batch-6'
profile=ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
records=json.loads((O/'generation.json').read_text()); exports=[]
for r in records:
 native=R/r['nativeFile']; im=Image.open(native); istool=r['id'].startswith('tool-'); im=im.convert('RGBA' if istool else 'RGB')
 if istool:
  assert im.getchannel('A').getextrema()[0]==0
  im.putalpha(im.getchannel('A').point(lambda a:0 if a<=2 else a))
 ratio=1 if istool else 4/3; target=(1024,1024) if istool else (2048,1536)
 assert abs(im.width/im.height-ratio)<.01,(r['id'],im.size)
 files=[]
 for w in ([1024,256,512] if istool else [2048,800,1200]):
  h=round(w/ratio); suffix='' if w==target[0] else f'-{w}w'; ext='png' if istool else 'webp'; sub='tools' if istool else 'places'; name=r['id'].split('-',1)[1]
  f=f'/media/{sub}/{name}{suffix}.{ext}'; dest=R/('public'+f); dest.parent.mkdir(parents=True,exist_ok=True)
  out=im.resize((w,h),Image.Resampling.LANCZOS)
  if istool:
   inner=im.resize((round(w*.94),round(h*.94)),Image.Resampling.LANCZOS)
   out=Image.new('RGBA',(w,h)); out.paste(inner,((w-inner.width)//2,(h-inner.height)//2))
  out.save(dest,icc_profile=profile,**({'optimize':True} if istool else {'quality':80,'method':6}))
  files.append(dict(file=f,width=w,exportSize=[w,h],sourceSize=list(im.size),resampled=im.size!=(w,h),alphaNoiseFloor=2 if istool else None,canvasInset=.03 if istool else 0,bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 main,*variants=files; main.pop('width'); exports.append(dict(id=r['id'],source=r['nativeFile'],nativeSha256=hashlib.sha256(native.read_bytes()).hexdigest(),**main,variants=variants))
(O/'exports.json').write_text(json.dumps(exports,ensure_ascii=False,indent=2)+'\n')
p=R/'docs/art-direction/delivery.json'; data=json.loads(p.read_text()); ids={e['id'] for e in exports}; data['assets']=[e for e in data['assets'] if e['id'] not in ids]+exports; data['lastBatch']='phase-12-batch-6'; p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
labels={'tool-pedir-ayuda':'Pedir ayuda','tool-descansar':'Descansar','tool-espacio-tranquilo':'Espacio tranquilo','tool-comunicar-necesidad':'Comunicar una necesidad','tool-anticipar-cambios':'Anticipar cambios','tool-expresar-desacuerdo':'Expresar desacuerdo','tool-apoyos-sensoriales':'Apoyos sensoriales','place-colegio':'Colegio','place-casa':'Casa','place-parque':'Parque','place-amigos':'Amigos','place-emociones':'Emociones','place-herramientas':'Herramientas'}
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
for name,group,small,dark in [('tools-review',exports[:7],False,False),('legibility-review',exports[:7],True,False),('places-review',exports[7:],False,False),('alpha-review',exports[:7],False,True)]:
 cw,ch=420,(230 if small else 350); sheet=Image.new('RGB',(3*cw,((len(group)+2)//3)*ch),'#163f47' if dark else '#fbf5ea'); draw=ImageDraw.Draw(sheet)
 for i,e in enumerate(group):
  x,y=i%3*cw,i//3*ch; im=Image.open(R/('public'+e['file']))
  if small:
   for dx,w in [(10,56),(95,96),(225,176)]:
    thumb=im.resize((w,w),Image.Resampling.LANCZOS); sheet.paste(thumb,(x+dx,y+180-w),thumb); draw.text((x+dx,y+183),str(w)+' px',font=font,fill='#22606b')
  else:
   im.thumbnail((390,285),Image.Resampling.LANCZOS); sheet.paste(im,(x+(cw-im.width)//2,y+10),im if im.mode=='RGBA' else None)
  draw.text((x+cw//2,y+ch-28),labels[e['id']],font=font,fill='#fbf5ea' if dark else '#163f47',anchor='mt')
 sheet.save(O/(name+'.png'),icc_profile=profile,optimize=True)
print('Exported 13 assets, 26 variants, four review sheets; resampling in exports.json')
