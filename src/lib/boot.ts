const SEEN_KEY = "boot-seen";
const RETURN_KEY = "boot-return";

const listeners = new Set<() => void>();

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
  return true;
}

export function shouldShowBoot(): boolean {
  return false;
}

export function markBootSeen() {
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
