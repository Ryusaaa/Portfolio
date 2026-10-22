# 🏎️ Satria Ibnu Safarudin - Portfolio

> A high-performance, F1-themed portfolio website built with Next.js 16, with a project-open transition, a tools strip and React Bits components.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer)

## ✨ Features

- 🏁 **F1-Themed Design** - Racing-inspired aesthetics with dynamic animations
- ⚡ **Next.js 16 + Turbopack** - Lightning-fast development and production builds
- 🎨 **Tailwind CSS v4** - Modern styling with custom F1 color palette
- 🧭 **Project-open transition** - Split-panel "pit-in" tied to the real load of the detail page and its cover image
- 🧰 **Tools strip** - Logo loop of the frameworks and tools used in the projects above
- 📱 **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- 🎭 **Framer Motion** - Smooth, performant animations throughout
- 🌐 **Fully static home page** - No GitHub request at build or runtime on `/`
- 🎯 **SEO Optimized** - Meta tags and semantic HTML structure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Ryusaaa/Portofolio.git
   cd Portofolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles & F1 theme
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── projects/
│   │       ├── page.tsx      # Projects gallery
│   │       └── [slug]/       # Dynamic project pages
│   ├── components/
│   │   ├── hero.tsx          # Hero section with modal
│   │   ├── project-showcase.tsx # Selected Works cards
│   │   ├── tools-strip.tsx   # Tools logo loop
│   │   ├── transition/       # Project-open overlay + TransitionLink
│   │   └── reactbits/        # Vendored React Bits components (see below)
│   ├── lib/
│   │   ├── github.ts         # GitHub API utilities
│   │   └── utils.ts          # Helper functions
│   └── types/
│       └── index.ts          # TypeScript definitions
├── public/
│   └── fonts/                # Custom F1 fonts
└── ...config files
```

## 🎨 Customization

### Colors
The F1 color palette is defined in `src/app/globals.css`:

```css
:root {
  --f1-red: #e10600;
  --f1-dark: #15151e;
  --f1-gray-dark: #1e1e26;
  --f1-gray: #38383f;
  --f1-silver: #a1a1aa;
}
```

### Personal Information
Update your information in `src/components/hero.tsx`:
- Name
- Bio description
- Social links

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React Framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [date-fns](https://date-fns.org/) | Date formatting |

## 📜 Available Scripts

```bash
# Development
npm run dev        # Start dev server with Turbopack

# Production
npm run build      # Build for production
npm run start      # Start production server

# Testing
npm run test       # Run tests
npm run lint       # Run ESLint
```

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ryusaaa/Portofolio)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Satria Ibnu Safarudin**

- GitHub: [@Ryusaaa](https://github.com/Ryusaaa)

---

<p align="center">
  Built with ❤️ and 🏎️ racing spirit
</p>

## Content to add

SmartAI Refrigerator currently renders a typographic cover plate. To replace it with real images, add these files (exact names and case) and set `image` in `PROJECTS_DATA` and `aestheticImage` / `detailImages` in `src/lib/projects.ts`:

- `public/Image/SMARTAI-REFRIGERATOR.png` (card cover, 16:9, 1600 px wide or more)
- `public/Image/SMARTAI-AESTHETIC.png` (detail banner, 16:7, 2000 px wide or more)
- `public/Image/detail-smartai/*.png` (real screenshots)

## Third-party components

`src/components/reactbits/` contains components copied from [React Bits](https://reactbits.dev) (MIT + Commons Clause). They are used inside this website and are not redistributed as a component library. Keep the attribution comment at the top of each file.

## Scripts

`npm run dev`, `npm run build`, `npm run lint`, `npm test`. The production build downloads the Inter font from Google Fonts, so it needs internet access.
