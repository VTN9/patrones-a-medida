// ============================================================================
// Hook: acceso al catálogo de patrones
// ============================================================================

import { PATTERNS, PATTERNS_BY_CATEGORY } from "../data/patterns";

export function usePatterns() {
  return {
    patterns: PATTERNS,
    patternsByCategory: PATTERNS_BY_CATEGORY,
  };
}