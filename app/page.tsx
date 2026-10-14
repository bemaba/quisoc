"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp, Compass, LockKeyhole, RotateCcw, Sparkles, Zap } from "lucide-react";
import { missions } from "@/lib/missions";

type Progress = Record<string, boolean>;

export default function Home() {
  const [completed, setCompleted] = useState<Progress>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quisoc-progress-v1");
      if (saved) setCompleted(JSON.parse(saved) as Progress);
    } catch {
      localStorage.removeItem("quisoc-progress-v1");
    }
    setReady(true);
  }, []);

  const doneCount = missions.filter((mission) => completed[mission.slug]).length;
  const firstIncomplete = missions.find((mission) => !completed[mission.slug]);
  const unlocked = (index: number) => index === 0 || missions.slice(0, index).every((mission) => completed[mission.slug]);

  function resetProgress() {
    if (!window.confirm("Vols reiniciar tot el progrés d'aquest dispositiu? Aquesta acció no es pot desfer.")) return;
    localStorage.removeItem("quisoc-progress-v1");
    setCompleted({});
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="shell flex h-[76px] items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3" aria-label="MIRROR, inici">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#c6a5ff]/40 bg-[#c6a5ff]/10 text-lg text-[#d7c1ff]">◉</span>
          <span className="font-display text-sm font-bold tracking-[.24em]">MIRROR<span className="text-[#c6a5ff]">.</span></span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-[#c1bdcd]">
          <a href="#missions" className="hidden transition hover:text-white sm:block">Les missions</a>
          <a href="#about" className="hidden transition hover:text-white sm:block">El repte</a>
          <a href="#missions" className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-[#c6a5ff]/60">Comença <ArrowRight className="ml-1 inline" size={14}/></a>
        </nav>
      </header>

      <section className="shell relative grid min-h-[580px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="relative z-10">
          <div className="eyebrow mb-6 flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#c6a5ff]"/> Un repte digital · 3r d'ESO</div>
          <h1 className="font-display max-w-[680px] text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl lg:text-[76px]">QUI SOC<br/><span className="text-[#c6a5ff]">DARRERE</span> LA<br/>PANTALLA<span className="text-[#f2a4db]">?</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#b9b5c6]">Descobreix què hi ha més enllà dels likes. Mira les xarxes amb uns altres ulls i investiga tot allò que no es veu a primera vista.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="primary-button" href="#missions">Comença el repte <ArrowRight size={17}/></a>
            <a className="secondary-button" href="#about"><CircleHelp size={16}/> Com funciona?</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#8f8a9f]">
            <span className="flex items-center gap-2"><Compass size={15} className="text-[#c6a5ff]"/> 5 missions</span>
            <span className="flex items-center gap-2"><Zap size={15} className="text-[#f2a4db]"/> 13 actuacions</span>
            <span className="flex items-center gap-2"><Sparkles size={15} className="text-[#91d9d0]"/> 17 sessions</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[490px]">
          <div className="absolute inset-10 rounded-full bg-[#8e62d8]/20 blur-[70px]"/>
          <div className="grid-noise glass relative overflow-hidden rounded-[28px] p-4 shadow-2xl shadow-black/40 sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f2a4db]"/><span className="h-2 w-2 rounded-full bg-[#f6c879]"/><span className="h-2 w-2 rounded-full bg-[#91d9d0]"/></div>
              <span className="text-[10px] tracking-[.2em] text-[#a8a2b8]">MIRROR / FEED</span>
              <span className="text-xs text-[#a8a2b8]">•••</span>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#101019]/90 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#c6a5ff] to-[#f2a4db] text-lg text-[#21152d]">L</div>
                <div><p className="text-sm font-semibold">laia.enconstruccio</p><p className="mt-0.5 text-xs text-[#8f8a9f]">Un dia qualsevol · fa 12 min</p></div>
                <span className="ml-auto text-[#c6a5ff]">✳</span>
              </div>
              <div className="my-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_50%_20%,rgba(198,165,255,.3),transparent_50%),linear-gradient(145deg,#28203c,#14141f_65%,#34223c)]">
                <div className="text-center"><div className="font-display text-5xl tracking-[.2em] text-white/80">?</div><p className="mt-2 text-[10px] tracking-[.25em] text-[#d9c8fa]">EL QUE VEUS ≠ TOT EL QUE HI HA</p></div>
              </div>
              <div className="flex items-center gap-4 text-sm"><span className="text-[#f2a4db]">♡</span><span>◯</span><span>↗</span><span className="ml-auto text-xs text-[#8f8a9f]">1.2k likes</span></div>
              <p className="mt-3 text-sm text-[#e9e5f2]"><span className="font-semibold">laia.enconstruccio</span> Avui tot perfecte ✨</p>
              <p className="mt-2 text-xs text-[#9c96ad]">Però... una publicació explica tota la història?</p>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#c6a5ff]/20 bg-[#c6a5ff]/[.07] p-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#c6a5ff]/15 text-[#d7c1ff]"><Sparkles size={17}/></span>
              <div><p className="text-xs font-semibold">Primera pista desbloquejada</p><p className="mt-1 text-[11px] text-[#aaa3bd]">La identitat digital és només una part de la història.</p></div>
              <ArrowUpRight className="ml-auto text-[#c6a5ff]" size={17}/>
            </div>
          </div>
          <div className="absolute -right-3 top-12 hidden rounded-2xl border border-white/10 bg-[#171521] px-4 py-3 shadow-xl sm:block"><p className="text-[10px] text-[#a8a2b8]">LA TEVA MISSIÓ</p><p className="mt-1 text-sm font-semibold">Mirar més enllà <span className="text-[#c6a5ff]">↗</span></p></div>
        </div>
      </section>

      <section id="missions" className="shell scroll-mt-8 py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-3">El mapa d'investigació</p><h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Cinc missions. Una nova mirada.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#a4a0b4]">Cada missió t'ajudarà a descobrir una peça del món digital. Completa els reptes per obrir el camí següent.</p></div>
          <div className="min-w-[180px] rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="flex items-center justify-between text-xs text-[#aaa3bd]"><span>Progrés del repte</span><span>{ready ? doneCount : 0}/5</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#c6a5ff] to-[#f2a4db] transition-all" style={{ width: `${doneCount * 20}%` }}/></div>
            <p className="mt-2 text-[11px] text-[#777187]">Desat en aquest dispositiu</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission, index) => {
            const isUnlocked = unlocked(index);
            const isCompleted = Boolean(completed[mission.slug]);
            return (
              <article key={mission.slug} className={`mission-card glass relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl p-5 ${isUnlocked ? "" : "locked opacity-60"}`}>
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full opacity-10 blur-3xl" style={{ background: mission.accent }}/>
                <div className="flex items-start justify-between">
                  <span className="font-display text-xs tracking-[.18em] text-[#8e879f]">MISSIÓ {String(mission.id).padStart(2, "0")}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border text-xl" style={{ color: mission.accent, borderColor: `${mission.accent}44`, background: `${mission.accent}12` }}>{isCompleted ? <Check size={20}/> : isUnlocked ? mission.icon : <LockKeyhole size={17}/>}</span>
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold">{mission.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#aaa5b8]">{mission.subtitle}</p>
                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-[#827c93]">{mission.sessions}</span>
                  {isUnlocked ? <Link className="flex items-center gap-1 text-xs font-semibold" style={{ color: mission.accent }} href={`/missio/${mission.slug}`}>{isCompleted ? "Torna-hi" : "Entra a la missió"} <ChevronRight size={15}/></Link> : <span className="flex items-center gap-1 text-xs text-[#777187]"><LockKeyhole size={12}/> Bloquejada</span>}
                </div>
                {isCompleted && <span className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: mission.accent }}/>}
              </article>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-4">
          <p className="flex items-center gap-2 text-xs leading-5 text-[#938da4]"><CircleHelp size={15} className="shrink-0 text-[#c6a5ff]"/> Pots repetir les activitats. Les reflexions personals són voluntàries i no bloquegen cap missió.</p>
          <button type="button" onClick={resetProgress} className="flex items-center gap-2 text-xs text-[#8d879e] transition hover:text-white"><RotateCcw size={13}/> Reiniciar progrés</button>
        </div>
      </section>

      <section id="about" className="shell scroll-mt-10 py-12">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#201a30] to-[#101018] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="eyebrow mb-3">No és un examen. És una investigació.</p><h2 className="font-display max-w-2xl text-2xl font-semibold sm:text-3xl">Les xarxes no expliquen tota la història. Tu pots aprendre a llegir entre línies.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa5b8]">Explora situacions fictícies, contrasta idees i troba estratègies per relacionar-te amb el món digital d'una manera més conscient, crítica i equilibrada.</p></div>
          <a href="#missions" className="primary-button whitespace-nowrap">Explora les missions <ArrowDown size={16}/></a>
        </div>
      </section>
      <footer className="shell mt-8 flex flex-col justify-between gap-3 border-t border-white/10 py-7 text-xs text-[#777187] sm:flex-row"><span className="font-display tracking-[.2em]">MIRROR / QUI SOC DARRERE LA PANTALLA?</span><span>Aprendre a mirar. Aprendre a triar.</span></footer>
    </main>
  );
}