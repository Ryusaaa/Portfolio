export interface Project {
  slug: string;
  title: string;
  role: string;
  year: string;
  tags: string[];
  description: string;
  aestheticImage: string;
  detailImages?: string[];
}

export const projects: Project[] = [
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
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}
