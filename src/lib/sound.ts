export type SoundName = "passing" | "radio";

const SRC: Record<SoundName, string> = {
  passing: "/sounds/f1-passing.mp3",
  radio: "/sounds/f1-radio.mp3",
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};

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
  (Object.keys(SRC) as SoundName[]).forEach(get);
}

/**
 * Plays a sound from the start. Resolves true if playback started.
 * Resolves false when the browser blocks it (autoplay policy) or the file fails.
 */
export async function playSound(name: SoundName, volume = 0.7): Promise<boolean> {
  const audio = get(name);
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = volume;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}