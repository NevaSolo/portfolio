export type Experience = {
  company: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "GROUP MANAO",
    role: "Développeur Web Full Stack",
    period: "Octobre 2025 — Aujourd'hui",
    description: "Développement web dans l'univers du commerce et de la vente.",
  },
  {
    company: "CFPM",
    role: "Formateur en création de sites web",
    period: "Février 2025 — Août 2025",
    description: "Formation aux technologies web.",
    tags: ["HTML/CSS", "PHP", "MySQL", "Développement web"],
  },
  {
    company: "Mi-Camp Sahambavy",
    role: "Développeur Web",
    period: "Février 2025 — Avril 2025",
    description:
      "Création d'un site web pour améliorer la visibilité et permettre les réservations des clients.",
  },
  {
    company: "Caisse d'Épargne de Madagascar",
    role: "Développeur Web",
    period: "Mai 2024 — Août 2024",
    description:
      "Développement d'une application web permettant de suivre le trafic du crédit en temps réel.",
  },
  {
    company: "BIONEXX",
    role: "Développeur Web",
    period: "Juin 2023 — Août 2023",
    description: "Développement d'une application web pour la gestion des situations de demandes d'achat.",
  },
];

export const EDUCATION = [
  {
    degree: "Master II — Intelligence Artificielle",
    school: "École Nationale d'Informatique",
    period: "2025 — 2026",
  },
  {
    degree: "Master I — Intelligence Artificielle",
    school: "École Nationale d'Informatique",
    period: "2024 — 2025",
  },
  {
    degree: "Licence en Informatique",
    school: "École Supérieure de Management d'Informatique Appliquée",
    period: "2023 — 2024",
  },
];
