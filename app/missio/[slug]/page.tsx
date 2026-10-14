"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, LockKeyhole, RotateCcw, Sparkles } from "lucide-react";
import { missions } from "@/lib/missions";

const choices = [
  { id: "opinio", label: "És una opinió", feedback: "Ben vist: és una valoració personal, no un fet que es pugui comprovar directament." },
  { id: "generalitzacio", label: "És una generalització", feedback: "Exacte! La frase atribueix el mateix comportament a tothom sense tenir proves. Les persones són diverses." },
  { id: "fet", label: "És un fet contrastable", feedback: "No ben bé. La frase afirma una cosa sobre totes les persones, però no aporta dades que ho demostrin." },
];

export default function MissionPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const mission = useMemo(() => missions.find((item) => item.slug === params.slug), [params.slug]);
  const [choice, setChoice] = useState("");
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quisoc-progress-v1");
      if (saved) setCompleted(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      localStorage.removeItem("quisoc-progress-v1");
    }
    setReady(true);
  }, []);

  if (!mission) {
    return <main className="shell py-24"><p className="eyebrow">MIRROR / ERROR 404</p><h1 className="font-display mt-4 text-4xl">Aquesta missió no existeix.</h1><Link href="/" className="primary-button mt-8">Torna al mapa</Link></main>;
  }

  const index = missions.findIndex((item) => item.slug === mission.slug);
  const isUnlocked = index === 0 || missions.slice(0, index).every((item) => completed[item.slug]);

  if (ready && !isUnlocked) {
    return <main className="shell py-24"><LockKeyhole className="text-[#c6a5ff]" size={32}/><h1 className="font-display mt-5 text-3xl">Missió bloquejada</h1><p className="mt-3 text-[#aaa5b8]">Completa la missió anterior per continuar la investigació.</p><Link href="/" className="primary-button mt-8">Torna al mapa</Link></main>;
  }

  const selected = choices.find((item) => item.id === choice);
  const isCorrect = choice === "generalitzacio";

  function markComplete() {
    const next = { ...completed, [mission!.slug]: true };
    localStorage.setItem("quisoc-progress-v1", JSON.stringify(next));
    setCompleted(next);
    router.push("/");
  }

  function retry() {
    setChoice("");
    setAnswered(false);
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="shell flex h-[76px] items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 text-sm text-[#bcb6ca] transition hover:text-white"><ArrowLeft size={17}/> Mapa de missions</Link>
        <span className="font-display text-xs font-bold tracking-[.2em]">MIRROR<span className="text-[#c6a5ff]">.</span></span>
      </header>
      <section className="shell max-w-4xl py-10 sm:py-16">
        <div className="eyebrow">MISSIÓ {String(mission.id).padStart(2, "0")} · {mission.sessions}</div>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex-1">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">{mission.title}<span style={{ color: mission.accent }}>.</span></h1>
            <p className="mt-4 text-xl text-[#c9c3d5]">{mission.subtitle}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#aaa5b8]">{mission.description}</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:w-56"><p className="text-[10px] uppercase tracking-[.16em] text-[#8f899f]">Objectiu</p><p className="mt-2 text-sm leading-6">{mission.objective}</p></div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {mission.activities.map((activity, i) => <div key={activity} className="glass rounded-xl p-4"><p className="text-[10px] tracking-[.15em] text-[#918aa4]">ACTIVITAT {String(i + 1).padStart(2, "0")}</p><p className="mt-2 text-sm font-semibold">{activity}</p></div>)}
        </div>

        {mission.id === 1 ? (
          <section className="glass mt-8 rounded-3xl p-5 sm:p-8">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c6a5ff]/15 text-[#c6a5ff]"><Sparkles size={20}/></span><div><p className="eyebrow">Repte interactiu · 01</p><h2 className="font-display mt-2 text-2xl font-semibold">Detectius de les afirmacions</h2></div></div>
            <p className="mt-5 text-sm leading-7 text-[#b8b2c7]">La Laia veu aquesta frase en una publicació: <span className="font-semibold text-white">«Totes les persones que utilitzen filtres tenen baixa autoestima.»</span></p>
            <p className="mt-3 text-sm leading-7 text-[#b8b2c7]">Quin tipus d'afirmació és? Tria la resposta que et sembli més adequada. Després podràs llegir la pista i tornar-ho a provar.</p>
            <div className="mt-5 grid gap-3">
              {choices.map((item) => <button key={item.id} type="button" disabled={answered && isCorrect} onClick={() => { setChoice(item.id); setAnswered(false); }} className={`rounded-xl border p-4 text-left text-sm transition ${choice === item.id ? "border-[#c6a5ff] bg-[#c6a5ff]/10 text-white" : "border-white/10 bg-white/[.025] text-[#c7c1d3] hover:border-white/25"} `}><span className="mr-3 inline-grid h-6 w-6 place-items-center rounded-full border border-white/20 text-xs">{String.fromCharCode(65 + choices.findIndex((c) => c.id === item.id))}</span>{item.label}</button>)}
            </div>
            {selected && <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${answered && isCorrect ? "border-[#91d9d0]/30 bg-[#91d9d0]/[.08] text-[#b8eee7]" : answered ? "border-[#f6c879]/30 bg-[#f6c879]/[.07] text-[#f7dba8]" : "border-white/10 bg-white/[.025] text-[#b8b2c7]"}`}><p className="flex items-center gap-2 font-semibold"><Lightbulb size={16}/>{answered ? (isCorrect ? "Molt bé!" : "Pensa-hi una mica més") : "Pista"}</p><p className="mt-2">{answered ? selected.feedback : "Fixa't en la paraula «totes». Una afirmació sobre tothom necessita proves que la sostinguin."}</p></div>}
            <div className="mt-5 flex flex-wrap gap-3">
              {!answered ? <button disabled={!choice} onClick={() => setAnswered(true)} className="primary-button disabled:cursor-not-allowed disabled:opacity-40">Comprova la resposta <ArrowRight size={16}/></button> : isCorrect ? <button onClick={markComplete} className="primary-button"><CheckCircle2 size={17}/> Completa la missió</button> : <button onClick={retry} className="secondary-button"><RotateCcw size={15}/> Torna-ho a provar</button>}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#858096]">Aquesta activitat és educativa, no és una prova psicològica. Les reflexions personals són opcionals i no es desen.</p>
          </section>
        ) : (
          <section className="glass mt-8 rounded-3xl p-6 sm:p-8"><p className="eyebrow">Aquesta missió s'està preparant</p><h2 className="font-display mt-3 text-2xl font-semibold">El contingut arribarà aviat.</h2><p className="mt-3 text-sm leading-7 text-[#aaa5b8]">L'estructura de la missió ja està preparada. En la següent iteració hi afegirem les activitats interactives específiques.</p><Link href="/" className="secondary-button mt-6">Torna al mapa</Link></section>
        )}
      </section>
    </main>
  );
}