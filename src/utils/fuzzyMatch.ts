// ============================================================================
// Fuzzy Matching — Levenshtein distance-based matching
// ============================================================================

/**
 * Calcula la distancia de Levenshtein entre dos strings.
 * Devuelve el número mínimo de ediciones (inserción, eliminación, sustitución)
 * necesarias para transformar `a` en `b`.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Optimización: si uno de los strings está vacío
  if (m === 0) return n;
  if (n === 0) return m;

  // Usar solo dos filas en lugar de la matriz completa (optimización de espacio)
  let prevRow = new Array(n + 1);
  let currRow = new Array(n + 1);

  for (let j = 0; j <= n; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,      // Eliminación
        currRow[j - 1] + 1,  // Inserción
        prevRow[j - 1] + cost // Sustitución
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[n];
}

/**
 * Busca la mejor coincidencia fuzzy de un input contra una lista de candidatos.
 * 
 * @param input - Texto ingresado por el usuario
 * @param candidates - Lista de strings candidatos
 * @param maxDistance - Distancia máxima aceptable (default: 2)
 * @returns El mejor candidato o undefined si ninguno cumple el threshold
 */
export function fuzzyMatch(
  input: string,
  candidates: string[],
  maxDistance: number = 2
): string | undefined {
  const normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) return undefined;

  let bestMatch: string | undefined;
  let bestDistance = Infinity;

  for (const candidate of candidates) {
    const normalizedCandidate = candidate.toLowerCase();
    
    // Match exacto = retorno inmediato
    if (normalizedInput === normalizedCandidate) {
      return candidate;
    }

    // Calcular distancia
    const distance = levenshteinDistance(normalizedInput, normalizedCandidate);
    
    // Solo considerar si está dentro del threshold
    if (distance < bestDistance && distance <= maxDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

/**
 * Remueve acentos y caracteres diacríticos de un string.
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza un string para comparación: lowercase, sin acentos, sin espacios extra.
 */
export function normalizeText(str: string): string {
  return removeAccents(str.toLowerCase().trim()).replace(/\s+/g, ' ');
}
