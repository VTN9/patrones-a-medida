// ============================================================================
// Gestión de perfiles de medidas en localStorage
// ============================================================================

import type { SavedProfile } from "../../types";

const STORAGE_KEY = "patrones_medida_perfiles";

export function getProfiles(): SavedProfile[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProfile(profile: Omit<SavedProfile, "id" | "createdAt" | "updatedAt">): SavedProfile {
  const profiles = getProfiles();
  const now = new Date().toISOString();
  const newProfile: SavedProfile = { ...profile, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  const updated = [...profiles, newProfile];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newProfile;
}

export function updateProfile(id: string, changes: Partial<SavedProfile>): SavedProfile | null {
  const profiles = getProfiles();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...profiles[idx], ...changes, updatedAt: new Date().toISOString() };
  profiles[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return updated;
}

export function deleteProfile(id: string): boolean {
  const profiles = getProfiles();
  const filtered = profiles.filter((p) => p.id !== id);
  if (filtered.length === profiles.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getProfileById(id: string): SavedProfile | undefined {
  return getProfiles().find((p) => p.id === id);
}