import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sakuga-button": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: "primary" | "secondary";
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
      };
    }
  }
}

declare module "@/lib/sakuga/button.js" {
  export function registerSakugaButton(): void;
}

declare module "@/lib/pixelfx/core/index.js" {
  export interface PixelFrame {
    w: number;
    h: number;
    data: Uint8ClampedArray;
  }
  export interface PixelFxInstance {
    update: (dt: number) => void;
    draw: (frame: PixelFrame, layer?: "back" | "front") => void;
  }
  export function createFrame(w: number, h: number): PixelFrame;
  export function clearFrame(frame: PixelFrame): void;
  export function createFx(
    effect: unknown,
    options?: Record<string, unknown>
  ): PixelFxInstance;
  export function composite(
    frame: PixelFrame,
    out: Uint8ClampedArray,
    bg?: string | number
  ): void;
}

declare module "@/lib/pixelfx/fx/transitions/pixel-dissolve.js" {
  export const meta: {
    name: string;
    duration: number;
    size: [number, number];
  };
  export function draw(p: unknown, t: number, o?: Record<string, unknown>): void;
}
