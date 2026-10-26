// Safe localStorage wrappers for saving client name and phone.
const STORAGE_KEY = "namekayro_client";

export interface SavedClient {
  name: string;
  phone: string;
}

export function getSavedClient(): SavedClient | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === "string" && typeof parsed.phone === "string") {
      return parsed as SavedClient;
    }
  } catch {
    // Gracefully handle storage disabled or corrupt JSON
  }
  return null;
}

export function saveClient(client: SavedClient): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
  } catch {
    // Gracefully handle storage quota or private browsing exceptions
  }
}

export function clearSavedClient(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore clear errors
  }
}
