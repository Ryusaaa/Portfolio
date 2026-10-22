# Satria Ibnu Safarudin — Portfolio

Personal portfolio site with an F1-racing aesthetic. Built with Next.js 16, Framer Motion, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-FF0055?style=flat-square&logo=framer&logoColor=white)

---

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) + Turbopack |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Testing** | Jest + Testing Library |

---

## Getting Started

```bash
git clone git@github.com:Ryusaaa/Portofolio.git
cd Portofolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Home
│   ├── projects/
│   │   ├── page.tsx            # Project gallery
│   │   └── [slug]/page.tsx     # Project detail
│   └── contact/page.tsx        # Contact
├── components/
│   ├── hero.tsx
│   ├── project-showcase.tsx
│   ├── tools-strip.tsx
│   ├── transition/             # Split-panel page transitions
│   └── reactbits/              # Vendored React Bits components
└── lib/
    ├── projects.ts             # Project data
    └── github.ts               # GitHub API
```

---

## Scripts

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
npm test         # Jest
```

---

## Notes

- **Fonts** — Uses the Formula 1 typeface served from `public/fonts/`. The production build fetches Inter from Google Fonts, so an internet connection is required.
- **React Bits** — `src/components/reactbits/` contains components sourced from [reactbits.dev](https://reactbits.dev) (MIT + Commons Clause). Attribution comments are preserved in each file.
- **Static home** — The `/` route makes no external API requests at build or runtime.

---

[@Ryusaaa](https://github.com/Ryusaaa)
