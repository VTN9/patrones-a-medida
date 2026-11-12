// ============================================================================
// Hook: gestión de medidas del formulario y perfiles
// ============================================================================

import { useState, useCallback } from "react";
import type { SavedProfile, AppMeasurements, ValidationError } from "../types";
import {
  getProfiles,
  saveProfile,
  updateProfile,
  deleteProfile,
} from "../services/localStorage/profiles";
import { validateMedidas } from "../utils/validators";

export function useMeasurements(initialMeasures: AppMeasurements = {}) {
  const [measures, setMeasures] = useState<AppMeasurements>(initialMeasures);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [profiles, setProfiles] = useState<SavedProfile[]>(getProfiles());

  const setMeasure = useCallback((field: string, value: string) => {
    const num = value === "" ? 0 : parseFloat(value.replace(",", "."));
    setMeasures((prev) => ({ ...prev, [field]: num }));
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);

  const runValidation = useCallback(
    (reglas: Array<() => ValidationError | null>) => {
      const errs = validateMedidas(measures, reglas);
      setErrors(errs);
      return errs.length === 0;
    },
    [measures]
  );

  const loadProfile = useCallback((profile: SavedProfile) => {
    setMeasures(profile.measures);
  }, []);

  const createProfile = useCallback(
    (name: string, category: string) => {
      const p = saveProfile({ name, category: category as any, measures });
      setProfiles(getProfiles());
      return p;
    },
    [measures]
  );

  const editProfile = useCallback(
    (id: string, changes: Partial<SavedProfile>) => {
      const p = updateProfile(id, changes);
      if (p) setProfiles(getProfiles());
      return p;
    },
    []
  );

  const removeProfile = useCallback((id: string) => {
    const ok = deleteProfile(id);
    if (ok) setProfiles(getProfiles());
    return ok;
  }, []);

  return {
    measures,
    setMeasure,
    errors,
    setErrors,
    clearErrors,
    runValidation,
    profiles,
    loadProfile,
    createProfile,
    editProfile,
    removeProfile,
    refreshProfiles: () => setProfiles(getProfiles()),
  };
}