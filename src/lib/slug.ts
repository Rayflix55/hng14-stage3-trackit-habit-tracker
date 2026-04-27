export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // 1. Remove non-alphanumeric (keep spaces and hyphens for now)
    .replace(/\s+/g, '-')         // 2. Turn all whitespace into a single hyphen
    .replace(/-+/g, '-');         // 3. Collapse multiple hyphens into one
}