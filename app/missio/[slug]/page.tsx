"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, HeartHandshake, Lightbulb, LockKeyhole, RotateCcw, Sparkles } from "lucide-react";
import { missions } from "@/lib/missions";

type Answers = Record<string, string>;
const progressKey = "quisoc-progress-v1";
const missionOneKey = "quisoc-m1-progress-v1";

const caseQuestions = [
  { id: "emotion", question: "Què podria estar sentint la Laia?", options: ["Només vol cridar l'atenció", "Pot sentir inseguretat, pressió o preocupació", "Segur que està enfadada amb les seves amigues"], correct: 1, feedback: "És una interpretació possible basada en el que explica. No podem saber exactament com se sent sense escoltar-la." },
  { id: "evidence", question: "Què sabem realment pel cas?", options: ["La Laia revisa sovint les reaccions i evita algunes fotos", "Té una autoestima baixa en tots els àmbits", "Les seves amigues la jutgen"], correct: 0, feedback: "Aquests són els fets descrits. Les altres opcions afegeixen conclusions que el cas no demostra." },
  { id: "support", question: "Quina resposta d'una amistat seria més útil?", options: ["«No n'hi ha per tant, deixa de pensar-hi»", "«Si no tens likes, no publiquis»", "«Vols explicar-me com et sents? No cal que surtis perfecta»"], correct: 2, feedback: "Escoltar sense jutjar, validar el que sent i oferir suport és més útil que minimitzar-ho o donar ordres." },
];

const hypotheses = [
  { text: "Totes les persones que utilitzen filtres tenen baixa autoestima.", correct: "generalitzacio", why: "Generalitza sobre tothom i atribueix una causa psicològica sense proves." },
  { text: "A mi m'agrada més publicar fotos sense filtres.", correct: "opinio", why: "Expressa una preferència personal." },
  { text: "Podem comptar quantes reaccions ha rebut una publicació.", correct: "contrastable", why: "És una dada que es pot comprovar." },
  { text: "Si una foto té molts likes, la persona que hi surt és més feliç.", correct: "generalitzacio", why: "Les reaccions no ens permeten saber com se sent una persona." },
];

const concepts = [
  { text: "Crec que soc una persona creativa.", correct: "autoconcepte" },
  { text: "Reconec qualitats meves encara que m'equivoqui.", correct: "autoestima" },
  { text: "Em preocupa molt què pensen els altres de mi.", correct: "validacio" },
  { text: "Només publico les fotografies que considero més afavoridores.", correct: "identitat-digital" },
  { text: "La imatge que tinc del meu cos i de la meva aparença.", correct: "autoimatge" },
  { text: "Les meves aficions, valors, relacions i experiències formen part de qui soc.", correct: "identitat" },
  { text: "El perfil i les publicacions que altres persones poden veure de mi.", correct: "identitat-digital" },
  { text: "Puc equivocar-me i continuar valorant-me com a persona.", correct: "autoestima" },
  { text: "La idea que tinc de les meves habilitats i característiques.", correct: "autoconcepte" },
  { text: "Comparo el meu aspecte amb el que veig en altres perfils.", correct: "autoimatge" },
  { text: "Necessito que les publicacions agradin als altres per sentir-me bé.", correct: "validacio" },
  { text: "La manera com em presento a internet no explica tota la meva vida.", correct: "identitat-digital" },
];

const conceptOptions = [
  { value: "identitat", label: "Identitat personal" },
  { value: "autoconcepte", label: "Autoconcepte" },
  { value: "autoestima", label: "Autoestima" },
  { value: "autoimatge", label: "Autoimatge" },
  { value: "identitat-digital", label: "Identitat digital" },
  { value: "validacio", label: "Validació externa" },
];

const reflectionQuestions = [
  "Em preocupa com surto a les fotografies que altres persones publiquen de mi.",
  "Abans de compartir una fotografia, penso en què opinaran els altres.",
  "Em comparo físicament amb persones que veig a les xarxes.",
  "He deixat de publicar una fotografia perquè pensava que no hi sortia prou bé.",
  "Em sento incòmode quan algú em fotografia sense avisar-me.",
  "Quan faig activitats amb altres persones, penso en si es faran fotografies o vídeos.",
  "Prefereixo editar o aplicar filtres a algunes fotografies abans de publicar-les.",
  "M'afecta negativament veure persones que aparentment tenen una vida millor que la meva.",
  "Em preocupa que una publicació rebi poques reaccions.",
  "He canviat alguna cosa de la meva imatge o manera de presentar-me per encaixar millor amb allò que veig a les xarxes.",
  "Algunes publicacions em fan sentir inseguretat respecte al meu aspecte.",
  "Em costa evitar comparar-me amb altres persones quan utilitzo les xarxes.",
  "Quan veig continguts que em generen malestar, sé identificar-ho i decidir què fer.",
];

