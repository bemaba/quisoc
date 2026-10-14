export type Mission = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  sessions: string;
  icon: string;
  accent: string;
  activities: string[];
};

export const missions: Mission[] = [
  {
    id: 1,
    slug: "el-mirall-digital",
    title: "El mirall digital",
    subtitle: "Què mostrem a les xarxes? I què no?",
    description: "La identitat és molt més que un perfil. Investiga com ens veiem i com ens poden interpretar els altres.",
    objective: "Identitat digital, autoconcept i autoestima",
    sessions: "4 sessions",
    icon: "◉",
    accent: "#c6a5ff",
    activities: ["El missatge misteriós", "Qui soc realment?", "El mirall de les xarxes"],
  },
  {
    id: 2,
    slug: "la-fabrica-dels-likes",
    title: "La fàbrica dels likes",
    subtitle: "La popularitat es pot mesurar amb un número?",
    description: "Descobreix com els likes, els filtres i la comparació poden canviar la manera d'interpretar una imatge.",
    objective: "Comparació social i validació externa",
    sessions: "3 sessions",
    icon: "♡",
    accent: "#f2a4db",
    activities: ["El simulador dels likes", "Realitat o aparença?"],
  },
  {
    id: 3,
    slug: "atrapat-a-la-pantalla",
    title: "Atrapat a la pantalla",
    subtitle: "Per què costa tant desconnectar?",
    description: "Explora les notificacions, el FOMO i els hàbits que competeixen per la nostra atenció.",
    objective: "Atenció, hàbits i benestar digital",
    sessions: "3 sessions",
    icon: "⌁",
    accent: "#91d9d0",
    activities: ["Per què costa desconnectar?", "El negoci de l'atenció"],
  },
  {
    id: 4,
    slug: "darrere-de-lalgoritme",
    title: "Darrere de l'algoritme",
    subtitle: "Qui decideix què veiem?",
    description: "Compara murs personalitzats i investiga com les decisions digitals afecten la convivència.",
    objective: "Algoritmes i convivència digital",
    sessions: "2 sessions",
    icon: "⌘",
    accent: "#f6c879",
    activities: ["Qui decideix què veiem?", "La xarxa invisible"],
  },
  {
    id: 5,
    slug: "recuperem-el-control",
    title: "Recuperem el control",
    subtitle: "Fem que el missatge arribi més enllà dels likes",
    description: "Connecta tot el que has après i transforma-ho en una campanya per a altres adolescents.",
    objective: "Autonomia i pensament crític",
    sessions: "5 sessions",
    icon: "✳",
    accent: "#a7b9ff",
    activities: ["Eines per al benestar digital", "Connectem les peces", "Més enllà dels likes", "Compartim el missatge"],
  },
];