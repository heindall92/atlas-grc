"""Atlas GRC · cabecera animada del README con la ciudad 3D.

1. Sirve una copia pública de app/ (con tools/cabecera-ciudad.html copiado dentro) en http://127.0.0.1:8652/.
2. Renderiza N fotogramas de la ciudad con Chrome sin ventana (WebGL por software).
3. Los compone sobre el fondo de la cabecera y guarda docs/assets/atlas-header-ciudad.webp.

Uso: python tools/cabecera.py <carpeta_de_trabajo>
"""
import os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

N, FPS = 72, 14
CH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = sys.argv[1]
FR = os.path.join(WORK, 'frames'); os.makedirs(FR, exist_ok=True)


def shot(url, out, size, prof, vt=6000):
    subprocess.run([CH, '--headless=new', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars',
                    '--default-background-color=00000000', f'--user-data-dir={os.path.join(WORK, prof)}',
                    f'--window-size={size}', f'--virtual-time-budget={vt}', f'--screenshot={out}', url],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)


# Fondo: la cabecera de siempre sin los iconos flotantes y con el subtítulo más corto
svg = open(os.path.join(ROOT, 'docs', 'assets', 'atlas-header.svg'), encoding='utf-8').read()
svg = re.sub(r'\s*<!-- iconos de Lucide flotando.*?(?=\n  </g>\n</svg>)', '', svg, flags=re.S)
svg = svg.replace('Aprende la norma desde cero, practica y construye un SGSI real.', 'Aprende la norma desde cero y construye un SGSI real.')
base_svg = os.path.join(WORK, 'base.svg'); open(base_svg, 'w', encoding='utf-8').write(svg)
base_png = os.path.join(WORK, 'base.png')
shot('file:///' + base_svg.replace(os.sep, '/'), base_png, '1280,320', 'chb', 3000)   # a los 3 s la aguja ya apunta al norte

# Fotogramas de la ciudad
def frame(k):
    out = os.path.join(FR, f'f{k:03d}.png')
    for tries in range(4):   # con varios Chrome a la vez alguno sale vacío: se repite
        if os.path.exists(out) and Image.open(out).getbbox():
            break
        shot(f'http://127.0.0.1:8652/cabecera-ciudad.html?p={k / N:.5f}&z=1.08', out, '900,660', f'chf{k}-{tries}')
    return out
with ThreadPoolExecutor(4) as ex:
    files = list(ex.map(frame, range(N)))

# Recorte común (unión de las cajas de todos los fotogramas)
box = None
for f in files:
    b = Image.open(f).getbbox()
    box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
base = Image.open(base_png).convert('RGBA')
H = 300
out = []
for f in files:
    c = Image.open(f).convert('RGBA').crop(box)
    s = H / c.height; c = c.resize((round(c.width * s), H), Image.LANCZOS)
    im = base.copy(); im.alpha_composite(c, (1280 - c.width - 24, 320 - H - 6))
    out.append(im.convert('RGB'))
dst = os.path.join(ROOT, 'docs', 'assets', 'atlas-header-ciudad.webp')
out[0].save(dst, save_all=True, append_images=out[1:], duration=round(1000 / FPS), loop=0, quality=78, method=6)
out[0].save(os.path.join(ROOT, 'docs', 'assets', 'atlas-header-ciudad.png'), optimize=True)
print('ok', dst, os.path.getsize(dst) // 1024, 'KB', 'recorte', box)