const frequencyOptions = ["Mai", "Poques vegades", "Algunes vegades", "Sovint", "Molt sovint", "Prefereixo no respondre"];

export default function MissionPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const mission = useMemo(() => missions.find((item) => item.slug === params.slug), [params.slug]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseAnswers, setCaseAnswers] = useState<Answers>({});
  const [caseChecked, setCaseChecked] = useState(false);
  const [caseComplete, setCaseComplete] = useState(false);
  const [hypothesisAnswers, setHypothesisAnswers] = useState<Answers>({});
  const [hypothesesChecked, setHypothesesChecked] = useState(false);
  const [conceptIndex, setConceptIndex] = useState(0);
  const [conceptAnswers, setConceptAnswers] = useState<Answers>({});
  const [conceptChecked, setConceptChecked] = useState(false);
  const [identityChoice, setIdentityChoice] = useState("");
  const [identityChecked, setIdentityChecked] = useState(false);
  const [reflection, setReflection] = useState("");
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Answers>({});
  const [questionnaireDone, setQuestionnaireDone] = useState(false);
  const [closingChoice, setClosingChoice] = useState("");
  const [closingChecked, setClosingChecked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) setCompleted(JSON.parse(saved) as Record<string, boolean>);
      const missionProgress = localStorage.getItem(missionOneKey);
      if (missionProgress) {
        const savedProgress = JSON.parse(missionProgress) as { stage?: number };
        if (typeof savedProgress.stage === "number") setStage(Math.min(2, Math.max(0, savedProgress.stage)));
      }
    } catch {
      localStorage.removeItem(progressKey);
      localStorage.removeItem(missionOneKey);
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

  function saveStage(nextStage: number) {
    setStage(nextStage);
    localStorage.setItem(missionOneKey, JSON.stringify({ stage: nextStage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markComplete() {
    if (!stageOneDone || !stageTwoDone || !stageThreeDone) return;
    const next = { ...completed, [mission.slug]: true };
    localStorage.setItem(progressKey, JSON.stringify(next));
    localStorage.removeItem(missionOneKey);
    setCompleted(next);
    router.push("/");
  }

  function restartActivity() {
    setCaseIndex(0); setCaseAnswers({}); setCaseChecked(false); setCaseComplete(false);
    setHypothesisAnswers({}); setHypothesesChecked(false);
    setConceptIndex(0); setConceptAnswers({}); setConceptChecked(false);
    setIdentityChoice(""); setIdentityChecked(false);
    setReflection(""); setReflectionSubmitted(false);
    setQuestionnaireStarted(false); setQuestionnaireAnswers({}); setQuestionnaireDone(false);
    setClosingChoice(""); setClosingChecked(false);
  }

  const correctCaseCount = caseQuestions.filter((q) => caseAnswers[q.id] === String(q.correct)).length;
  const correctHypothesisCount = hypotheses.filter((q, i) => hypothesisAnswers[String(i)] === q.correct).length;
  const correctConceptCount = concepts.filter((q, i) => conceptAnswers[String(i)] === q.correct).length;
  const stageOneDone = caseComplete && correctCaseCount === caseQuestions.length && hypothesesChecked && correctHypothesisCount === hypotheses.length;
  const stageTwoDone = conceptChecked && correctConceptCount >= 10 && identityChecked && identityChoice === "partial" && reflectionSubmitted && reflection.trim().length >= 20;
  const stageThreeDone = closingChecked && closingChoice === "listen";

  return (
    <main className="min-h-screen pb-20">
      <header className="shell flex h-[76px] items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 text-sm text-[#bcb6ca] transition hover:text-white"><ArrowLeft size={17}/> Mapa de missions</Link>
        <span className="font-display text-xs font-bold tracking-[.2em]">MIRROR<span className="text-[#c6a5ff]">.</span></span>
      </header>
      <section className="shell max-w-4xl py-10 sm:py-16">
        <div className="eyebrow">MISSIÓ 01 · SESSIONS 1–4</div>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex-1">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">El mirall digital<span className="text-[#c6a5ff]">.</span></h1>
            <p className="mt-4 text-xl text-[#c9c3d5]">Què mostrem a les xarxes? I què no?</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#aaa5b8]">La identitat és molt més que un perfil. Investiga com ens veiem, com ens valorem i com ens poden interpretar els altres. No cal explicar experiències personals: treballarem amb situacions fictícies i les reflexions íntimes són opcionals.</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:w-56"><p className="text-[10px] uppercase tracking-[.16em] text-[#8f899f]">Objectiu</p><p className="mt-2 text-sm leading-6">Identitat personal i digital, autoconcept, autoestima, autoimatge i validació externa.</p></div>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          {[
            { title: "01 · El missatge misteriós", desc: "Analitza el cas de la Laia.", done: stageOneDone },
            { title: "02 · Qui soc realment?", desc: "Descobreix les diferents identitats.", done: stageTwoDone },
            { title: "03 · El mirall de les xarxes", desc: "Reflexiona i tria com donar suport.", done: stageThreeDone },
          ].map((item, i) => <button key={item.title} onClick={() => saveStage(i)} className={`rounded-2xl border p-4 text-left transition ${stage === i ? "border-[#c6a5ff]/60 bg-[#c6a5ff]/[.09]" : "border-white/10 bg-white/[.025] hover:border-white/20"}`}><div className="flex items-center justify-between"><p className="text-xs font-semibold">{item.title}</p>{item.done ? <CheckCircle2 size={17} className="text-[#91d9d0]"/> : <span className="text-xs text-[#777187]">{i + 1}/3</span>}</div><p className="mt-2 text-xs leading-5 text-[#aaa5b8]">{item.desc}</p></button>)}
        </div>

        {stage === 0 && <section className="glass mt-6 rounded-3xl p-5 sm:p-8">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c6a5ff]/15 text-[#c6a5ff]"><Sparkles size={20}/></span><div><p className="eyebrow">Actuació 1 · Sessió 1</p><h2 className="font-display mt-2 text-2xl font-semibold">El missatge misteriós</h2><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">Llegeix la conversa i separa allò que sabem del que només suposem.</p></div></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#11101a] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#c6a5ff]/20 font-semibold text-[#decfff]">L</div><div><p className="text-sm font-semibold">Laia</p><p className="text-xs text-[#827c93]">Conversa fictícia · Grup d&apos;amistats</p></div><span className="ml-auto text-xs text-[#827c93]">21:14</span></div>
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white/[.07] p-3 text-sm leading-6 text-[#ded9e9]">Últimament intento no sortir a les fotos. Sempre penso que les meves amigues hi surten millor que jo.</div>
            <div className="ml-auto mt-3 max-w-[90%] rounded-2xl rounded-tr-sm bg-[#c6a5ff]/15 p-3 text-sm leading-6 text-[#e3d5ff]">Però a les teves publicacions tens un munt de reaccions!</div>
            <div className="mt-3 max-w-[90%] rounded-2xl rounded-tl-sm bg-white/[.07] p-3 text-sm leading-6 text-[#ded9e9]">Ja, però miro les reaccions moltes vegades per veure si n&apos;arriben més. No sé per què em preocupa tant.</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-white/10 p-3"><p className="text-[10px] uppercase tracking-widest text-[#c6a5ff]">Publicació fictícia</p><p className="mt-2 text-sm">«Un dia perfecte amb la millor gent ✨»</p><p className="mt-1 text-xs text-[#8f899f]">Foto de grup · 248 reaccions</p></div><div className="rounded-xl border border-white/10 p-3"><p className="text-[10px] uppercase tracking-widest text-[#f2a4db]">Comentari</p><p className="mt-2 text-sm">«Sembla que sempre t&apos;ho passes genial!»</p><p className="mt-1 text-xs text-[#8f899f]">No sabem què passa fora de la imatge.</p></div></div>
          </div>
          <div className="mt-7"><p className="eyebrow">Activitat 1 · Anàlisi del cas</p><h3 className="font-display mt-2 text-xl font-semibold">Quina interpretació està més ben fonamentada?</h3><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">Respon les tres preguntes. Cal encertar-les per passar a les primeres hipòtesis.</p>
            <div className="mt-5 rounded-2xl border border-white/10 p-4 sm:p-5"><p className="text-xs text-[#918aa4]">PREGUNTA {caseIndex + 1} DE {caseQuestions.length}</p><h4 className="mt-2 font-semibold">{caseQuestions[caseIndex].question}</h4><div className="mt-4 grid gap-2">{caseQuestions[caseIndex].options.map((option, i) => <button key={option} onClick={() => { setCaseAnswers((prev) => ({ ...prev, [caseQuestions[caseIndex].id]: String(i) })); setCaseChecked(false); }} className={`rounded-xl border p-3 text-left text-sm transition ${caseAnswers[caseQuestions[caseIndex].id] === String(i) ? "border-[#c6a5ff] bg-[#c6a5ff]/10" : "border-white/10 hover:border-white/20"}`}>{option}</button>)}</div>
              {caseChecked && caseAnswers[caseQuestions[caseIndex].id] === String(caseQuestions[caseIndex].correct) && <p className="mt-4 rounded-xl bg-[#91d9d0]/[.08] p-3 text-sm leading-6 text-[#b8eee7]">{caseQuestions[caseIndex].feedback}</p>}
              <div className="mt-4 flex flex-wrap gap-3">{!caseChecked ? <button className="primary-button" disabled={caseAnswers[caseQuestions[caseIndex].id] === undefined} onClick={() => { if (caseAnswers[caseQuestions[caseIndex].id] === String(caseQuestions[caseIndex].correct)) setCaseChecked(true); else setCaseChecked(true); }}>{caseAnswers[caseQuestions[caseIndex].id] === undefined ? "Tria una resposta" : "Comprova la resposta"} <ArrowRight size={16}/></button> : caseAnswers[caseQuestions[caseIndex].id] === String(caseQuestions[caseIndex].correct) ? <button className="primary-button" onClick={() => { if (caseIndex < caseQuestions.length - 1) { setCaseIndex(caseIndex + 1); setCaseChecked(false); } else { setCaseComplete(true); } }}>{caseIndex < caseQuestions.length - 1 ? "Següent pregunta" : "Cas completat"} <ArrowRight size={16}/></button> : <button className="secondary-button" onClick={() => setCaseChecked(false)}><RotateCcw size={15}/> Torna-ho a provar</button>}</div>
              {caseChecked && caseAnswers[caseQuestions[caseIndex].id] !== String(caseQuestions[caseIndex].correct) && <p className="mt-3 text-xs text-[#f6c879]">La resposta no encaixa amb la informació disponible. Revisa la pista i prova una altra opció.</p>}
              {caseComplete && correctCaseCount === caseQuestions.length && <p className="mt-3 text-xs text-[#91d9d0]">Les tres preguntes estan resoltes!</p>}
            </div>
          </div>
          <div className="mt-7"><p className="eyebrow">Activitat 2 · Primeres hipòtesis</p><h3 className="font-display mt-2 text-xl font-semibold">Fet, opinió o generalització?</h3><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">Classifica cada frase. No podem deduir com és una persona ni com se sent a partir d&apos;una sola publicació.</p>
            <div className="mt-4 space-y-3">{hypotheses.map((item, i) => <div key={item.text} className="rounded-xl border border-white/10 p-4"><p className="text-sm leading-6">{item.text}</p><div className="mt-3 flex flex-wrap gap-2">{[{value:"contrastable",label:"Fet contrastable"},{value:"opinio",label:"Opinió"},{value:"generalitzacio",label:"Generalització"}].map((opt) => <button key={opt.value} onClick={() => { setHypothesisAnswers((prev) => ({ ...prev, [String(i)]: opt.value })); setHypothesesChecked(false); }} className={`rounded-full border px-3 py-2 text-xs ${hypothesisAnswers[String(i)] === opt.value ? "border-[#c6a5ff] bg-[#c6a5ff]/10" : "border-white/10 text-[#aaa5b8]"}`}>{opt.label}</button>)}</div>{hypothesesChecked && <p className={`mt-3 text-xs leading-5 ${hypothesisAnswers[String(i)] === item.correct ? "text-[#91d9d0]" : "text-[#f6c879]"}`}>{item.why}</p>}</div>)}</div>
            <div className="mt-4 flex flex-wrap gap-3"><button className="primary-button" disabled={Object.keys(hypothesisAnswers).length !== hypotheses.length} onClick={() => setHypothesesChecked(true)}>Comprova les classificacions <ArrowRight size={16}/></button>{hypothesesChecked && correctHypothesisCount < hypotheses.length && <button className="secondary-button" onClick={() => setHypothesesChecked(false)}><RotateCcw size={15}/> Revisa-les</button>}</div>
            {hypothesesChecked && correctHypothesisCount === hypotheses.length && correctCaseCount === caseQuestions.length && <div className="mt-5 rounded-2xl border border-[#91d9d0]/30 bg-[#91d9d0]/[.07] p-4"><p className="flex items-center gap-2 font-semibold text-[#b8eee7]"><CheckCircle2 size={18}/> Actuació 1 completada</p><p className="mt-2 text-sm leading-6 text-[#b8b2c7]">Has distingit els fets de les suposicions i has evitat treure conclusions psicològiques a partir d&apos;una imatge.</p><button className="primary-button mt-4" onClick={() => saveStage(1)}>Continua: qui soc realment? <ArrowRight size={16}/></button></div>}
          </div>
        </section>}

        {stage === 1 && <section className="glass mt-6 rounded-3xl p-5 sm:p-8">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f2a4db]/15 text-[#f2a4db]"><Sparkles size={20}/></span><div><p className="eyebrow">Actuació 2 · Sessió 2</p><h2 className="font-display mt-2 text-2xl font-semibold">Qui soc realment?</h2><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">La identitat té moltes capes. Aprèn a distingir-les i compara el que una persona pensa, publica i el que els altres interpreten.</p></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{[{title:"Identitat personal",text:"El conjunt de valors, interessos, experiències, relacions i característiques que formen part de qui som."},{title:"Autoconcepte",text:"La idea que tenim de nosaltres mateixos i de les nostres capacitats."},{title:"Autoestima",text:"La manera com ens valorem i ens tractem, també quan ens equivoquem."},{title:"Autoimatge",text:"Com percebem la nostra aparença i el nostre cos."},{title:"Identitat digital",text:"La part de nosaltres que es mostra o es construeix en entorns digitals: perfils, comentaris i publicacions."},{title:"Validació externa",text:"Quan donem molt de pes a l'aprovació o a l'opinió de les altres persones per valorar-nos."}].map((item) => <article key={item.title} className="rounded-xl border border-white/10 bg-white/[.025] p-4"><h3 className="font-semibold text-[#ded4f7]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">{item.text}</p></article>)}</div>
          <div className="mt-8"><p className="eyebrow">Activitat 1 · Classificació de conceptes</p><h3 className="font-display mt-2 text-xl font-semibold">Quin concepte descriu cada frase?</h3><div className="mt-4 rounded-2xl border border-white/10 p-4 sm:p-5"><div className="flex items-center justify-between text-xs text-[#918aa4]"><span>AFIRMACIÓ {conceptIndex + 1} DE {concepts.length}</span><span>{correctConceptCount}/{concepts.length} encerts</span></div><p className="mt-3 text-lg font-medium">{concepts[conceptIndex].text}</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{conceptOptions.map((opt) => <button key={opt.value} onClick={() => { setConceptAnswers((prev) => ({ ...prev, [String(conceptIndex)]: opt.value })); setConceptChecked(false); }} className={`rounded-xl border p-3 text-left text-sm ${conceptAnswers[String(conceptIndex)] === opt.value ? "border-[#c6a5ff] bg-[#c6a5ff]/10" : "border-white/10 hover:border-white/20"}`}>{opt.label}</button>)}</div><div className="mt-4 flex flex-wrap gap-3"><button className="primary-button" disabled={conceptAnswers[String(conceptIndex)] === undefined} onClick={() => setConceptChecked(true)}>Comprova <ArrowRight size={16}/></button>{conceptChecked && <button className="secondary-button" onClick={() => { setConceptIndex((conceptIndex + 1) % concepts.length); setConceptChecked(false); }}>Següent afirmació <ArrowRight size={16}/></button>}</div>{conceptChecked && <p className={`mt-4 text-sm ${conceptAnswers[String(conceptIndex)] === concepts[conceptIndex].correct ? "text-[#91d9d0]" : "text-[#f6c879]"}`}>{conceptAnswers[String(conceptIndex)] === concepts[conceptIndex].correct ? "Correcte! Has identificat el concepte." : `Revisa la definició de «${conceptOptions.find((opt) => opt.value === concepts[conceptIndex].correct)?.label}» i torna-ho a provar.`}</p>}</div><div className="mt-3 flex flex-wrap gap-2">{concepts.map((item, i) => <button key={item.text} onClick={() => { setConceptIndex(i); setConceptChecked(false); }} aria-label={`Afirmació ${i + 1}`} className={`h-2.5 flex-1 rounded-full ${conceptAnswers[String(i)] === item.correct ? "bg-[#91d9d0]" : conceptAnswers[String(i)] ? "bg-[#f6c879]" : "bg-white/10"}`}/>)}</div></div>
          <div className="mt-8"><p className="eyebrow">Activitat 2 · Les tres identitats</p><h3 className="font-display mt-2 text-xl font-semibold">Un mateix perfil, tres mirades</h3><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{title:"El que pensa l'Àlex",text:"«Soc una persona tranquil·la; m'encanta dibuixar, encara que no ho ensenyo gaire.»"},{title:"El que publica",text:"Fotos de concerts, sortides amb amistats i moments divertits."},{title:"El que interpreten altres",text:"Algunes persones pensen que sempre està de festa i que no li agrada estar sol."}].map((item) => <div key={item.title} className="rounded-xl border border-white/10 p-4"><p className="text-xs font-semibold text-[#c6a5ff]">{item.title}</p><p className="mt-3 text-sm leading-6 text-[#b8b2c7]">{item.text}</p></div>)}</div><p className="mt-4 text-sm font-semibold">Quina conclusió és la més raonable?</p><div className="mt-3 grid gap-2">{[{value:"total",label:"El perfil ens permet saber com és l'Àlex en tots els àmbits."},{value:"partial",label:"El perfil mostra una part de la seva vida, però no tota la seva identitat."},{value:"fake",label:"Si publica moments divertits, segur que amaga qui és realment."}].map((opt) => <button key={opt.value} onClick={() => { setIdentityChoice(opt.value); setIdentityChecked(false); }} className={`rounded-xl border p-3 text-left text-sm ${identityChoice === opt.value ? "border-[#c6a5ff] bg-[#c6a5ff]/10" : "border-white/10"}`}>{opt.label}</button>)}</div>{identityChecked && <p className={`mt-3 text-sm leading-6 ${identityChoice === "partial" ? "text-[#91d9d0]" : "text-[#f6c879]"}`}>{identityChoice === "partial" ? "Exacte. Les publicacions són una selecció; no mostren totes les aficions, emocions ni experiències d'una persona." : "No podem conèixer una persona del tot només pel que publica. El perfil és parcial i les interpretacions poden ser equivocades."}</p>}<button className="secondary-button mt-3" disabled={!identityChoice} onClick={() => setIdentityChecked(true)}>Comprova la conclusió</button></div>
          <div className="mt-8"><p className="eyebrow">Activitat 3 · Reflexió argumentada</p><h3 className="font-display mt-2 text-xl font-semibold">Podem conèixer realment una persona només a través del seu perfil digital?</h3><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">Escriu una resposta breu fent servir almenys dos conceptes d&apos;aquesta missió. La resposta només es manté en aquesta pantalla: no es desa ni s&apos;envia.</p><textarea value={reflection} onChange={(e) => { setReflection(e.target.value); setReflectionSubmitted(false); }} rows={4} className="mt-4 w-full rounded-xl border border-white/10 bg-[#11101a] p-4 text-sm leading-6 text-white outline-none focus:border-[#c6a5ff]" placeholder="Crec que... perquè... (utilitza dos conceptes)" /><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[#827c93]">{reflection.trim().length}/20 caràcters mínims</span><button className="primary-button" disabled={reflection.trim().length < 20} onClick={() => setReflectionSubmitted(true)}>He acabat la reflexió <Check size={16}/></button></div>{reflectionSubmitted && <p className="mt-3 text-sm text-[#91d9d0]">Reflexió completada. No s'ha desat el text.</p>}</div>
          {stageTwoDone && <div className="mt-6 rounded-2xl border border-[#91d9d0]/30 bg-[#91d9d0]/[.07] p-4"><p className="flex items-center gap-2 font-semibold text-[#b8eee7]"><CheckCircle2 size={18}/> Actuació 2 completada</p><p className="mt-2 text-sm leading-6 text-[#b8b2c7]">Has identificat els conceptes i vist per què un perfil no explica tota la identitat d&apos;una persona.</p><button className="primary-button mt-4" onClick={() => saveStage(2)}>Continua: el mirall de les xarxes <ArrowRight size={16}/></button></div>}
          {!stageTwoDone && <p className="mt-6 text-xs leading-5 text-[#827c93]">Per completar aquesta actuació: aconsegueix 10 de 12 encerts, comprova la conclusió sobre l&apos;Àlex i acaba la reflexió breu.</p>}
        </section>}

        {stage === 2 && <section className="glass mt-6 rounded-3xl p-5 sm:p-8">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#91d9d0]/15 text-[#91d9d0]"><HeartHandshake size={20}/></span><div><p className="eyebrow">Actuació 3 · Sessions 3 i 4</p><h2 className="font-display mt-2 text-2xl font-semibold">El mirall de les xarxes</h2><p className="mt-2 text-sm leading-6 text-[#aaa5b8]">La comparació, la imatge i l&apos;aprovació poden influir en com ens sentim, però no afecten tothom de la mateixa manera.</p></div></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5"><p className="eyebrow">Una idea important</p><h3 className="font-display mt-2 text-xl font-semibold">Una publicació no és tota una vida</h3><p className="mt-3 text-sm leading-7 text-[#b8b2c7]">A les xarxes acostumem a veure moments seleccionats: una fotografia, un èxit, una sortida o una versió editada. Comparar la nostra vida sencera amb aquests fragments pot generar pressió o inseguretat. Els likes indiquen reaccions a una publicació, no el valor d&apos;una persona ni el seu benestar emocional.</p><p className="mt-3 text-sm leading-7 text-[#b8b2c7]">Si un contingut et genera malestar, pots aturar-te, deixar de seguir o silenciar aquell compte, parlar-ne amb algú de confiança o recordar què t&apos;agrada de tu mateix fora de la pantalla. Demanar suport també és una estratègia útil.</p></div>
          <div className="mt-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Qüestionari personal opcional</p><h3 className="font-display mt-2 text-xl font-semibold">Com em relaciono amb la meva imatge digital?</h3></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#aaa5b8]">No és un examen</span></div><p className="mt-3 text-sm leading-6 text-[#aaa5b8]">Aquest qüestionari t&apos;ajuda a reflexionar sobre algunes situacions. No és una prova psicològica, no hi ha respostes bones o dolentes i pots ometre qualsevol pregunta. Les respostes només es mantenen mentre tens aquesta pantalla oberta: no es desen ni es comparteixen.</p>{!questionnaireStarted && !questionnaireDone && <button className="secondary-button mt-4" onClick={() => setQuestionnaireStarted(true)}>Començar el qüestionari opcional <ArrowRight size={16}/></button>}{questionnaireStarted && !questionnaireDone && <div className="mt-4 space-y-3">{reflectionQuestions.map((question, i) => <div key={question} className="rounded-xl border border-white/10 p-4"><p className="text-sm leading-6"><span className="mr-2 text-xs text-[#c6a5ff]">{String(i + 1).padStart(2, "0")}</span>{question}</p><div className="mt-3 flex flex-wrap gap-2">{frequencyOptions.map((option) => <button key={option} onClick={() => setQuestionnaireAnswers((prev) => ({ ...prev, [String(i)]: option }))} className={`rounded-full border px-3 py-2 text-xs transition ${questionnaireAnswers[String(i)] === option ? "border-[#91d9d0] bg-[#91d9d0]/10 text-[#b8eee7]" : "border-white/10 text-[#aaa5b8] hover:border-white/20"}`}>{option}</button>)}</div></div>)}<div className="flex flex-wrap gap-3"><button className="primary-button" onClick={() => { setQuestionnaireDone(true); setQuestionnaireStarted(false); setQuestionnaireAnswers({}); }}>Acabar i esborrar les respostes <Check size={16}/></button><button className="secondary-button" onClick={() => { setQuestionnaireStarted(false); setQuestionnaireAnswers({}); }}>Ometre qüestionari</button></div><p className="text-xs leading-5 text-[#827c93]">Respostes seleccionades: {Object.keys(questionnaireAnswers).length} de {reflectionQuestions.length}. No cal respondre-les totes.</p></div>}{questionnaireDone && <p className="mt-4 rounded-xl bg-[#91d9d0]/[.08] p-3 text-sm text-[#b8eee7]">Qüestionari tancat i respostes esborrades d&apos;aquesta pantalla. Gràcies per dedicar-hi un moment.</p>}</div>
          <div className="mt-8"><p className="eyebrow">Repte de tancament</p><h3 className="font-display mt-2 text-xl font-semibold">La Laia et diu que les reaccions li estan afectant l&apos;ànim. Què faries?</h3><div className="mt-4 grid gap-2">{[{value:"dismiss",label:"Dir-li que exagera i que no hauria de preocupar-se."},{value:"likes",label:"Aconsellar-li que publiqui més fins que tingui més likes."},{value:"listen",label:"Escoltar-la sense jutjar, preguntar què necessita i recordar-li que el seu valor no depèn de les reaccions."},{value:"diagnose",label:"Dir-li que ja saps quin problema psicològic té."}].map((opt) => <button key={opt.value} onClick={() => { setClosingChoice(opt.value); setClosingChecked(false); }} className={`rounded-xl border p-3 text-left text-sm leading-6 ${closingChoice === opt.value ? "border-[#c6a5ff] bg-[#c6a5ff]/10" : "border-white/10 hover:border-white/20"}`}>{opt.label}</button>)}</div><div className="mt-4 flex flex-wrap gap-3"><button className="primary-button" disabled={!closingChoice} onClick={() => setClosingChecked(true)}>Comprova el repte <ArrowRight size={16}/></button>{closingChecked && closingChoice !== "listen" && <button className="secondary-button" onClick={() => { setClosingChoice(""); setClosingChecked(false); }}><RotateCcw size={15}/> Torna-ho a provar</button>}</div>{closingChecked && <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${closingChoice === "listen" ? "border-[#91d9d0]/30 bg-[#91d9d0]/[.08] text-[#b8eee7]" : "border-[#f6c879]/30 bg-[#f6c879]/[.07] text-[#f7dba8]"}`}>{closingChoice === "listen" ? "Molt bé. Escoltar, no jutjar i oferir suport respecta el que sent la Laia sense fer diagnòstics ni reduir el seu valor als likes." : "Prova una resposta que escolti la Laia sense jutjar-la, sense pressionar-la per aconseguir més reaccions i sense fer diagnòstics."}</div>}</div>
          {stageThreeDone && <div className="mt-7 rounded-2xl border border-[#91d9d0]/30 bg-[#91d9d0]/[.07] p-5"><p className="flex items-center gap-2 font-semibold text-[#b8eee7]"><CheckCircle2 size={19}/> Missió 01 completada</p><p className="mt-2 text-sm leading-6 text-[#b8b2c7]">Has investigat el missatge misteriós, distingit identitat i autoimatge, i practicat una manera respectuosa d&apos;oferir suport. El qüestionari personal era opcional i no ha condicionat el progrés.</p><button className="primary-button mt-4" onClick={markComplete}>Completa la missió i torna al mapa <ArrowRight size={16}/></button></div>}
          {!stageThreeDone && <p className="mt-5 text-xs leading-5 text-[#827c93]">Per acabar la missió, completa el repte de tancament. El qüestionari personal és opcional i es pot ometre.</p>}
        </section>}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><button onClick={restartActivity} className="flex items-center gap-2 text-xs text-[#827c93] transition hover:text-white"><RotateCcw size={13}/> Reinicia les activitats d&apos;aquesta pantalla</button><Link href="/" className="text-xs text-[#aaa5b8] hover:text-white">Torna al mapa de missions</Link></div>
        <p className="mt-8 text-xs leading-5 text-[#777187]">Activitat educativa per a 3r d&apos;ESO. Les situacions són fictícies. No es guarden respostes personals, no s&apos;elaboren perfils psicològics i no hi ha classificacions competitives.</p>
      </section>
    </main>
  );
}
