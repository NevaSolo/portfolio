export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export const EXPERTISE: SkillGroup[] = [
  {
    title: "Full Stack Development",
    description: "Frontend & Backend",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Vue.js", "Next.js", "Node.js", "Laravel", "Symfony", "Flask", "CodeIgniter", "PHP"],
  },
  {
    title: "Artificial Intelligence",
    description: "Machine Learning & NLP",
    items: ["Python", "Machine Learning", "Deep Learning", "NLP", "OCR", "AI Applications"],
  },
  {
    title: "Database",
    description: "Data persistence",
    items: ["MySQL", "PostgreSQL", "MongoDB", "SQL"],
  },
  {
    title: "Creative Development",
    description: "Interactive & Motion",
    items: ["Three.js", "React Three Fiber", "Interactive Web", "UX/UI", "Motion Design"],
  },
];

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Vue.js",
  "Node.js",
  "Laravel",
  "Symfony",
  "Flask",
  "PHP",
  "CodeIgniter",
  "Three.js",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Machine Learning",
  "NLP",
  "OCR",
];

export const LANGUAGES = [
  { name: "Français", level: "Excellent" },
  { name: "Anglais", level: "Moyen" },
  { name: "Malagasy", level: "Langue maternelle" },
];

export const STATS = [
  { value: "3+", label: "Années d'expérience / projets professionnels" },
  { value: "Master II", label: "Intelligence Artificielle" },
  { value: "Full Stack", label: "Frontend + Backend" },
  { value: "AI", label: "Machine Learning / IA" },
];
