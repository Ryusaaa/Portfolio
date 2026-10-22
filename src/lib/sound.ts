export type SoundName = "passing" | "radio";

const SRC: Record<SoundName, string> = {
  passing: "/sounds/F1-PASSING.mp3",
  radio: "/sounds/F1-RADIO.mp3",
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};
const played: Partial<Record<SoundName, boolean>> = {};

function get(name: SoundName): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  let audio = cache[name];
  if (!audio) {
    audio = new Audio(SRC[name]);
    audio.preload = "auto";
    cache[name] = audio;
  }
  return audio;
}

/** Warm the cache so the first play has no network delay. */
export function preloadSounds() {
  (Object.keys(SRC) as SoundName[]).forEach((n) => get(n)?.load());
}

/**
 * Plays a sound from the start. Resolves true if playback started.
 * Resolves false when the browser blocks it (autoplay policy) or the file fails;
 * the reason is logged to the console so it can be diagnosed in production.
 */
export async function playSound(name: SoundName, volume = 0.7): Promise<boolean> {
  const audio = get(name);
  if (!audio) return false;
  try {
    audio.volume = volume;
  } catch {
    /* read-only on some mobile browsers */
  }
  try {
    // Safari throws if currentTime is set before metadata is ready, so only rewind when needed.
    if (audio.currentTime > 0) audio.currentTime = 0;
  } catch {
    /* ignore */
  }
  try {
    await audio.play();
    played[name] = true;
    return true;
  } catch (err) {
    const reason = err instanceof Error ? err.name : String(err);
    console.warn(`[sound] "${name}" did not play (${reason}). File: ${SRC[name]}`);
    return false;
  }
}

/**
 * Autoplay fallback: play `name` on the first click, tap or key press, as long as that
 * happens within `maxWaitMs` of calling this. Skipped if the sound already played.
 */
export function playOnFirstGesture(name: SoundName, maxWaitMs = 8000): (() => void) | undefined {
  if (typeof window === "undefined" || played[name]) return;
  const events = ["pointerdown", "keydown"] as const;
  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, handler));
    clearTimeout(timer);
  };
  const handler = () => {
    cleanup();
    if (!played[name]) void playSound(name);
  };
  const timer = setTimeout(cleanup, maxWaitMs);
  events.forEach((e) => window.addEventListener(e, handler));
  return cleanup;
}