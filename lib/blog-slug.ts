const ARABIC_YEH = /\u064A/g;
const ARABIC_KAF = /\u0643/g;

function decodePathSegment(value: string): string {
  let decoded = value;

  // A slug can arrive raw, encoded, or (behind a proxy) double-encoded.
  // Decode at most twice and stop as soon as the value no longer changes.
  for (let index = 0; index < 2; index += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
}

/** Canonical form used for comparing Persian blog slugs. */
export function normalizeBlogSlug(value: string): string {
  return decodePathSegment(value)
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .normalize('NFC')
    .replace(ARABIC_YEH, 'ی')
    .replace(ARABIC_KAF, 'ک');
}

/** URL-safe public path for a blog post. */
export function blogPostPath(slug: string): string {
  return `/blog/${encodeURIComponent(normalizeBlogSlug(slug))}`;
}
