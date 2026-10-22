const SEEN_KEY = "boot-seen";
const RETURN_KEY = "boot-return";

const listeners = new Set<() => void>();
let raceRequested = false;
let finished = false;

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeBoot(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function hasSeenBoot(): boolean {
  if (finished) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function shouldShowBoot(): boolean {
  return raceRequested && !finished;
}

export function requestRace() {
  raceRequested = true;
  document.documentElement.dataset.boot = "pending";
  notify();
}

export function markBootSeen() {
  finished = true;
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* ignore */
  }
  notify();
}

export function getReturnPath(): string {
  try {
    const p = sessionStorage.getItem(RETURN_KEY);
    if (p && p.startsWith("/") && !p.startsWith("//") && !p.startsWith("/start")) return p;
  } catch {
    /* ignore */
  }
  return "/";
}