export const ABOUT_DATA = {
  title: "Passion & Purpose",
  description: "I am a Fullstack Developer with a deep passion for the ever-evolving world of technology. My journey is driven by curiosity and a constant desire to explore and master new tools and frameworks.",
  subDescription: "With a strong foundation in problem-solving and an eagerness to learn, I am ready to contribute as a Fullstack Developer—bringing fresh ideas, dedication, and a drive to create impactful digital solutions."
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
    id: "1",
    role: "Fullstack Developer (Internship)",
    company: "PT. DiAntara Intermedia",
    period: "July 2025 — February 2026",
    description: "Completed an internship as a Fullstack Developer, utilizing a modern tech stack including Vue.js, Next.js, and Laravel. Responsible for building and maintaining web applications and managing databases with PostgreSQL and MySQL.",
    type: "Internship"
  },
  // Add more experience items here
];

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  link?: string;
  type: "Web Development" | "UI/UX Design" | "Mobile App";
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "sod",
    title: "SOD (Sertifikat Online Diantara)",
    description: "A platform for automatically generating and managing certificates for events and workshops. Streamlines the certification process with bulk generation features.",
    image: "/Image/SOD.png",
    tags: ["Next.js", "Laravel", "Certificate Generation", "Automation"],
    year: "2025",
    type: "Web Development"
  },
  {
    id: "accounting",
    title: "Accounting Diantara",
    description: "Internal accounting system developed during my internship at PT DiAntara Intermedia. tailored for the Finance division to manage financial records and reporting.",
    image: "/Image/Accounting-Diantara.png",
    tags: ["Laravel", "Vue.js", "Accounting", "Internal System"],
    year: "2025",
    type: "Web Development"
  },
  {
    id: "sibening",
    title: "Si-Bening",
    description: "Sistem Bimbingan Elektronik dan Konseling. A school counseling application connecting guidance counselors (Guru BK) and students for efficient consultation management.",
    image: "/Image/Si-Bening.png",
    tags: ["Laravel", "React Vite", "School System", "Counseling", "Management"],
    year: "2025",
    type: "Web Development"
  }
];

export const SOCIAL_LINKS = {
  email: "satriaibnusaparudin26@gmail.com", // TODO: Update with actual email
  instagram: "https://www.instagram.com/dlqdmsdn", // TODO: Update
  github: "https://github.com/Ryusaaa",
  linkedin: "https://www.linkedin.com/in/Satria-Ibnu-Safarudin" // TODO: Update
};
