import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google"; // Keep Inter for body text as it's readable
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClientWrapper } from "@/components/ClientWrapper";
import { PageTransitionProvider } from "@/components/transition/page-transition-provider";
import { CursorMount } from "@/components/cursor-mount";

// Runs before first paint: only the initial load of "/" in a fresh session gets the boot screen.
const bootGate = `try{if(location.pathname==="/"&&!sessionStorage.getItem("boot-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.boot="pending"}}catch(e){}`;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Configure local F1 font
const f1Font = localFont({
  src: [
    {
      path: "../../public/fonts/Formula1-Regular-1.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formula1-Bold-4.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formula1-Wide.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Satria Ibnu Safarudin | Portofolio",
  description: "High-performance Junior Fullstack engineering. Built with Next.js and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootGate }} />
      </head>
      <body
        className={`${inter.variable} ${f1Font.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <PageTransitionProvider>
          <Navbar />
          <ClientWrapper>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ClientWrapper>
          <CursorMount />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
