const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "protonmail.com",
  "msn.com",
];

// Classic Levenshtein edit distance between two strings.
function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dist: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dist[i][j] = Math.min(
        dist[i - 1][j] + 1,
        dist[i][j - 1] + 1,
        dist[i - 1][j - 1] + cost,
      );
    }
  }

  return dist[rows - 1][cols - 1];
}

// Looks for a close match against well-known email providers so a typo like
// "gmail.co" (syntactically valid, but almost certainly not what the user
// meant) can be flagged even though basic format validation lets it through.
export function suggestEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;

  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!domain) return null;
  if (COMMON_EMAIL_DOMAINS.includes(domain)) return null;

  let bestMatch: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of COMMON_EMAIL_DOMAINS) {
    const distance = editDistance(domain, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  if (bestMatch && bestDistance > 0 && bestDistance <= 2) {
    return email.slice(0, at + 1) + bestMatch;
  }

  return null;
}
