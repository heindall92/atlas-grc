"""Pasa a texto (Markdown) todo el material del curso con MarkItDown, para redactar fichas y ejercicios.

Uso:   python tools/extraer.py            ->  sources/md/<nombre>.md
Necesita:  pip install "markitdown[all]"

- Solo LEE la carpeta ..\\GRC-Master Evolve. No modifica nada allí.
- Los PDF se convierten página a página (con un encabezado «## Página N») para poder
  citar «Doc, pág. N» en la app. Los DOCX y XLSX se convierten con MarkItDown tal cual.
- Si un fichero ya está convertido y no ha cambiado, se salta.
"""
import io
import os
import sys

from markitdown import MarkItDown

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.realpath(os.path.join(HERE, '..', 'GRC-Master Evolve'))
OUT = os.path.join(HERE, 'sources', 'md')
SKIP = ('SCAN-ISO-42001',)          # ISO 42001: fuera del alcance
EXTS = ('.pdf', '.docx', '.xlsx', '.html')


def slug(rel):
    base = os.path.splitext(rel)[0].replace('\\', '/').replace('/', '__')
    keep = ''.join(c if c.isalnum() or c in '-_.' else '-' for c in base)
    while '--' in keep:
        keep = keep.replace('--', '-')
    return keep.strip('-')[:120]


def pdf_pages(path):
    """Texto de cada página con pdfminer (el mismo motor que usa MarkItDown para PDF)."""
    from pdfminer.high_level import extract_text
    from pdfminer.pdfpage import PDFPage
    with open(path, 'rb') as f:
        n = sum(1 for _ in PDFPage.get_pages(f))
    out = []
    for i in range(n):
        try:
            t = extract_text(path, page_numbers=[i]) or ''
        except Exception as e:  # páginas rotas: se anotan y se sigue
            t = f'[no se pudo leer: {e}]'
        out.append(t.replace('\t', ' ').strip())
    return out


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    os.makedirs(OUT, exist_ok=True)
    md = MarkItDown()
    for root, _, files in os.walk(SRC):
        if 'Proyecto 1' in root:
            continue
        for fn in sorted(files):
            if not fn.lower().endswith(EXTS) or any(s in fn for s in SKIP):
                continue
            full = os.path.join(root, fn)
            if os.path.getsize(full) == 0:
                print('vacío, se ignora:', fn)
                continue
            rel = os.path.relpath(full, SRC)
            dst = os.path.join(OUT, slug(rel) + '.md')
            if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(full):
                continue
            try:
                if fn.lower().endswith('.pdf'):
                    pages = pdf_pages(full)
                    body = '\n\n'.join(f'## Página {i + 1}\n\n{t}' for i, t in enumerate(pages))
                    empty = sum(1 for t in pages if len(t) < 20)
                    note = f'{len(pages)} págs.' + (f', {empty} sin texto (escaneadas: harían falta OCR)' if empty else '')
                else:
                    body = md.convert(full).text_content
                    note = 'MarkItDown'
                with io.open(dst, 'w', encoding='utf-8') as f:
                    f.write(f'<!-- origen: {rel} -->\n# {os.path.splitext(fn)[0]}\n\n{body}\n')
                print('ok  ', rel, '·', note)
            except Exception as e:
                print('FALLO', rel, '·', e)


if __name__ == '__main__':
    main()
