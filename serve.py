#!/usr/bin/env python3
"""Atlas GRC - servidor local.

Sirve la carpeta app/ y, bajo /material/, los PDF de la carpeta del curso
(..\\GRC-Master Evolve), solo lectura y solo PDF. Nada sale de este ordenador.

Uso:  python serve.py [puerto] [--no-browser]     (por defecto http://127.0.0.1:8643)
"""
import http.server, os, sys, threading, urllib.parse, webbrowser
from functools import partial

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, 'app')
MATERIAL = os.path.realpath(os.path.join(HERE, '..', 'GRC-Master Evolve'))
ROUTES = {'/material/': (MATERIAL, ('.pdf', '.docx', '.xlsx', '.html'))}
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
PORT = int(ARGS[0]) if ARGS else 8643


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.json': 'application/json', '.js': 'text/javascript', '.webp': 'image/webp',
                      '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.svg': 'image/svg+xml',
                      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def translate_path(self, path):
        clean = urllib.parse.unquote(path.split('?', 1)[0].split('#', 1)[0])
        for prefix, (base, exts) in ROUTES.items():
            if clean.startswith(prefix):
                full = os.path.realpath(os.path.join(base, clean[len(prefix):]))
                if full.startswith(base + os.sep) and full.lower().endswith(exts):
                    return full
                return os.path.join(ROOT, '__no_existe__')
        return super().translate_path(path)

    def list_directory(self, path):
        self.send_error(404)
        return None


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), partial(Handler, directory=ROOT))
    url = f'http://127.0.0.1:{PORT}/'
    print(f'Atlas GRC en {url}  (cierra esta ventana para apagarlo)')
    if '--no-browser' not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
