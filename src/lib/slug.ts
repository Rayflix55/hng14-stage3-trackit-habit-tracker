/**
 * MENTOR_TRACE: Requirement 4.1 - Slug Generation
 * Slugs must be lowercase and hyphenated.
 */
export const getHabitSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
};