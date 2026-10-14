# QUI SOC DARRERE LA PANTALLA?

Aplicació educativa interactiva en català per a 3r d'ESO sobre identitat digital, autoestima, xarxes socials i benestar.

## Objectiu

Crear una experiència educativa digital per explorar com les xarxes socials poden influir en la identitat, l'autoestima, la salut mental, les relacions i els hàbits quotidians. El projecte combina cinc missions narratives desbloquejables i 13 actuacions, distribuïdes en 17 sessions.

## Arquitectura proposada

- **Frontend:** Next.js + TypeScript, responsive per ordinador i tauleta, allotjat a Vercel.
- **Dades i autenticació docent:** Supabase (Postgres, Auth i Row Level Security).
- **Continguts educatius:** definicions tipades i versionades al repositori inicialment.
- **Progrés de l'alumnat:** guardat localment al navegador en la primera versió.
- **Desplegament:** GitHub → Vercel; migracions versionades a Supabase.

## Experiència de l'alumnat

1. Portada: «QUI SOC DARRERE LA PANTALLA?»
2. Introducció narrativa a la plataforma fictícia MIRROR.
3. Mapa de cinc missions desbloquejables.
4. Activitats interactives amb pistes, reintents i retroacció.
5. Recursos, glossari i opcions d'accessibilitat.
6. Campanya digital final «Més enllà dels likes» i tancament reflexiu.

Les missions ja completades es poden tornar a visitar. Els qüestionaris personals són voluntaris i no bloquegen el progrés.

## Les cinc missions

1. **El mirall digital** — identitat, autoconceptualització, autoestima i autoimatge.
2. **La fàbrica dels likes** — comparació social, validació externa, filtres i ideals de bellesa.
3. **Atrapat a la pantalla** — hàbits digitals, FOMO, atenció i benestar.
4. **Darrere de l'algoritme** — recomanacions, personalització i convivència digital.
5. **Recuperem el control** — estratègies de benestar, síntesi i campanya final.

## Panell docent / administració

Ruta proposada: `/admin`, restringida a usuaris autenticats amb rol docent o administrador.

- Crear i gestionar grups/aules.
- Afegir i desactivar participants amb àlies o codis pseudònims.
- Iniciar, pausar, tancar i reiniciar una edició del repte.
- Consultar el progrés agregat per missió.
- Gestionar publicació i ordre de continguts en una fase posterior.
- Registrar accions administratives sensibles en un historial d'auditoria.

Els reinicis requereixen confirmació explícita i un àmbit clar (participant o edició). És preferible crear una nova edició del repte que eliminar l'historial.

## Model de dades inicial (Supabase)

- `profiles`: personal docent i rol, enllaçat amb `auth.users`.
- `classrooms`: aula/grup, estat i dates.
- `participants`: identificador pseudònim per aula.
- `challenge_runs`: edició del repte, estat i dates.
- `missions` i `activities`: estructura i configuració no sensible.
- `progress`: estat de missió/activitat i marca temporal mínima.
- `admin_audit_log`: actor, acció, àmbit afectat i data.

Totes les taules exposades han de tenir polítiques Row Level Security (RLS). La clau `service_role` mai no s'ha d'incloure al navegador; les operacions administratives s'han de validar al servidor.

## Privacitat i benestar

- No demanar noms reals, comptes de xarxes socials ni fotografies personals.
- No emmagatzemar respostes personals dels qüestionaris emocionals.
- No generar diagnòstics, perfils de risc, puntuacions d'autoestima ni rànquings.
- Les preguntes personals es poden ometre i no condicionen el desbloqueig.
- Si es detecta malestar important a l'aula, cal aplicar el protocol del centre; la web no interpreta ni classifica respostes.
- Definir minimització de dades, retenció i accés restringit per defecte.

## Fases de desenvolupament

1. **Prototip:** disseny, portada, narrativa, mapa de missions, desbloqueig, progrés local i una activitat funcional.
2. **Missió 1:** identitat i autoestima, casos ficticis, classificació conceptual i reflexió privada.
3. **Missions 2–3:** likes, comparació social, atenció, FOMO i hàbits digitals.
4. **Missions 4–5:** algoritmes, convivència, benestar i campanya final.
5. **Panell docent:** autenticació, aules, codis, control de les edicions i progrés agregat.
6. **Validació:** accessibilitat, privacitat, proves de permisos i pilot educatiu.

## Criteris d'acceptació

- Compatible amb ordinadors i tauletes.
- Navegació per teclat, bon contrast i textos llegibles.
- Alternatives a arrossegar elements i a interaccions temporitzades.
- Reintents i retroacció sense penalització competitiva.
- Desbloqueig basat en tasques digitals obligatòries, no en reflexions personals.
- Progrés local recuperable al mateix dispositiu.
- Cap credencial secreta al codi del navegador.
- RLS i proves d'autorització abans d'emmagatzemar progrés en servidor.

## Decisió recomanada per a l'MVP

El document de disseny indica que els comptes individuals, la base de dades i les estadístiques personals no són necessaris en la primera versió. Per tant, convé començar amb el progrés local i afegir Supabase quan s'implementin les funcions docents. La sincronització del progrés només s'hauria d'afegir si el pilot demostra que és necessària per treballar des de diversos dispositius.
