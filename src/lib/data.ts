export const ABOUT_DATA = {
  title: "Who I Am",
  description: "Junior full-stack developer based in Indonesia. I build web applications end to end — React, Vue and Next.js on the front, Laravel and Node.js on the back — and I'm currently doing on-the-job training as a backend developer at PT FAST Indo Talenta.",
  subDescription: "Most of my recent work is about connecting the parts: databases, APIs and AI services wired into something a person can actually use. I'm looking for a junior full-stack or backend role where I can keep learning on real systems."
};

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: string;
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "2",
    role: "Backend Developer — On-the-Job Training",
    company: "PT FAST Indo Talenta",
    period: "September 2026 — October 2026",
    description: "Continued my vocational training through an on-the-job placement at PT FAST Indo Talenta as a Backend Developer. Contributed to the rebuild of the Fitalenta website into a unified web system backed by a centralized database. My work focused on backend implementation, integrating system workflows, maintaining consistent data handling, and improving website security.",
    type: "On-the-Job Training"
  },
  {
    id: "3",
    role: "Web Development Trainee — Batch 4 (Node.js & React)",
    company: "BBPVP Bandung — Ministry of Manpower of the Republic of Indonesia (Kemnaker)",
    period: "August 2026 — September 2026",
    description: "Participated in Batch 4 of the vocational web-development training program organized by Indonesia's Ministry of Manpower (Kemnaker) at BBPVP Bandung, focusing on full-stack development with Node.js and React. Applied the training through practical assignments and a final project involving frontend development, backend APIs, database integration, and AI service integration.",
    type: "Vocational Training"
  },
  {
    id: "1",
    role: "Fullstack Developer (Internship)",
    company: "PT. DiAntara Intermedia",
    period: "July 2025 — February 2026",
    description: "Completed an internship as a Fullstack Developer, utilizing a modern tech stack including Vue.js, Next.js, and Laravel. Responsible for building and maintaining web applications and managing databases with PostgreSQL and MySQL.",
    type: "Internship"
  },
];

export interface ProjectItem {
  id: string;
  slug: string; // must equal a slug in src/lib/projects.ts
  title: string;
  description: string;
  image?: string; // optional: a typographic CoverPlate is rendered when missing
  tags: string[];
  year: string;
  link?: string;
  type: "Web Development" | "UI/UX Design" | "Mobile App" | "Game Development";
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "smartai",
    slug: "smartai-refrigerator",
    title: "SmartAI Refrigerator",
    description: "A web app for managing food inventory, tracking expiration dates, and generating AI-assisted recipes from what's in the fridge. Final project of the BBPVP Bandung Node.js and React training.",
    image: "/Image/SMARTAI-REFRIGERATOR.png",
    tags: ["React", "Node.js", "MySQL", "Prisma", "Cloudflare Workers AI"],
    year: "2026",
    type: "Web Development"
  },
  {
    id: "sod",
    slug: "certificate-generator",
    title: "SOD (Sertifikat Online Diantara)",
    description: "A platform for automatically generating and managing certificates for events and workshops. Streamlines the certification process with bulk generation features.",
    image: "/Image/SOD.png",
    tags: ["Next.js", "Laravel", "Certificate Generation", "Automation"],
    year: "2025",
    type: "Web Development"
  },
  {
    id: "accounting",
    slug: "accounting-system",
    title: "Accounting Diantara",
    description: "Internal accounting system developed during my internship at PT DiAntara Intermedia. tailored for the Finance division to manage financial records and reporting.",
    image: "/Image/Accounting-Diantara.png",
    tags: ["Laravel", "Vue.js", "Accounting", "Internal System"],
    year: "2025",
    type: "Web Development"
  },
  {
    id: "sibening",
    slug: "sibening",
    title: "Si-Bening",
    description: "Sistem Bimbingan Elektronik dan Konseling. A school counseling application connecting guidance counselors (Guru BK) and students for efficient consultation management.",
    image: "/Image/Si-Bening.png",
    tags: ["Laravel", "React Vite", "School System", "Counseling", "Management"],
    year: "2025",
    type: "Web Development"
  },
  {
    id: "ashbound",
    slug: "ashbound",
    title: "Ashbound",
    description: "Ashbound is a multiplayer co-op RPG developed using Flutter and the Flame game engine. The project was created as an exploration of how Flutter can be used beyond traditional application development to build interactive multiplayer experiences across multiple platforms.",
    image: "/Image/ASHBOUND_AESTHETHIC.png",
    tags: ["Flutter", "Flame", "Elysiajs", "Multiplayer"],
    year: "2026",
    type: "Game Development"
  }
];

export const SOCIAL_LINKS = {
  email: "satriaibnusaparudin26@gmail.com", // TODO: Update with actual email
  instagram: "https://www.instagram.com/dlqdmsdn", // TODO: Update
  github: "https://github.com/Ryusaaa",
  linkedin: "https://www.linkedin.com/in/Satria-Ibnu-Safarudin" // TODO: Update
};


export interface ToolItem {
  name: string;
  icon: string; // key into the icon map in components/tools-strip.tsx
}

// Only technologies used in the projects and experience listed on this site.
export const TOOLS_DATA: ToolItem[] = [
  { name: "Next.js", icon: "SiNextdotjs" },
  { name: "React", icon: "SiReact" },
  { name: "Vue.js", icon: "SiVuedotjs" },
  { name: "Vite", icon: "SiVite" },
  { name: "Laravel", icon: "SiLaravel" },
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "Express", icon: "SiExpress" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "MySQL", icon: "SiMysql" },
  { name: "PostgreSQL", icon: "SiPostgresql" },
  { name: "Prisma", icon: "SiPrisma" },
  { name: "Flutter", icon: "SiFlutter" },
  { name: "GSAP", icon: "SiGreensock" },
  { name: "Cloudflare", icon: "SiCloudflare" },
];

/** Position (0-based) of a project in the Selected Works order, or -1. */
export function getProjectIndex(slug: string): number {
  return PROJECTS_DATA.findIndex((p) => p.slug === slug);
}
