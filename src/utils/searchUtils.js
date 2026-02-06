const MAX_SEARCH_TERMS = 10;

/**
 * Parse a comma-separated search input into an array of trimmed, lowercase terms.
 * Caps at MAX_SEARCH_TERMS to prevent performance abuse.
 */
export function parseSearchTerms(input) {
  if (!input) return [];

  return input
    .split(',')
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 0)
    .slice(0, MAX_SEARCH_TERMS);
}

/**
 * Check if a text string matches any of the provided search terms.
 */
export function matchesAnyTerm(text, terms) {
  if (!text || terms.length === 0) return false;
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

/**
 * Check if an item matches any search term across multiple fields.
 * Returns true if any field contains any of the search terms (OR logic).
 */
export function matchesSearchTerms(item, fields, terms) {
  if (terms.length === 0) return true;
  return fields.some((field) => matchesAnyTerm(item[field], terms));
}
