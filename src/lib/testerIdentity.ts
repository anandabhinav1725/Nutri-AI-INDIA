const testerStorageKey = "nutriai_browser_tester_id";

export function getOrCreateBrowserTesterId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(testerStorageKey);
  if (existing) {
    return existing;
  }

  const id = window.crypto?.randomUUID?.() ?? `tester-${Date.now()}`;
  window.localStorage.setItem(testerStorageKey, id);
  return id;
}
