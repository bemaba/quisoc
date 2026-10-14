# QUI SOC DARRERE LA PANTALLA?

Aplicació educativa interactiva en català per a 3r d'ESO sobre identitat digital, autoestima, xarxes socials i benestar.

## Desenvolupament local

Requisits: Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000).

Comandes disponibles: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

## Arquitectura

- **Next.js + TypeScript + Tailwind CSS:** interfície web responsive.
- **Vercel:** hosting i desplegaments des de GitHub.
- **Supabase (fase posterior):** autenticació docent i dades d'aula, amb Row Level Security.
- **Progrés local:** la primera versió desa les missions completades al navegador.

## Experiència educativa

Cinc missions desbloquejables i 13 actuacions distribuïdes en 17 sessions. Les missions inclouen continguts, activitats, pistes, reintents i retroacció. Les reflexions personals són voluntàries i no condicionen el progrés.

## Estat del projecte

El prototip inicial inclou el mapa de missions i una activitat interactiva funcional a la primera missió. Les missions 2–5 tenen ara la seva estructura de presentació; els seus exercicis s'afegiran de manera iterativa.

Consulta [l'arquitectura i les decisions tècniques](./docs/arquitectura-quisoc.md).