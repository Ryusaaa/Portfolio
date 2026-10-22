"use client";

// Thin local wrapper so the rest of the app doesn't depend on vendor props.
import MagnetBase from "./reactbits/magnet";
import type { ComponentProps } from "react";

export function Magnet(props: ComponentProps<typeof MagnetBase>) {
  return <MagnetBase magnetStrength={4} {...props} />;
}
