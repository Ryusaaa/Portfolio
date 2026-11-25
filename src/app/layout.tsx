import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { ClientWrapper } from "@/components/ClientWrapper";
import { PageTransitionProvider } from "@/components/transition/page-transition-provider";
import { PixelCursor } from "@/components/cursor/pixel-cursor";
import { SiteChrome } from "@/components/site-chrome";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel-var",
  subsets: ["latin"],
  display: "swap",
});

// MIDNIGHT ARCHIVE signature typeface — Clash Display (locally hosted, Fontshare license)
const clashDisplay = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Satria Ibnu Safarudin — MIDNIGHT ARCHIVE",
  description:
    "Personal engineering archive of Satria Ibnu Safarudin — backend/full-stack developer building reliable web systems, services, and integrations. Based in Bandung, Indonesia.",
  openGraph: {
    title: "Satria Ibnu Safarudin — MIDNIGHT ARCHIVE",
    description: "Backend / full-stack developer. Systems, integrations, and software built with intention.",
    url: "https://ryusa.tech",
    siteName: "ryusa.tech",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${pressStart2P.variable} ${clashDisplay.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <PageTransitionProvider>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <ClientWrapper>
            <main className="flex-grow">{children}</main>
            <SiteChrome>
              <Footer />
            </SiteChrome>
          </ClientWrapper>
          <PixelCursor />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
