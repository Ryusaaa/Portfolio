export type SoundName = "click" | "confirm";

/**
 * Sound hooks reserved for optional future audio feedback.
 * Currently silent to avoid intrusive browser audio or external F1 assets.
 */
export function preloadSounds() {
  // No-op
}

export async function playSound(_name: SoundName, _volume = 0.5): Promise<boolean> {
  void _name;
  void _volume;
  return false;
}

export function playOnFirstGesture(_name: SoundName, _maxWaitMs = 8000): (() => void) | undefined {
  void _name;
  void _maxWaitMs;
  return undefined;
}
