// Stak V1 — prompt template placeholder utilities
// Templates embed placeholders as {key}. Declared placeholders carry a label
// and a sample value: { key, label, sample }. See SPEC.md Sections 7.3 and 9.

export interface Placeholder {
  key: string;
  label: string;
  sample: string;
}

// A placeholder key is a run of letters, digits, underscores and hyphens
// wrapped in single braces, e.g. {folder}, {file_name}, {repo-url}.
const PLACEHOLDER_RE = /\{([A-Za-z0-9_-]+)\}/g;

/**
 * Extract the distinct placeholder keys referenced in a template, in order of
 * first appearance. Duplicates are collapsed.
 */
export function extractPlaceholderKeys(template: string): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const match of template.matchAll(PLACEHOLDER_RE)) {
    const key = match[1];
    if (key && !seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Substitute placeholder values into a template. Keys present in the template
 * but missing from `values` are left untouched as `{key}` so the user can see
 * what still needs filling. Substitution is non-recursive: replacement values
 * are never re-scanned for placeholders.
 */
export function substitutePlaceholders(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(PLACEHOLDER_RE, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] ?? '' : whole,
  );
}

export interface PlaceholderConsistency {
  /** Keys used in the template but not declared in the placeholder list. */
  undeclared: string[];
  /** Declared placeholders whose key never appears in the template. */
  unused: string[];
  ok: boolean;
}

/**
 * Cross-check a template against its declared placeholders. The AI Improve and
 * Translate features must preserve placeholder keys exactly; this is the guard
 * that catches drift.
 */
export function checkPlaceholderConsistency(
  template: string,
  placeholders: Pick<Placeholder, 'key'>[],
): PlaceholderConsistency {
  const used = new Set(extractPlaceholderKeys(template));
  const declared = new Set(placeholders.map((p) => p.key));

  const undeclared = [...used].filter((k) => !declared.has(k));
  const unused = [...declared].filter((k) => !used.has(k));

  return {
    undeclared,
    unused,
    ok: undeclared.length === 0 && unused.length === 0,
  };
}

/**
 * Build a values map from declared placeholders' sample values — used to render
 * a fully-populated preview of a prompt.
 */
export function sampleValues(placeholders: Placeholder[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of placeholders) out[p.key] = p.sample;
  return out;
}
