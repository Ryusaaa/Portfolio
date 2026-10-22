"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition, type TransitionMeta } from "./page-transition-provider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  transition?: TransitionMeta;
};

function isPlainLeftClick(e: MouseEvent<HTMLAnchorElement>, target?: string) {
  return (
    e.button === 0 &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey &&
    (!target || target === "_self")
  );
}

export function TransitionLink({ href, transition, onClick, target, children, ...rest }: Props) {
  const { navigate } = usePageTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (!isPlainLeftClick(e, target)) return; // modifier / middle click / _blank: browser default
    e.preventDefault();
    navigate(href, transition);
  };

  return (
    <Link href={href} target={target} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
