# Satria Ibnu Safarudin - Portfolio

Personal portfolio of a backend / full-stack developer based in Bandung, Indonesia. Dark, scanline-inspired interface built with Next.js 16, React 19, Tailwind CSS v4, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-FF0055?style=flat-square&logo=framer&logoColor=white)

---

## Features

- **Route loader** - blinds-style scanline overlay with a progress fill on first visit and on every page change. Skipped under `prefers-reduced-motion`.
- **Gradient ASCII background** - React Bits `GradientASCII` behind the dashboard hero.
- **Halftone reveal** - React Bits `HalftoneReveal` on the featured project cover.
- **Logo loop** - React Bits `LogoLoop` for the Tools in use strip.
- **Pixel dissolve** - PixelFX `pixel-dissolve` on project covers.
- **Sakuga VFX buttons** - canvas button effects with a plain button fallback.
- **Button hover states** - shared `ma-btn` / `ma-link` styles in `globals.css`.
- **Project case studies** - detail pages generated from `src/lib/projects.ts`.

---

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS v4 |
| **Animation** | Framer Motion 12, GSAP, WebGL (React Bits) |
| **Icons** | Lucide React, React Icons |
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
│   ├── page.tsx                  # Dashboard
│   ├── projects/                 # Catalogue and [slug] detail
│   ├── experience/
│   ├── about/
│   ├── contact/
│   ├── icon.png, apple-icon.png  # Favicons
│   └── globals.css               # Palette tokens and shared styles
├── components/
│   ├── hero.tsx
│   ├── tools-strip.tsx
│   ├── dashboard/                # Featured showcase, ASCII backdrop
│   ├── transition/               # Route loader and page transition provider
│   ├── reactbits/                # Vendored React Bits components
│   ├── effects/                  # PixelFX and ASCII ornaments
│   └── ui/                       # Buttons, tabs, cards
└── lib/
    ├── data.ts                   # Projects, experience, tools, links
    ├── projects.ts               # Project detail content
    ├── sakuga/                   # Vendored Sakuga VFX button
    └── pixelfx/                  # Vendored PixelFX runtime
```

---

## Palette

Defined as CSS variables in `src/app/globals.css`. Token names keep the `midnight-*` prefix.

| Token | Value | Use |
|---|---|---|
| `midnight-950` | `#050505` | Background |
| `midnight-900` | `#0e130f` | Surfaces |
| `midnight-700` | `#3b4a37` | Borders |
| `midnight-500` | `#b7d12e` | Primary accent |
| `midnight-300` | `#9fb0b5` | Secondary text |
| `archive-paper` | `#d9d3c4` | Main text |
| `archive-muted` | `#b9ae98` | Body text |
| `olive` / `sand` / `wood` | `#5e7a2a` / `#b89f7e` / `#a9825a` | Supporting tones |

---

## Scripts

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint
npm test         # Jest
```

---

## Notes

- **Fonts** - Clash Display is served from `public/fonts/`. Inter, Geist Mono, and Press Start 2P are fetched from Google Fonts at build time, so `npm run build` needs an internet connection.
- **Third-party components** - sources and licenses are listed in `docs/COMPONENT_SOURCES.md`.
- **Content** - edit projects, experience, tools, and social links in `src/lib/data.ts` and `src/lib/projects.ts`.

---

[@Ryusaaa](https://github.com/Ryusaaa)