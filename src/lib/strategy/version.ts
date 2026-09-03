/** Suggests the next minor version string ("v1.0" -> "v1.1"). Falls back sensibly for unexpected formats. */
export function suggestNextVersion(current: string): string {
  const match = current.match(/^v?(\d+)\.(\d+)$/i);
  if (!match) return "v1.1";
  const major = Number(match[1]);
  const minor = Number(match[2]);
  return `v${major}.${minor + 1}`;
}
