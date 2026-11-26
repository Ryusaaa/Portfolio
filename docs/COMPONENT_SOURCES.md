# Component Sources & Provenance — MIDNIGHT ARCHIVE

This file records external component sources, licenses, and local file paths used in the portfolio.

## 1. Sakuga VFX (`finktheartist/sakuga-vfx`)
- **Source:** https://github.com/finktheartist/sakuga-vfx (`button/button.js`)
- **License:** MIT License
- **Local files:**
  - `src/lib/sakuga/button.js` — vendored `<sakuga-button>` custom element with SSR guard and MIDNIGHT ARCHIVE `--sk-*` / canvas color palette.
  - `src/components/ui/sakuga-vfx-button.tsx` — React wrapper used in the primary Navbar (`src/components/navbar.tsx`), Hero CTAs (`src/components/hero.tsx`), About CTAs (`src/app/about/page.tsx`), and Contact CTA (`src/app/contact/page.tsx`).

## 2. PixelFX (`patch-gg/pixelfx`)
- **Source:** https://github.com/patch-gg/pixelfx (`src/core/*`, `src/fx/transitions/pixel-dissolve.js`, `src/fx/transitions/_lib.js`)
- **License:** MIT License (Copyright (c) 2026 Patch / Hugo Duprez; `src/lib/pixelfx/LICENSE`)
- **Local files:**
  - `src/lib/pixelfx/` — core runtime and `pixel-dissolve` transition.
  - `src/components/effects/pixel-fx-reveal.tsx` — `<PixelFxReveal>` canvas wrapper rendering `pixel-dissolve` on featured project visuals (`src/components/dashboard/featured-showcase.tsx`, `src/app/projects/page.tsx`).

## 3. React Bits (`reactbits.dev`)
- **Source:** https://reactbits.dev/ (existing vendored components in `src/components/reactbits/`)
- **Local components used visibly on Dashboard & Tools:**
  - `SplitText` (`src/components/reactbits/split-text.tsx`) — used in `src/components/dashboard/featured-showcase.tsx` and `src/components/ProjectDetail.tsx`.
  - `DecryptedText` (`src/components/reactbits/decrypted-text.tsx`) — used in `src/components/dashboard/featured-showcase.tsx`.
  - `Magnet` (`src/components/reactbits/magnet.tsx`) — used in `src/components/dashboard/featured-showcase.tsx` and `src/components/ProjectDetail.tsx`.
  - `LogoLoop` (`src/components/reactbits/logo-loop.tsx`) — used in `src/components/tools-strip.tsx`.
  - `GradientASCII` (`src/components/reactbits/gradient-ascii.tsx`) — Backgrounds / Gradient ASCII, rendered behind the Hero through `src/components/dashboard/ascii-backdrop.tsx`.
  - `HalftoneReveal` (`src/components/reactbits/halftone-reveal.tsx`) — Animations / Halftone Reveal, used on the featured project cover in `src/components/dashboard/featured-showcase.tsx`.

## 4. 21st.dev Patterns (`21st.dev`)
- **Spotlight Card (`src/components/ui/spotlight-card.tsx`):**
  - Pattern: 21st.dev Spotlight Card (pointer-tracked radial spotlight surface).
  - Rendered on: Home Archive Directory (`src/app/page.tsx`), Experience Milestones (`src/app/experience/page.tsx`), About Interests (`src/app/about/page.tsx`), Contact Channels (`src/app/contact/page.tsx`).
- **Animated Tabs (`src/components/ui/archive-tabs.tsx`):**
  - Pattern: 21st.dev Animated Tabs (`framer-motion` `layoutId` spring indicator).
  - Rendered on: Projects Catalogue filter (`src/app/projects/page.tsx`) and About Technical Index (`src/app/about/page.tsx`).
