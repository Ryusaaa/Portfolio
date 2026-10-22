"use client";

import { useState, type FormEvent } from "react";
import { Radio, Send } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data";
import { playSound } from "@/lib/sound";

const fieldClass =
  "w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-neutral-600 outline-none transition-colors duration-200 focus:border-f1-red";

const labelClass = "block font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-1";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim() || "Hello from your portfolio";
    const message = String(data.get("message") ?? "").trim();
    const body = `${message}\n\n— ${name} (${email})`;

    void playSound("radio");
    setSent(true);
    window.location.href = `mailto:${SOCIAL_LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Driver name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={`${fieldClass} cursor-target`}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Reply channel
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={`${fieldClass} cursor-target`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="What is this about?"
          className={`${fieldClass} cursor-target`}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Radio message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project or opportunity"
          className={`${fieldClass} cursor-target resize-none`}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          className="cursor-target inline-flex items-center justify-center gap-3 bg-f1-red px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.25em] text-white transition-colors duration-200 hover:bg-white hover:text-f1-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Send size={16} aria-hidden="true" />
          Send message
        </button>
        <p role="status" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500">
          {sent ? (
            <>
              <Radio size={14} className="text-f1-red" aria-hidden="true" />
              Message ready — your email app should open
            </>
          ) : (
            "Opens your email app with the message filled in"
          )}
        </p>
      </div>
    </form>
  );
}