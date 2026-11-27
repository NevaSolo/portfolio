export type Project = {
  id: string;
  number: string;
  title: string;
  client?: string;
  period?: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  featured?: boolean;
  github?: string;
  demo?: string;
  /** Preview screenshot under /public, e.g. "/projects/tsing.jpg" (16:10). */
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "tsing",
    number: "01",
    title: "Tsing — Plateforme de t-shirts personnalisés",
    category: "E-commerce / Créateurs",
    year: "2026",
    description:
      "Plateforme où artistes, marques et passionnés créent et vendent leurs propres t-shirts : personnalisation du texte, de l'image, de la couleur et du placement, aperçu 3D face et dos, puis mise en boutique en un clic avec prix et stock. Inclut boutique, espace designer, messagerie et commande en ligne.",
    technologies: ["React", "Vite", "Three.js", "React Three Fiber", "React Router", "Axios"],
    demo: "https://tsing.75-119-136-160.nip.io/",
    image: "/projects/tsing.jpg",
  },
  {
    id: "accounting-ai",
    number: "02",
    title: "Système intelligent de génération d'écritures comptables",
    client: "Projet académique — Master II IA",
    category: "Intelligence Artificielle",
    year: "2025",
    description:
      "Système intelligent capable d'analyser des factures commerciales à partir d'images ou de PDF, d'automatiser l'extraction des informations et de proposer des écritures comptables.",
    technologies: ["OCR", "NLP", "Machine Learning", "Python", "FastAPI", "React", "MySQL"],
    featured: true,
    demo: "https://compta-ia.75-119-136-160.nip.io/",
    image: "/projects/compta-ia.jpg",
  },
  {
    id: "credit-traffic",
    number: "03",
    title: "Application de suivi du trafic du crédit",
    client: "Caisse d'Épargne de Madagascar — Fianarantsoa",
    period: "Mai 2024 — Août 2024",
    category: "Application Web",
    year: "2024",
    description:
      "Application web permettant de suivre en temps réel le trafic du crédit au sein de l'agence : échéances du jour et retards en un coup d'œil, paiements, pénalités et remboursements anticipés, dossier client complet (photo, pièces, garanties), avec un accès réservé au personnel et des actions tracées.",
    technologies: ["Full Stack", "Base de données"],
    demo: "https://credit.75-119-136-160.nip.io/",
    image: "/projects/credit-traffic.jpg",
  },
  {
    id: "mi-camp",
    number: "04",
    title: "Plateforme de réservation",
    client: "Mi-Camp Sahambavy",
    period: "Février 2025 — Avril 2025",
    category: "Site Web / Réservation",
    year: "2025",
    description:
      "Création d'un site web destiné à améliorer la visibilité de l'établissement et à permettre aux clients d'effectuer des réservations en ligne.",
    technologies: ["Full Stack", "Réservation en ligne"],
    demo: "https://mi-camp.netlify.app/",
    image: "/projects/mi-camp.jpg",
  },
  {
    id: "bionexx",
    number: "05",
    title: "Gestion des demandes d'achat",
    client: "BIONEXX",
    period: "Juin 2023 — Août 2023",
    category: "Application Web",
    year: "2023",
    description:
      "Développement d'une application web pour la gestion des situations de demandes d'achat.",
    technologies: ["Full Stack"],
    image: "/projects/bionexx.svg",
  },
  {
    id: "devhunt-eni",
    number: "06",
    title: "DEVHUNT ENI",
    client: "ENI Fianarantsoa",
    category: "Hackathon",
    year: "2024",
    description:
      "Participation à un DEVHUNT organisé par l'ENI Fianarantsoa — projet orienté vers la création de solutions favorisant l'inclusion des personnes en situation de handicap.",
    technologies: ["Hackathon", "Accessibilité"],
    image: "/projects/devhunt.svg",
  },
  {
    id: "group-manao",
    number: "07",
    title: "Projets professionnels actuels",
    client: "GROUP MANAO",
    period: "Octobre 2025 — Aujourd'hui",
    category: "Commerce & Vente",
    year: "2025",
    description: "Développement web dans l'univers du commerce et de la vente.",
    technologies: ["Full Stack"],
    image: "/projects/group-manao.svg",
  },
];
