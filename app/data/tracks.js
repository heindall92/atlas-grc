/* Registro de normas («pistas») de Atlas GRC.
   Para añadir una norma nueva (ENS, ISO 27005, ISO 22301…):
     1. Cambia su status a 'activo' aquí.
     2. Crea app/data/<id>/content.js con ATLAS.track('<id>').content = {...} (mismo formato que iso27001).
     3. Añade sus <script> en index.html.
   Cada norma tiene su propio color (--track) y su propio progreso. */
window.ATLAS = {
  tracks: [
    {id: 'iso27001', name: 'ISO/IEC 27001:2022', short: 'ISO 27001', sub: 'Sistema de gestión de la seguridad de la información', color: '#5e5ce6', color2: '#bf5af2', dark: '#7d7aff', dark2: '#da8fff', status: 'activo'},
    {id: 'ens', name: 'Esquema Nacional de Seguridad', short: 'ENS', sub: 'RD 311/2022 · categorías, medidas del Anexo II, Declaración de Conformidad', color: '#c8102e', color2: '#ffb000', dark: '#ff5a6e', dark2: '#ffc53d', status: 'pronto'},
    {id: 'iso27005', name: 'ISO/IEC 27005 · MAGERIT', short: 'Riesgos', sub: 'Análisis y gestión de riesgos con MAGERIT v3 y PILAR', color: '#d9480f', color2: '#f59f00', dark: '#ff8a4c', dark2: '#ffc34d', status: 'pronto'},
    {id: 'iso22301', name: 'ISO 22301 · Continuidad', short: 'Continuidad', sub: 'BIA, plan de continuidad y recuperación', color: '#2b8a3e', color2: '#20c997', dark: '#51cf66', dark2: '#63e6be', status: 'pronto'},
    {id: 'iso19011', name: 'ISO 19011 · Auditoría', short: 'Auditoría', sub: 'Principios, programa y realización de auditorías', color: '#0b7285', color2: '#4dabf7', dark: '#3bc9db', dark2: '#74c0fc', status: 'pronto'},
    {id: 'iso27701', name: 'ISO/IEC 27701 · Privacidad', short: 'Privacidad', sub: 'Extensión de privacidad del SGSI (RGPD)', color: '#862e9c', color2: '#f06595', dark: '#da77f2', dark2: '#faa2c1', status: 'pronto'}
  ],
  _data: {},
  track(id) { return this._data[id] || (this._data[id] = {}); }
};
