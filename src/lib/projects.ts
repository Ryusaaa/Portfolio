export interface Project {
  slug: string;
  title: string;
  role: string;
  year: string;
  tags: string[];
  description: string;
  aestheticImage?: string;
  detailImages?: string[];
  githubFrontend?: string;
  githubBackend?: string;
}

export const projects: Project[] = [
  {
    slug: "smartai-refrigerator",
    title: "SMARTAI REFRIGERATOR",
    role: "Full-Stack Developer — Training Final Project",
    year: "2026",
    tags: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MySQL", "Prisma", "Cloudflare Workers AI", "REST API", "SSE"],
    description: `SmartAI Refrigerator is a full-stack web application that helps users manage food inventory, track expiration dates, and generate AI-assisted recipes from available ingredients. I built the application as the final project for BBPVP Bandung's Node.js and React training, integrating a React frontend with a Node.js/Express API, a MySQL database managed with Prisma, and Cloudflare Workers AI for recipe generation and conversational assistance.`,
    aestheticImage: "/Image/SMARTAI-AESTHETIC.png",
    detailImages: [
      "/Image/detail-smartai/Login-Page.png",
      "/Image/detail-smartai/Dashboard-Page.png",
      "/Image/detail-smartai/Recipe-Generator-Page.png",
      "/Image/detail-smartai/Chatbot-Page.png",
      "/Image/detail-smartai/Refrigerator-Stock-Page.png",
    ],
    githubFrontend: "https://github.com/Ryusaaa/smart-ai-refrigerator-frontend",
    githubBackend: "https://github.com/Ryusaaa/smart-ai-refrigerator-backend",
  },
  {
    slug: "accounting-system",
    title: "ACCOUNTING SYSTEM",
    role: "Web Developer",
    year: "2025",
    tags: ["Laravel", "Vue.js", "MySQL", "REST API", "Finance"],
    description: `This project was developed to improve financial workflows that were previously handled manually and often caused inefficiencies. I worked closely with the finance team to understand processes such as invoicing, reporting, and reimbursements, and translated those needs into a structured system. As a fullstack developer, I built a centralized platform to manage financial data and automate reporting. This improved data consistency and reduced manual work. Through this project, I learned how to bridge communication between non-technical users and system implementation, as well as design solutions based on real operational needs.`,
    aestheticImage: "/Image/ACCOUNTING-AESTHETIC.png",
    detailImages: [
      "/Image/detail-accounting/Screenshot 2026-04-14 194717.png",
      "/Image/detail-accounting/Screenshot 2026-04-14 194744.png",
      "/Image/detail-accounting/Screenshot 2026-04-14 194756.png",
      "/Image/detail-accounting/Screenshot 2026-04-14 194833.png",
      "/Image/detail-accounting/Screenshot 2026-04-14 194845.png",
    ],
  },
  {
    slug: "certificate-generator",
    title: "CERTIFICATE GENERATOR",
    role: "Backend Developer",
    year: "2025",
    tags: ["Laravel", "Email Automation", "PDF Generation", "REST API"],
    description: `This was the first project I worked on during my internship, where I collaborated with a cross-school team to build a certificate generation platform. The goal was to replace manual certificate creation, which was inefficient when handling large numbers of participants. As a backend developer, I focused on building the system for bulk certificate generation and automated email distribution. This improved efficiency and ensured consistency across outputs. Through this project, I learned how to collaborate in a team, handle real-world requirements, and build backend systems that support scalable workflows.`,
    aestheticImage: "/Image/SOD-AESTHETIC.png",
    detailImages: [
      "/Image/detail-SOD/Screenshot 2025-11-30 191601.png",
      "/Image/detail-SOD/Screenshot 2025-12-01 075604.png",
      "/Image/detail-SOD/admin-activity-management.png",
      "/Image/detail-SOD/admin-activitytypes.png",
      "/Image/detail-SOD/admin-add-activity-management.png",
      "/Image/detail-SOD/admin-add-instruktur.png",
      "/Image/detail-SOD/admin-add-sertifikat.png",
    ],
  },
  {
    slug: "sibening",
    title: "SIBENING",
    role: "Backend Developer & Technical Lead",
    year: "2025",
    tags: ["WebSocket", "Real-time Chat", "Laravel", "Student Platform"],
    description: `This project was developed to improve communication between students and school counselors, where delays and lack of real-time interaction reduced the effectiveness of support. I worked in a team of four as a backend developer and technical lead. I communicated with counselors to understand common student issues and existing communication patterns, then translated those insights into system requirements. On the technical side, I implemented a real-time chat system using WebSocket, focusing on message handling and system reliability. Through this project, I learned how to lead technical decisions, translate user needs into system design, and build backend systems that support real-time interaction.`,
    aestheticImage: "/Image/SIBENING-AESTHETIC.png",
  },
  {
    slug: "ashbound",
    title: "ASHBOUND",
    role: "Fullstack Game Developer",
    year: "2026",
    tags: ["Flutter", "Flame", "Elysiajs", "Multiplayer", "RPG"],
    description: `Ashbound is a multiplayer co-op RPG developed using Flutter and the Flame game engine. The project was created as an exploration of how Flutter can be used beyond traditional application development to build interactive multiplayer experiences across multiple platforms. I built the client side using Flame to handle the game loop and rendering, and developed the backend using Elysiajs for networking and game state synchronization.`,
    aestheticImage: "/Image/ASHBOUND-DETAIL-AESTHETIC.png",
    detailImages: [
      "/Image/detail-ashbound/PAGE-WELCOME.png",
      "/Image/detail-ashbound/PAGE-MAINMENU.png",
      "/Image/detail-ashbound/PAGE-STARTGAME.png",
      "/Image/detail-ashbound/PAGE-MULTIPLAYER(ENTER-THE-ASH).png",
      "/Image/detail-ashbound/PAGE-CREATE-ROOM.png",
      "/Image/detail-ashbound/PAGE-JOIN-ROOM.png",
      "/Image/detail-ashbound/PAGE-WAITING-ROOM.png",
      "/Image/detail-ashbound/PAGE-CHOOSE-ROLE.png",
      "/Image/detail-ashbound/PAGE-LETTER.png",
      "/Image/detail-ashbound/PAGE-MESSAGE-501.png",
      "/Image/detail-ashbound/PAGE-SETTING.png",
    ],
    githubFrontend: "https://github.com/Ryusaaa/ashbound-frontend",
    githubBackend: "https://github.com/Ryusaaa/ashbound-backend",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}
