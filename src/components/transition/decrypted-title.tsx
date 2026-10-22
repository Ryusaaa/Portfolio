"use client";

import DecryptedText from "@/components/reactbits/decrypted-text";

/** One-shot decrypt reveal. The final text is exposed to assistive tech via aria-label. */
export function DecryptedTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span aria-label={text} className="block">
      <DecryptedText
        text={text}
        animateOn="view"
        sequential
        speed={40}
        maxIterations={8}
        className={className}
        parentClassName={className}
        encryptedClassName="text-[#a1a1aa]"
        aria-hidden="true"
      />
    </span>
  );
}
