import type { Metadata } from "next";
import { StartGate } from "@/components/start-gate";

export const metadata: Metadata = {
  title: "Satria Ibnu Safarudin | Portofolio",
  robots: { index: false, follow: false },
};

export default function StartPage() {
  return <StartGate />;
}